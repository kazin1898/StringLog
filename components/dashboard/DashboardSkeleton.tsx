'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="h-[60px] w-64 bg-muted rounded animate-pulse" />
            <div className="h-5 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-muted rounded-lg animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-7 w-12 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Graph + Sessions */}
        <div className="grid gap-6 md:grid-cols-[1fr_340px]">
          <Card>
            <CardHeader className="pb-3">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-[240px] bg-muted/20 rounded animate-pulse" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center justify-between px-3 py-2">
                    <div className="space-y-1">
                      <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
