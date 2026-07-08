import './globals.css'
import { Providers } from './providers'
import MetaPixelPageView from '@/components/ebia/MetaPixelPageView'
import { META_PIXEL_ID } from '@/lib/meta-pixel'

const EBIA_META_PIXEL_BOOTSTRAP = `
(function() {
  var pixelId = '${META_PIXEL_ID}';
  window.__EBIA_META_PIXEL_ID__ = pixelId;

  if (!window.__EBIA_META_PIXEL_SCRIPT_LOADED__) {
    !function(f,b,e,v,n,t,s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.__EBIA_META_PIXEL_SCRIPT_LOADED__ = true;
  }

  if (typeof window.fbq === 'function' && !window.__EBIA_META_PIXEL_INITIALIZED__) {
    window.fbq('init', pixelId);
    window.__EBIA_META_PIXEL_INITIALIZED__ = true;
  }
})();
`

export const metadata = {
  title: 'EBIA · Aprende IA, Excel y tecnología desde cero',
  description: 'EBIA es una escuela digital para aprender Inteligencia Artificial, Excel y herramientas tecnológicas desde cero. Paso a paso, sin tecnicismos, con ejemplos prácticos.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
        <script id="ebia-meta-pixel" dangerouslySetInnerHTML={{ __html: EBIA_META_PIXEL_BOOTSTRAP }} />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <MetaPixelPageView />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
