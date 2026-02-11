'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play, Plus } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="flex gap-2">
      <Button asChild size="icon" className="rounded-full size-10">
        <Link href="/practice" aria-label="Start Practice">
          <Play className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="icon" className="rounded-full size-10">
        <Link href="/repertoire" aria-label="Add Song">
          <Plus className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
