"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Search, UserPlus } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import axios from "axios"

export default function UsersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [foydalanuv, setFoydalanuv] = useState([])

  // API dan foydalanuvchilarni olish
  useEffect(() => {
    axios
      .get("https://testonline.pythonanywhere.com/api/admin/users/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setFoydalanuv(res.data.results)          
        }
      })
      .catch((err) => {
        console.log(err)        
      })
  }, [])

  // Foydalanuvchilarni qidiruv asosida filtrlash
  const filteredUsers = foydalanuv.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number.includes(searchQuery),
  )

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Foydalanuvchilar</h2>
            <p className="text-gray-600">Platformadagi barcha foydalanuvchilar ro'yxati</p>
          </div>
          <Button onClick={() => router.push("/admin/users/add")}>
            <UserPlus className="mr-2 h-4 w-4" /> Yangi foydalanuvchi
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Foydalanuvchi qidirish..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Foydalanuvchilar ro'yxati</CardTitle>
            <CardDescription>Platformada ro'yxatdan o'tgan barcha foydalanuvchilar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50"><th className="text-left p-3 font-medium">ID</th><th className="text-left p-3 font-medium">Ism</th><th className="text-left p-3 font-medium">Telefon</th><th className="text-left p-3 font-medium">Email</th><th className="text-left p-3 font-medium">Rol</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium">Ro'yxatdan o'tgan sana</th><th className="text-left p-3 font-medium"></th></tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        // Sanani formatlash
                        const date = new Date(user.date_joined)
                        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`

                        return (
                          <tr key={user.id} className="border-t">
                            <td className="p-3">#{user.id}</td>
                            <td className="p-3">{user.full_name || "Noma'lum"}</td>
                            <td className="p-3">{user.phone_number || "Telefon yo'q"}</td>
                            <td className="p-3">{user.email || "Email yo'q"}</td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={
                                  user.role === "admin"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }
                              >
                                {user.role || "Abituriyent"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={
                                  user.status_display
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }
                              >
                                {user.status_display}
                              </Badge>
                            </td>
                            <td className="p-3">{formattedDate}</td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/admin/users/${user.id}`)}
                              >
                                Ko'rish
                              </Button>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-3 text-center text-gray-500">
                          Foydalanuvchilar topilmadi
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