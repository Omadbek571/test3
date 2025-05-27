"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, Search } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import axios from "axios"

export default function MaterialsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [mater, setMater] = useState([])

  useEffect(() => {
    axios
      .get("https://testonline.pythonanywhere.com/api/admin/materials/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setMater(res.data.results) 
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

console.log(mater);  

  // Filter materials based on search query
  const filteredMaterials = mater.filter(
    (material) =>
      (material.title?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
      (material.subject_name?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
      (material.material_type?.toLowerCase().includes(searchQuery.toLowerCase()) || "")
  )

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">O'quv materiallari</h2>
            <p className="text-gray-600">Platformadagi barcha o'quv materiallari ro'yxati</p>
          </div>
          <Button onClick={() => router.push("/admin/materials/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi material
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Material qidirish..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Hisobot
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Materiallar ro'yxati</CardTitle>
            <CardDescription>Platformaga qo'shilgan barcha o'quv materiallari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium">ID</th>
                      <th className="text-left p-3 font-medium">Material nomi</th>
                      <th className="text-left p-3 font-medium">Fan</th>
                      <th className="text-left p-3 font-medium">Tur</th>
                      <th className="text-left p-3 font-medium">Format</th>
                      <th className="text-left p-3 font-medium">Hajmi</th>
                      <th className="text-left p-3 font-medium">Yuklab olishlar</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.map((material) => (
                      <tr key={material.id} className="border-t">
                        <td className="p-3">#{material.id}</td>
                        <td className="p-3">{material.title}</td>
                        <td className="p-3">{mater[0]?.subject?.name}</td>
                        <td className="p-3">{material.material_type}</td>
                        <td className="p-3">{material.file_format}</td>
                        <td className="p-3">{material.size_display}</td>
                        <td className="p-3">{material.downloads_count}</td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={
                              material.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {material.status === "active" ? "Faol" : "Nofaol"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/materials/${material.id}`)}
                          >
                            Ko'rish
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}