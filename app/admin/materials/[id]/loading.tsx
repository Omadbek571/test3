import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function MaterialDetailLoading() {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 rounded-md mr-4" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-8 w-full max-w-md mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  ))}
                </div>

                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <div className="border rounded-lg p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-md mb-4" />
                  <Skeleton className="h-5 w-48 mb-1" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
