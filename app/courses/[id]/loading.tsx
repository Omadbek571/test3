import { Skeleton } from "@/components/ui/skeleton"

export default function CourseDetailLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-5 w-full mb-4" />

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="flex items-center mb-4">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="mb-8">
            <Skeleton className="h-10 w-full max-w-md mb-4" />

            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-40 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div>
                <Skeleton className="h-6 w-64 mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start">
                        <Skeleton className="h-5 w-5 mr-2" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-6 w-32 mb-3" />
                <div className="space-y-2">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start">
                        <Skeleton className="h-2 w-2 rounded-full mt-2 mr-2" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border p-6">
            <Skeleton className="aspect-video w-full rounded-lg mb-4" />
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-10 w-full mb-6" />
            <Skeleton className="h-px w-full my-4" />
            <div className="space-y-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

