import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function UniversityDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Skeleton className="h-10 w-48 mb-6" />

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <Skeleton className="w-full h-48 md:h-64" />

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 lg:w-1/4">
                <div className="bg-white rounded-lg border p-4 text-center mb-6">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-1" />
                  <Skeleton className="h-5 w-20 mx-auto mb-4" />

                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>

                <div className="bg-white rounded-lg border p-4 mb-6">
                  <Skeleton className="h-5 w-40 mb-3" />
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border p-4">
                  <Skeleton className="h-5 w-32 mb-3" />
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 lg:w-3/4">
                <Skeleton className="h-10 w-full mb-6" />

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-6" />

                    <Skeleton className="h-6 w-48 mb-3" />
                    <div className="space-y-2 mb-6">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>

                    <Skeleton className="h-32 w-full rounded-lg" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

