import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import dns from 'node:dns'

// ---------- Mongo ----------
let cachedClient = null
let cachedDb = null
let mongoDnsConfigured = false

function configureMongoDns(mongoUrl) {
  if (
    mongoDnsConfigured ||
    !mongoUrl.startsWith('mongodb+srv://') ||
    !process.env.MONGO_DNS_SERVERS
  ) {
    return
  }

  const servers = process.env.MONGO_DNS_SERVERS
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean)

  if (servers.length > 0) {
    dns.setServers(servers)
  }

  mongoDnsConfigured = true
}

async function connectToMongo() {
  const mongoUrl = process.env.MONGO_URL
  const dbName = process.env.DB_NAME

  if (!mongoUrl) {
    throw new Error('Falta MONGO_URL en el archivo .env.local')
  }

  if (!dbName) {
    throw new Error('Falta DB_NAME en el archivo .env.local')
  }

  if (cachedClient && cachedDb) {
    return cachedDb
  }

  configureMongoDns(mongoUrl)

  let lastError

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const newClient = new MongoClient(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
    })

    try {
      await newClient.connect()

      const newDb = newClient.db(dbName)

      cachedClient = newClient
      cachedDb = newDb

      return newDb
    } catch (error) {
      lastError = error
      await newClient.close().catch(() => {})

      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }
  }

  cachedClient = null
  cachedDb = null

  throw new Error(`Error conectando a MongoDB: ${lastError.message}`)
}

// ---------- CORS ----------
function handleCORS(response) {
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.CORS_ORIGINS || '*'
  )
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Cookie'
  )
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// ---------- Auth helpers ----------
const SESSION_SECRET = () => {
  if (!process.env.SESSION_SECRET) {
    throw new Error('Falta SESSION_SECRET en el archivo .env.local')
  }

  return process.env.SESSION_SECRET
}
const COOKIE_NAME = 'ebia_session'

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET())
    .update(body)
    .digest('base64url')

  return `${body}.${sig}`
}

function verifyToken(token) {
  if (!token || !token.includes('.')) return null

  const [body, sig] = token.split('.')
  const expected = crypto
    .createHmac('sha256', SESSION_SECRET())
    .update(body)
    .digest('base64url')

  const signature = Buffer.from(sig)
  const expectedSignature = Buffer.from(expected)

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(signature, expectedSignature)
  ) {
    return null
  }

  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))

    if (data.exp && data.exp < Date.now()) return null

    return data
  } catch {
    return null
  }
}

function getSessionFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(COOKIE_NAME + '='))

  if (!match) return null

  const token = match.split('=')[1]

  return verifyToken(token)
}

function requireAdmin(request) {
  const session = getSessionFromRequest(request)

  if (!session || session.role !== 'admin') return null

  return session
}

async function handleAuthRoute(request, route, method) {
  if (route === '/admin/login' && method === 'POST') {
    const body = await request.json()
    const { email, password } = body || {}
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase()

    if (normalizedEmail !== adminEmail || password !== process.env.ADMIN_PASSWORD) {
      const response = handleCORS(
        NextResponse.json(
          { error: 'Credenciales incorrectas' },
          { status: 401 }
        )
      )

      response.headers.set('Cache-Control', 'no-store')
      return response
    }

    const token = signToken({
      role: 'admin',
      email: adminEmail,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })

    const response = NextResponse.json({ ok: true, email: adminEmail })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    response.headers.set('Cache-Control', 'no-store')
    return handleCORS(response)
  }

  if (route === '/admin/logout' && method === 'POST') {
    const response = NextResponse.json({ ok: true })

    response.cookies.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    response.headers.set('Cache-Control', 'no-store')
    return handleCORS(response)
  }

  if (route === '/admin/me' && method === 'GET') {
    const session = getSessionFromRequest(request)

    if (!session) {
      const response = handleCORS(
        NextResponse.json(
          { authenticated: false },
          { status: 401 }
        )
      )

      response.headers.set('Cache-Control', 'no-store')
      return response
    }

    const response = handleCORS(
      NextResponse.json({
        authenticated: true,
        email: session.email,
      })
    )

    response.headers.set('Cache-Control', 'no-store')
    return response
  }

  return null
}

