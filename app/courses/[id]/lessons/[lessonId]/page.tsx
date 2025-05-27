"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  List,
  MessageSquare,
  Play,
  FileText,
} from "lucide-react"

// Mock course data
const getCourse = (id) => {
  const courses = {
    "1": {
      id: 1,
      title: "Matematika asoslari",
      lessons: [
        {
          id: 1,
          title: "Kirish va kurs haqida ma'lumot",
          duration: "45 daqiqa",
          isCompleted: true,
          isFree: true,
          videoUrl: "https://example.com/video1.mp4",
          description: "Bu darsda kurs haqida umumiy ma'lumot beriladi va o'quv rejasi tushuntiriladi.",
          materials: [
            { id: 1, title: "Kurs rejasi", type: "pdf", url: "#" },
            { id: 2, title: "Matematika asoslari", type: "pdf", url: "#" },
          ],
        },
        {
          id: 2,
          title: "Algebraik ifodalar va amallar",
          duration: "1 soat 15 daqiqa",
          isCompleted: true,
          isFree: true,
          videoUrl: "https://example.com/video2.mp4",
          description: "Bu darsda algebraik ifodalar va ular ustida amallar o'rganiladi.",
          materials: [
            { id: 3, title: "Algebraik ifodalar", type: "pdf", url: "#" },
            { id: 4, title: "Mashqlar to'plami", type: "pdf", url: "#" },
          ],
        },
        {
          id: 3,
          title: "Tenglamalar va tengsizliklar",
          duration: "1 soat 30 daqiqa",
          isCompleted: false,
          isFree: false,
          videoUrl: "https://example.com/video3.mp4",
          description: "Bu darsda tenglamalar va tengsizliklar yechish usullari o'rganiladi.",
          materials: [
            { id: 5, title: "Tenglamalar", type: "pdf", url: "#" },
            { id: 6, title: "Tengsizliklar", type: "pdf", url: "#" },
          ],
        },
        {
          id: 4,
          title: "Kvadrat tenglamalar",
          duration: "1 soat 20 daqiqa",
          isCompleted: false,
          isFree: false,
          videoUrl: "https://example.com/video4.mp4",
          description: "Bu darsda kvadrat tenglamalar va ularni yechish usullari o'rganiladi.",
          materials: [
            { id: 7, title: "Kvadrat tenglamalar", type: "pdf", url: "#" },
            { id: 8, title: "Mashqlar to'plami", type: "pdf", url: "#" },
          ],
        },
        {
          id: 5,
          title: "Funksiyalar va ularning grafiklari",
          duration: "1 soat 45 daqiqa",
          isCompleted: false,
          isFree: false,
          videoUrl: "https://example.com/video5.mp4",
          description: "Bu darsda funksiyalar va ularning grafiklari o'rganiladi.",
          materials: [
            { id: 9, title: "Funksiyalar", type: "pdf", url: "#" },
            { id: 10, title: "Grafiklar", type: "pdf", url: "#" },
          ],
        },
      ],
    },
    "2": {
      id: 2,
      title: "Fizika kursi",
      lessons: [
        {
          id: 1,
          title: "Kirish va kurs haqida ma'lumot",
          duration: "45 daqiqa",
          isCompleted: true,
          isFree: true,
          videoUrl: "https://example.com/video1.mp4",
          description: "Bu darsda kurs haqida umumiy ma'lumot beriladi va o'quv rejasi tushuntiriladi.",
          materials: [
            { id: 1, title: "Kurs rejasi", type: "pdf", url: "#" },
            { id: 2, title: "Fizika asoslari", type: "pdf", url: "#" },
          ],
        },
        // More lessons...
      ],
    },
  }

  return courses[id] || null
}

// Get lesson by ID
const getLesson = (courseId, lessonId) => {
  const course = getCourse(courseId)
  if (!course) return null

  return course.lessons.find((lesson) => lesson.id === Number.parseInt(lessonId)) || null
}

