'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Logo from '@/components/ebia/Logo';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@ebia.mx');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = data.error || 'No se pudo iniciar sesión.';
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      const sessionResponse = await fetch('/api/admin/me', {
        credentials: 'same-origin',
        cache: 'no-store',
      });

      if (!sessionResponse.ok) {
        throw new Error('La sesión no pudo guardarse en el navegador.');
      }

      toast.success('Bienvenido');
      router.replace('/admin');
      router.refresh();
    } catch (error) {
      const message = error.message || 'Error al conectar con el servidor.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-mesh">
      <Toaster position="top-center" richColors />
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold">Panel de administración</h1>
            <p className="text-sm text-muted-foreground mt-1">Ingresa tus credenciales para continuar.</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-11"
                placeholder="admin@ebia.mx"
              />
            </div>
            <div>
              <Label htmlFor="pwd">Contraseña</Label>
              <Input
                id="pwd"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-11"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Entrando…</> : 'Entrar'}
            </Button>
            {errorMessage && (
              <p role="alert" className="text-sm text-rose-600">
                {errorMessage}
              </p>
            )}
          </form>
          <p className="text-xs text-muted-foreground mt-6 text-center">
            <Link href="/" className="hover:text-foreground">← Volver al sitio</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
