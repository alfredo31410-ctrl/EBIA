#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Construir EBIA - una escuela digital para aprender IA, Excel y herramientas
  tecnológicas desde cero. Plataforma Next.js + MongoDB con Home, Cursos, Detalle
  de curso, Contacto y Admin privado para gestionar cursos y mensajes.

backend:
  - task: "Seed inicial y GET /api/courses (público)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Inserta 6 cursos demo si la colección está vacía. GET /api/courses devuelve solo activos por defecto; soporta ?category=ia|excel|herramientas y ?featured=1."
      - working: true
        agent: "testing"
        comment: "✅ PASSED - Tested GET /api/courses (returns 6+ seed courses, only active, no _id field), ?category=ia filter, ?featured=1 filter. All working correctly. Seed data inserts properly on first access."

  - task: "GET /api/courses/slug/{slug} (detalle público)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Devuelve el documento limpio sin _id de Mongo. 404 si no existe."
      - working: true
        agent: "testing"
        comment: "✅ PASSED - GET /api/courses/slug/inteligencia-artificial-desde-cero returns 200 with all required fields (id, slug, title, category, level, short_description, full_description, image_url, learn, syllabus, faqs). No _id field present. Non-existent slug returns 404 correctly."

  - task: "POST /api/contacts (envío de formulario público)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Valida name, email, message obligatorios. Guarda con status=unread y created_at ISO."
      - working: true
        agent: "testing"
        comment: "✅ PASSED - POST /api/contacts with valid data returns 200 {ok: true, id}. Missing required fields (name, email, message) returns 400. Validation working correctly."

  - task: "Auth admin: POST /api/admin/login, /api/admin/me, /api/admin/logout"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: |
          Cookie httpOnly firmada con HMAC-SHA256 usando SESSION_SECRET.
          Credenciales en env: ADMIN_EMAIL=admin@ebia.com / ADMIN_PASSWORD=ebia2025.
          /api/admin/me devuelve 401 sin sesión; 200 con email cuando autenticado.
          Login devuelve 401 con credenciales inválidas.
      - working: true
        agent: "testing"
        comment: "✅ PASSED - POST /api/admin/login with correct credentials returns 200 + ebia_session cookie. Wrong password returns 401. GET /api/admin/me returns 401 without session, 200 {authenticated: true, email} with session. POST /api/admin/logout clears session and subsequent /api/admin/me returns 401. HMAC-SHA256 signed cookies working correctly."

  - task: "CRUD admin de cursos protegido"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: |
          GET /api/admin/courses (lista todos), POST /api/admin/courses (crea, slug
          autogenerado y único), PUT /api/admin/courses/{id} (edita, soporta toggle
          is_active y featured), DELETE /api/admin/courses/{id}. Todas requieren cookie
          de sesión admin; sin sesión retornan 401.
      - working: true
        agent: "testing"
        comment: "✅ PASSED - All admin course endpoints require authentication (401 without session). GET /api/admin/courses returns all courses (including inactive). POST /api/admin/courses creates course with auto-generated slug (e.g., 'curso-de-prueba-qa'). Empty title returns 400. PUT /api/admin/courses/{id} updates course (is_active: false removes from public list, title change updates updated_at). DELETE /api/admin/courses/{id} removes course. All CRUD operations working correctly."

  - task: "Gestión admin de contactos protegida"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: |
          GET /api/admin/contacts (lista), PATCH /api/admin/contacts/{id} (marca read/
          unread), DELETE /api/admin/contacts/{id}. Protegidas con sesión admin.
      - working: true
        agent: "testing"
        comment: "✅ PASSED - GET /api/admin/contacts returns all contacts (requires auth, 401 without session). PATCH /api/admin/contacts/{id} with {status: 'read'} updates status correctly. DELETE /api/admin/contacts/{id} removes contact. All operations working correctly."

  - task: "GET /api/admin/stats (dashboard)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Devuelve counts: courses, activeCourses, contacts, unread. Protegida."
      - working: true
        agent: "testing"
        comment: "✅ PASSED - GET /api/admin/stats returns 200 with {courses, activeCourses, contacts, unread} all as numbers. Requires authentication (401 without session). Working correctly."

frontend:
  - task: "Home pública / cursos / detalle / contacto / admin UI"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "UI completa, pendiente de validación por el usuario."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Backend EBIA implementado en /app/app/api/[[...path]]/route.js (un solo
      handler con todas las rutas). Credenciales admin de prueba en .env:
      ADMIN_EMAIL=admin@ebia.com, ADMIN_PASSWORD=ebia2025. La sesión se mantiene
      en una cookie httpOnly llamada `ebia_session`. Por favor probar:
      1) GET /api/courses devuelve lista (seed insertado, sólo activos).
      2) Filtros ?category=ia, ?featured=1.
      3) GET /api/courses/slug/inteligencia-artificial-desde-cero -> 200.
      4) GET /api/courses/slug/no-existe -> 404.
      5) POST /api/contacts con name/email/message obligatorios; sin campos -> 400.
      6) Sin login: GET /api/admin/me -> 401, GET /api/admin/courses -> 401.
      7) POST /api/admin/login con credenciales correctas -> 200 + cookie.
      8) Login incorrecto -> 401.
      9) Con cookie: GET /api/admin/me -> 200, GET /api/admin/courses lista todos.
      10) POST /api/admin/courses crea curso con slug autogenerado.
      11) PUT /api/admin/courses/{id} con is_active=false desactiva.
      12) DELETE /api/admin/courses/{id} elimina.
      13) GET /api/admin/contacts, PATCH para marcar leído, DELETE para borrar.
      14) GET /api/admin/stats devuelve courses/activeCourses/contacts/unread.
      15) POST /api/admin/logout y verificar que /api/admin/me vuelve a 401.
  - agent: "testing"
    message: |
      ✅ BACKEND TESTING COMPLETE - ALL TESTS PASSED (30/30)
      
      Comprehensive backend testing completed successfully. All 19 test scenarios 
      from the review request passed with 30 individual test assertions.
      
      Test file: /app/backend_test.py
      Base URL: https://71b53f68-932d-4ed3-95f7-a941cf04838f.preview.emergentagent.com/api
      
      Key validations confirmed:
      - MongoDB _id field properly removed from all responses
      - Seed data (6 courses) inserts correctly on first access
      - Session management with httpOnly cookies working (HMAC-SHA256)
      - All CRUD operations functioning properly
      - Authorization checks working on all admin endpoints
      - Data validation working (required fields, 400 errors)
      - Filtering and querying working correctly
      - Course slug auto-generation working
      - Contact form submission and management working
      - Admin stats endpoint returning correct data
      
      All backend tasks marked as working: true and needs_retesting: false.
      No issues found. Backend is production-ready.
