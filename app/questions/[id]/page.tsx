"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, CheckCircle, MessageCircle, ThumbsUp } from "lucide-react"

// Mock questions data
const questions = {
  "1": {
    id: 1,
    title: "Matematikadan integral mavzusini tushuntirib bera olasizmi?",
    content:
      "Integrallar mavzusini tushunishda qiynalayapman. Asosiy tushunchalarni va misollarni tushuntirib bera olasizmi? Ayniqsa aniq va noaniq integrallar orasidagi farqni tushunishda qiynalayapman. Shuningdek, integrallarni hisoblash usullarini ham bilishni xohlayman. Masalan, bo'laklab integrallash, o'zgaruvchini almashtirish usuli va boshqalar. Iltimos, sodda va tushunarli tilda tushuntirib bersangiz.",
    author: "Sardor Aliyev",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "2023-10-15",
    subject: "Matematika",
    answers: 3,
    likes: 5,
    status: "answered",
  },
  "2": {
    id: 2,
    title: "Fizikadan elektr toki formulalarini qanday yodlash mumkin?",
    content:
      "Elektr toki bilan bog'liq formulalarni yodlashda qiynalayapman. Qanday usullar bilan oson yodlash mumkin?",
    author: "Nilufar Karimova",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "2023-10-10",
    subject: "Fizika",
    answers: 2,
    likes: 3,
    status: "answered",
  },
}

// Mock answers data
const answers = {
  "1": [
    {
      id: 1,
      questionId: 1,
      content:
        "Integral - bu differensial hisobning teskari amali hisoblanadi. Integrallar ikki turga bo'linadi: aniq va noaniq integrallar. Noaniq integral F'(x) = f(x) bo'lgan F(x) funksiyani topishdir. Aniq integral esa ma'lum bir oraliqda funksiya ostidagi yuzni hisoblaydi. Masalan, ∫x²dx = x³/3 + C, bu yerda C - o'zgarmas son.",
      author: "Aziz Karimov",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023-10-16",
      likes: 3,
      isAccepted: true,
    },
    {
      id: 2,
      questionId: 1,
      content:
        "Integrallarni tushunish uchun avval hosilalarni yaxshi bilish kerak. Integral - bu funksiyaning o'zgarish tezligidan funksiyaning o'zini topish jarayoni. Masalan, agar tezlik v(t) ma'lum bo'lsa, bosib o'tilgan yo'lni s(t) = ∫v(t)dt formula orqali topish mumkin.",
      author: "Dilshod Toshmatov",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023-10-17",
      likes: 2,
      isAccepted: false,
    },
    {
      id: 3,
      questionId: 1,
      content:
        "Integrallarni yechishda bir nechta usullar mavjud: bevosita integrallash, bo'laklab integrallash, o'zgaruvchini almashtirish usuli va boshqalar. Masalan, ∫sin(x)dx = -cos(x) + C, ∫e^x dx = e^x + C. Agar qo'shimcha savollaringiz bo'lsa, bemalol so'rashingiz mumkin.",
      author: "Nilufar Sobirova",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023-10-18",
      likes: 1,
      isAccepted: false,
    },
  ],
  "2": [
    {
      id: 1,
      questionId: 2,
      content:
        "Elektr toki formulalarini yodlash uchun ularni amalda qo'llash eng yaxshi usul. Masalan, Om qonuni I = U/R formulasini yodlash uchun, turli xil misollar yechib ko'ring. Shuningdek, formulalarni mantiqiy bog'lash ham muhim. Masalan, quvvat P = I*U = I²*R = U²/R formulalarini bir-biriga bog'lab yodlash mumkin.",
      author: "Dilshod Toshmatov",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023-10-11",
      likes: 2,
      isAccepted: true,
    },
    {
      id: 2,
      questionId: 2,
      content:
        "Formulalarni yodlashda mnemonik usullardan foydalanish mumkin. Masalan, Om qonuni uchun 'UIR' so'zini eslab qolish va I = U/R ekanligini yodda tutish. Shuningdek, formulalarni vizual tasvirlash ham yordam beradi - chizmalar, jadvallar yoki xaritalar tuzib, ularni ko'z oldingizga keltiring.",
      author: "Aziz Karimov",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023-10-12",
      likes: 1,
      isAccepted: false,
    },
  ],
}

interface QuestionType {
  id: number
  title: string
  content: string
  author: string
  authorImage: string
  date: string
  subject: string
  answers: number
  likes: number
  status: string
}

interface AnswerType {
  id: number
  questionId: number
  content: string
  author: string
  authorImage: string
  date: string
  likes: number
  isAccepted: boolean
}

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [newAnswer, setNewAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const question = questions[params.id] as QuestionType | undefined
  const questionAnswers = (answers[params.id] as AnswerType[] | undefined) || []

  if (!question) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Savol topilmadi</h1>
        <p className="mb-8">So'ralgan savol mavjud emas yoki o'chirilgan</p>
        <Button onClick={() => router.push("/questions")}>Savollar ro'yxatiga qaytish</Button>
      </div>
    )
  }

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAnswer.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setNewAnswer("")
      alert("Javobingiz yuborildi!")
    }, 1000)
  }

  const handleLikeQuestion = () => {
    // Here you would typically update the like count in your backend
    alert("Savolga like bosildi!")
  }

  const handleLikeAnswer = (answerId: number) => {
    // Here you would typically update the like count in your backend
    alert(`${answerId}-javobga like bosildi!`)
  }

  const handleAcceptAnswer = (answerId: number) => {
    // Here you would typically update the accepted answer in your backend
    alert(`${answerId}-javob qabul qilindi!`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/questions")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Savollar ro'yxatiga qaytish
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{question.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="outline">{question.subject}</Badge>
                <span className="text-muted-foreground">{question.date}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLikeQuestion}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              {question.likes}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line mb-6">{question.content}</p>
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={question.authorImage} alt={question.author} />
              <AvatarFallback>{question.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{question.author}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Javoblar ({questionAnswers.length})</h2>
        </div>

        {questionAnswers.length > 0 ? (
          <div className="space-y-6">
            {questionAnswers.map((answer) => (
              <Card key={answer.id} className={answer.isAccepted ? "border-green-500" : ""}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={answer.authorImage} alt={answer.author} />
                        <AvatarFallback>{answer.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{answer.author}</div>
                        <div className="text-sm text-muted-foreground">{answer.date}</div>
                      </div>
                    </div>
                    {answer.isAccepted && (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Qabul qilingan
                      </Badge>
                    )}
                  </div>
                  <p className="whitespace-pre-line mb-4">{answer.content}</p>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" onClick={() => handleLikeAnswer(answer.id)}>
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {answer.likes}
                    </Button>
                    {question.author === "Sardor Aliyev" && !answer.isAccepted && (
                      <Button variant="outline" size="sm" onClick={() => handleAcceptAnswer(answer.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Javobni qabul qilish
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Hali javoblar yo'q</h3>
              <p className="text-muted-foreground">Birinchi bo'lib javob bering!</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Javob yozing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitAnswer}>
            <Textarea
              placeholder="Javobingizni yozing..."
              rows={6}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="mb-4"
            />
            <Button type="submit" disabled={isSubmitting || !newAnswer.trim()}>
              {isSubmitting ? "Yuborilmoqda..." : "Javobni yuborish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

