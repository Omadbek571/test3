"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MessageCircle, Search, ThumbsUp, User } from "lucide-react"

// Mock questions data
const questions = [
  {
    id: 1,
    title: "Matematikadan integral mavzusini tushuntirib bera olasizmi?",
    content:
      "Integrallar mavzusini tushunishda qiynalayapman. Asosiy tushunchalarni va misollarni tushuntirib bera olasizmi?",
    author: "Sardor Aliyev",
    date: "2023-10-15",
    subject: "Matematika",
    answers: 3,
    likes: 5,
    status: "answered",
  },
  {
    id: 2,
    title: "Fizikadan elektr toki formulalarini qanday yodlash mumkin?",
    content:
      "Elektr toki bilan bog'liq formulalarni yodlashda qiynalayapman. Qanday usullar bilan oson yodlash mumkin?",
    author: "Nilufar Karimova",
    date: "2023-10-10",
    subject: "Fizika",
    answers: 2,
    likes: 3,
    status: "answered",
  },
  {
    id: 3,
    title: "Ingliz tili grammatikasidagi Present Perfect va Past Simple farqi nimada?",
    content:
      "Ingliz tili grammatikasidagi Present Perfect va Past Simple zamonlarini farqlashda qiynalayapman. Ularning farqini va qo'llanilishini tushuntirib bera olasizmi?",
    author: "Javohir Toshmatov",
    date: "2023-10-05",
    subject: "Ingliz tili",
    answers: 4,
    likes: 7,
    status: "answered",
  },
  {
    id: 4,
    title: "Kimyodan organik birikmalar klassifikatsiyasini tushuntirib bera olasizmi?",
    content:
      "Organik birikmalarning klassifikatsiyasini tushunishda qiynalayapman. Asosiy guruhlarni va ularning xususiyatlarini tushuntirib bera olasizmi?",
    author: "Aziza Rahimova",
    date: "2023-09-28",
    subject: "Kimyo",
    answers: 1,
    likes: 2,
    status: "answered",
  },
  {
    id: 5,
    title: "Tarixdan O'zbekistonning mustaqillikka erishish jarayoni haqida ma'lumot kerak",
    content:
      "O'zbekistonning mustaqillikka erishish jarayoni haqida batafsil ma'lumot kerak. Asosiy voqealar va sanalari bilan tushuntirib bera olasizmi?",
    author: "Bekzod Qodirov",
    date: "2023-09-20",
    subject: "Tarix",
    answers: 2,
    likes: 4,
    status: "answered",
  },
  {
    id: 6,
    title: "Biologiyadan fotosintez jarayonini tushuntirib bera olasizmi?",
    content:
      "Fotosintez jarayonini tushunishda qiynalayapman. Jarayonning bosqichlarini va ahamiyatini tushuntirib bera olasizmi?",
    author: "Gulnora Karimova",
    date: "2023-09-15",
    subject: "Biologiya",
    answers: 3,
    likes: 6,
    status: "answered",
  },
  {
    id: 7,
    title: "DTM testlarida vaqtni qanday to'g'ri taqsimlash kerak?",
    content:
      "DTM testlarida vaqtni to'g'ri taqsimlash bo'yicha maslahatlar kerak. Qanday qilib barcha savollarga vaqtida javob berish mumkin?",
    author: "Akbar Rasulov",
    date: "2023-09-10",
    subject: "DTM",
    answers: 5,
    likes: 10,
    status: "answered",
  },
  {
    id: 8,
    title: "Ona tili fanidan ergashgan qo'shma gaplar haqida ma'lumot kerak",
    content:
      "Ergashgan qo'shma gaplar mavzusini tushunishda qiynalayapman. Ularning turlari va qo'llanilishini tushuntirib bera olasizmi?",
    author: "Dilshod Toshmatov",
    date: "2023-09-05",
    subject: "Ona tili",
    answers: 2,
    likes: 3,
    status: "answered",
  },
  {
    id: 9,
    title: "Matematikadan logarifm mavzusini tushuntirib bera olasizmi?",
    content:
      "Logarifmlar mavzusini tushunishda qiynalayapman. Asosiy xususiyatlarini va misollarni tushuntirib bera olasizmi?",
    author: "Kamola Aliyeva",
    date: "2023-08-28",
    subject: "Matematika",
    answers: 4,
    likes: 5,
    status: "answered",
  },
  {
    id: 10,
    title: "Fizikadan mexanik harakat formulalarini tushuntirib bera olasizmi?",
    content:
      "Mexanik harakat bilan bog'liq formulalarni tushunishda qiynalayapman. Asosiy formulalarni va ularning qo'llanilishini tushuntirib bera olasizmi?",
    author: "Nodir Karimov",
    date: "2023-08-20",
    subject: "Fizika",
    answers: 3,
    likes: 4,
    status: "answered",
  },
]

interface QuestionType {
  id: number
  title: string
  content: string
  author: string
  date: string
  subject: string
  answers: number
  likes: number
  status: string
}

interface NewQuestionType {
  title: string
  content: string
  subject: string
}

