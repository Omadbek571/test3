"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, CalendarDays, Loader2, AlertCircle } from "lucide-react"
import { useEffect, useState, use } from "react" // React.use ni import qilamiz
import axios from "axios"

interface ScheduleItemForm {
  title: string
  description?: string
  day_of_week: string
  start_time: string
  end_time: string
  item_type: string
}

interface Choice {
  value: string | number
  display_name: string
}

export default function EditScheduleItemPage({ params: paramsProp }: { params: { id: string } }) {
  const resolvedParams = use(paramsProp) // paramsProp ni React.use orqali ochamiz
  const { id } = resolvedParams // Endi 'id' ni ochilgan params dan olamiz

  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  const [formData, setFormData] = useState<ScheduleItemForm>({
    title: "",
    description: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    item_type: ""
  })

  const [dayOfWeekChoices, setDayOfWeekChoices] = useState<Choice[]>([])
  const [itemTypeChoices, setItemTypeChoices] = useState<Choice[]>([])

  const [loading, setLoading] = useState(true)
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    } else {
      setError("Avtorizatsiya tokeni topilmadi. Iltimos, qayta login qiling.")
      setLoading(false)
      setOptionsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      if (!localStorage.getItem("token")) {
          setLoading(false);
          setOptionsLoading(false);
      }
      return
    }

    setOptionsLoading(true)
    axios
      .options(`https://testonline.pythonanywhere.com/api/schedule/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const actions = res.data.actions?.PUT || res.data.actions?.POST;
        if (actions) {
          setDayOfWeekChoices(actions.day_of_week?.choices || [])
          setItemTypeChoices(actions.item_type?.choices || [])
        }
      })
      .catch((err) => {
        console.error("Dropdown tanlovlarini yuklashda xatolik:", err)
        setError("Dropdown ma'lumotlarini yuklab bo'lmadi.")
      })
      .finally(() => {
        setOptionsLoading(false)
      })
  }, [token])


  useEffect(() => {
    if (!token || !id || optionsLoading) {
      if (!localStorage.getItem("token") && !optionsLoading) setLoading(false);
      return
    }

    setLoading(true)
    setError(null)
    axios
      .get(`https://testonline.pythonanywhere.com/api/schedule/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const item = res.data
        setFormData({
          title: item.title || "",
          description: item.description || "",
          day_of_week: item.day_of_week ? String(item.day_of_week) : "",
          start_time: item.start_time ? item.start_time.substring(0, 5) : "",
          end_time: item.end_time ? item.end_time.substring(0, 5) : "",
          item_type: item.item_type || ""
        })
      })
      .catch((err) => {
        console.error("Jadval ma'lumotini yuklashda xatolik:", err)
        if (err.response && err.response.status === 401) {
          setError("Sessiya muddati tugagan yoki token yaroqsiz. Iltimos, qayta login qiling.")
        } else {
          setError("Ma'lumotni yuklab bo'lmadi.")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id, token, optionsLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof ScheduleItemForm, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) {
      setError("Saqlash uchun avtorizatsiya tokeni topilmadi.")
      return
    }
    setSaving(true)
    setError(null)

    const payload = {
      ...formData,
      day_of_week: parseInt(formData.day_of_week, 10),
      start_time: formData.start_time.length === 5 ? `${formData.start_time}:00` : formData.start_time,
      end_time: formData.end_time.length === 5 ? `${formData.end_time}:00` : formData.end_time,
    }

    axios
      .put(`https://testonline.pythonanywhere.com/api/schedule/${id}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        router.push("/schedule")
      })
      .catch((err) => {
        console.error("Ma'lumotni saqlashda xatolik:", err.response?.data || err.message)
        let errorMessage = "Ma'lumotni saqlab bo'lmadi."
        if (err.response && err.response.data) {
          const errors = err.response.data
          const messages = Object.keys(errors).map(key => {
            const fieldErrors = Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key];
            return `${key}: ${fieldErrors}`;
          });
          errorMessage = messages.join(' \n')
        }
        setError(errorMessage)
      })
      .finally(() => {
        setSaving(false)
      })
  }

  if (loading || optionsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">Jadval Yozuvini Tahrirlash</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-blue-500" />
              Yozuv Ma'lumotlari (ID: {id})
            </CardTitle>
            <CardDescription>
              Kerakli maydonlarni to'ldiring va o'zgarishlarni saqlang.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Sarlavha</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Masalan, Matematika darsi"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Tavsif (ixtiyoriy)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Qo'shimcha ma'lumotlar..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="day_of_week">Hafta kuni</Label>
                  <Select
                    name="day_of_week"
                    value={formData.day_of_week}
                    onValueChange={(value) => handleSelectChange("day_of_week", value)}
                    required
                  >
                    <SelectTrigger id="day_of_week">
                      <SelectValue placeholder="Hafta kunini tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {dayOfWeekChoices.map(choice => (
                        <SelectItem key={choice.value} value={String(choice.value)}>
                          {choice.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item_type">Yozuv turi</Label>
                  <Select
                    name="item_type"
                    value={formData.item_type}
                    onValueChange={(value) => handleSelectChange("item_type", value)}
                    required
                  >
                    <SelectTrigger id="item_type">
                      <SelectValue placeholder="Yozuv turini tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemTypeChoices.map(choice => (
                        <SelectItem key={choice.value} value={String(choice.value)}>
                          {choice.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Boshlanish vaqti</Label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">Tugash vaqti</Label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={saving || loading || optionsLoading}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}