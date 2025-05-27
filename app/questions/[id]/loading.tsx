import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function QuestionDetailLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-10 w-48 mb-6" />

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="w-full">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          <div className="flex items-center">
            <Skeleton className="h-8 w-8 rounded-full mr-2" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-40" />
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded-full mr-2" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  {i === 0 && <Skeleton className="h-6 w-32" />}
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-9 w-20" />
                  {i !== 0 && <Skeleton className="h-9 w-40" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-10 w-40" />
        </CardContent>
      </Card>
    </div>
  )
}

