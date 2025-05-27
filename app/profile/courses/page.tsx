"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Search } from "lucide-react"
import axios from "axios"

export default function ProfileCoursesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [apiEnrolledCourses, setApiEnrolledCourses] = useState([])
  const [apiCompletedCourses, setApiCompletedCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios
        .get(`https://testonline.pythonanywhere.com/api/courses/my-courses/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const responseData = res.data
          const enrolled = []
          const completed = []

          let coursesToProcess = []
          if (Array.isArray(responseData)) {
            coursesToProcess = responseData
          } else if (responseData && Array.isArray(responseData.results)) {
            coursesToProcess = responseData.results
          }


          if (coursesToProcess.length > 0) {
            coursesToProcess.forEach((enrollment) => {
              if (enrollment.completed_at === null) {
                enrolled.push(enrollment)
              } else {
                completed.push(enrollment)
              }
            })
          }
          
          setApiEnrolledCourses(enrolled)
          setApiCompletedCourses(completed)
          setIsLoading(false)
        })
        .catch((err) => {
          setApiEnrolledCourses([])
          setApiCompletedCourses([])
          setIsLoading(false)
        })
    } else {
      setApiEnrolledCourses([])
      setApiCompletedCourses([])
      setIsLoading(false)
    }
  }, [])

  const filterCourses = (courses) => {
    if (!searchQuery) return courses
    return courses.filter(
      (enrollment) =>
        enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enrollment.course.teacher?.full_name &&
          enrollment.course.teacher.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (enrollment.course.subject?.name &&
          enrollment.course.subject.name.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  const filteredEnrolledCourses = filterCourses(apiEnrolledCourses)
  const filteredCompletedCourses = filterCourses(apiCompletedCourses)

  if (isLoading) {
    return (
        <div className="container mx-auto py-8 px-4 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
            <p className="text-xl font-semibold">Kurslar yuklanmoqda...</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mening kurslarim</h1>
          <p className="text-muted-foreground mt-1">O'qiyotgan va yakunlagan kurslaringiz</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Kurslarni qidirish..."
              className="w-full md:w-[300px] pl-8 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => router.push("/courses")}>Yangi kurslar</Button>
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="enrolled">O'qiyotgan kurslar</TabsTrigger>
          <TabsTrigger value="completed">Yakunlangan kurslar</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">
          {filteredEnrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrolledCourses.map((enrollment) => (
                <EnrolledCourseCard key={enrollment.id} enrollmentData={enrollment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">O'qiyotgan kurslar topilmadi</h2>
              <p className="text-muted-foreground mb-6">
                Siz hali birorta kursga yozilmagansiz yoki qidiruv bo'yicha kurslar topilmadi.
              </p>
              <Button onClick={() => router.push("/courses")}>Kurslarni ko'rish</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {filteredCompletedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompletedCourses.map((enrollment) => (
                <CompletedCourseCard key={enrollment.id} enrollmentData={enrollment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Yakunlangan kurslar yo'q</h2>
              <p className="text-muted-foreground mb-6">
                Siz hali birorta kursni yakunlamagansiz yoki qidiruv bo'yicha kurslar topilmadi.
              </p>
              <Button onClick={() => router.push("/courses")}>Kurslarni ko'rish</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EnrolledCourseCard({ enrollmentData }) {
  const router = useRouter()
  const course = enrollmentData.course
  const progress = enrollmentData.progress || 0
  const totalLessons = course.lessons_count || 0
  const completedLessons = totalLessons > 0 ? Math.round((progress / 100) * totalLessons) : 0

  const nextLessonId = enrollmentData.last_accessed_lesson?.id
  let continueLink = `/courses/${course.id}`

  if(nextLessonId) {
    continueLink = `/courses/${course.id}/lessons/${nextLessonId}`
  }

  const handleContinue = () => {
    router.push(continueLink)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg?height=200&width=300"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          onError={(e) => e.currentTarget.src = "/placeholder.svg?height=200&width=300"}
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          {course.subject?.name && <Badge variant="outline">{course.subject.name}</Badge>}
          <Badge variant="secondary">O'qilmoqda</Badge>
        </div>
        <CardTitle className="text-xl mt-2">
          <Link href={`/courses/${course.id}`} className="hover:underline">
            {course.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {course.teacher?.full_name && <div className="text-sm text-muted-foreground mb-3">O'qituvchi: {course.teacher.full_name}</div>}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{parseFloat(progress).toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {totalLessons > 0 && (
            <div className="text-xs text-muted-foreground">
              {completedLessons} / {totalLessons} darslar yakunlangan
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {enrollmentData.enrolled_at && (
            <>
              <Clock className="h-3.5 w-3.5 inline-block mr-1" />
              Yozilgan: {new Date(enrollmentData.enrolled_at).toLocaleDateString()}
            </>
          )}
        </div>
        {progress < 100 && totalLessons > 0 && (
          <Button onClick={handleContinue}>
            Davom ettirish
          </Button>
        )}
         {(progress >= 100 || totalLessons === 0) && (
          <Button variant="outline" onClick={() => router.push(`/courses/${course.id}`)}>
            Kursni ko'rish
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function CompletedCourseCard({ enrollmentData }) {
  const router = useRouter()
  const course = enrollmentData.course

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg?height=200&width=300"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          onError={(e) => e.currentTarget.src = "/placeholder.svg?height=200&width=300"}
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          {course.subject?.name && <Badge variant="outline">{course.subject.name}</Badge>}
          <Badge variant="success">Yakunlangan</Badge>
        </div>
        <CardTitle className="text-xl mt-2">
          <Link href={`/courses/${course.id}`} className="hover:underline">
            {course.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {course.teacher?.full_name && <div className="text-sm text-muted-foreground mb-3">O'qituvchi: {course.teacher.full_name}</div>}
        <div className="text-sm">
          {enrollmentData.completed_at && (
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Yakunlangan sana:</span>
              <span>{new Date(enrollmentData.completed_at).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sertifikat:</span>
            <span className="text-green-600">Mavjud</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push(`/courses/${course.id}`)}>
          Kursni ko'rish
        </Button>
      </CardFooter>
    </Card>
  )
}