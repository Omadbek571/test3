import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-24 mr-4" />
          <Skeleton className="h-8 w-48" />
        </div>

        {/* Current user position Skeleton */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <Skeleton className="w-16 h-16 rounded-full mr-4" />
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div>
                <Skeleton className="h-8 w-24" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Podium Skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-end justify-center py-8 px-4">
              <Skeleton className="h-40 w-24 mx-2" />
              <Skeleton className="h-48 w-28 mx-2" />
              <Skeleton className="h-32 w-24 mx-2" />
            </div>
          </CardContent>
        </Card>

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

        {/* Rating table Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-full mb-6" />

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