export default function QuestionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [showAskForm, setShowAskForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState<NewQuestionType>({
    title: "",
    content: "",
    subject: "",
  })

  // Filter questions based on search query, selected subject and active tab
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject = selectedSubject === "all" || question.subject === selectedSubject

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "answered" && question.status === "answered") ||
      (activeTab === "unanswered" && question.status === "unanswered") ||
      (activeTab === "my" && question.author === "Sardor Aliyev") // Assuming current user

    return matchesSearch && matchesSubject && matchesTab
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewQuestion((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubjectChange = (value: string) => {
    setNewQuestion((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically submit the question to your backend
    alert("Savolingiz yuborildi! Tez orada javob olasiz.")
    setShowAskForm(false)
    setNewQuestion({ title: "", content: "", subject: "" })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Savol-javoblar</h1>
            <p className="text-muted-foreground mt-1">Savollaringizni bering va javoblar oling</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Savollarni qidirish..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowAskForm(true)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Savol berish
          </Button>
        </div>
      </div>

      {showAskForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Yangi savol berish</CardTitle>
            <CardDescription>Savolingizni aniq va tushunarli shaklda yozing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitQuestion}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="subject">Fan</label>
                  <Select value={newQuestion.subject} onValueChange={handleSubjectChange}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Fanni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Matematika">Matematika</SelectItem>
                      <SelectItem value="Fizika">Fizika</SelectItem>
                      <SelectItem value="Kimyo">Kimyo</SelectItem>
                      <SelectItem value="Biologiya">Biologiya</SelectItem>
                      <SelectItem value="Tarix">Tarix</SelectItem>
                      <SelectItem value="Ona tili">Ona tili</SelectItem>
                      <SelectItem value="Ingliz tili">Ingliz tili</SelectItem>
                      <SelectItem value="DTM">DTM</SelectItem>
                      <SelectItem value="Boshqa">Boshqa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="title">Savol sarlavhasi</label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Savolingiz sarlavhasini kiriting"
                    value={newQuestion.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="content">Savol matni</label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Savolingizni batafsil yozing"
                    rows={5}
                    value={newQuestion.content}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAskForm(false)}>
                    Bekor qilish
                  </Button>
                  <Button type="submit">Savolni yuborish</Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Fanlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant={selectedSubject === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject("all")}
                >
                  Barcha fanlar
                </Button>
                <Button
                  variant={selectedSubject === "Matematika" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject("Matematika")}
                >
                  Matematika
                </Button>
                <Button
                  variant={selectedSubject === "Fizika" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject("Fizika")}
                >
                  Fizika
                </Button>
                <Button
                  variant={selectedSubject === "Kimyo" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject("Kimyo")}
                >
                  Kimyo
                </Button>
                <Button
                  variant={selectedSubject === "Biologiya" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject("Biologiya")}
                >
                  Biologiya
                </Button>
                <Button
                  variant={selectedSubject === "Tarix" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject("Tarix")}
                >
                  Tarix
                </Button>
                <Button
                  variant={selectedSubject === "Ona tili" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject("Ona tili")}
                >
                  Ona tili
                </Button>
                <Button
                  variant={selectedSubject === "Ingliz tili" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject("Ingliz tili")}
                >
                  Ingliz tili
                </Button>
                <Button
                  variant={selectedSubject === "DTM" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedSubject("DTM")}
                >
                  DTM
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Barcha savollar</TabsTrigger>
              <TabsTrigger value="answered">Javob berilgan</TabsTrigger>
              <TabsTrigger value="unanswered">Javobsiz</TabsTrigger>
              <TabsTrigger value="my">Mening savollarim</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} router={router} />
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">Savollar topilmadi</h3>
                  <p className="text-muted-foreground mb-4">Yangi savol berish uchun "Savol berish" tugmasini bosing</p>
                  <Button onClick={() => setShowAskForm(true)}>Savol berish</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="answered" className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} router={router} />
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">Javob berilgan savollar topilmadi</h3>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unanswered" className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} router={router} />
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">Javobsiz savollar topilmadi</h3>
                </div>
              )}
            </TabsContent>

            <TabsContent value="my" className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} router={router} />
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">Siz hali savol bermagansiz</h3>
                  <p className="text-muted-foreground mb-4">Yangi savol berish uchun "Savol berish" tugmasini bosing</p>
                  <Button onClick={() => setShowAskForm(true)}>Savol berish</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

interface QuestionCardProps {
  question: QuestionType
  router: any
}

function QuestionCard({ question, router }: QuestionCardProps) {
  return (
    <Card
      className="hover:border-primary/50 transition-colors cursor-pointer"
      onClick={() => router.push(`/questions/${question.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">{question.title}</h3>
            <p className="text-muted-foreground line-clamp-2 mb-3">{question.content}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline">{question.subject}</Badge>
              <span className="text-muted-foreground flex items-center">
                <User className="h-3.5 w-3.5 mr-1" />
                {question.author}
              </span>
              <span className="text-muted-foreground">{question.date}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center text-muted-foreground">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{question.answers}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{question.likes}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

