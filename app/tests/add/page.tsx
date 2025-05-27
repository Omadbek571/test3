"use client"

import { useRef, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, FileText, Save } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation" // Next.js 13+ uchun to'g'ri import

export default function TestAddPage() {
  const router = useRouter()

  // Inputlar uchun useRef'larni yaratish
  const titleRef = useRef<HTMLInputElement>(null)
  const typeRef = useRef<HTMLSelectElement>(null)
  const difficultyRef = useRef<HTMLSelectElement>(null)
  const questionsCountRef = useRef<HTMLInputElement>(null)
  const timeLimitRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const rewardRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const statusRef = useRef<HTMLInputElement>(null)

  // Subject uchun alohida useState
  const [subject, setSubject] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false) // So'rov jarayonini ko'rsatish uchun
  const [testData, setTestData] = useState<any[]>([]) // Yangi testlarni saqlash uchun array

  // Yangi test qo'shish va API'ga so'rov yuborish (axios bilan, asinxron)
  const handleSaveChanges = () => {
    setIsLoading(true) // So'rov boshlandi

    // Subject tanlanmagan bo'lsa, xatolik ko'rsatish
    if (!subject) {
      alert("Iltimos, fan tanlang!")
      setIsLoading(false)
      return
    }

    const newTest = {
      title: titleRef.current?.value || "",
      subject: Number(subject), // subject qiymatini Number ga aylantiramiz
      description: descriptionRef.current?.value || "",
      difficulty: difficultyRef.current?.value?.toLowerCase() || "oson",
      test_type: typeRef.current?.value?.toLowerCase() || "free",
      price: priceRef.current?.value ? Number(priceRef.current.value).toFixed(2) : "0.00",
      reward_points: Number(rewardRef.current?.value) || 0,
      time_limit: Number(timeLimitRef.current?.value) || 0,
      status: statusRef.current?.checked ? "active" : "inactive",
    }

    console.log(48, newTest)

    // Axios bilan asinxron so'rov yuborish
    axios
      .post("https://testonline.pythonanywhere.com/api/admin/tests/", newTest, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setTestData([...testData, response.data]) // API'dan kelgan javobni saqlash
        alert("Yangi test qo'shildi!")

        // Formani tozalash
        if (titleRef.current) titleRef.current.value = ""
        setSubject(null) // Subject'ni tozalash
        if (typeRef.current) typeRef.current.value = "free"
        if (difficultyRef.current) difficultyRef.current.value = "oson"
        if (questionsCountRef.current) questionsCountRef.current.value = "0"
        if (timeLimitRef.current) timeLimitRef.current.value = "0"
        if (priceRef.current) priceRef.current.value = "0"
        if (rewardRef.current) rewardRef.current.value = "0"
        if (descriptionRef.current) descriptionRef.current.value = ""
        if (statusRef.current) statusRef.current.checked = true

        // /admin/dashboard sahifasiga yo'naltirish
        router.push("/admin/dashboard")
      })
      .catch((err) => {
        console.log(err)
        alert("Testni qo'shishda xatolik yuz berdi: " + (err.response?.data?.subject || err.message))
      })
      .finally(() => {
        setIsLoading(false) // So'rov tugadi
      })
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.push("/admin/tests")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
            <div>
              <h2 className="text-2xl font-bold mb-1">Test qo'shish</h2>
              <p className="text-gray-600">Yangi test yaratish</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  Test qo'shish
                </CardTitle>
                <CardDescription>Yangi test haqida asosiy ma'lumotlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Test nomi</Label>
                      <Input id="title" ref={titleRef} placeholder="Test nomini kiriting" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Fan</Label>
                      <Select value={subject || ""} onValueChange={(value) => setSubject(value)}>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Fan tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Matematika</SelectItem>
                          <SelectItem value="2">Fizika</SelectItem>
                          <SelectItem value="3">Kimyo</SelectItem>
                          <SelectItem value="4">Biologiya</SelectItem>
                          <SelectItem value="5">Ingliz tili</SelectItem>
                          <SelectItem value="6">Ona tili</SelectItem>
                          <SelectItem value="7">Tarix</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tur</Label>
                      <Select>
                        <SelectTrigger id="type" ref={typeRef}>
                          <SelectValue placeholder="Tur tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Bepul</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Qiyinlik</Label>
                      <Select>
                        <SelectTrigger id="difficulty" ref={difficultyRef}>
                          <SelectValue placeholder="Qiyinlik tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oson">Oson</SelectItem>
                          <SelectItem value="o'rta">O'rta</SelectItem>
                          <SelectItem value="qiyin">Qiyin</SelectItem>
                          <SelectItem value="murakkab">Murakkab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="questionsCount">Savollar soni</Label>
                      <Input
                        id="questionsCount"
                        type="number"
                        ref={questionsCountRef}
                        placeholder="Savollar sonini kiriting"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeLimit">Vaqt chegarasi (daqiqa)</Label>
                      <Input id="timeLimit" type="number" ref={timeLimitRef} placeholder="Vaqt chegarasini kiriting" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Narxi (so'm)</Label>
                      <Input id="price" type="number" ref={priceRef} placeholder="Narxni kiriting" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reward">Mukofot (so'm)</Label>
                      <Input id="reward" type="number" ref={rewardRef} placeholder="Mukofotni kiriting" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Tavsif</Label>
                    <Textarea
                      id="description"
                      ref={descriptionRef}
                      rows={4}
                      placeholder="Test haqida qisqacha tavsif"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="active-status">Faol holati</Label>
                      <div className="text-sm text-gray-500">Test faol holatini o'zgartirish</div>
                    </div>
                    <Switch id="active-status" ref={statusRef} defaultChecked={true} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={isLoading}>
                  {isLoading ? (
                    "Yuborilmoqda..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Saqlash
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
