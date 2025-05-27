"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart2, FileText, Save, Users, Edit, Trash2, PlusCircle } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

interface SubjectNested {
  id: number
  name: string
  icon?: string
}

interface UserNested {
  id: number
  username: string
}

interface TestDetail {
  id: number
  title: string
  subject: SubjectNested
  description: string
  difficulty: string
  difficulty_display: string
  test_type: string
  type_display: string
  price: number
  time_limit: number
  reward_points: number
  status: string
  status_display: string
  created_at: string
  updated_at: string
  question_count: number
  created_by: UserNested
}

interface Question {
  id: number
  test: number
  order: number
  question_text: string
  difficulty: string
  difficulty_display: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  correct_answer_display: string
  explanation: string | null
  points: number
}

interface ParticipantTestInfo {
  id: number
  title: string
  subject: SubjectNested
  test_type: string
  type_display: string
  question_count: number
  difficulty: string
  difficulty_display: string
  price: string
  price_display: string
  time_limit: number
  reward_points: number
  status: string
  status_display: string
  created_at: string
}

interface ParticipantUserAnswerQuestion {
  id: number
  order: number
  question_text: string
  difficulty: string
  difficulty_display: string
  points: number
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  explanation: string | null
}

interface ParticipantUserAnswer {
  question: ParticipantUserAnswerQuestion
  selected_answer: string
  is_correct: boolean
}

interface Participant {
  id: number
  user: number
  test: ParticipantTestInfo
  score: number
  score_display: string
  total_questions: number
  percentage: number
  start_time: string
  end_time: string | null
  time_spent: string
  time_spent_display: string
  status: string
  status_display: string
  user_answers: ParticipantUserAnswer[]
}

interface Statistics {
  participants_count: number
  average_score: number
  total_income: number
}

const API_BASE_URL = "https://testonline.pythonanywhere.com/api/admin/tests"

