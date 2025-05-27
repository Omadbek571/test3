import { Skeleton } from "@/components/ui/skeleton"

export default function LessonLoading() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center">
          <Skeleton className="h-9 w-9 mr-2" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-9 w-32" />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6 px-4">
            <div className="mb-6">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-5 w-40" />
            </div>

            {/* Video player */}
            <Skeleton className="aspect-video w-full rounded-lg mb-6" />

            <div className="flex flex-wrap gap-3 mb-6">
              <Skeleton className="h-10 w-40" />
              <div className="flex-1"></div>
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            <Skeleton className="h-px w-full my-6" />

            <div className="space-y-6">
              <div>
                <Skeleton className="h-7 w-40 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div>
                <Skeleton className="h-7 w-40 mb-3" />
                <div className="space-y-2">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <Skeleton className="h-10 w-10 rounded-md mr-3" />
                          <div>
                            <Skeleton className="h-5 w-40 mb-1" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-8" />
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-7 w-64 mb-3" />
                <div className="rounded-lg border">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-64" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 border-l overflow-y-auto">
          <div className="p-4">
            <div className="mb-4">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-2 w-full mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>

            <Skeleton className="h-px w-full my-4" />

            <Skeleton className="h-6 w-40 mb-3" />
            <div className="space-y-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <div className="flex items-center p-2 rounded-md">
                      <div className="flex items-center flex-1 min-w-0">
                        <Skeleton className="h-6 w-6 rounded-full mr-2" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

