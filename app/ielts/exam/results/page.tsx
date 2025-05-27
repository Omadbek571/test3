"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, CheckCircle, Download, Headphones, MessageSquare, Pencil, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function IELTSExamResultsPage() {
  const router = useRouter()

  // Mock results data
  const resultsData = {
    examTitle: "IELTS Mock Test 4",
    date: "2023-06-15",
    overallScore: 6.5,
    sections: [
      { id: "listening", name: "Listening", score: 7.0, correct: 32, total: 40 },
      { id: "reading", name: "Reading", score: 6.5, correct: 30, total: 40 },
      {
        id: "writing",
        name: "Writing",
        score: 6.0,
        tasks: [
          {
            id: 1,
            title: "Task 1",
            score: 6.0,
            feedback: "Good attempt at describing the graph. Work on cohesion and coherence.",
          },
          {
            id: 2,
            title: "Task 2",
            score: 6.0,
            feedback: "Good essay structure. Work on developing your arguments more fully.",
          },
        ],
      },
      {
        id: "speaking",
        name: "Speaking",
        score: 6.5,
        parts: [
          { id: 1, title: "Part 1", score: 6.5, feedback: "Good fluency. Work on vocabulary range." },
          {
            id: 2,
            title: "Part 2",
            score: 6.0,
            feedback: "Good attempt at the long turn. Work on organizing your ideas better.",
          },
          {
            id: 3,
            title: "Part 3",
            score: 7.0,
            feedback: "Good discussion of abstract ideas. Work on grammatical accuracy.",
          },
        ],
      },
    ],
    feedback: {
      strengths: [
        "Good overall fluency in speaking",
        "Strong reading comprehension skills",
        "Good listening for specific information",
      ],
      weaknesses: [
        "Limited vocabulary range in writing",
        "Grammatical errors in complex sentences",
        "Need to develop ideas more fully in writing",
      ],
      recommendations: [
        "Practice writing Task 2 essays with more complex vocabulary",
        "Work on grammatical accuracy in speaking",
        "Practice reading for gist and main ideas",
      ],
    },
  }

  const getScoreColor = (score: number) => {
    if (score >= 7.0) return "text-green-600"
    if (score >= 6.0) return "text-amber-600"
    return "text-red-600"
  }

  const getBandDescription = (score: number) => {
    if (score >= 8.0) return "Very Good User"
    if (score >= 7.0) return "Good User"
    if (score >= 6.0) return "Competent User"
    if (score >= 5.0) return "Modest User"
    if (score >= 4.0) return "Limited User"
    return "Basic User"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/ielts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">IELTS imtihon natijalari</h1>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-700 font-bold text-3xl border-4 border-blue-300">
                  {resultsData.overallScore}
                </div>
                <div>
                  <h2 className="text-xl font-bold">Umumiy IELTS bali</h2>
                  <p className="text-gray-600">{getBandDescription(resultsData.overallScore)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Imtihon sanasi: {new Date(resultsData.date).toLocaleDateString("uz-UZ")}
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <Button variant="outline" className="mb-2">
                  <Download className="mr-2 h-4 w-4" />
                  Natijalarni yuklab olish
                </Button>
                <div>
                  <Button size="sm" onClick={() => router.push("/ielts")}>
                    Mashqlarni davom ettirish
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {resultsData.sections.map((section) => (
                <div key={section.id} className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-sm text-gray-500">{section.name}</div>
                  <div className={`text-lg font-bold ${getScoreColor(section.score)}`}>{section.score}</div>
                  {section.correct !== undefined && (
                    <div className="text-xs text-gray-500">
                      {section.correct}/{section.total} ({Math.round((section.correct / section.total) * 100)}%)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Umumiy</TabsTrigger>
            <TabsTrigger value="listening">Listening</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="writing">Writing</TabsTrigger>
            <TabsTrigger value="speaking">Speaking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Umumiy natijalar</CardTitle>
                <CardDescription>IELTS imtihoni bo'yicha umumiy natijalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">Bo'limlar bo'yicha natijalar</h3>
                      <div className="space-y-4">
                        {resultsData.sections.map((section) => (
                          <div key={section.id}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{section.name}</span>
                              <span className={`text-sm font-medium ${getScoreColor(section.score)}`}>
                                {section.score}
                              </span>
                            </div>
                            <Progress value={(section.score * 100) / 9} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Kuchli tomonlar</h3>
                      <div className="space-y-2">
                        {resultsData.feedback.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                            <span className="text-gray-600">{strength}</span>
                          </div>
                        ))}
                      </div>

                      <h3 className="font-medium mt-4 mb-3">Rivojlantirish kerak bo'lgan tomonlar</h3>
                      <div className="space-y-2">
                        {resultsData.feedback.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-start">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 shrink-0" />
                            <span className="text-gray-600">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-medium mb-3">Tavsiyalar</h3>
                    <div className="space-y-2">
                      {resultsData.feedback.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 shrink-0">
                            <span className="text-blue-700 text-sm font-medium">{index + 1}</span>
                          </div>
                          <span className="text-gray-600">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listening">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Headphones className="mr-2 h-5 w-5 text-blue-500" />
                  Listening
                </CardTitle>
                <CardDescription>Listening bo'limi bo'yicha natijalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-700 font-bold text-xl border-2 border-blue-300">
                        {resultsData.sections[0].score}
                      </div>
                      <div>
                        <h3 className="font-medium">Umumiy ball</h3>
                        <p className="text-gray-600">
                          {resultsData.sections[0].correct}/{resultsData.sections[0].total} to'g'ri javoblar
                        </p>
                      </div>
                    </div>
                    <div>
                      <Progress
                        value={(resultsData.sections[0].correct / resultsData.sections[0].total) * 100}
                        className="h-2 w-40"
                      />
                      <div className="text-xs text-center mt-1 text-gray-500">
                        {Math.round((resultsData.sections[0].correct / resultsData.sections[0].total) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Bo'limlar bo'yicha natijalar</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Section 1</span>
                          <span className="text-sm text-gray-500">8/10</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Section 2</span>
                          <span className="text-sm text-gray-500">9/10</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Section 3</span>
                          <span className="text-sm text-gray-500">7/10</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Section 4</span>
                          <span className="text-sm text-gray-500">8/10</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Tavsiyalar</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                        <span>Section 1 va 2 da yaxshi natija ko'rsatdingiz.</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 shrink-0" />
                        <span>
                          Section 3 da qiyinchilik sezdingiz. Akademik muhokamalarni eshitish bo'yicha ko'proq mashq
                          qiling.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                        <span>Umumiy eshitish ko'nikmalaringiz yaxshi.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reading">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                  Reading
                </CardTitle>
                <CardDescription>Reading bo'limi bo'yicha natijalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-700 font-bold text-xl border-2 border-blue-300">
                        {resultsData.sections[1].score}
                      </div>
                      <div>
                        <h3 className="font-medium">Umumiy ball</h3>
                        <p className="text-gray-600">
                          {resultsData.sections[1].correct}/{resultsData.sections[1].total} to'g'ri javoblar
                        </p>
                      </div>
                    </div>
                    <div>
                      <Progress
                        value={(resultsData.sections[1].correct / resultsData.sections[1].total) * 100}
                        className="h-2 w-40"
                      />
                      <div className="text-xs text-center mt-1 text-gray-500">
                        {Math.round((resultsData.sections[1].correct / resultsData.sections[1].total) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Bo'limlar bo'yicha natijalar</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Passage 1</span>
                          <span className="text-sm text-gray-500">12/13</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Passage 2</span>
                          <span className="text-sm text-gray-500">10/13</span>
                        </div>
                        <Progress value={77} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Passage 3</span>
                          <span className="text-sm text-gray-500">8/14</span>
                        </div>
                        <Progress value={57} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Tavsiyalar</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                        <span>Passage 1 da a'lo natija ko'rsatdingiz.</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 shrink-0" />
                        <span>
                          Passage 3 da qiyinchilik sezdingiz. Akademik matnlarni o'qish bo'yicha ko'proq mashq qiling.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                        <span>Tez o'qish ko'nikmalaringizni rivojlantiring.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="writing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pencil className="mr-2 h-5 w-5 text-blue-500" />
                  Writing
                </CardTitle>
                <CardDescription>Writing bo'limi bo'yicha natijalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-700 font-bold text-xl border-2 border-blue-300">
                        {resultsData.sections[2].score}
                      </div>
                      <div>
                        <h3 className="font-medium">Umumiy ball</h3>
                        <p className="text-gray-600">Writing bo'yicha umumiy natija</p>
                      </div>
                    </div>
                    <div>
                      <Progress value={(resultsData.sections[2].score * 100) / 9} className="h-2 w-40" />
                      <div className="text-xs text-center mt-1 text-gray-500">
                        {Math.round((resultsData.sections[2].score * 100) / 9)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {resultsData.sections[2].tasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">{task.title}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-600">Ball</span>
                          <span className={`font-medium ${getScoreColor(task.score)}`}>{task.score}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Izoh</h4>
                          <p className="text-gray-600">{task.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Baholash mezonlari</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Task Achievement / Response</span>
                          <span className="text-sm text-gray-500">6.0</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Coherence and Cohesion</span>
                          <span className="text-sm text-gray-500">6.0</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Lexical Resource</span>
                          <span className="text-sm text-gray-500">6.0</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Grammatical Range and Accuracy</span>
                          <span className="text-sm text-gray-500">6.0</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Tavsiyalar</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                        <span>Yaxshi essay tuzilishiga egasiz.</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 shrink-0" />
                        <span>Lug'at boyligingizni oshiring va murakkab grammatik tuzilmalardan foydalaning.</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 shrink-0" />
                        <span>Fikrlaringizni to'liqroq rivojlantiring.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="speaking">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                  Speaking
                </CardTitle>
                <CardDescription>Speaking bo'limi bo'yicha natijalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-700 font-bold text-xl border-2 border-blue-300">
                        {resultsData.sections[3].score}
                      </div>
                      <div>
                        <h3 className="font-medium">Umumiy ball</h3>
                        <p className="text-gray-600">Speaking bo'yicha umumiy natija</p>
                      </div>
                    </div>
                    <div>
                      <Progress value={(resultsData.sections[3].score * 100) / 9} className="h-2 w-40" />
                      <div className="text-xs text-center mt-1 text-gray-500">
                        {Math.round((resultsData.sections[3].score * 100) / 9)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {resultsData.sections[3].parts.map((part) => (
                      <div key={part.id} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">{part.title}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-600">Ball</span>
                          <span className={`font-medium ${getScoreColor(part.score)}`}>{part.score}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Izoh</h4>
                          <p className="text-gray-600">{part.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Baholash mezonlari</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Fluency and Coherence</span>
                          <span className="text-sm text-gray-500">6.5</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Lexical Resource</span>
                          <span className="text-sm text-gray-500">6.0</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Grammatical Range and Accuracy</span>
                          <span className="text-sm text-gray-500">6.5</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Pronunciation</span>
                          <span className="text-sm text-gray-500">7.0</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Tavsiyalar</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                        <span>Yaxshi ravonlikka egasiz.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                        <span>Talaffuzingiz yaxshi.</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 shrink-0" />
                        <span>Lug'at boyligingizni oshiring va murakkab grammatik tuzilmalardan foydalaning.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

