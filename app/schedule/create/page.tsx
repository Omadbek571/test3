"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea" // description uchun
import { ArrowLeft, Calendar, Plus, Save, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"

interface ScheduleItemForm {
  id: string 
  day_of_week: string 
  start_time: string
  end_time: string
  title: string
  item_type: string
  description?: string
}

const initialItem: Omit<ScheduleItemForm, 'id'> = {
  day_of_week: "1",
  start_time: "09:00",
  end_time: "10:30",
  title: "",
  item_type: "lesson",
  description: "",
}

export default function ScheduleCreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [scheduleItems, setScheduleItems] = useState<ScheduleItemForm[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    } else {
      setError("Avtorizatsiya tokeni topilmadi. Iltimos, qayta login qiling.")
    }

    const dayParam = searchParams.get('day')
    const todayParam = searchParams.get('today')
    let initialDay = "1" 

    if (dayParam && /^[1-7]$/.test(dayParam)) {
        initialDay = dayParam
    } else if (todayParam === 'true') {
        const jsToday = new Date().getDay()
        initialDay = (jsToday === 0 ? 7 : jsToday).toString()
    }
    
    setScheduleItems([{ ...initialItem, id: crypto.randomUUID(), day_of_week: initialDay }])

  }, [searchParams])

  const days = [
    { value: "1", label: "Dushanba" },
    { value: "2", label: "Seshanba" },
    { value: "3", label: "Chorshanba" },
    { value: "4", label: "Payshanba" },
    { value: "5", label: "Juma" },
    { value: "6", label: "Shanba" },
    { value: "7", label: "Yakshanba" },
  ]

  const itemTypes = [
    { value: "lesson", label: "Dars" },
    { value: "test", label: "Test" },
    { value: "study", label: "Mustaqil ish" },
    { value: "event", label: "Tadbir" },
    { value: "other", label: "Boshqa" },
  ]

  const handleAddItem = () => {
    setScheduleItems([...scheduleItems, { ...initialItem, id: crypto.randomUUID() }])
  }

  const handleRemoveItem = (id: string) => {
    if (scheduleItems.length > 1) {
      setScheduleItems(scheduleItems.filter((item) => item.id !== id))
    } else {
      setError("Kamida bitta jadval elementi bo'lishi kerak.")
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleItemChange = (id: string, field: keyof ScheduleItemForm, value: string) => {
    setScheduleItems(
      scheduleItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const validateItems = () => {
    for (const item of scheduleItems) {
        if (!item.title.trim()) {
            setError(`Element #${scheduleItems.indexOf(item) + 1} uchun sarlavha (Fan) kiritilmagan.`);
            return false;
        }
        if (item.start_time >= item.end_time) {
            setError(`Element #${scheduleItems.indexOf(item) + 1} uchun boshlanish vaqti tugash vaqtidan keyin yoki teng bo'lishi mumkin emas.`);
            return false;
        }
    }
    setError(null);
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError("Saqlash uchun avtorizatsiya tokeni mavjud emas.")
      return
    }
    if (!validateItems()) {
        return;
    }

    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    const promises = scheduleItems.map(item => {
      const payload = {
        day_of_week: parseInt(item.day_of_week, 10),
        start_time: item.start_time,
        end_time: item.end_time,
        title: item.title,
        item_type: item.item_type,
        description: item.description || undefined,
      }
      return axios.post(`https://testonline.pythonanywhere.com/api/schedule/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    })

    try {
      await Promise.all(promises)
      setSuccessMessage("Jadval elementlari muvaffaqiyatli saqlandi!")
      setIsSaving(false)
      setTimeout(() => {
        router.push("/schedule")
      }, 2000)
    } catch (err: any) {
      console.error("Saqlashda xatolik:", err)
      let errorMessage = "Jadval elementlarini saqlashda xatolik yuz berdi."
      if (err.response && err.response.data) {
        const apiErrors = err.response.data
        if (typeof apiErrors === 'object' && apiErrors !== null) {
            const firstKey = Object.keys(apiErrors)[0];
            if (firstKey && Array.isArray(apiErrors[firstKey])) {
                 errorMessage = `${firstKey.replace(/_/g, ' ')}: ${apiErrors[firstKey][0]}`;
            } else if (apiErrors.detail) {
                 errorMessage = apiErrors.detail;
            }
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
      setIsSaving(false)
    }
  }
  
  if (successMessage && !isSaving) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-green-600">Muvaffaqiyatli!</CardTitle>
              <CardDescription className="text-center">{successMessage}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8 }}
                className="h-2 bg-green-500 rounded-full mb-4"
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/schedule")}>
                Jadvalga qaytish
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/schedule")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">Yangi o'qish jadvali</h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center text-sm">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0"/>
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Jadval elementlari</CardTitle>
            <CardDescription>Yangi o'qish jadvalingiz uchun ma'lumotlarni kiriting.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {scheduleItems.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    className="border rounded-lg p-4 space-y-4 bg-white shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">Element #{index + 1}</h4>
                      {scheduleItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor={`title-${item.id}`}>Sarlavha (Fan)</Label>
                        <Input
                          id={`title-${item.id}`}
                          placeholder="Masalan: Matematika darsi"
                          value={item.title}
                          onChange={(e) => handleItemChange(item.id, "title", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`day-${item.id}`}>Kun</Label>
                        <Select
                          value={item.day_of_week}
                          onValueChange={(value) => handleItemChange(item.id, "day_of_week", value)}
                        >
                          <SelectTrigger id={`day-${item.id}`}>
                            <SelectValue placeholder="Kunni tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`start-time-${item.id}`}>Boshlanish vaqti</Label>
                        <Input
                          id={`start-time-${item.id}`}
                          type="time"
                          value={item.start_time}
                          onChange={(e) => handleItemChange(item.id, "start_time", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`end-time-${item.id}`}>Tugash vaqti</Label>
                        <Input
                          id={`end-time-${item.id}`}
                          type="time"
                          value={item.end_time}
                          onChange={(e) => handleItemChange(item.id, "end_time", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`type-${item.id}`}>Tur</Label>
                        <Select
                          value={item.item_type}
                          onValueChange={(value) => handleItemChange(item.id, "item_type", value)}
                        >
                          <SelectTrigger id={`type-${item.id}`}>
                            <SelectValue placeholder="Turni tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                       <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor={`description-${item.id}`}>Qo'shimcha ma'lumot (ixtiyoriy)</Label>
                        <Textarea
                          id={`description-${item.id}`}
                          placeholder="Element haqida qisqacha ta'rif..."
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                          className="min-h-[60px]"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <div className="flex justify-start">
                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                      <Plus className="h-4 w-4 mr-2" /> Yana element qo'shish
                    </Button>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                  <Button variant="outline" type="button" onClick={() => router.push("/schedule")} disabled={isSaving}>
                    Bekor qilish
                  </Button>
                  <Button type="submit" disabled={isSaving || !token || scheduleItems.length === 0}>
                    {isSaving ? (
                      <>Saqlanmoqda...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Barchasini saqlash
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}