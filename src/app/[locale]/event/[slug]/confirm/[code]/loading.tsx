import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ConfirmCompanionLoading() {
  const t = useTranslations("ConfirmCompanionPage");
  return (
    <>
      <nav className="flex flex-1 justify-between items-center space-x-2 px-2 md:px-4 py-2 sticky top-0 z-50 bg-background/50 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </nav>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pb-24 pt-6 max-w-2xl">
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {/* Header Skeleton */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{t("title")}</h1>
              <p className="text-muted-foreground">{t("description")}</p>
            </div>

            {/* Event Card Skeleton */}
            <Card className="gap-2 shadow-primary/50">
              <CardHeader>
                <Skeleton className="h-7 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Organizer Card Skeleton */}
            <Card className="gap-2 shadow-primary/50">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companions Card Skeleton */}
            <Card className="gap-2 shadow-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 border rounded-md">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Confirmation Form Skeleton */}
            <Card>
              <CardContent className="py-6 space-y-4">
                <div className="text-center space-y-2">
                  <Skeleton className="h-4 w-64 mx-auto" />
                  <Skeleton className="h-5 w-48 mx-auto" />
                </div>

                <Skeleton className="h-11 w-full rounded-md" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
