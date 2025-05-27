"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, Edit, Plus, Trash2, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"

interface ScheduleItem {
  id: number
  day_of_week: number
  day_display: string
  start_time: string
  end_time: string
  title: string
  item_type: string
  type_display: string
  description?: string
}

const dayMappings: { apiValue: number; displayShort: string; displayLong: string; tabValue: string }[] = [
  { apiValue: 1, displayShort: "Du", displayLong: "Dushanba", tabValue: "monday" },
  { apiValue: 2, displayShort: "Se", displayLong: "Seshanba", tabValue: "tuesday" },
  { apiValue: 3, displayShort: "Cho", displayLong: "Chorshanba", tabValue: "wednesday" },
  { apiValue: 4, displayShort: "Pa", displayLong: "Payshanba", tabValue: "thursday" },
  { apiValue: 5, displayShort: "Ju", displayLong: "Juma", tabValue: "friday" },
  { apiValue: 6, displayShort: "Sha", displayLong: "Shanba", tabValue: "saturday" },
  { apiValue: 7, displayShort: "Ya", displayLong: "Yakshanba", tabValue: "sunday" },
]

export default function SchedulePage() {
  const router = useRouter()
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([])
  const [groupedSchedule, setGroupedSchedule] = useState<Record<number, ScheduleItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    } else {
      setError("Avtorizatsiya tokeni topilmadi. Iltimos, qayta login qiling.")
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!token) {
        if(!localStorage.getItem("token")) setLoading(false);
        return;
    }

    setLoading(true)
    setError(null)
    axios
      .get(`https://testonline.pythonanywhere.com/api/schedule/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data: ScheduleItem[] = res.data.results || res.data
        setScheduleItems(data)

        const grouped: Record<number, ScheduleItem[]> = {}
        dayMappings.forEach(day => grouped[day.apiValue] = [])
        data.forEach(item => {
          if (!grouped[item.day_of_week]) {
            grouped[item.day_of_week] = []
          }
          grouped[item.day_of_week].push(item)
        })
        setGroupedSchedule(grouped)

        const jsToday = new Date().getDay()
        const apiTodayDayOfWeek = jsToday === 0 ? 7 : jsToday
        
        setTodaySchedule(data.filter(item => item.day_of_week === apiTodayDayOfWeek))
      })
      .catch((err) => {
        console.error("Jadvalni yuklashda xatolik:", err)
        if (err.response && err.response.status === 401) {
            setError("Sessiya muddati tugagan yoki token yaroqsiz. Iltimos, qayta login qiling.")
        } else {
            setError("Jadval ma'lumotlarini yuklab bo'lmadi. Server bilan bog'lanishda muammo.")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  const handleDelete = (itemId: number) => {
    if (!token) {
        setError("O'chirish uchun avtorizatsiya tokeni topilmadi.")
        return
    }
    if (window.confirm("Haqiqatan ham bu yozuvni o'chirmoqchimisiz?")) {
      axios
        .delete(`https://testonline.pythonanywhere.com/api/schedule/${itemId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setScheduleItems(prevItems => prevItems.filter(item => item.id !== itemId))
          setGroupedSchedule(prevGrouped => {
              const newGrouped = { ...prevGrouped }
              for (const dayKey in newGrouped) {
                const dayNumber = parseInt(dayKey, 10)
                if (!isNaN(dayNumber)) {
                    newGrouped[dayNumber] = newGrouped[dayNumber].filter(item => item.id !== itemId)
                }
              }
              return newGrouped
          });
          setTodaySchedule(prevToday => prevToday.filter(item => item.id !== itemId))
        })
        .catch((err) => {
          console.error("Jadval elementini o'chirishda xatolik:", err)
          setError("Elementni o'chirib bo'lmadi.")
        })
    }
  }

  const formatTime = (timeStr: string) => {
    if (!timeStr) return ""
    return timeStr.substring(0, 5)
  }

  const getSubjectColor = (title: string) => {
    const colors: Record<string, string> = {
      Matematika: "bg-blue-100 text-blue-800",
      Fizika: "bg-purple-100 text-purple-800",
      "Ingliz tili": "bg-green-100 text-green-800",
      Tarix: "bg-amber-100 text-amber-800",
      "Ona tili": "bg-red-100 text-red-800",
    }
    return colors[title] || "bg-gray-100 text-gray-800"
  }

  const getTypeColor = (itemTypeDisplay: string) => {
     const colors: Record<string, string> = {
      Dars: "bg-blue-50 text-blue-700 border-blue-200",
      Test: "bg-red-50 text-red-700 border-red-200",
      "Mustaqil ish": "bg-yellow-50 text-yellow-700 border-yellow-200",
      Tadbir: "bg-purple-50 text-purple-700 border-purple-200",
      Boshqa: "bg-gray-50 text-gray-700 border-gray-200",
      "Amaliy mashg'ulot": "bg-green-50 text-green-700 border-green-200",
      "Qo'shimcha dars": "bg-amber-50 text-amber-700 border-amber-200",
    }
    return colors[itemTypeDisplay] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga
            </Button>
            <h1 className="text-2xl font-bold">O'qish jadvali</h1>
          </div>
          <Button onClick={() => router.push("/schedule/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi yozuv
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2"/>
            {error}
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Haftalik jadval
            </CardTitle>
            <CardDescription>Sizning haftalik o'qish jadvalingiz</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={dayMappings.find(d => d.apiValue === (new Date().getDay() === 0 ? 7 : new Date().getDay()))?.tabValue || dayMappings[0].tabValue}>
              <TabsList className="grid w-full grid-cols-7 mb-6">
                {dayMappings.map(day => (
                  <TabsTrigger key={day.tabValue} value={day.tabValue}>{day.displayShort}</TabsTrigger>
                ))}
              </TabsList>

              {dayMappings.map(dayInfo => (
                <TabsContent key={dayInfo.tabValue} value={dayInfo.tabValue}>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{dayInfo.displayLong}</h3>
                    {(groupedSchedule[dayInfo.apiValue] && groupedSchedule[dayInfo.apiValue].length > 0) ? (
                      groupedSchedule[dayInfo.apiValue].map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getSubjectColor(item.title)}`}
                              >
                                <Clock className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <div className="text-sm text-gray-500">
                                  {formatTime(item.start_time)} - {formatTime(item.end_time)}
                                </div>
                                {item.description && <p className="text-xs text-gray-400 mt-1">{item.description}</p>}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <Badge variant="outline" className={getTypeColor(item.type_display)}>
                                {item.type_display}
                                </Badge>
                                <div className="flex gap-1 mt-1">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="p-1 h-auto"
                                        onClick={() => router.push(`/schedule/edit/${item.id}`)}
                                    >
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        className="p-1 h-auto"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-6 border border-dashed rounded-lg">
                        <p className="text-gray-500">Bu kun uchun yozuvlar yo'q</p>
                        <Button variant="outline" className="mt-2" onClick={() => router.push(`/schedule/create?day=${dayInfo.apiValue}`)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Yozuv qo'shish
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bugungi jadval</CardTitle>
            <CardDescription>Bugungi kungi yozuvlaringiz</CardDescription>
          </CardHeader>
          <CardContent>
            {todaySchedule.length > 0 ? (
                <div className="space-y-4">
                {todaySchedule.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getSubjectColor(item.title)}`}
                        >
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="text-sm text-gray-500">
                            {formatTime(item.start_time)} - {formatTime(item.end_time)}
                            </div>
                            {item.description && <p className="text-xs text-gray-400 mt-1">{item.description}</p>}
                        </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                            <Badge variant="outline" className={getTypeColor(item.type_display)}>
                            {item.type_display}
                            </Badge>
                            <div className="flex gap-1 mt-1">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="p-1 h-auto"
                                    onClick={() => router.push(`/schedule/edit/${item.id}`)}
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="p-1 h-auto"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center p-6 border border-dashed rounded-lg">
                    <p className="text-gray-500">Bugun uchun yozuvlar yo'q.</p>
                    <Button variant="outline" className="mt-2" onClick={() => router.push(`/schedule/create?today=true`)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Yozuv qo'shish
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}