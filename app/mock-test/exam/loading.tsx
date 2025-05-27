import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"

export default function MockTestExamLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-24 mr-4" />
          <Skeleton className="h-8 w-64" />
        </div>

        <Skeleton className="h-16 w-full mb-6" />

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

