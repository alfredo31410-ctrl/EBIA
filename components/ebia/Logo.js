import Link from 'next/link';

export default function Logo({ size = 'md', variant = 'default' }) {
  const sizes = {
    sm: { box: 'h-7 w-7', text: 'text-lg', dot: 'h-1.5 w-1.5' },
    md: { box: 'h-9 w-9', text: 'text-xl', dot: 'h-2 w-2' },
    lg: { box: 'h-14 w-14', text: 'text-3xl', dot: 'h-2.5 w-2.5' },
  };
  const s = sizes[size] || sizes.md;
  const isLight = variant === 'light';
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
      <div className={`relative ${s.box} rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-amber-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white font-extrabold transition-transform group-hover:scale-105`}>
        <span className="text-[0.65em] tracking-tight">e</span>
        <div className={`absolute -bottom-0.5 -right-0.5 ${s.dot} rounded-full bg-amber-400 ring-2 ring-white`} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-extrabold tracking-tight ${isLight ? 'text-white' : 'text-foreground'}`}>EBIA</span>
        <span className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${isLight ? 'text-white/70' : 'text-muted-foreground'}`}>Escuela digital</span>
      </div>
    </Link>
  );
}
