import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCategoryLabel, getLevelLabel } from '@/lib/ebia/constants';

export default function CourseCard({ course }) {
  return (
    <div className="group flex flex-col rounded-2xl bg-card border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
      <Link href={`/cursos/${course.slug}`} className="block aspect-[16/10] overflow-hidden bg-muted">
        {course.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.image_url} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="h-full w-full grid-pattern" />
        )}
      </Link>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 border-0 font-semibold">{getCategoryLabel(course.category)}</Badge>
          <Badge variant="outline" className="font-medium">{getLevelLabel(course.level)}</Badge>
        </div>
        <Link href={`/cursos/${course.slug}`}>
          <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{course.short_description}</p>
        <div className="flex items-center justify-between mb-4">
          {course.price ? (
            <div>
              <span className="text-2xl font-extrabold text-foreground">${course.price}</span>
              <span className="text-xs text-muted-foreground ml-1">MXN</span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-primary">Consultar precio</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/cursos/${course.slug}`}>Información <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
          </Button>
          <Button asChild size="sm" className="flex-1 bg-[#25D366] hover:bg-[#1ebe5b] text-white">
            <a href="/landings/gracias">
              <MessageCircle className="h-3.5 w-3.5 mr-1" fill="currentColor" /> Continuar
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
