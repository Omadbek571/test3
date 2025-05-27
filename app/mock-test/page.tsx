"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, CreditCard, Award, BarChart } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function MockTestPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("overview")

  // Mock test data
  const mockTestData = {
    overview: {
      languages: [
        {
          id: "english",
          name: "Ingliz tili",
          icon: "🇬🇧",
          currentScore: 6.5,
          targetScore: 7.5,
          nextExam: "2023-08-15",
          completedTests: 8,
          totalTests: 12,
          progress: 67,
        },
        {
          id: "turkish",
          name: "Turk tili",
          icon: "🇹🇷",
          currentScore: 5.5,
          targetScore: 6.5,
          nextExam: "2023-09-10",
          completedTests: 4,
          totalTests: 10,
          progress: 40,
        },
        {
          id: "arabic",
          name: "Arab tili",
          icon: "🇸🇦",
          currentScore: 4.0,
          targetScore: 5.5,
          nextExam: "2023-09-20",
          completedTests: 2,
          totalTests: 8,
          progress: 25,
        },
      ],
      recentActivity: [
        { date: "2023-06-10", type: "Test", language: "Ingliz tili", name: "Mock Test 8", score: 6.5 },
        {
          date: "2023-06-05",
          type: "Lesson",
          language: "Ingliz tili",
          name: "Writing Task 2 - Essay Structure",
          completed: true,
        },
        { date: "2023-06-03", type: "Test", language: "Turk tili", name: "Mock Test 3", score: 5.5 },
        { date: "2023-05-28", type: "Test", language: "Arab tili", name: "Mock Test 1", score: 4.0 },
      ],
    },
    mockTests: {
      english: [
        {
          id: 1,
          title: "IELTS Mock Test 1",
          date: "2023-05-15",
          completed: true,
          score: 6.0,
          price: 50000,
        },
        {
          id: 2,
          title: "IELTS Mock Test 2",
          date: "2023-05-22",
          completed: true,
          score: 6.0,
          price: 50000,
        },
        {
          id: 3,
          title: "IELTS Mock Test 3",
          date: "2023-05-29",
          completed: true,
          score: 6.5,
          price: 50000,
        },
        {
          id: 4,
          title: "IELTS Mock Test 4",
          date: "2023-06-15",
          completed: false,
          price: 50000,
        },
      ],
      turkish: [
        {
          id: 1,
          title: "Türkçe Seviye Testi 1",
          date: "2023-05-18",
          completed: true,
          score: 5.0,
          price: 50000,
        },
        {
          id: 2,
          title: "Türkçe Seviye Testi 2",
          date: "2023-05-25",
          completed: true,
          score: 5.5,
          price: 50000,
        },
        {
          id: 3,
          title: "Türkçe Seviye Testi 3",
          date: "2023-06-20",
          completed: false,
          price: 50000,
        },
      ],
      arabic: [
        {
          id: 1,
          title: "اختبار اللغة العربية 1",
          date: "2023-05-20",
          completed: true,
          score: 4.0,
          price: 50000,
        },
        {
          id: 2,
          title: "اختبار اللغة العربية 2",
          date: "2023-06-25",
          completed: false,
          price: 50000,
        },
      ],
    },
    resources: {
      english: [
        { id: 1, title: "IELTS Vocabulary List", type: "PDF", size: "2.5 MB", downloads: 1245 },
        { id: 2, title: "Writing Task 2 Templates", type: "PDF", size: "1.8 MB", downloads: 987 },
        { id: 3, title: "Speaking Part 2 Topics", type: "PDF", size: "1.2 MB", downloads: 856 },
        { id: 4, title: "Reading Strategies", type: "Video", duration: "45 min", views: 1560 },
      ],
      turkish: [
        { id: 1, title: "Türkçe Temel Kelimeler", type: "PDF", size: "1.8 MB", downloads: 845 },
        { id: 2, title: "Türkçe Gramer Kuralları", type: "PDF", size: "2.2 MB", downloads: 687 },
        { id: 3, title: "Türkçe Konuşma Pratiği", type: "Video", duration: "35 min", views: 920 },
      ],
      arabic: [
        { id: 1, title: "قائمة المفردات العربية", type: "PDF", size: "2.0 MB", downloads: 645 },
        { id: 2, title: "قواعد النحو العربية", type: "PDF", size: "2.4 MB", downloads: 587 },
        { id: 3, title: "تمارين الاستماع العربية", type: "Audio", duration: "40 min", views: 720 },
      ],
    },
  }

  const getScoreColor = (score: number) => {
    if (score >= 7.0) return "text-green-600"
    if (score >= 6.0) return "text-amber-600"
    return "text-red-600"
  }

  const handleStartMockTest = (languageId: string) => {
    router.push(`/mock-test/exam/${languageId}`)
  }

  // Animatsiya variantlari
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">Mock Test</h1>
        </div>

        {/* Statistika kartlari */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tugatilgan testlar</p>
                <p className="text-2xl font-bold">14</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <BarChart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">O'rtacha ball</p>
                <p className="text-2xl font-bold">5.8</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardContent className="p-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Keyingi imtihon</p>
                <p className="text-2xl font-bold">15 kun</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Selection */}
        <Tabs defaultValue="english" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="english">
              <span className="mr-2">🇬🇧</span> Ingliz tili
            </TabsTrigger>
            <TabsTrigger value="turkish">
              <span className="mr-2">🇹🇷</span> Turk tili
            </TabsTrigger>
            <TabsTrigger value="arabic">
              <span className="mr-2">🇸🇦</span> Arab tili
            </TabsTrigger>
          </TabsList>

          {mockTestData.overview.languages.map((language) => (
            <TabsContent key={language.id} value={language.id}>
              {/* Language Score Card */}
              <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-700 font-bold text-2xl border-4 border-blue-300">
                        {language.currentScore}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{language.name} bali</h2>
                        <p className="text-gray-600">Maqsad: {language.targetScore} ball</p>
                        <div className="mt-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Progress</span>
                            <span className="text-xs text-gray-500">{language.progress}%</span>
                          </div>
                          <Progress value={language.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="text-sm text-gray-600 mb-1">Keyingi imtihon</div>
                      <div className="text-lg font-bold text-blue-700">
                        {new Date(language.nextExam).toLocaleDateString("uz-UZ")}
                      </div>
                      <Button size="sm" className="mt-2" onClick={() => handleStartMockTest(language.id)}>
                        Mock test topshirish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main content */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Umumiy</TabsTrigger>
                  <TabsTrigger value="mockTests">Mock testlar</TabsTrigger>
                  <TabsTrigger value="resources">Materiallar</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>Umumiy ma'lumot</CardTitle>
                      <CardDescription>{language.name} bo'yicha umumiy ma'lumotlar</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium mb-3">Tayyorgarlik jarayoni</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">Umumiy progress</span>
                                  <span className="text-sm text-gray-500">
                                    {language.completedTests}/{language.totalTests} test
                                  </span>
                                </div>
                                <Progress value={language.progress} className="h-2" />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-lg p-3">
                                  <div className="text-sm text-gray-500">Joriy ball</div>
                                  <div className="text-2xl font-bold text-blue-700">{language.currentScore}</div>
                                </div>
                                <div className="border rounded-lg p-3">
                                  <div className="text-sm text-gray-500">Maqsad ball</div>
                                  <div className="text-2xl font-bold text-green-700">{language.targetScore}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium mb-3">So'nggi faoliyat</h3>
                            <div className="space-y-4">
                              {mockTestData.overview.recentActivity
                                .filter((activity) => activity.language === language.name)
                                .slice(0, 3)
                                .map((activity, index) => (
                                  <div key={index} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="flex items-center">
                                          <Badge variant="outline" className="mr-2">
                                            {activity.type}
                                          </Badge>
                                          <h3 className="font-medium">{activity.name}</h3>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                          {new Date(activity.date).toLocaleDateString("uz-UZ")}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        {activity.score ? (
                                          <div className="text-lg font-bold text-blue-700">{activity.score}</div>
                                        ) : (
                                          <Badge
                                            variant="outline"
                                            className="bg-green-50 text-green-700 border-green-200"
                                          >
                                            Tugatilgan
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>

                        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                          <AlertCircle className="h-4 w-4 text-blue-500" />
                          <AlertDescription>
                            Mock testlarni topshirish uchun hisobingizda yetarli mablag' bo'lishi kerak. Har bir test
                            narxi: 50,000 so'm.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="mockTests">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                        {language.name} Mock testlari
                      </CardTitle>
                      <CardDescription>To'liq imtihon simulyatsiyalari</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
                        {mockTestData.mockTests[language.id as keyof typeof mockTestData.mockTests].map((test) => (
                          <motion.div key={test.id} variants={item}>
                            <Card className="border hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{test.title}</h3>
                                    <div className="text-sm text-gray-500 mt-1">
                                      {test.date
                                        ? new Date(test.date).toLocaleDateString("uz-UZ")
                                        : "Rejalashtirish kerak"}
                                    </div>
                                    <div className="flex items-center mt-2">
                                      <CreditCard className="h-4 w-4 text-gray-500 mr-1" />
                                      <span className="text-sm text-gray-500">{test.price.toLocaleString()} so'm</span>
                                    </div>
                                  </div>

                                  {test.completed ? (
                                    <div className="mt-2 md:mt-0">
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-700">{test.score}</div>
                                        <div className="text-xs text-gray-500">Overall Band</div>
                                      </div>
                                    </div>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="mt-2 md:mt-0 bg-amber-50 text-amber-700 border-amber-200"
                                    >
                                      Rejalashtirilgan
                                    </Badge>
                                  )}
                                </div>

                                <div className="mt-4 flex justify-end">
                                  {test.completed ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => router.push(`/mock-test/${language.id}/results/${test.id}`)}
                                    >
                                      Natijalarni ko'rish
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      onClick={() => router.push(`/mock-test/exam/${language.id}/${test.id}`)}
                                    >
                                      Testni boshlash
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                        {language.name} materiallari
                      </CardTitle>
                      <CardDescription>Imtihonga tayyorgarlik uchun materiallar</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        variants={container}
                        initial="hidden"
                        animate="show"
                      >
                        {mockTestData.resources[language.id as keyof typeof mockTestData.resources].map((resource) => (
                          <motion.div key={resource.id} variants={item}>
                            <Card className="border hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{resource.title}</h3>
                                    <div className="flex items-center mt-1">
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {resource.type}
                                      </Badge>
                                      <span className="text-sm text-gray-500 ml-2">
                                        {resource.size || (resource.duration && `${resource.duration}`)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <Button
                                    size="sm"
                                    onClick={() => router.push(`/mock-test/resources/${language.id}/${resource.id}`)}
                                  >
                                    {resource.type === "PDF"
                                      ? "Yuklab olish"
                                      : resource.type === "Video" || resource.type === "Audio"
                                        ? "Ko'rish"
                                        : "Kirish"}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

