import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileCoursesLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="mb-8">
        <Skeleton className="h-10 w-full max-w-md mb-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg border overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-5 w-3/4 mb-3" />
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

