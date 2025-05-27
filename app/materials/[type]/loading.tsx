import { Skeleton } from "@/components/ui/skeleton"

export default function MaterialsTypeLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
      </div>
    </div>
  )
}

