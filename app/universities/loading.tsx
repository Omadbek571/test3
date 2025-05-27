import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-24 mr-4" />
          <Skeleton className="h-8 w-48" />
        </div>

        {/* Filters Skeleton */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-full mb-6" />

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <Skeleton className="w-full md:w-64 h-40" />
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                        <div>
                          <Skeleton className="h-6 w-48 mb-2" />
                          <Skeleton className="h-4 w-32 mb-2" />
                        </div>
                        <Skeleton className="h-10 w-24" />
                      </div>

                      <Skeleton className="h-4 w-32 mb-2" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-28" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