// ---------- Utilities ----------
function slugify(s) {
  return (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function clean(doc) {
  if (!doc) return doc

  const { _id, ...rest } = doc

  return rest
}

const landingCourseUpdates = [
  {
    slugs: ['inteligencia-artificial-desde-cero'],
    data: {
      title: 'Clase gratis de IA desde cero',
      category: 'ia',
      level: 'principiante',
      short_description:
        'Aprende a usar Inteligencia Artificial para trabajar mas rapido, ordenar ideas y crear mejores prompts sin tecnicismos.',
      full_description:
        'Clase gratuita en vivo para principiantes que quieren aprender Inteligencia Artificial desde cero y aplicarla en tareas reales.',
      image_url:
        'https://images.pexels.com/photos/6282022/pexels-photo-6282022.jpeg',
      price: 0,
      landing_url: 'https://ebiacapacitacion.com/ia-desde-cero',
      signup_url: 'https://ebiacapacitacion.com/ia-desde-cero',
      signup_event: 'none',
      is_active: true,
      featured: true,
      promise:
        'En una clase gratis vas a entender como empezar a usar IA paso a paso.',
      learn: [
        'Usar IA sin tecnicismos',
        'Crear prompts claros',
        'Aplicar IA en tareas reales',
      ],
      audience: [
        'Personas que quieren empezar desde cero',
        'Profesionales que buscan ahorrar tiempo',
        'Emprendedores y estudiantes',
      ],
      syllabus: [
        {
          title: 'Clase gratis',
          items: [
            'Que es la IA y como usarla',
            'Prompts utiles para el dia a dia',
            'Aplicaciones practicas para trabajo y estudio',
          ],
        },
      ],
      benefits: [
        'Acceso gratuito a la clase',
        'Explicacion paso a paso',
        'Ejemplos practicos',
      ],
      faqs: [
        {
          q: 'Necesito saber programar?',
          a: 'No. La clase esta pensada para personas que empiezan desde cero.',
        },
      ],
    },
  },
  {
    slugs: ['excel-practico-desde-cero'],
    data: {
      title: 'Reto 5 dias IA',
      category: 'ia',
      level: 'principiante',
      short_description:
        'Reto practico para pasar de no saber nada a usar Inteligencia Artificial con claridad en 5 dias.',
      full_description:
        'Reto intensivo en vivo para aprender lo esencial de Inteligencia Artificial con estructura, ejemplos claros y ejercicios aplicables.',
      image_url:
        'https://images.unsplash.com/photo-1541178735493-479c1a27ed24',
      price: 190,
      landing_url: 'https://ebiacapacitacion.com/reto-5-dias-ia',
      signup_url: 'https://ebiacapacitacion.com/reto-5-dias-ia',
      signup_event: 'none',
      is_active: true,
      featured: true,
      promise:
        'En 5 dias vas a construir una base practica para usar IA con criterio.',
      learn: [
        'Entender que pedirle a la IA',
        'Construir prompts utiles',
        'Aplicar IA en tareas reales',
        'Crear un plan de accion para seguir practicando',
      ],
      audience: [
        'Personas que empiezan desde cero',
        'Profesionales que quieren actualizarse',
        'Emprendedores y estudiantes',
      ],
      syllabus: [
        {
          title: 'Ruta de 5 dias',
          items: [
            'Entiende la IA',
            'Prompts utiles',
            'Trabajo real',
            'Flujos simples',
            'Plan de accion',
          ],
        },
      ],
      benefits: [
        '5 sesiones en vivo',
        'Ejemplos practicos',
        'Acompanamiento paso a paso',
      ],
      faqs: [
        {
          q: 'El boton de pago ya esta activo?',
          a: 'Todavia no. El checkout se conectara cuando este listo Hotmart.',
        },
      ],
    },
  },
]

async function syncLandingCourseUpdates(db) {
  await Promise.all(
    landingCourseUpdates.map(({ slugs, data }) =>
      db.collection('courses').updateOne(
        { slug: { $in: slugs } },
        { $set: data }
      )
    )
  )
}

// ---------- Seed data ----------
async function seedIfEmpty(db) {
  const count = await db.collection('courses').countDocuments()

  if (count > 0) return

  const now = new Date().toISOString()

  const seed = [
    {
      id: uuidv4(),
      slug: 'inteligencia-artificial-desde-cero',
      title: 'Inteligencia Artificial desde cero',
      category: 'ia',
      level: 'principiante',
      short_description:
        'Aprende qué es la IA, cómo se usa en el día a día y cómo aprovecharla en tu vida y trabajo.',
      full_description:
        'Un curso pensado para personas sin conocimientos previos. Te enseñamos a usar ChatGPT, Gemini, Copilot y otras herramientas de IA paso a paso, con ejemplos prácticos que puedes aplicar desde el primer día.',
      image_url:
        'https://images.pexels.com/photos/6282022/pexels-photo-6282022.jpeg',
      price: 1499,
      whatsapp_url: '',
      is_active: true,
      featured: true,
      promise:
        'En 4 semanas vas a usar IA con confianza para escribir, organizarte y resolver tareas reales.',
      learn: [
        'Conversar con ChatGPT y obtener respuestas útiles',
        'Crear prompts claros y efectivos',
        'Resumir documentos largos en segundos',
        'Generar imágenes con IA',
        'Automatizar tareas repetitivas',
      ],
      audience: [
        'Personas que quieren empezar a usar IA sin miedo',
        'Profesionales que buscan ahorrar tiempo',
        'Emprendedores y estudiantes',
      ],
      syllabus: [
        {
          title: 'Módulo 1',
          items: ['¿Qué es la IA y por qué importa hoy?', 'Tu primer chat con ChatGPT'],
        },
        {
          title: 'Módulo 2',
          items: ['Prompts efectivos paso a paso', 'Plantillas listas para copiar'],
        },
        {
          title: 'Módulo 3',
          items: ['IA para escribir, resumir y traducir', 'IA para crear imágenes'],
        },
        {
          title: 'Módulo 4',
          items: ['IA en el trabajo: correos, reportes, ideas', 'Tu plan de uso diario'],
        },
      ],
      benefits: [
        'Acceso de por vida',
        'Comunidad privada',
        'Plantillas de prompts incluidas',
        'Certificado de finalización',
      ],
      faqs: [
        {
          q: '¿Necesito saber programar?',
          a: 'No. El curso está diseñado para personas sin conocimientos técnicos.',
        },
        {
          q: '¿Cuánto tiempo me toma?',
          a: 'Aproximadamente 4 semanas, dedicando 2-3 horas por semana.',
        },
      ],
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      slug: 'excel-practico-desde-cero',
      title: 'Excel práctico desde cero',
      category: 'excel',
      level: 'principiante',
      short_description:
        'Domina Excel con ejercicios reales: fórmulas, tablas, gráficos y trucos para ahorrar horas de trabajo.',
      full_description:
        'Un curso 100% práctico para que dejes de tenerle miedo a Excel. Aprende lo esencial y lo que de verdad se usa en el trabajo, sin rodeos.',
      image_url: 'https://images.unsplash.com/photo-1584472666879-7d92db132958',
      price: 1299,
      whatsapp_url: '',
      is_active: true,
      featured: true,
      promise:
        'En 3 semanas vas a manejar Excel con seguridad y resolver tareas que antes te tomaban horas.',
      learn: [
        'Crear y dar formato a hojas de cálculo',
        'Fórmulas esenciales: SUMA, BUSCARV, SI',
        'Tablas dinámicas paso a paso',
        'Gráficos claros y profesionales',
        'Atajos de teclado que ahorran tiempo',
      ],
      audience: [
        'Personas que usan Excel en el trabajo',
        'Estudiantes',
        'Quienes quieren organizar finanzas personales',
      ],
      syllabus: [
        {
          title: 'Módulo 1',
          items: ['Interfaz y conceptos básicos', 'Formato de celdas y datos'],
        },
        {
          title: 'Módulo 2',
          items: ['Fórmulas indispensables', 'Funciones lógicas y de búsqueda'],
        },
        {
          title: 'Módulo 3',
          items: ['Tablas dinámicas', 'Gráficos efectivos'],
        },
      ],
      benefits: [
        'Plantillas descargables',
        'Ejercicios reales',
        'Soporte por WhatsApp',
        'Certificado',
      ],
      faqs: [
        {
          q: '¿Qué versión de Excel necesito?',
          a: 'Funciona con cualquier versión moderna, incluyendo Excel Online gratis.',
        },
      ],
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      slug: 'productividad-con-herramientas-digitales',
      title: 'Productividad con herramientas digitales',
      category: 'herramientas',
      level: 'principiante',
      short_description:
        'Organiza tu vida y trabajo con apps como Notion, Google Drive, Calendar y Trello sin complicarte.',
      full_description:
        'Aprende a usar las mejores herramientas digitales para estudiar, trabajar y organizarte. Sin tecnicismos, con ejemplos del día a día.',
      image_url:
        'https://images.pexels.com/photos/5412270/pexels-photo-5412270.jpeg',
      price: 999,
      whatsapp_url: '',
      is_active: true,
      featured: true,
      promise:
        'Vas a tener un sistema personal de organización simple, claro y que sí vas a usar.',
      learn: [
        'Notion desde cero',
        'Google Drive, Docs y Sheets',
        'Calendario y recordatorios efectivos',
        'Trello para proyectos',
        'Almacenamiento seguro en la nube',
      ],
      audience: ['Estudiantes desordenados', 'Profesionales saturados', 'Emprendedores'],
      syllabus: [
        {
          title: 'Módulo 1',
          items: ['Tu sistema personal en Notion', 'Organización diaria simple'],
        },
        {
          title: 'Módulo 2',
          items: ['Google Workspace práctico', 'Trabajo en equipo en la nube'],
        },
        {
          title: 'Módulo 3',
          items: ['Trello y gestión de tareas', 'Calendario y hábitos'],
        },
      ],
      benefits: ['Plantilla Notion incluida', 'Comunidad', 'Soporte', 'Certificado'],
      faqs: [
        {
          q: '¿Necesito pagar herramientas?',
          a: 'No, todas las herramientas que vemos tienen versión gratuita.',
        },
      ],
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      slug: 'chatgpt-para-tu-trabajo',
      title: 'ChatGPT para tu trabajo',
      category: 'ia',
      level: 'intermedio',
      short_description:
        'Aplica ChatGPT en tareas reales: correos, reportes, análisis, ideas y atención al cliente.',
      full_description:
        'Curso enfocado en aplicaciones reales de ChatGPT en el ámbito profesional. Plantillas, casos prácticos y flujos listos para usar.',
      image_url: 'https://images.unsplash.com/photo-1541178735493-479c1a27ed24',
      price: 1799,
      whatsapp_url: '',
      is_active: true,
      featured: false,
      promise:
        'Vas a ahorrar al menos 5 horas a la semana usando ChatGPT en tu trabajo.',
      learn: [
        'Escribir correos profesionales en segundos',
        'Resumir reuniones y documentos',
        'Generar reportes y propuestas',
        'Crear contenido para redes',
        'Analizar datos con lenguaje natural',
      ],
      audience: ['Profesionales en cualquier área', 'Líderes de equipo', 'Freelancers'],
      syllabus: [
        {
          title: 'Módulo 1',
          items: ['Prompts avanzados', 'Personas y contextos'],
        },
        {
          title: 'Módulo 2',
          items: ['Comunicación profesional', 'Documentos y reportes'],
        },
        {
          title: 'Módulo 3',
          items: ['Análisis y decisiones', 'Automatización con GPTs'],
        },
      ],
      benefits: ['+50 plantillas de prompts', 'Comunidad activa', 'Actualizaciones de por vida'],
      faqs: [
        {
          q: '¿Necesito ChatGPT Plus?',
          a: 'No es obligatorio. El curso muestra cómo usarlo gratis y de pago.',
        },
      ],
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      slug: 'excel-avanzado-y-dashboards',
      title: 'Excel avanzado y dashboards',
      category: 'excel',
      level: 'avanzado',
      short_description:
        'Crea dashboards profesionales con tablas dinámicas, segmentadores, Power Query y visualizaciones.',
      full_description:
        'Lleva tu Excel al siguiente nivel: análisis de datos, automatización y dashboards que impresionan.',
      image_url: 'https://images.unsplash.com/photo-1584472666879-7d92db132958',
      price: 2299,
      whatsapp_url: '',
      is_active: true,
      featured: false,
      promise:
        'Vas a construir dashboards interactivos y profesionales desde cero.',
      learn: [
        'Power Query para limpiar datos',
        'Tablas dinámicas avanzadas',
        'Segmentadores y escalas de tiempo',
        'Fórmulas matriciales modernas',
        'Diseño de dashboards efectivos',
      ],
      audience: [
        'Analistas de datos',
        'Profesionales con experiencia en Excel',
        'Administradores',
      ],
      syllabus: [
        {
          title: 'Módulo 1',
          items: ['Power Query', 'Modelo de datos'],
        },
        {
          title: 'Módulo 2',
          items: ['Tablas dinámicas pro', 'Segmentadores'],
        },
        {
          title: 'Módulo 3',
          items: ['Diseño visual', 'Dashboard final'],
        },
      ],
      benefits: ['Archivos de ejercicios reales', 'Mentorías grupales', 'Certificado pro'],
      faqs: [
        {
          q: '¿Necesito conocimientos previos?',
          a: 'Sí, debes manejar lo básico de Excel y fórmulas comunes.',
        },
      ],
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      slug: 'automatiza-tu-dia-a-dia',
      title: 'Automatiza tu día a día',
      category: 'herramientas',
      level: 'intermedio',
      short_description:
        'Conecta tus apps y automatiza tareas con Zapier, Make y Google Apps Script sin escribir código.',
      full_description:
        'Aprende a automatizar tu trabajo: recibir correos, llenar hojas, enviar notificaciones y mucho más, sin programar.',
      image_url:
        'https://images.pexels.com/photos/6238120/pexels-photo-6238120.jpeg',
      price: 1599,
      whatsapp_url: '',
      is_active: true,
      featured: false,
      promise:
        'Vas a crear al menos 5 automatizaciones útiles desde tu primer día.',
      learn: [
        'Make (Integromat) desde cero',
        'Zapier para conectar apps',
        'Apps Script en Google',
        'Webhooks simples',
        'Notificaciones automáticas',
      ],
      audience: ['Emprendedores', 'Equipos pequeños', 'Profesionales con muchas tareas repetitivas'],
      syllabus: [
        {
          title: 'Módulo 1',
          items: ['Pensamiento de automatización', 'Tu primer flujo'],
        },
        {
          title: 'Módulo 2',
          items: ['Make paso a paso', 'Zapier rápido'],
        },
        {
          title: 'Módulo 3',
          items: ['Apps Script', 'Casos prácticos'],
        },
      ],
      benefits: ['Plantillas de flujos', 'Soporte técnico', 'Comunidad'],
      faqs: [
        {
          q: '¿Tengo que saber programar?',
          a: 'No, casi todo es visual y arrastrar-soltar.',
        },
      ],
      created_at: now,
      updated_at: now,
    },
  ]

  await db.collection('courses').insertMany(seed)
}

// ---------- Route handler ----------
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'EBIA API ok' }))
    }

    if (route === '/health' && method === 'GET') {
      return handleCORS(
        NextResponse.json({
          ok: true,
          service: 'ebia-api',
          timestamp: new Date().toISOString(),
        })
      )
    }

    const authResponse = await handleAuthRoute(request, route, method)

    if (authResponse) {
      return authResponse
    }

    const db = await connectToMongo()

    await seedIfEmpty(db)
    await syncLandingCourseUpdates(db)

    // ===== COURSES public =====
    if ((route === '/courses' || route === '/cursos') && method === 'GET') {
      const url = new URL(request.url)
      const category = url.searchParams.get('category')
      const featured = url.searchParams.get('featured')
      const includeInactive = url.searchParams.get('all') === '1'
      const session = getSessionFromRequest(request)

      const q = {}

      if (!includeInactive || !session) q.is_active = true
      if (category && category !== 'all') q.category = category
      if (featured === '1') q.featured = true

      const items = await db
        .collection('courses')
        .find(q)
        .sort({ created_at: -1 })
        .toArray()

      return handleCORS(NextResponse.json(items.map(clean)))
    }

    if (
      (route.startsWith('/courses/slug/') ||
        route.startsWith('/cursos/slug/')) &&
      method === 'GET'
    ) {
      const slug = route
        .replace('/courses/slug/', '')
        .replace('/cursos/slug/', '')
      const item = await db.collection('courses').findOne({ slug })

      if (!item) {
        return handleCORS(
          NextResponse.json(
            { error: 'No encontrado' },
            { status: 404 }
          )
        )
      }

      return handleCORS(NextResponse.json(clean(item)))
    }

    // ===== COURSES admin =====
    if (
      (route === '/admin/courses' || route === '/admin/cursos') &&
      method === 'GET'
    ) {
      if (!requireAdmin(request)) {
        return handleCORS(
          NextResponse.json(
            { error: 'No autorizado' },
            { status: 401 }
          )
        )
      }

      const items = await db
        .collection('courses')
        .find({})
        .sort({ created_at: -1 })
        .toArray()

      return handleCORS(NextResponse.json(items.map(clean)))
    }

    if (
      (route === '/admin/courses' || route === '/admin/cursos') &&
      method === 'POST'
    ) {
      if (!requireAdmin(request)) {
        return handleCORS(
          NextResponse.json(
            { error: 'No autorizado' },
            { status: 401 }
          )
        )
      }

      const body = await request.json()

      if (!body.title) {
        return handleCORS(
          NextResponse.json(
            { error: 'Título requerido' },
            { status: 400 }
          )
        )
      }

      const now = new Date().toISOString()
      let slug = body.slug ? slugify(body.slug) : slugify(body.title)

      const exists = await db.collection('courses').findOne({ slug })

      if (exists) {
        slug = `${slug}-${Math.floor(Math.random() * 9999)}`
      }

      const doc = {
        id: uuidv4(),
        slug,
        title: body.title,
        category: body.category || 'ia',
        level: body.level || 'principiante',
        short_description: body.short_description || '',
        full_description: body.full_description || '',
        image_url: body.image_url || '',
        price: body.price != null && body.price !== '' ? Number(body.price) : null,
        whatsapp_url: body.whatsapp_url || '',
        is_active: body.is_active !== false,
        featured: !!body.featured,
        promise: body.promise || '',
        learn: Array.isArray(body.learn) ? body.learn : [],
        audience: Array.isArray(body.audience) ? body.audience : [],
        syllabus: Array.isArray(body.syllabus) ? body.syllabus : [],
        benefits: Array.isArray(body.benefits) ? body.benefits : [],
        faqs: Array.isArray(body.faqs) ? body.faqs : [],
        created_at: now,
        updated_at: now,
      }

      await db.collection('courses').insertOne(doc)

      return handleCORS(NextResponse.json(clean(doc)))
    }

    if (
      (route.startsWith('/admin/courses/') ||
        route.startsWith('/admin/cursos/')) &&
      method === 'PUT'
    ) {
      if (!requireAdmin(request)) {
        return handleCORS(
          NextResponse.json(
            { error: 'No autorizado' },
            { status: 401 }
          )
        )
      }

      const id = route
        .replace('/admin/courses/', '')
        .replace('/admin/cursos/', '')
      const body = await request.json()
      const update = {
        ...body,
        updated_at: new Date().toISOString(),
      }

      delete update.id
      delete update._id
      delete update.created_at

      if (update.price != null && update.price !== '') {
        update.price = Number(update.price)
      }

      if (update.slug) {
        update.slug = slugify(update.slug)
      }

      await db.collection('courses').updateOne({ id }, { $set: update })

      const updated = await db.collection('courses').findOne({ id })

      return handleCORS(NextResponse.json(clean(updated)))
    }

    if (
      (route.startsWith('/admin/courses/') ||
        route.startsWith('/admin/cursos/')) &&
      method === 'DELETE'
    ) {
      if (!requireAdmin(request)) {
        return handleCORS(
          NextResponse.json(
            { error: 'No autorizado' },
            { status: 401 }
          )
        )
      }

      const id = route
        .replace('/admin/courses/', '')
        .replace('/admin/cursos/', '')

      await db.collection('courses').deleteOne({ id })

      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ===== CONTACTS =====
    if (route === '/contacts' && method === 'POST') {
      const body = await request.json()

      if (!body.name || !body.email || !body.message) {
        return handleCORS(
          NextResponse.json(
            { error: 'Faltan campos obligatorios' },
            { status: 400 }
          )
        )
      }

      const doc = {
        id: uuidv4(),
        name: String(body.name).slice(0, 200),
        email: String(body.email).slice(0, 200),
        phone: body.phone ? String(body.phone).slice(0, 50) : '',
        message: String(body.message).slice(0, 4000),
        status: 'unread',
        created_at: new Date().toISOString(),
      }

      await db.collection('contacts').insertOne(doc)

      return handleCORS(
        NextResponse.json({
          ok: true,
          id: doc.id,
        })
      )
    }

    if (route === '/admin/contacts' && method === 'GET') {
      if (!requireAdmin(request)) {
        return handleCORS(
          NextResponse.json(
            { error: 'No autorizado' },
            { status: 401 }
          )
        )
      }

      const items = await db
        .collection('contacts')
        .find({})
        .sort({ created_at: -1 })
        .toArray()

      return handleCORS(NextResponse.json(items.map(clean)))
    }

    if (route.startsWith('/admin/contacts/') && method === 'PATCH') {
      if (!requireAdmin(request)) {
        return handleCORS(
          NextResponse.json(
            { error: 'No autorizado' },
            { status: 401 }
          )
        )
      }

      const id = route.replace('/admin/contacts/', '')
      const body = await request.json()

      await db
        .collection('contacts')
        .updateOne(
          { id },
          { $set: { status: body.status || 'read' } }
        )

      return handleCORS(NextResponse.json({ ok: true }))
    }

    if (route.startsWith('/admin/contacts/') && method === 'DELETE') {
      if (!requireAdmin(request)) {
        return handleCORS(
          NextResponse.json(
            { error: 'No autorizado' },
            { status: 401 }
          )
        )
      }

      const id = route.replace('/admin/contacts/', '')

      await db.collection('contacts').deleteOne({ id })

      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ===== STATS =====
    if (route === '/admin/stats' && method === 'GET') {
      if (!requireAdmin(request)) {
        return handleCORS(
          NextResponse.json(
            { error: 'No autorizado' },
            { status: 401 }
          )
        )
      }

      const courses = await db.collection('courses').countDocuments()
      const activeCourses = await db
        .collection('courses')
        .countDocuments({ is_active: true })
      const contacts = await db.collection('contacts').countDocuments()
      const unread = await db
        .collection('contacts')
        .countDocuments({ status: 'unread' })

      return handleCORS(
        NextResponse.json({
          courses,
          activeCourses,
          contacts,
          unread,
        })
      )
    }

    return handleCORS(
      NextResponse.json(
        { error: `Route ${route} not found` },
        { status: 404 }
      )
    )
  } catch (error) {
    console.error('API Error:', error)

    return handleCORS(
      NextResponse.json(
        {
          error: 'Internal server error',
          ...(process.env.NODE_ENV !== 'production'
            ? { detail: error.message }
            : {}),
        },
        { status: 500 }
      )
    )
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