export default function TestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [testId, setTestId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [adminToken, setAdminToken] = useState<string | null>(null)

  const [testDetails, setTestDetails] = useState<TestDetail | null>(null)
  const [questionsData, setQuestionsData] = useState<Question[]>([])
  const [participantsData, setParticipantsData] = useState<Participant[]>([])
  const [statisticsData, setStatisticsData] = useState<Statistics | null>(null)

  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false)
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false)

  const [editFormData, setEditFormData] = useState<{
    title?: string
    subject_id?: number
    description?: string
    difficulty?: string
    test_type?: string
    price?: number
    reward_points?: number
    time_limit?: number
    status?: string
  }>({})

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setAdminToken(token)
    } else {
      console.error("Admin tokeni topilmadi")
    }
  }, [])

  useEffect(() => {
    if (params?.id && typeof params.id === "string") {
      setTestId(params.id)

      // Check for tab query parameter
      const searchParams = new URLSearchParams(window.location.search)
      const tabParam = searchParams.get("tab")
      if (tabParam && ["details", "questions", "users", "statistics"].includes(tabParam)) {
        setActiveTab(tabParam)
      }
    }
  }, [params])

  useEffect(() => {
    if (!testId || !adminToken) return

    setIsLoadingDetails(true)
    axios
      .get(`${API_BASE_URL}/${testId}/`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      .then((res) => {
        setTestDetails(res.data)
        setEditFormData({
          title: res.data.title,
          subject_id: res.data.subject?.id,
          description: res.data.description,
          difficulty: res.data.difficulty,
          test_type: res.data.test_type,
          price: Number.parseFloat(res.data.price) || 0,
          reward_points: res.data.reward_points,
          time_limit: res.data.time_limit,
          status: res.data.status,
        })
      })
      .catch((err) => {
        console.error("Test tafsilotlarini olishda xatolik:", err)
      })
      .finally(() => {
        setIsLoadingDetails(false)
      })
  }, [testId, adminToken])

  useEffect(() => {
    if (!testId || !adminToken || activeTab !== "questions") return

    setIsLoadingQuestions(true)
    axios
      .get(`${API_BASE_URL}/${testId}/questions/`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      .then((res) => {
        setQuestionsData(res.data.results || res.data)
      })
      .catch((err) => {
        console.error("'Savollar' tabini olishda xatolik:", err)
      })
      .finally(() => {
        setIsLoadingQuestions(false)
      })
  }, [testId, adminToken, activeTab])

  useEffect(() => {
    if (!testId || !adminToken || activeTab !== "users") return

    setIsLoadingParticipants(true)
    axios
      .get(`${API_BASE_URL}/${testId}/participants/`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      .then((res) => {
        setParticipantsData(res.data.results || [])
      })
      .catch((err) => {
        console.error("'Foydalanuvchilar' tabini olishda xatolik:", err)
        setParticipantsData([])
      })
      .finally(() => {
        setIsLoadingParticipants(false)
      })
  }, [testId, adminToken, activeTab])

  useEffect(() => {
    if (!testId || !adminToken || activeTab !== "statistics") return

    setIsLoadingStatistics(true)
    axios
      .get(`${API_BASE_URL}/${testId}/statistics/`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      .then((res) => {
        setStatisticsData(res.data)
      })
      .catch((err) => {
        console.error("'Statistika' tabini olishda xatolik:", err)
      })
      .finally(() => {
        setIsLoadingStatistics(false)
      })
  }, [testId, adminToken, activeTab])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    const numValue =
      id === "price" || id === "reward_points" || id === "time_limit" || id === "subject_id" ? Number(value) : value
    setEditFormData((prev) => ({ ...prev, [id]: numValue }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSwitchChange = (id: string, checked: boolean) => {
    setEditFormData((prev) => ({ ...prev, [id]: checked ? "active" : "draft" }))
  }

  const handleSaveChanges = () => {
    if (!testId || !adminToken || !testDetails) return

    const payload = {
      title: editFormData.title,
      subject: editFormData.subject_id,
      description: editFormData.description,
      difficulty: editFormData.difficulty,
      test_type: editFormData.test_type,
      price: Number(editFormData.price),
      reward_points: Number(editFormData.reward_points),
      time_limit: Number(editFormData.time_limit),
      status: editFormData.status,
    }

    axios
      .put(`${API_BASE_URL}/${testId}/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      })
      .then((res) => {
        setTestDetails(res.data)
        alert("O'zgarishlar muvaffaqiyatli saqlandi!")
      })
      .catch((err) => {
        console.error("Test ma'lumotlarini saqlashda xatolik:", err.response?.data || err.message)
        alert(`Xatolik yuz berdi: ${JSON.stringify(err.response?.data) || err.message}`)
      })
  }

  const handleDeleteTest = () => {
    if (!testId || !adminToken) return

    if (confirm("Haqiqatan ham bu testni o'chirmoqchimisiz?")) {
      axios
        .delete(`${API_BASE_URL}/${testId}/`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        })
        .then(() => {
          alert("Test muvaffaqiyatli o'chirildi")
          router.push("/admin/tests")
        })
        .catch((err) => {
          console.error("Testni o'chirishda xatolik:", err)
          alert("Testni o'chirishda xatolik yuz berdi.")
        })
    }
  }

  const handleDeleteQuestion = (questionId: number) => {
    if (!testId || !adminToken) return
    if (confirm("Haqiqatan ham bu savolni o'chirmoqchimisiz?")) {
      axios
        .delete(`${API_BASE_URL}/${testId}/questions/${questionId}/`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        })
        .then(() => {
          alert("Savol o'chirildi")
          setQuestionsData((prev) => prev.filter((q) => q.id !== questionId))
          if (testDetails) {
            setTestDetails((prev) => (prev ? { ...prev, question_count: prev.question_count - 1 } : null))
          }
        })
        .catch((err) => {
          console.error("Savolni o'chirishda xatolik:", err)
          alert("Savolni o'chirishda xatolik.")
        })
    }
  }

  if (isLoadingDetails && !testDetails) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">Yuklanmoqda...</div>
      </AdminLayout>
    )
  }

  if (!testDetails && !isLoadingDetails) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-red-500">Test ma'lumotlari topilmadi yoki yuklashda xatolik.</div>
      </AdminLayout>
    )
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
              <h2 className="text-2xl font-bold mb-1">Test ma'lumotlari</h2>
              <p className="text-gray-600">ID: {testId}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="destructive" onClick={handleDeleteTest}>
              Testni O'chirish
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="details">Tafsilotlar</TabsTrigger>
            <TabsTrigger value="questions">Savollar</TabsTrigger>
            <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
            <TabsTrigger value="statistics">Statistika</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-500" />
                      Test ma'lumotlarini tahrirlash
                    </CardTitle>
                    <CardDescription>Test haqida asosiy ma'lumotlar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Test nomi</Label>
                          <Input id="title" value={editFormData.title || ""} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject_id">Fan IDsi</Label>
                          <Input
                            id="subject_id"
                            type="number"
                            placeholder="Fan ID sini kiriting"
                            value={editFormData.subject_id || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="test_type">Tur</Label>
                          <Select
                            value={editFormData.test_type}
                            onValueChange={(value) => handleSelectChange("test_type", value)}
                          >
                            <SelectTrigger id="test_type">
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
                          <Select
                            value={editFormData.difficulty}
                            onValueChange={(value) => handleSelectChange("difficulty", value)}
                          >
                            <SelectTrigger id="difficulty">
                              <SelectValue placeholder="Qiyinlik tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Oson</SelectItem>
                              <SelectItem value="medium">O'rta</SelectItem>
                              <SelectItem value="hard">Qiyin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="question_count_display">Savollar soni (avtomatik)</Label>
                          <Input
                            id="question_count_display"
                            type="number"
                            value={testDetails?.question_count || 0}
                            readOnly
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time_limit">Vaqt chegarasi (daqiqa)</Label>
                          <Input
                            id="time_limit"
                            type="number"
                            value={editFormData.time_limit || 0}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Narxi (so'm)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={editFormData.price || 0}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reward_points">Mukofot ballari</Label>
                          <Input
                            id="reward_points"
                            type="number"
                            value={editFormData.reward_points || 0}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Tavsif</Label>
                        <Textarea
                          id="description"
                          value={editFormData.description || ""}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="status">Faol holati</Label>
                          <div className="text-sm text-gray-500">Test faol holatini o'zgartirish</div>
                        </div>
                        <Switch
                          id="status"
                          checked={editFormData.status === "active"}
                          onCheckedChange={(checked) => handleSwitchChange("status", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveChanges}>
                      <Save className="mr-2 h-4 w-4" /> O'zgarishlarni Saqlash
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-500" /> Test haqida (Joriy)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDetails ? (
                      <p>Yuklanmoqda...</p>
                    ) : testDetails ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Test nomi</h3>
                          <p className="font-medium">{testDetails.title}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Fan</h3>
                          <p>{testDetails.subject?.name || "Noma'lum"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Tur</h3>
                          <Badge
                            className={
                              testDetails.test_type === "premium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {testDetails.type_display}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Qiyinlik</h3>
                          <p>{testDetails.difficulty_display}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                          <Badge
                            className={
                              testDetails.status === "active"
                                ? "bg-green-100 text-green-800"
                                : testDetails.status === "draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {testDetails.status_display}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Yaratilgan sana</h3>
                          <p>{new Date(testDetails.created_at).toLocaleDateString("uz-UZ")}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Savollar soni</h3>
                          <p>{testDetails.question_count}</p>
                        </div>
                      </div>
                    ) : (
                      <p>Ma'lumot yo'q</p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-blue-500" /> Ishtirokchilar (Statistikadan)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingStatistics && !statisticsData ? (
                      <p>Yuklanmoqda...</p>
                    ) : statisticsData ? (
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">{statisticsData.participants_count}</div>
                        <p className="text-sm text-gray-500 mb-4">Ishtirokchilar soni</p>
                        <Button className="w-full" onClick={() => setActiveTab("users")}>
                          Batafsil ko'rish
                        </Button>
                      </div>
                    ) : (
                      <p>Statistika yuklanmadi.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" /> Test savollari
                </CardTitle>
                <CardDescription>Jami: {testDetails?.question_count || 0} ta</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingQuestions ? (
                  <p>Savollar yuklanmoqda...</p>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Ro'yxatdagi savollar: {questionsData.length}</h3>
                      <Button onClick={() => router.push(`/admin/tests/${testId}/questions/add`)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Savol qo'shish
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {questionsData.length > 0 ? (
                        questionsData.map((question, index) => (
                          <Card key={question.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <Badge variant="outline" className="mr-2">
                                      Savol {question.order || index + 1} (ID: {question.id})
                                    </Badge>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      {question.difficulty_display}
                                    </Badge>
                                    <Badge variant="secondary" className="ml-2">
                                      {question.points} ball
                                    </Badge>
                                  </div>
                                  <p className="mb-1 font-semibold">{question.question_text}</p>
                                  {question.explanation && (
                                    <p className="text-xs text-gray-500 mb-3">Izoh: {question.explanation}</p>
                                  )}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {[
                                      { id: "A", text: question.option_a },
                                      { id: "B", text: question.option_b },
                                      { id: "C", text: question.option_c },
                                      { id: "D", text: question.option_d },
                                    ].map((option) => (
                                      <div
                                        key={option.id}
                                        className={`p-2 border rounded-md text-sm ${option.id === question.correct_answer ? "bg-green-50 border-green-300 font-medium" : "bg-gray-50"}`}
                                      >
                                        <span className="font-bold mr-2">{option.id}:</span> {option.text}
                                        {option.id === question.correct_answer && (
                                          <Badge className="ml-2 bg-green-100 text-green-800 text-xs">To'g'ri</Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="ml-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/admin/tests/${testId}/questions/${question.id}/edit`)}
                                  >
                                    <Edit className="h-4 w-4 mr-1 sm:mr-2" /> Tahrirlash
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1 sm:mr-2" /> O'chirish
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p>Bu test uchun hali savollar qo'shilmagan.</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-500" /> Test ishtirokchilari
                </CardTitle>
                <CardDescription>Testni topshirgan foydalanuvchilar ro'yxati</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingParticipants ? (
                  <p>Ishtirokchilar ro'yxati yuklanmoqda...</p>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th
                              className="text-left p-3 font-me
                            dium"
                            >
                              Natija ID
                            </th>
                            <th className="text-left p-3 font-medium">Foydalanuvchi ID</th>
                            <th className="text-left p-3 font-medium">Boshlash vaqti</th>
                            <th className="text-left p-3 font-medium">Ball / Foiz</th>
                            <th className="text-left p-3 font-medium">Sarflangan vaqt</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-left p-3 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {participantsData.length > 0 ? (
                            participantsData.map((participant) => (
                              <tr key={participant.id} className="border-t">
                                <td className="p-3">#{participant.id}</td>
                                <td className="p-3">ID: {participant.user}</td>
                                <td className="p-3">{new Date(participant.start_time).toLocaleString("uz-UZ")}</td>
                                <td className="p-3 font-medium">
                                  {participant.score_display} ({participant.percentage.toFixed(1)}%)
                                </td>
                                <td className="p-3">{participant.time_spent_display}</td>
                                <td className="p-3">
                                  <Badge variant={participant.status === "completed" ? "default" : "outline"}>
                                    {participant.status_display}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      alert(
                                        `Foydalanuvchi ${participant.user} natijalarini ko'rish uchun ID: ${participant.id}`,
                                      )
                                    }
                                  >
                                    Ko'rish
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="p-4 text-center">
                                Bu testni hali hech kim topshirmagan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-blue-500" /> Test statistikasi
                </CardTitle>
                <CardDescription>Test bo'yicha statistik ma'lumotlar</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStatistics && !statisticsData ? (
                  <p>Statistika yuklanmoqda...</p>
                ) : statisticsData ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-500">Ishtirokchilar</div>
                        <div className="text-2xl font-bold">{statisticsData.participants_count}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-500">O'rtacha ball (%)</div>
                        <div className="text-2xl font-bold">{statisticsData.average_score.toFixed(1)}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-500">Jami daromad</div>
                        <div className="text-2xl font-bold">{statisticsData.total_income.toLocaleString()} so'm</div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p>Statistik ma'lumotlar topilmadi.</p>
                )}
                <div className="text-center p-10 border rounded-lg">
                  <p className="text-gray-500">Bu yerda test statistikasi uchun grafiklar bo'lishi mumkin</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
