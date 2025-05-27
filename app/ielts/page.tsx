"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, CheckCircle, Clock, FileText, Headphones, MessageSquare, Pencil } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function IELTSPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("overview")

  // Mock IELTS data
  const ieltsData = {
    overview: {
      currentScore: 6.5,
      targetScore: 7.5,
      nextExam: "2023-08-15",
      completedTests: 8,
      totalTests: 12,
      progress: 67,
      sections: [
        { name: "Listening", score: 7.0, progress: 70 },
        { name: "Reading", score: 6.5, progress: 65 },
        { name: "Writing", score: 6.0, progress: 60 },
        { name: "Speaking", score: 6.5, progress: 65 },
      ],
      recentActivity: [
        { date: "2023-06-10", type: "Test", name: "Mock Test 8", score: 6.5 },
        { date: "2023-06-05", type: "Lesson", name: "Writing Task 2 - Essay Structure", completed: true },
        { date: "2023-06-01", type: "Test", name: "Mock Test 7", score: 6.0 },
        { date: "2023-05-28", type: "Lesson", name: "Speaking Part 2 - Long Turn", completed: true },
      ],
    },
    practice: {
      listening: [
        {
          id: 1,
          title: "Section 1 - Conversation",
          difficulty: "Easy",
          duration: "15 min",
          questions: 10,
          completed: true,
          score: 8,
        },
        {
          id: 2,
          title: "Section 2 - Monologue",
          difficulty: "Medium",
          duration: "15 min",
          questions: 10,
          completed: true,
          score: 7,
        },
        {
          id: 3,
          title: "Section 3 - Academic Discussion",
          difficulty: "Hard",
          duration: "15 min",
          questions: 10,
          completed: false,
        },
        {
          id: 4,
          title: "Section 4 - Academic Lecture",
          difficulty: "Hard",
          duration: "15 min",
          questions: 10,
          completed: false,
        },
      ],
      reading: [
        {
          id: 1,
          title: "Academic Reading 1",
          difficulty: "Medium",
          duration: "20 min",
          questions: 13,
          completed: true,
          score: 9,
        },
        {
          id: 2,
          title: "Academic Reading 2",
          difficulty: "Hard",
          duration: "20 min",
          questions: 13,
          completed: true,
          score: 8,
        },
        { id: 3, title: "Academic Reading 3", difficulty: "Hard", duration: "20 min", questions: 14, completed: false },
      ],
      writing: [
        {
          id: 1,
          title: "Task 1 - Graph Description",
          difficulty: "Medium",
          duration: "20 min",
          completed: true,
          score: "6.0",
        },
        {
          id: 2,
          title: "Task 2 - Essay Writing",
          difficulty: "Hard",
          duration: "40 min",
          completed: true,
          score: "6.5",
        },
      ],
      speaking: [
        { id: 1, title: "Part 1 - Introduction", difficulty: "Easy", duration: "5 min", completed: true, score: "6.5" },
        { id: 2, title: "Part 2 - Long Turn", difficulty: "Medium", duration: "7 min", completed: true, score: "6.0" },
        { id: 3, title: "Part 3 - Discussion", difficulty: "Hard", duration: "5 min", completed: false },
      ],
    },
    mockTests: [
      {
        id: 1,
        title: "Full Mock Test 1",
        date: "2023-05-15",
        completed: true,
        score: 6.0,
        sections: [
          { name: "Listening", score: 6.5 },
          { name: "Reading", score: 6.0 },
          { name: "Writing", score: 5.5 },
          { name: "Speaking", score: 6.0 },
        ],
      },
      {
        id: 2,
        title: "Full Mock Test 2",
        date: "2023-05-22",
        completed: true,
        score: 6.0,
        sections: [
          { name: "Listening", score: 6.5 },
          { name: "Reading", score: 6.0 },
          { name: "Writing", score: 5.5 },
          { name: "Speaking", score: 6.0 },
        ],
      },
      {
        id: 3,
        title: "Full Mock Test 3",
        date: "2023-05-29",
        completed: true,
        score: 6.5,
        sections: [
          { name: "Listening", score: 7.0 },
          { name: "Reading", score: 6.5 },
          { name: "Writing", score: 6.0 },
          { name: "Speaking", score: 6.5 },
        ],
      },
      { id: 4, title: "Full Mock Test 4", date: "2023-06-15", completed: false },
    ],
    resources: [
      { id: 1, title: "IELTS Vocabulary List", type: "PDF", size: "2.5 MB", downloads: 1245 },
      { id: 2, title: "Writing Task 2 Templates", type: "PDF", size: "1.8 MB", downloads: 987 },
      { id: 3, title: "Speaking Part 2 Topics", type: "PDF", size: "1.2 MB", downloads: 856 },
      { id: 4, title: "Reading Strategies", type: "Video", duration: "45 min", views: 1560 },
      { id: 5, title: "Listening Tips and Tricks", type: "Video", duration: "30 min", views: 1890 },
      { id: 6, title: "Grammar for IELTS", type: "Course", lessons: 12, enrolled: 756 },
    ],
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Easy: "bg-green-50 text-green-700 border-green-200",
      Medium: "bg-amber-50 text-amber-700 border-amber-200",
      Hard: "bg-red-50 text-red-700 border-red-200",
    }
    return colors[difficulty as keyof typeof colors] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const getScoreColor = (score: number) => {
    if (score >= 7.0) return "text-green-600"
    if (score >= 6.0) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">IELTS tayyorgarlik</h1>
        </div>

        {/* IELTS Score Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-700 font-bold text-2xl border-4 border-blue-300">
                  {ieltsData.overview.currentScore}
                </div>
                <div>
                  <h2 className="text-xl font-bold">Joriy IELTS bali</h2>
                  <p className="text-gray-600">Maqsad: {ieltsData.overview.targetScore} ball</p>
                  <div className="mt-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs text-gray-500">{ieltsData.overview.progress}%</span>
                    </div>
                    <Progress value={ieltsData.overview.progress} className="h-1.5" />
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-sm text-gray-600 mb-1">Keyingi imtihon</div>
                <div className="text-lg font-bold text-blue-700">
                  {new Date(ieltsData.overview.nextExam).toLocaleDateString("uz-UZ")}
                </div>
                <Button size="sm" className="mt-2" onClick={() => router.push("/ielts/exam")}>
                  Mock test topshirish
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {ieltsData.overview.sections.map((section) => (
                <div key={section.name} className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-sm text-gray-500">{section.name}</div>
                  <div className={`text-lg font-bold ${getScoreColor(section.score)}`}>{section.score}</div>
                  <Progress value={section.progress} className="h-1.5 mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Umumiy</TabsTrigger>
            <TabsTrigger value="practice">Mashqlar</TabsTrigger>
            <TabsTrigger value="mockTests">Mock testlar</TabsTrigger>
            <TabsTrigger value="resources">Materiallar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-blue-500" />
                    Tayyorgarlik jarayoni
                  </CardTitle>
                  <CardDescription>IELTS imtihoniga tayyorgarlik jarayoni</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Umumiy progress</span>
                        <span className="text-sm text-gray-500">
                          {ieltsData.overview.completedTests}/{ieltsData.overview.totalTests} test
                        </span>
                      </div>
                      <Progress value={ieltsData.overview.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <div className="text-sm text-gray-500">Joriy ball</div>
                        <div className="text-2xl font-bold text-blue-700">{ieltsData.overview.currentScore}</div>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="text-sm text-gray-500">Maqsad ball</div>
                        <div className="text-2xl font-bold text-green-700">{ieltsData.overview.targetScore}</div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Keyingi qadamlar</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Writing Task 2 bo'yicha mashqlar</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Speaking Part 3 bo'yicha mashqlar</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Reading bo'yicha tezlikni oshirish</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    So'nggi faoliyat
                  </CardTitle>
                  <CardDescription>IELTS bo'yicha so'nggi faoliyatingiz</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ieltsData.overview.recentActivity.map((activity, index) => (
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
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Tugatilgan
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center">
                      <Button variant="outline" onClick={() => setSelectedTab("practice")}>
                        Barcha faoliyatni ko'rish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="practice">
            <Tabs defaultValue="listening">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="listening">Listening</TabsTrigger>
                <TabsTrigger value="reading">Reading</TabsTrigger>
                <TabsTrigger value="writing">Writing</TabsTrigger>
                <TabsTrigger value="speaking">Speaking</TabsTrigger>
              </TabsList>

              <TabsContent value="listening">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Headphones className="mr-2 h-5 w-5 text-blue-500" />
                      Listening mashqlari
                    </CardTitle>
                    <CardDescription>IELTS Listening bo'yicha mashqlar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ieltsData.practice.listening.map((practice) => (
                        <Card key={practice.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{practice.title}</h3>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className={getDifficultyColor(practice.difficulty)}>
                                    {practice.difficulty}
                                  </Badge>
                                  <span className="text-sm text-gray-500 ml-2">
                                    {practice.duration} • {practice.questions} savollar
                                  </span>
                                </div>
                              </div>
                              {practice.completed ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {practice.score}/10
                                </Badge>
                              ) : null}
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button size="sm" onClick={() => router.push(`/ielts/practice/listening/${practice.id}`)}>
                                {practice.completed ? "Qayta ishlash" : "Boshlash"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reading">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                      Reading mashqlari
                    </CardTitle>
                    <CardDescription>IELTS Reading bo'yicha mashqlar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ieltsData.practice.reading.map((practice) => (
                        <Card key={practice.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{practice.title}</h3>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className={getDifficultyColor(practice.difficulty)}>
                                    {practice.difficulty}
                                  </Badge>
                                  <span className="text-sm text-gray-500 ml-2">
                                    {practice.duration} • {practice.questions} savollar
                                  </span>
                                </div>
                              </div>
                              {practice.completed ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {practice.score}/13
                                </Badge>
                              ) : null}
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button size="sm" onClick={() => router.push(`/ielts/practice/reading/${practice.id}`)}>
                                {practice.completed ? "Qayta ishlash" : "Boshlash"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="writing">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Pencil className="mr-2 h-5 w-5 text-blue-500" />
                      Writing mashqlari
                    </CardTitle>
                    <CardDescription>IELTS Writing bo'yicha mashqlar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ieltsData.practice.writing.map((practice) => (
                        <Card key={practice.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{practice.title}</h3>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className={getDifficultyColor(practice.difficulty)}>
                                    {practice.difficulty}
                                  </Badge>
                                  <span className="text-sm text-gray-500 ml-2">{practice.duration}</span>
                                </div>
                              </div>
                              {practice.completed ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {practice.score}
                                </Badge>
                              ) : null}
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button size="sm" onClick={() => router.push(`/ielts/practice/writing/${practice.id}`)}>
                                {practice.completed ? "Qayta ishlash" : "Boshlash"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="speaking">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                      Speaking mashqlari
                    </CardTitle>
                    <CardDescription>IELTS Speaking bo'yicha mashqlar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ieltsData.practice.speaking.map((practice) => (
                        <Card key={practice.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{practice.title}</h3>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className={getDifficultyColor(practice.difficulty)}>
                                    {practice.difficulty}
                                  </Badge>
                                  <span className="text-sm text-gray-500 ml-2">{practice.duration}</span>
                                </div>
                              </div>
                              {practice.completed ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {practice.score}
                                </Badge>
                              ) : null}
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button size="sm" onClick={() => router.push(`/ielts/practice/speaking/${practice.id}`)}>
                                {practice.completed ? "Qayta ishlash" : "Boshlash"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="mockTests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  IELTS Mock testlar
                </CardTitle>
                <CardDescription>To'liq IELTS imtihon simulyatsiyalari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ieltsData.mockTests.map((test) => (
                    <Card key={test.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                          <div>
                            <h3 className="font-medium">{test.title}</h3>
                            <div className="text-sm text-gray-500 mt-1">
                              {test.date ? new Date(test.date).toLocaleDateString("uz-UZ") : "Rejalashtirish kerak"}
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

                        {test.completed && test.sections && (
                          <div className="mt-4 grid grid-cols-4 gap-2">
                            {test.sections.map((section) => (
                              <div key={section.name} className="text-center">
                                <div className="text-sm text-gray-500">{section.name}</div>
                                <div className={`text-sm font-medium ${getScoreColor(section.score)}`}>
                                  {section.score}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 flex justify-end">
                          {test.completed ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/ielts/mock-tests/${test.id}/results`)}
                            >
                              Natijalarni ko'rish
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => router.push(`/ielts/mock-tests/${test.id}`)}>
                              Testni boshlash
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                  IELTS materiallari
                </CardTitle>
                <CardDescription>IELTS imtihoniga tayyorgarlik uchun materiallar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ieltsData.resources.map((resource) => (
                    <Card key={resource.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{resource.title}</h3>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {resource.type}
                              </Badge>
                              <span className="text-sm text-gray-500 ml-2">
                                {resource.size ||
                                  (resource.duration && `${resource.duration}`) ||
                                  (resource.lessons && `${resource.lessons} darslar`)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button size="sm" onClick={() => router.push(`/ielts/resources/${resource.id}`)}>
                            {resource.type === "PDF"
                              ? "Yuklab olish"
                              : resource.type === "Video"
                                ? "Ko'rish"
                                : "Kirish"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

