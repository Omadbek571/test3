"use client"

import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Clock,
  Star,
  Users,
  Share2,
  Heart,
  ShoppingCart,
  Award,
  BookOpen,
  GraduationCap,
  Calendar,
  Globe,
  MessageSquare,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock course data
const getCourse = (id) => {
  const courses = {
    "1": {
      id: 1,
      title: "Matematika asoslari",
      description:
        "Bu kurs orqali siz matematika asoslarini o'rganasiz. Algebra, geometriya va trigonometriya bo'limlari bo'yicha chuqur bilimga ega bo'lasiz. Kurs davomida nazariy bilimlar bilan bir qatorda amaliy mashqlar ham bajariladi.",
      longDescription:
        "Matematika asoslari kursi abituriyentlar uchun mo'ljallangan bo'lib, unda algebra, geometriya va trigonometriya bo'limlari bo'yicha chuqur bilimlar beriladi. Kurs davomida nazariy bilimlar bilan bir qatorda amaliy mashqlar ham bajariladi. Har bir mavzu bo'yicha testlar va masalalar yechiladi. Kurs yakunida siz matematika fanidan yetarli bilimga ega bo'lasiz va DTM testlariga tayyorlanishingiz mumkin bo'ladi.",
      instructor: "Aziz Karimov",
      instructorTitle: "Matematika fani o'qituvchisi",
      instructorBio:
        "10 yillik tajribaga ega matematika o'qituvchisi. 100 dan ortiq o'quvchilarni oliy ta'lim muassasalariga tayyorlagan.",
      instructorImage: "/placeholder.svg?height=100&width=100",
      rating: 4.8,
      students: 1245,
      duration: "8 hafta",
      level: "Boshlang'ich",
      price: 299000,
      category: "matematika",
      image: "/placeholder.svg?height=400&width=800",
      lastUpdated: "2023-10-15",
      language: "O'zbek",
      certificate: true,
      requirements: [
        "Matematika bo'yicha boshlang'ich bilimlar",
        "Darslarni muntazam kuzatib borish imkoniyati",
        "Amaliy mashqlarni bajarish uchun vaqt",
      ],
      whatYouWillLearn: [
        "Algebra asoslari va tenglamalar",
        "Geometriya va trigonometriya",
        "Funksiyalar va ularning grafiklari",
        "Logarifmlar va eksponentalar",
        "Masalalar yechish usullari",
        "DTM testlarini yechish ko'nikmalari",
      ],
      lessons: [
        {
          id: 1,
          title: "Kirish va kurs haqida ma'lumot",
          duration: "45 daqiqa",
          isCompleted: true,
          isFree: true,
        },
        {
          id: 2,
          title: "Algebraik ifodalar va amallar",
          duration: "1 soat 15 daqiqa",
          isCompleted: true,
          isFree: true,
        },
        {
          id: 3,
          title: "Tenglamalar va tengsizliklar",
          duration: "1 soat 30 daqiqa",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 4,
          title: "Kvadrat tenglamalar",
          duration: "1 soat 20 daqiqa",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 5,
          title: "Funksiyalar va ularning grafiklari",
          duration: "1 soat 45 daqiqa",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 6,
          title: "Logarifmik va eksponensial funksiyalar",
          duration: "2 soat",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 7,
          title: "Trigonometriya asoslari",
          duration: "1 soat 50 daqiqa",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 8,
          title: "Geometriya: uchburchaklar va to'rtburchaklar",
          duration: "1 soat 30 daqiqa",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 9,
          title: "Geometriya: aylanalar va ko'pburchaklar",
          duration: "1 soat 40 daqiqa",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 10,
          title: "Yakuniy test va kursni yakunlash",
          duration: "1 soat",
          isCompleted: false,
          isFree: false,
        },
      ],
      reviews: [
        {
          id: 1,
          name: "Sardor Aliyev",
          date: "2023-09-10",
          rating: 5,
          comment: "Juda ajoyib kurs! Matematikani tushunishimga katta yordam berdi.",
        },
        {
          id: 2,
          name: "Nilufar Karimova",
          date: "2023-08-25",
          rating: 4,
          comment: "Yaxshi kurs, lekin ba'zi mavzular tezroq o'tilsa yaxshi bo'lardi.",
        },
        {
          id: 3,
          name: "Javohir Toshmatov",
          date: "2023-07-15",
          rating: 5,
          comment: "O'qituvchi juda yaxshi tushuntiradi. Har bir mavzu aniq va tushunarli.",
        },
      ],
      faqs: [
        {
          question: "Kurs tugagandan so'ng materiallar menga qoladi?",
          answer:
            "Ha, kurs tugagandan so'ng barcha materiallar sizga qoladi va istalgan vaqtda qayta ko'rishingiz mumkin.",
        },
        {
          question: "Kursni boshlash uchun qanday bilimlar kerak?",
          answer:
            "Kursni boshlash uchun matematikaning boshlang'ich bilimlariga ega bo'lishingiz kifoya. Biz asosiy tushunchalardan boshlaymiz.",
        },
        {
          question: "Kurs davomida qo'shimcha yordam olish mumkinmi?",
          answer: "Ha, kurs davomida o'qituvchiga savol berishingiz va qo'shimcha yordam olishingiz mumkin.",
        },
      ],
    },
    "2": {
      id: 2,
      title: "Fizika kursi",
      description: "Mexanika, elektr va magnit maydonlari",
      instructor: "Dilshod Toshmatov",
      instructorTitle: "Fizika fani o'qituvchisi",
      instructorBio: "8 yillik tajribaga ega fizika o'qituvchisi. Respublika olimpiadasi g'olibi.",
      instructorImage: "/placeholder.svg?height=100&width=100",
      rating: 4.6,
      students: 890,
      duration: "10 hafta",
      level: "O'rta",
      price: 349000,
      category: "fizika",
      image: "/placeholder.svg?height=400&width=800",
      lastUpdated: "2023-09-20",
      language: "O'zbek",
      certificate: true,
      requirements: [
        "Fizika bo'yicha boshlang'ich bilimlar",
        "Matematika asoslarini bilish",
        "Amaliy mashqlarni bajarish uchun vaqt",
      ],
      whatYouWillLearn: [
        "Mexanika asoslari",
        "Elektr va magnit maydonlari",
        "Optika va yorug'lik",
        "Atom va yadro fizikasi",
        "Masalalar yechish usullari",
        "DTM testlarini yechish ko'nikmalari",
      ],
      lessons: [
        {
          id: 1,
          title: "Kirish va kurs haqida ma'lumot",
          duration: "45 daqiqa",
          isCompleted: true,
          isFree: true,
        },
        {
          id: 2,
          title: "Mexanika: kinematika",
          duration: "1 soat 30 daqiqa",
          isCompleted: true,
          isFree: true,
        },
        {
          id: 3,
          title: "Mexanika: dinamika",
          duration: "1 soat 45 daqiqa",
          isCompleted: false,
          isFree: false,
        },
        // More lessons...
      ],
      reviews: [
        {
          id: 1,
          name: "Bekzod Rahimov",
          date: "2023-08-15",
          rating: 5,
          comment: "Fizikani tushunishimga katta yordam berdi.",
        },
        // More reviews...
      ],
      faqs: [
        {
          question: "Kurs tugagandan so'ng materiallar menga qoladi?",
          answer:
            "Ha, kurs tugagandan so'ng barcha materiallar sizga qoladi va istalgan vaqtda qayta ko'rishingiz mumkin.",
        },
        {
          question: "Kursni boshlash uchun qanday bilimlar kerak?",
          answer:
            "Kursni boshlash uchun fizikaning boshlang'ich bilimlariga ega bo'lishingiz va matematikani yaxshi bilishingiz kerak.",
        },
      ],
    },
    // More courses...
  }

  return courses[id] || null
}

