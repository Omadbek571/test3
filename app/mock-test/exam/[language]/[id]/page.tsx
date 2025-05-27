"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Clock, Headphones, MessageSquare, Pencil } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function MockTestExamPage({ params }: { params: { language: string; id: string } }) {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState("intro")
  const [timeLeft, setTimeLeft] = useState("60:00")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [userBalance, setUserBalance] = useState(100000) // Mock balance

  // Get language name based on language ID
  const getLanguageName = (languageId: string) => {
    switch (languageId) {
      case "english":
        return "Ingliz tili"
      case "turkish":
        return "Turk tili"
      case "arabic":
        return "Arab tili"
      default:
        return "Til"
    }
  }

  // Mock exam data
  const examData = {
    title: `${getLanguageName(params.language)} Mock Test ${params.id}`,
    price: 50000,
    duration: "2 hours 45 minutes",
    sections: [
      { id: "listening", name: "Listening", questions: 40, duration: "30 minutes" },
      { id: "reading", name: "Reading", questions: 40, duration: "60 minutes" },
      { id: "writing", name: "Writing", questions: 2, duration: "60 minutes" },
      { id: "speaking", name: "Speaking", questions: 3, duration: "15 minutes" },
    ],
    listening: {
      questions: Array.from({ length: 40 }).map((_, index) => ({
        id: index,
        text: `Question ${index + 1}: What is the name of the speaker?`,
        options: [
          { id: "A", text: "John Smith" },
          { id: "B", text: "Jane Doe" },
          { id: "C", text: "Robert Brown" },
          { id: "D", text: "Sarah Wilson" },
        ],
      })),
    },
    reading: {
      questions: Array.from({ length: 40 }).map((_, index) => ({
        id: index,
        text: `Question ${index + 1}: According to the passage, what is the main reason for climate change?`,
        options: [
          { id: "A", text: "Industrial pollution" },
          { id: "B", text: "Deforestation" },
          { id: "C", text: "Greenhouse gas emissions" },
          { id: "D", text: "Natural climate cycles" },
        ],
      })),
    },
    writing: {
      tasks: [
        {
          id: 0,
          title: "Task 1",
          description:
            "The graph below shows the population of four European countries between 2000 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
          wordCount: "At least 150 words",
        },
        {
          id: 1,
          title: "Task 2",
          description:
            "Some people believe that universities should focus on providing academic skills rather than preparing students for employment. To what extent do you agree or disagree?",
          wordCount: "At least 250 words",
        },
      ],
    },
    speaking: {
      parts: [
        {
          id: 0,
          title: "Part 1: Introduction and Interview",
          description:
            "In this part, the examiner will introduce themselves and ask you to introduce yourself. They will then ask you general questions about familiar topics such as your home, family, work or studies, and interests.",
          duration: "4-5 minutes",
        },
        {
          id: 1,
          title: "Part 2: Long Turn",
          description:
            "In this part, you will be given a card with a topic and some points to include in your talk. You will have one minute to prepare and then you will talk for 1-2 minutes. The examiner will then ask you one or two questions on the same topic.",
          duration: "3-4 minutes",
          topic:
            "Describe a book that you have recently read. You should say:\n- what the book was\n- what it was about\n- why you decided to read it\nand explain whether you would recommend this book to others.",
        },
        {
          id: 2,
          title: "Part 3: Discussion",
          description:
            "In this part, the examiner will ask you further questions connected to the topic in Part 2. These questions will give you an opportunity to discuss more abstract ideas and issues.",
          duration: "4-5 minutes",
          questions: [
            "Do you think reading habits have changed in recent years?",
            "What are the advantages and disadvantages of e-books compared to printed books?",
            "How important is reading for academic success?",
          ],
        },
      ],
    },
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: value,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < examData.listening.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleStartExam = () => {
    setCurrentSection("listening")
    // Set initial time for listening section
    setTimeLeft("30:00")
  }

  const handlePayment = () => {
    setShowPaymentDialog(true)
  }

  const handleConfirmPayment = () => {
    // Deduct the payment from balance
    setUserBalance((prev) => prev - 50000)
    // Set payment as confirmed
    setPaymentConfirmed(true)
    // Close the dialog
    setShowPaymentDialog(false)
    // Show a success message
    alert("Hisobingizdan 50,000 so'm yechib olindi!")
  }

  const handleFinishSection = () => {
    if (currentSection === "listening") {
      setCurrentSection("reading")
      setCurrentQuestion(0)
      setTimeLeft("60:00")
    } else if (currentSection === "reading") {
      setCurrentSection("writing")
      setCurrentQuestion(0)
      setTimeLeft("60:00")
    } else if (currentSection === "writing") {
      setCurrentSection("speaking")
      setCurrentQuestion(0)
      setTimeLeft("15:00")
    } else if (currentSection === "speaking") {
      router.push(`/mock-test/${params.language}/results/${params.id}`)
    }
  }

  // Simulate a timer
  useEffect(() => {
    if (currentSection !== "intro" && !["writing", "speaking"].includes(currentSection)) {
      const timer = setInterval(() => {
        const [minutes, seconds] = timeLeft.split(":").map(Number)
        let newMinutes = minutes
        let newSeconds = seconds - 1

        if (newSeconds < 0) {
          newSeconds = 59
          newMinutes -= 1
        }

        if (newMinutes < 0) {
          clearInterval(timer)
          handleFinishSection()
          return
        }

        setTimeLeft(`${newMinutes.toString().padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeLeft, currentSection])

  const renderSection = () => {
    if (currentSection === "intro") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{examData.title}</CardTitle>
            <CardDescription>Imtihon simulyatsiyasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!paymentConfirmed && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertDescription>
                    Bu testni topshirish uchun {examData.price.toLocaleString()} so'm to'lov qilishingiz kerak.
                  </AlertDescription>
                </Alert>
              )}

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Imtihon haqida</h3>
                <p className="text-gray-600 mb-4">
                  Bu {getLanguageName(params.language)} imtihon simulyatsiyasi bo'lib, u haqiqiy imtihonga o'xshash
                  formatda o'tkaziladi. Imtihon 4 ta bo'limdan iborat:
                </p>

                <div className="space-y-3">
                  {examData.sections.map((section) => (
                    <div key={section.id} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        {section.id === "listening" && <Headphones className="h-4 w-4 text-blue-700" />}
                        {section.id === "reading" && <BookOpen className="h-4 w-4 text-blue-700" />}
                        {section.id === "writing" && <Pencil className="h-4 w-4 text-blue-700" />}
                        {section.id === "speaking" && <MessageSquare className="h-4 w-4 text-blue-700" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{section.name}</div>
                        <div className="text-sm text-gray-500">
                          {section.questions} savollar • {section.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Imtihon qoidalari</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Har bir bo'lim uchun belgilangan vaqt mavjud.</li>
                  <li>• Listening bo'limida audio faqat bir marta eshittiriladi.</li>
                  <li>• Reading bo'limida matnlarni diqqat bilan o'qing.</li>
                  <li>• Writing bo'limida so'z soniga e'tibor bering.</li>
                  <li>• Speaking bo'limida aniq va ravon gapiring.</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-amber-50">
                <h3 className="font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-700" />
                  Umumiy vaqt
                </h3>
                <p className="text-gray-600">
                  Imtihon uchun umumiy vaqt: <span className="font-medium">{examData.duration}</span>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {paymentConfirmed ? (
              <Button className="w-full" onClick={handleStartExam}>
                Imtihonni boshlash
              </Button>
            ) : (
              <Button className="w-full" onClick={handlePayment}>
                {examData.price.toLocaleString()} so'm to'lash
              </Button>
            )}
          </CardFooter>
        </Card>
      )
    }

    if (currentSection === "listening") {
      const currentQuestionData = examData.listening.questions[currentQuestion]
      const progress = ((currentQuestion + 1) / examData.listening.questions.length) * 100

      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Headphones className="mr-2 h-5 w-5 text-blue-500" />
                Listening
              </CardTitle>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-amber-500" />
                <span className="font-medium">{timeLeft}</span>
              </div>
            </div>
            <CardDescription>
              <Progress value={progress} className="h-2 mt-2" />
              <div className="mt-1 text-right">
                Savol {currentQuestion + 1} / {examData.listening.questions.length}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="text-center mb-4">
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                    Audio
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">
                    Haqiqiy imtihonda siz audio eshitasiz. Bu simulyatsiyada audio yo'q.
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Audio eshitish
                  </Button>
                </div>
              </div>

              <div className="text-lg font-medium">{currentQuestionData.text}</div>

              <RadioGroup value={selectedAnswers[currentQuestion] || ""} onValueChange={handleAnswerSelect}>
                {currentQuestionData.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                    <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                    <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{option.id}.</span> {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
              Oldingi
            </Button>

            {currentQuestion < examData.listening.questions.length - 1 ? (
              <Button onClick={handleNextQuestion}>Keyingi</Button>
            ) : (
              <Button onClick={handleFinishSection}>Bo'limni tugatish</Button>
            )}
          </CardFooter>
        </Card>
      )
    }

    if (currentSection === "reading") {
      const currentQuestionData = examData.reading.questions[currentQuestion]
      const progress = ((currentQuestion + 1) / examData.reading.questions.length) * 100

      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                Reading
              </CardTitle>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-amber-500" />
                <span className="font-medium">{timeLeft}</span>
              </div>
            </div>
            <CardDescription>
              <Progress value={progress} className="h-2 mt-2" />
              <div className="mt-1 text-right">
                Savol {currentQuestion + 1} / {examData.reading.questions.length}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="text-center mb-4">
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                    Matn
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">
                    Haqiqiy imtihonda siz matn o'qiysiz. Bu simulyatsiyada matn yo'q.
                  </p>
                </div>
              </div>

              <div className="text-lg font-medium">{currentQuestionData.text}</div>

              <RadioGroup value={selectedAnswers[currentQuestion] || ""} onValueChange={handleAnswerSelect}>
                {currentQuestionData.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
                    <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                    <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{option.id}.</span> {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
              Oldingi
            </Button>

            {currentQuestion < examData.reading.questions.length - 1 ? (
              <Button onClick={handleNextQuestion}>Keyingi</Button>
            ) : (
              <Button onClick={handleFinishSection}>Bo'limni tugatish</Button>
            )}
          </CardFooter>
        </Card>
      )
    }

    if (currentSection === "writing") {
      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Pencil className="mr-2 h-5 w-5 text-blue-500" />
                Writing
              </CardTitle>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-amber-500" />
                <span className="font-medium">{timeLeft}</span>
              </div>
            </div>
            <CardDescription>Writing bo'limi</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="task1">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="task1">Task 1</TabsTrigger>
                <TabsTrigger value="task2">Task 2</TabsTrigger>
              </TabsList>

              <TabsContent value="task1">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-medium mb-2">{examData.writing.tasks[0].title}</h3>
                    <p className="text-gray-600 mb-2">{examData.writing.tasks[0].description}</p>
                    <div className="text-sm text-gray-500">{examData.writing.tasks[0].wordCount}</div>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-center mb-4">
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                        Grafik
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">
                        Haqiqiy imtihonda siz grafik ko'rasiz. Bu simulyatsiyada grafik yo'q.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task1-answer">Javobingiz</Label>
                    <Textarea
                      id="task1-answer"
                      placeholder="Javobingizni shu yerga yozing..."
                      className="min-h-[200px]"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="task2">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-medium mb-2">{examData.writing.tasks[1].title}</h3>
                    <p className="text-gray-600 mb-2">{examData.writing.tasks[1].description}</p>
                    <div className="text-sm text-gray-500">{examData.writing.tasks[1].wordCount}</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task2-answer">Javobingiz</Label>
                    <Textarea
                      id="task2-answer"
                      placeholder="Javobingizni shu yerga yozing..."
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleFinishSection}>
              Bo'limni tugatish
            </Button>
          </CardFooter>
        </Card>
      )
    }

    if (currentSection === "speaking") {
      return (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                Speaking
              </CardTitle>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-amber-500" />
                <span className="font-medium">{timeLeft}</span>
              </div>
            </div>
            <CardDescription>Speaking bo'limi</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="part1">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="part1">Part 1</TabsTrigger>
                <TabsTrigger value="part2">Part 2</TabsTrigger>
                <TabsTrigger value="part3">Part 3</TabsTrigger>
              </TabsList>

              <TabsContent value="part1">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-medium mb-2">{examData.speaking.parts[0].title}</h3>
                    <p className="text-gray-600 mb-2">{examData.speaking.parts[0].description}</p>
                    <div className="text-sm text-gray-500">Davomiyligi: {examData.speaking.parts[0].duration}</div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Namuna savollar</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Can you tell me your full name?</li>
                      <li>• Where are you from?</li>
                      <li>• Do you work or are you a student?</li>
                      <li>• What do you do in your free time?</li>
                      <li>• Do you like reading books? Why/Why not?</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">
                        Haqiqiy imtihonda siz ekzaminator bilan suhbatlashasiz. Bu simulyatsiyada suhbat yo'q.
                      </p>
                      <Button variant="outline" disabled>
                        Mikrofonni yoqish
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="part2">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-medium mb-2">{examData.speaking.parts[1].title}</h3>
                    <p className="text-gray-600 mb-2">{examData.speaking.parts[1].description}</p>
                    <div className="text-sm text-gray-500">Davomiyligi: {examData.speaking.parts[1].duration}</div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Mavzu</h3>
                    <p className="text-gray-600 whitespace-pre-line">{examData.speaking.parts[1].topic}</p>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">
                        Haqiqiy imtihonda siz ekzaminator bilan suhbatlashasiz. Bu simulyatsiyada suhbat yo'q.
                      </p>
                      <Button variant="outline" disabled>
                        Mikrofonni yoqish
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="part3">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-medium mb-2">{examData.speaking.parts[2].title}</h3>
                    <p className="text-gray-600 mb-2">{examData.speaking.parts[2].description}</p>
                    <div className="text-sm text-gray-500">Davomiyligi: {examData.speaking.parts[2].duration}</div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Savollar</h3>
                    <ul className="space-y-2 text-gray-600">
                      {examData.speaking.parts[2].questions.map((question, index) => (
                        <li key={index}>• {question}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">
                        Haqiqiy imtihonda siz ekzaminator bilan suhbatlashasiz. Bu simulyatsiyada suhbat yo'q.
                      </p>
                      <Button variant="outline" disabled>
                        Mikrofonni yoqish
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleFinishSection}>
              Imtihonni tugatish
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push(`/mock-test/exam/${params.language}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">{getLanguageName(params.language)} imtihoni</h1>
        </div>

        {renderSection()}

        {/* Payment Confirmation Dialog */}
        <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>To'lovni tasdiqlang</AlertDialogTitle>
              <AlertDialogDescription>
                Mock test topshirish uchun hisobingizdan <span className="font-bold">50,000 so'm</span> yechib olinadi.
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span>Joriy balans:</span>
                    <span className="font-bold">{userBalance.toLocaleString()} so'm</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>Test narxi:</span>
                    <span className="font-bold text-red-500">-50,000 so'm</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 pt-1 border-t">
                    <span>Qolgan balans:</span>
                    <span className="font-bold">{(userBalance - 50000).toLocaleString()} so'm</span>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmPayment}>Roziman</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

