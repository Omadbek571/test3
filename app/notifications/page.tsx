"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, BookOpen, CheckCircle, Clock, FileText, Settings, Wallet, AlertCircle, Loader2, MailOpen } from "lucide-react"
import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"

const API_BASE_URL = "https://testonline.pythonanywhere.com"

interface Notification {
  id: number
  message: string
  notification_type: string
  type_display: string
  is_read: boolean
  created_at: string
  time_since: string
  link?: string
  related_object_id?: number
}

interface UnreadCountResponse {
  unread_count: number
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    } else {
      setError("Avtorizatsiya tokeni topilmadi. Iltimos, qayta login qiling.")
      setIsLoading(false)
    }
  }, [])

  const fetchNotifications = useCallback(() => {
    if (!token) {
      if (!localStorage.getItem("token")) setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    let url = `${API_BASE_URL}/api/notifications/`
    if (filter === "unread") {
      url += "?is_read=false"
    }
    
    axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setNotifications(response.data.results || response.data || [])
      })
      .catch(err => {
        console.error("Bildirishnomalarni yuklashda xatolik:", err)
        let errorMsg = "Bildirishnomalarni yuklab bo'lmadi."
        if (err.response?.status === 401) {
          errorMsg = "Sessiya muddati tugagan. Iltimos, qayta login qiling."
        } else if (err.response?.data?.detail) {
          errorMsg = err.response.data.detail
        }
        setError(errorMsg)
        setNotifications([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [token, filter])

  const fetchUnreadCount = useCallback(() => {
    if (!token) return

    axios.get<UnreadCountResponse>(`${API_BASE_URL}/api/notifications/unread-count/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setUnreadCount(response.data.unread_count)
      })
      .catch(err => {
        console.error("O'qilmaganlar sonini olishda xatolik:", err)
      })
  }, [token])

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [fetchNotifications, fetchUnreadCount])


  const handleMarkRead = (notificationId: number, link?: string) => {
    if (!token) return

    const notification = notifications.find(n => n.id === notificationId)
    if (notification && notification.is_read) {
        if (link) router.push(link)
        return
    }

    axios.post(`${API_BASE_URL}/api/notifications/${notificationId}/mark-read/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev -1))
        if (link) router.push(link)
      })
      .catch(err => {
        console.error(`${notificationId} IDli bildirishnomani o'qildi deb belgilashda xatolik:`, err)
        if (link) router.push(link) 
      })
  }
  
  const handleMarkAllRead = () => {
    if (!token || unreadCount === 0) return

    axios.post(`${API_BASE_URL}/api/notifications/mark-all-read/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)
      })
      .catch(err => {
        console.error("Barcha bildirishnomalarni o'qildi deb belgilashda xatolik:", err)
        setError("Barcha bildirishnomalarni o'qildi deb belgilashda xatolik yuz berdi.")
      })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_test":
      case "test_reminder":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "payment_success":
      case "subscription_activated":
        return <Wallet className="h-5 w-5 text-green-500" />
      case "test_result":
      case "achievement_unlocked":
        return <CheckCircle className="h-5 w-5 text-purple-500" />
      case "new_material":
        return <BookOpen className="h-5 w-5 text-amber-500" />
      case "general_reminder":
      case "event_reminder":
        return <Clock className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("uz-UZ", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  if (isLoading && notifications.length === 0 && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga
            </Button>
            <h1 className="text-2xl font-bold">Bildirishnomalar</h1>
            {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-3 text-sm">{unreadCount}</Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/profile/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Sozlamalar
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center text-sm">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0"/>
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
            <div className="flex space-x-2">
                <Button 
                    variant={filter === "all" ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("all")}
                >
                    Barchasi
                </Button>
                <Button 
                    variant={filter === "unread" ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("unread")}
                >
                    O'qilmaganlar
                     {filter === "unread" && unreadCount > 0 && <Badge variant="default" className="ml-2">{unreadCount}</Badge>}
                </Button>
            </div>
             {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                    <MailOpen className="mr-2 h-4 w-4" />
                    Barchasini o'qildi qilish
                </Button>
            )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
                {filter === "all" ? "Barcha bildirishnomalar" : "O'qilmagan bildirishnomalar"}
            </CardTitle>
            <CardDescription>
                {filter === "all" ? "Sizning barcha bildirishnomalaringiz" : "Sizning o'qilmagan bildirishnomalaringiz"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && notifications.length > 0 && (
                <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin text-blue-500 mx-auto" /></div>
            )}
            {!isLoading && notifications.length === 0 && (
                 <div className="text-center py-10 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-2 text-gray-400"/>
                    <p>Hozircha bildirishnomalar yo'q.</p>
                    {filter === "unread" && <p className="text-sm">Barcha bildirishnomalaringiz o'qilgan.</p>}
                </div>
            )}
            {notifications.length > 0 && (
                <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                    key={notification.id}
                    className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${notification.is_read ? "bg-white" : "bg-blue-50 border-blue-200 shadow-blue-100"}`}
                    onClick={() => handleMarkRead(notification.id, notification.link)}
                    >
                    <div className="flex">
                        <div className="mr-3 mt-1 flex-shrink-0">{getNotificationIcon(notification.notification_type)}</div>
                        <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                            <h3 className={`font-medium ${!notification.is_read ? 'text-blue-800' : 'text-gray-800'}`}>{notification.type_display}</h3>
                            <p className={`text-sm mt-0.5 ${!notification.is_read ? 'text-gray-700' : 'text-gray-600'}`}>{notification.message}</p>
                            </div>
                            {!notification.is_read && (
                            <Badge variant="default" className="bg-blue-500 text-white text-xs px-1.5 py-0.5">
                                Yangi
                            </Badge>
                            )}
                        </div>
                        <div className={`text-xs mt-1.5 ${!notification.is_read ? 'text-blue-600' : 'text-gray-500'}`}>
                            {notification.time_since || formatDate(notification.created_at)}
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}