export default function CourseDetailPage({ params }) {
  const router = useRouter()
  const [course, setCourse] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [inWishlist, setInWishlist] = useState(false)
  const [inCart, setInCart] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const fetchedCourse = getCourse(params.id)
      setCourse(fetchedCourse)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded mb-6"></div>
            <div className="flex gap-4 mb-6">
              <div className="h-10 bg-gray-200 animate-pulse rounded w-32"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded w-32"></div>
            </div>
            <div className="h-10 bg-gray-200 animate-pulse rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 space-y-4">
              <div className="aspect-video bg-gray-200 animate-pulse rounded"></div>
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Kurs topilmadi</h1>
        <p className="mb-8">So'ralgan kurs mavjud emas yoki o'chirilgan</p>
        <Button onClick={() => router.push("/courses")}>Kurslar ro'yxatiga qaytish</Button>
      </div>
    )
  }

  // Calculate progress
  const completedLessons = course.lessons.filter((lesson) => lesson.isCompleted).length
  const totalLessons = course.lessons.length
  const progress = Math.round((completedLessons / totalLessons) * 100)

  // Calculate total course duration
  const totalDuration = course.lessons.reduce((total, lesson) => {
    const durationParts = lesson.duration.split(" ")
    let minutes = 0

    if (durationParts.includes("soat")) {
      const hourIndex = durationParts.indexOf("soat")
      minutes += Number.parseInt(durationParts[hourIndex - 1]) * 60
    }

    if (durationParts.includes("daqiqa")) {
      const minuteIndex = durationParts.indexOf("daqiqa")
      minutes += Number.parseInt(durationParts[minuteIndex - 1])
    }

    return total + minutes
  }, 0)

  const totalHours = Math.floor(totalDuration / 60)
  const totalMinutes = totalDuration % 60

  const toggleWishlist = () => {
    setInWishlist(!inWishlist)
  }

  const toggleCart = () => {
    setInCart(!inCart)
  }

  const handleShare = () => {
    setShowShareDialog(true)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="outline" className="mr-4" onClick={() => router.push("/courses")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kurslar ro'yxatiga qaytish
        </Button>
        <div className="text-sm breadcrumbs">
          <ul className="flex items-center space-x-2">
            <li>
              <a href="/" className="text-muted-foreground hover:text-foreground">
                Bosh sahifa
              </a>
            </li>
            <li>
              <span className="text-muted-foreground mx-2">/</span>
            </li>
            <li>
              <a href="/courses" className="text-muted-foreground hover:text-foreground">
                Kurslar
              </a>
            </li>
            <li>
              <span className="text-muted-foreground mx-2">/</span>
            </li>
            <li>{course.title}</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-blue-50">
                {course.category}
              </Badge>
              <Badge variant="outline">{course.level}</Badge>
              {course.certificate && (
                <Badge variant="outline" className="bg-green-50">
                  <Award className="h-3 w-3 mr-1" />
                  Sertifikat
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{course.rating}</span>
                <span className="text-sm text-muted-foreground ml-1">({course.reviews.length} sharh)</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span>{course.students} o'quvchi</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Oxirgi yangilanish: {course.lastUpdated}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-1" />
                <span>{course.language}</span>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <img
                src={course.instructorImage || "/placeholder.svg"}
                alt={course.instructor}
                className="h-10 w-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{course.instructor}</p>
                <p className="text-sm text-muted-foreground">{course.instructorTitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button onClick={() => router.push(`/courses/${course.id}/lessons/1`)}>
                <BookOpen className="mr-2 h-4 w-4" />
                Kursni boshlash
              </Button>
              <Button variant={inCart ? "default" : "outline"} onClick={toggleCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {inCart ? "Savatda" : "Savatga qo'shish"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={inWishlist ? "text-red-500" : ""}
                onClick={toggleWishlist}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Kurs haqida</TabsTrigger>
              <TabsTrigger value="curriculum">Darslar</TabsTrigger>
              <TabsTrigger value="instructor">O'qituvchi</TabsTrigger>
              <TabsTrigger value="reviews">Sharhlar</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Kurs haqida</h2>
                <p className="text-muted-foreground">{course.longDescription}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Nimalarni o'rganasiz</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Talablar</h2>
                <ul className="space-y-2">
                  {course.requirements.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 mr-2"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                  Kurs yakunida
                </h2>
                <p className="mb-4">Kursni muvaffaqiyatli yakunlaganingizdan so'ng:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Kurs mavzulari bo'yicha chuqur bilimga ega bo'lasiz</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Amaliy ko'nikmalarni o'zlashtirasiz</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>DTM testlariga tayyorlanish uchun yetarli bilimga ega bo'lasiz</span>
                  </li>
                  {course.certificate && (
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Kursni yakunlaganlik to'g'risida sertifikat olasiz</span>
                    </li>
                  )}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="curriculum">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Kurs tarkibi</h2>
                <div className="text-sm text-muted-foreground">
                  Jami: {totalLessons} ta dars • {totalHours} soat {totalMinutes} daqiqa
                </div>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {course.lessons.map((lesson, index) => (
                  <AccordionItem
                    key={lesson.id}
                    value={`lesson-${lesson.id}`}
                    className="border rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted mr-3 shrink-0">
                          {lesson.isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium">{lesson.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{lesson.duration}</span>
                            {lesson.isFree && (
                              <>
                                <span className="mx-2">•</span>
                                <Badge variant="outline" className="text-xs">
                                  Bepul
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 border-t">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Bu darsda siz {lesson.title.toLowerCase()} mavzusini o'rganasiz.
                        </p>
                        <Button
                          variant={lesson.isCompleted ? "outline" : "default"}
                          size="sm"
                          onClick={() => router.push(`/courses/${course.id}/lessons/${lesson.id}`)}
                        >
                          {lesson.isCompleted ? "Qayta ko'rish" : "Ko'rish"}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="instructor">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img
                  src={course.instructorImage || "/placeholder.svg"}
                  alt={course.instructor}
                  className="h-24 w-24 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold mb-1">{course.instructor}</h2>
                  <p className="text-muted-foreground mb-3">{course.instructorTitle}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{course.rating} reyting</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.students} o'quvchi</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>1 ta kurs</span>
                    </div>
                  </div>
                  <p className="mb-4">{course.instructorBio}</p>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    O'qituvchi bilan bog'lanish
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-muted p-6 rounded-lg text-center md:w-1/3">
                    <div className="text-5xl font-bold mb-2">{course.rating}</div>
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= Math.round(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{course.reviews.length} ta sharh asosida</p>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="font-semibold mb-4">O'quvchilar sharhlari</h3>
                    <div className="space-y-4">
                      {course.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{review.name}</div>
                            <div className="text-sm text-muted-foreground">{review.date}</div>
                          </div>
                          <div className="flex mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-4" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Sharh qoldirish
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Ko'p so'raladigan savollar</h2>

                <Accordion type="single" collapsible className="space-y-4">
                  {course.faqs &&
                    course.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
                          <div className="text-left font-medium">{faq.question}</div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3 border-t">
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Savolingiz bormi?</h3>
                      <p className="text-muted-foreground mb-4">
                        Agar sizda kurs haqida savollar bo'lsa, o'qituvchiga murojaat qilishingiz yoki quyidagi tugmani
                        bosib savol qoldirishingiz mumkin.
                      </p>
                      <Button variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Savol berish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-4 relative">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Button variant="outline" className="bg-white/90 hover:bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="text-3xl font-bold mb-4">{course.price.toLocaleString()} so'm</div>

              <div className="space-y-3 mb-6">
                <Button className="w-full" size="lg" onClick={() => router.push(`/courses/${course.id}/lessons/1`)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Kursni boshlash
                </Button>
                <Button variant={inCart ? "default" : "outline"} className="w-full" size="lg" onClick={toggleCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {inCart ? "Savatda" : "Savatga qo'shish"}
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kurs davomiyligi</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Darslar soni</span>
                  <span className="font-medium">{course.lessons.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Darajasi</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Til</span>
                  <span className="font-medium">{course.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Oxirgi yangilanish</span>
                  <span className="font-medium">{course.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sertifikat</span>
                  <span className="font-medium">{course.certificate ? "Ha" : "Yo'q"}</span>
                </div>
              </div>

              {completedLessons > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sizning progressingiz</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {completedLessons} / {totalLessons} darslar yakunlangan
                    </div>
                  </div>
                </>
              )}

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="font-medium">Kurs o'z ichiga oladi:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <BookOpen className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{course.lessons.length} ta video dars</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>
                      Jami {totalHours} soat {totalMinutes} daqiqa
                    </span>
                  </li>
                  <li className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Amaliy mashqlar va testlar</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>O'qituvchi bilan aloqa</span>
                  </li>
                  {course.certificate && (
                    <li className="flex items-center">
                      <Award className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Yakuniy sertifikat</span>
                    </li>
                  )}
                </ul>
              </div>

              <Separator className="my-4" />

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Kursni do'stlaringiz bilan ulashing</p>
                <div className="flex justify-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                          </svg>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Facebook</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                          </svg>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Twitter</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                          </svg>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>LinkedIn</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                          </svg>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>WhatsApp</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kursni ulashing</DialogTitle>
            <DialogDescription>
              Kurs havolasini nusxalab oling yoki ijtimoiy tarmoqlar orqali ulashing
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={`https://abituriyent.uz/courses/${course.id}`} readOnly />
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(`https://abituriyent.uz/courses/${course.id}`)
                alert("Havola nusxalandi!")
              }}
            >
              Nusxalash
            </Button>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
              </svg>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

