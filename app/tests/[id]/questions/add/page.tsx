"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import axios from "axios"

export default function AddQuestionPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params?.id as string

  const [formData, setFormData] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "", // Qiymati 'A', 'B', 'C', 'D' bo'lishi kerak
    explanation: "",
    difficulty: "orta", // Backendga mos qiymat: 'oson', 'orta', 'qiyin', 'murakkab'
    points: 1,
    order: 0,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [adminToken, setAdminToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setAdminToken(token)
    } else {
      console.error("Admin tokeni topilmadi!")
      alert("Avtorizatsiya uchun token topilmadi. Iltimos, qayta tizimga kiring.")
      router.push("/admin") // Yoki login sahifasiga
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: id === "points" || id === "order" ? (value === "" ? 0 : Number(value)) : value,
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!adminToken) {
      alert("Admin tokeni topilmadi! Iltimos, qayta tizimga kiring.")
      setIsSubmitting(false)
      return
    }

    if (!testId) {
      alert("Test ID si topilmadi!")
      setIsSubmitting(false)
      return
    }

    if (
      !formData.question_text ||
      !formData.option_a ||
      !formData.option_b ||
      !formData.option_c ||
      !formData.option_d ||
      !formData.correct_answer ||
      !formData.difficulty ||
      formData.points < 1
    ) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring va ballni to'g'ri kiriting.")
      setIsSubmitting(false)
      return
    }

    const payload = {
      question_text: formData.question_text,
      option_a: formData.option_a,
      option_b: formData.option_b,
      option_c: formData.option_c,
      option_d: formData.option_d,
      correct_answer: formData.correct_answer,
      difficulty: formData.difficulty,
      points: formData.points,
      explanation: formData.explanation || null,
      order: formData.order || 0,
    }

    console.log("APIga yuborilayotgan ma'lumot:", payload)

    try {
      const response = await axios.post(
        `https://testonline.pythonanywhere.com/api/admin/tests/${testId}/questions/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        },
      )

      if (response.status === 201) {
        alert("Savol muvaffaqiyatli qo'shildi!")
        setFormData({
          question_text: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_answer: "",
          explanation: "",
          difficulty: "orta",
          points: 1,
          order: 0,
        })
        router.push(`/admin/tests/${testId}?tab=questions`)
      } else {
        alert(`Savol qo'shishda kutilmagan javob: ${response.status}`)
      }
    } catch (err: any) {
      console.error("Savolni qo'shishda xatolik:", err.response?.data || err.message)
      let errorMessage = "Xatolik yuz berdi."
      if (err.response && err.response.data) {
        const errors = err.response.data
        const errorMessages = Object.entries(errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
          .join("\n")
        errorMessage = `Savol qo'shishda xatolik:\n${errorMessages}`
      } else {
        errorMessage = `Savol qo'shishda xatolik: ${err.message}`
      }
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              className="mr-4"
              onClick={() => router.push(`/admin/tests/${testId}?tab=questions`)}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
            <div>
              <h2 className="text-2xl font-bold mb-1">Test #{testId} uchun savol qo'shish</h2>
              <p className="text-gray-600">Yangi savol ma'lumotlarini kiriting</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Savol ma'lumotlari</CardTitle>
              <CardDescription>Barcha kerakli maydonlarni to'ldiring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question_text">
                  Savol matni <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="question_text"
                  placeholder="Savol matnini kiriting..."
                  rows={4}
                  value={formData.question_text}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="option_a">
                    A varianti <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="option_a"
                    placeholder="A variantini kiriting"
                    value={formData.option_a}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option_b">
                    B varianti <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="option_b"
                    placeholder="B variantini kiriting"
                    value={formData.option_b}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option_c">
                    C varianti <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="option_c"
                    placeholder="C variantini kiriting"
                    value={formData.option_c}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="option_d">
                    D varianti <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="option_d"
                    placeholder="D variantini kiriting"
                    value={formData.option_d}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correct_answer">
                    To'g'ri javob <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.correct_answer}
                    onValueChange={(value) => handleSelectChange("correct_answer", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="correct_answer">
                      <SelectValue placeholder="To'g'ri javobni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">
                    Qiyinlik darajasi <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Qiyinlik darajasini tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oson">Oson</SelectItem>
                      <SelectItem value="orta">O'rta</SelectItem>
                      <SelectItem value="qiyin">Qiyin</SelectItem>
                      <SelectItem value="murakkab">Murakkab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">
                    Ball <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    placeholder="Savol uchun ball"
                    value={formData.points}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Izoh (ixtiyoriy)</Label>
                <Textarea
                  id="explanation"
                  placeholder="Savol uchun izoh yoki tushuntirish..."
                  rows={3}
                  value={formData.explanation}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Tartib raqami (ixtiyoriy)</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  placeholder="Savol tartib raqami"
                  value={formData.order === 0 ? "" : formData.order}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Agar bo'sh qoldirilsa yoki 0 kiritsangiz, savol avtomatik ravishda oxiriga qo'shiladi.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push(`/admin/tests/${testId}?tab=questions`)}
                disabled={isSubmitting}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saqlanmoqda..." : "Savolni saqlash"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AdminLayout>
  )
}
