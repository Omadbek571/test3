"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Search } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import axios from "axios"

export default function PaymentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [infoPayments, setInfoPayments] = useState([])
  console.log(17, infoPayments)

  useEffect(() => {
    axios
      .get("https://testonline.pythonanywhere.com/api/admin/payments/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(27, res)
        setInfoPayments(res.data.results)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  // Filter payments based on search query
  const filteredPayments = infoPayments.filter((payment) =>
    (payment.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
    (payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
    (payment.amount?.toString().includes(searchQuery) || "") ||
    (payment.payment_type?.toLowerCase().includes(searchQuery.toLowerCase()) || "")
  )

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">To'lovlar</h2>
            <p className="text-gray-600">Platformadagi barcha to'lovlar ro'yxati</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="To'lov qidirish..."
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
            <CardTitle>To'lovlar ro'yxati</CardTitle>
            <CardDescription>Platformada amalga oshirilgan barcha to'lovlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium">ID</th>
                      <th className="text-left p-3 font-medium">Foydalanuvchi</th>
                      <th className="text-left p-3 font-medium">Tavsif</th>
                      <th className="text-left p-3 font-medium">Tur</th>
                      <th className="text-right p-3 font-medium">Summa</th>
                      <th className="text-left p-3 font-medium">Sana</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-t">
                        <td className="p-3">#{payment.id}</td>
                        <td className="p-3">{payment.user_email}</td>
                        <td className="p-3">{payment.description}</td>
                        <td className="p-3">
                          <Badge
                            className={`px-2.5 py-0.5 rounded-full text-sm font-medium border 
                              ${payment.payment_type === 'deposit'
                                ? 'bg-green-50 text-green-700 border-green-300'
                                : 'bg-red-50 text-red-700 border-red-300'}`}
                          >
                            {payment.payment_type}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-medium">
                          +{payment.amount.toLocaleString()} so'm
                        </td>
                        <td className="p-3">
                          {new Date(payment.created_at).toLocaleDateString("uz-UZ")}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/payments/${payment.id}`)}
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