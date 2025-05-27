import { Skeleton } from "@/components/ui/skeleton"

export default function MaterialsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-2xl" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
      </div>
    </div>
  )
}