export default function LessonPage({ params }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [lessonCompleted, setLessonCompleted] = useState(false)

  const course = getCourse(params.id)
  const lesson = getLesson(params.id, params.lessonId)

  if (!course || !lesson) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Dars topilmadi</h1>
        <p className="mb-8">So'ralgan dars mavjud emas yoki o'chirilgan</p>
        <Button onClick={() => router.push(`/courses/${params.id}`)}>Kursga qaytish</Button>
      </div>
    )
  }

  // Calculate progress
  const completedLessons = course.lessons.filter(
    (l) => l.isCompleted || (l.id === Number.parseInt(params.lessonId) && lessonCompleted),
  ).length
  const totalLessons = course.lessons.length
  const progress = Math.round((completedLessons / totalLessons) * 100)

  // Get next and previous lessons
  const currentIndex = course.lessons.findIndex((l) => l.id === Number.parseInt(params.lessonId))
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

  const markAsCompleted = () => {
    setLessonCompleted(true)
    // Here you would typically make an API call to update the lesson status
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/courses/${params.id}`)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-2 text-lg font-medium">{course.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <List className="h-4 w-4 mr-2" />
            Darslar ro'yxati
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <List className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6 px-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{lesson.duration}</span>
                {lesson.isFree && (
                  <>
                    <span className="mx-2">•</span>
                    <Badge variant="outline">Bepul</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Video player */}
            <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-2" />
                <p>Video player here</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {!lessonCompleted ? (
                <Button onClick={markAsCompleted}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Darsni yakunlash
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Yakunlangan
                </Button>
              )}

              <div className="flex-1"></div>

              {prevLesson && (
                <Button variant="outline" onClick={() => router.push(`/courses/${params.id}/lessons/${prevLesson.id}`)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Oldingi dars
                </Button>
              )}

              {nextLesson && (
                <Button onClick={() => router.push(`/courses/${params.id}/lessons/${nextLesson.id}`)}>
                  Keyingi dars
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Dars haqida</h2>
                <p className="text-muted-foreground">{lesson.description}</p>
              </div>

              {lesson.materials && lesson.materials.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Materiallar</h2>
                  <div className="space-y-2">
                    {lesson.materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="bg-primary/10 text-primary p-2 rounded-md mr-3">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{material.title}</p>
                            <p className="text-xs text-muted-foreground uppercase">{material.type}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold mb-3">Savollar va javoblar</h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">Dars bo'yicha savollaringiz bormi?</p>
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Savol berish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-full md:w-80 border-l overflow-y-auto">
            <div className="p-4">
              <div className="mb-4">
                <h2 className="font-semibold mb-2">Kurs progressi</h2>
                <Progress value={progress} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground">
                  {completedLessons} / {totalLessons} darslar yakunlangan ({progress}%)
                </p>
              </div>

              <Separator className="my-4" />

              <h2 className="font-semibold mb-3">Darslar ro'yxati</h2>
              <div className="space-y-2">
                {course.lessons.map((l, index) => {
                  const isActive = l.id === Number.parseInt(params.lessonId)
                  const isCompleted = l.isCompleted || (isActive && lessonCompleted)

                  return (
                    <Collapsible key={l.id}>
                      <div
                        className={`flex items-center p-2 rounded-md ${
                          isActive ? "bg-primary/10" : isCompleted ? "bg-green-50" : ""
                        }`}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted mr-2 shrink-0">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="truncate">
                            <Link
                              href={`/courses/${params.id}/lessons/${l.id}`}
                              className="font-medium truncate hover:underline"
                            >
                              {l.title}
                            </Link>
                          </div>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="pl-8 pr-2 py-2 text-sm text-muted-foreground">
                          <div className="flex items-center mb-1">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{l.duration}</span>
                          </div>
                          {l.isFree && (
                            <Badge variant="outline" className="text-xs">
                              Bepul
                            </Badge>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

