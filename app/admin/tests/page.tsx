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

export default function TestsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [testsCard, setTestCard] = useState([])

  useEffect(() => {
    axios
      .get("https://testonline.pythonanywhere.com/api/admin/tests/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTestCard(res.data.results)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  // Testlarni qidiruv asosida filtrlash
  const filteredTests = testsCard.filter(
    (test) =>
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.subject_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Testlar</h2>
            <p className="text-gray-600">Platformadagi barcha testlar ro'yxati</p>
          </div>
          <Button onClick={() => router.push("/admin/tests/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi test
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Test qidirish..."
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
            <CardTitle>Testlar ro'yxati</CardTitle>
            <CardDescription>Platformaga qo'shilgan barcha testlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium">ID</th>
                      <th className="text-left p-3 font-medium">Test nomi</th>
                      <th className="text-left p-3 font-medium">Fan</th>
                      <th className="text-left p-3 font-medium">Savollar soni</th>
                      <th className="text-left p-3 font-medium">Qiyinlik</th>
                      <th className="text-left p-3 font-medium">Qo'shilgan sana</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.length > 0 ? (
                      filteredTests.map((test) => {
                        // Sanani formatlash
                        const date = new Date(test.created_at)
                        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

                        return (
                          <tr key={test.id} className="border-t">
                            <td className="p-3">#{test.id}</td>
                            <td className="p-3">{test.title}</td>
                            <td className="p-3">{test.subject_name}</td>
                            <td className="p-3">{test.question_count}</td>
                            <td className="p-3">{test.difficulty_display}</td>
                            <td className="p-3">{formattedDate}</td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={
                                  test.status === "published"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }
                              >
                                {test.status_display}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/admin/tests/${test.id}`)}
                                >
                                  Ko'rish
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                  onClick={() => router.push(`/admin/tests/${test.id}?tab=questions`)}
                                >
                                  Savollarni tahrirlash
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-3 text-center text-gray-500">
                          Testlar topilmadi
                        </td>
                      </tr>
                    )}
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
