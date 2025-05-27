"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Clock,
  Filter,
  Search,
  Star,
  Users,
  BookOpen,
  GraduationCap,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for courses
const courses = [
  {
    id: 1,
    title: "Matematika asoslari",
    description: "Algebra, geometriya va trigonometriya asoslari",
    instructor: "Aziz Karimov",
    rating: 4.8,
    students: 1245,
    duration: "8 hafta",
    level: "Boshlang'ich",
    price: 299000,
    category: "matematika",
    image: "/placeholder.svg?height=200&width=300",
    isFeatured: true,
    isPopular: true,
    language: "O'zbek",
    lastUpdated: "2023-10-15",
    topics: ["Algebra", "Geometriya", "Trigonometriya"],
  },
  {
    id: 2,
    title: "Fizika kursi",
    description: "Mexanika, elektr va magnit maydonlari",
    instructor: "Dilshod Toshmatov",
    rating: 4.6,
    students: 890,
    duration: "10 hafta",
    level: "O'rta",
    price: 349000,
    category: "fizika",
    image: "/placeholder.svg?height=200&width=300",
    isFeatured: true,
    isPopular: false,
    language: "O'zbek",
    lastUpdated: "2023-09-20",
    topics: ["Mexanika", "Elektr", "Magnit maydonlari"],
  },
  {
    id: 3,
    title: "Ingliz tili grammatikasi",
    description: "Ingliz tili grammatikasi va so'zlashuv",
    instructor: "Nilufar Sobirova",
    rating: 4.9,
    students: 1560,
    duration: "12 hafta",
    level: "Har qanday",
    price: 399000,
    category: "tillar",
    image: "/placeholder.svg?height=200&width=300",
    isFeatured: false,
    isPopular: true,
    language: "O'zbek/Ingliz",
    lastUpdated: "2023-08-15",
    topics: ["Grammatika", "So'zlashuv", "Tinglab tushunish"],
  },
  {
    id: 4,
    title: "Kimyo asoslari",
    description: "Organik va anorganik kimyo asoslari",
    instructor: "Jamshid Qodirov",
    rating: 4.5,
    students: 720,
    duration: "8 hafta",
    level: "Boshlang'ich",
    price: 279000,
    category: "kimyo",
    image: "/placeholder.svg?height=200&width=300",
    isFeatured: false,
    isPopular: false,
    language: "O'zbek",
    lastUpdated: "2023-07-10",
    topics: ["Organik kimyo", "Anorganik kimyo", "Laboratoriya ishlari"],
  },
  {
    id: 5,
    title: "Biologiya kursi",
    description: "Tirik organizmlar va ularning tuzilishi",
    instructor: "Gulnora Karimova",
    rating: 4.7,
    students: 850,
    duration: "9 hafta",
    level: "O'rta",
    price: 329000,
    category: "biologiya",
    image: "/placeholder.svg?height=200&width=300",
    isFeatured: true,
    isPopular: true,
    language: "O'zbek",
    lastUpdated: "2023-08-05",
    topics: ["Botanika", "Zoologiya", "Anatomiya"],
  },
  {
    id: 6,
    title: "Tarix kursi",
    description: "Jahon va O'zbekiston tarixi",
    instructor: "Bobur Alimov",
    rating: 4.4,
    students: 680,
    duration: "7 hafta",
    level: "Har qanday",
    price: 249000,
    category: "tarix",
    image: "/placeholder.svg?height=200&width=300",
    isFeatured: false,
    isPopular: false,
    language: "O'zbek",
    lastUpdated: "2023-06-20",
    topics: ["Jahon tarixi", "O'zbekiston tarixi", "Arxeologiya"],
  },
]

// Categories for filtering
const categories = [
  { id: "all", name: "Barcha kurslar" },
  { id: "matematika", name: "Matematika" },
  { id: "fizika", name: "Fizika" },
  { id: "kimyo", name: "Kimyo" },
  { id: "biologiya", name: "Biologiya" },
  { id: "tarix", name: "Tarix" },
  { id: "tillar", name: "Tillar" },
]

// Levels for filtering
const levels = [
  { id: "all", name: "Barcha darajalar" },
  { id: "Boshlang'ich", name: "Boshlang'ich" },
  { id: "O'rta", name: "O'rta" },
  { id: "Har qanday", name: "Har qanday" },
]

export default function CoursesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [wishlist, setWishlist] = useState<number[]>([])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter courses based on search query, selected category, level, and price range
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1]

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice
  })

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.students - a.students
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      default:
        return 0
    }
  })

  // Get featured and popular courses
  const featuredCourses = courses.filter((course) => course.isFeatured)
  const popularCourses = courses.filter((course) => course.isPopular)

  const toggleWishlist = (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setWishlist((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  const resetFilters = () => {
    setSelectedCategory("all")
    setSelectedLevel("all")
    setPriceRange([0, 500000])
    setSortBy("popular")
    setSearchQuery("")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="w-1/3 h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-1/4 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kurslar</h1>
          <p className="text-muted-foreground mt-1">O'zingizga kerakli kurslarni toping va o'rganing</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Kurslarni qidirish..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filtrlash</SheetTitle>
                <SheetDescription>Kurslarni filtrlash uchun parametrlarni tanlang</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Kategoriya</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategory === category.id}
                          onCheckedChange={() => setSelectedCategory(category.id)}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Daraja</h3>
                  <div className="space-y-1">
                    {levels.map((level) => (
                      <div key={level.id} className="flex items-center">
                        <Checkbox
                          id={`level-${level.id}`}
                          checked={selectedLevel === level.id}
                          onCheckedChange={() => setSelectedLevel(level.id)}
                        />
                        <label
                          htmlFor={`level-${level.id}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {level.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Narx</h3>
                  <Slider
                    defaultValue={[0, 500000]}
                    max={500000}
                    step={10000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>{priceRange[0].toLocaleString()} so'm</span>
                    <span>{priceRange[1].toLocaleString()} so'm</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Saralash</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Saralash" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Ommabop</SelectItem>
                      <SelectItem value="rating">Reyting bo'yicha</SelectItem>
                      <SelectItem value="newest">Eng yangi</SelectItem>
                      <SelectItem value="price-low">Narx: pastdan yuqoriga</SelectItem>
                      <SelectItem value="price-high">Narx: yuqoridan pastga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" onClick={resetFilters}>
                    Filtrlani tozalash
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button>Qo'llash</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            className="hidden md:flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filtrlash</span>
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="hidden md:block mb-8 p-4 border rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Kategoriya</h3>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategoriyani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Daraja</h3>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Darajani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Narx</h3>
              <Slider
                defaultValue={[0, 500000]}
                max={500000}
                step={10000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-4"
              />
              <div className="flex justify-between text-sm">
                <span>{priceRange[0].toLocaleString()} so'm</span>
                <span>{priceRange[1].toLocaleString()} so'm</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Saralash</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Saralash" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Ommabop</SelectItem>
                  <SelectItem value="rating">Reyting bo'yicha</SelectItem>
                  <SelectItem value="newest">Eng yangi</SelectItem>
                  <SelectItem value="price-low">Narx: pastdan yuqoriga</SelectItem>
                  <SelectItem value="price-high">Narx: yuqoridan pastga</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={resetFilters} className="mr-2">
              Filtrlani tozalash
            </Button>
            <Button onClick={() => setShowFilters(false)}>Qo'llash</Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4 flex flex-wrap">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} onClick={() => setSelectedCategory(category.id)}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {featuredCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Tavsiya etilgan kurslar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    inWishlist={wishlist.includes(course.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            </div>
          )}

          {popularCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Ommabop kurslar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    inWishlist={wishlist.includes(course.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Barcha kurslar</h2>
              {sortedCourses.length > 0 && (
                <div className="text-sm text-muted-foreground">{sortedCourses.length} ta kurs topildi</div>
              )}
            </div>

            {sortedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    inWishlist={wishlist.includes(course.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Kurslar topilmadi</h3>
                <p className="text-muted-foreground mb-6">Qidiruv so'rovingizga mos kurslar topilmadi.</p>
                <Button onClick={resetFilters}>Filtrlarni tozalash</Button>
              </div>
            )}
          </div>
        </TabsContent>

        {categories.slice(1).map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  inWishlist={wishlist.includes(course.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Yangi kurslar haqida xabardor bo'ling</h2>
            <p className="text-gray-600 mb-4 md:mb-0">
              Yangi kurslar, chegirmalar va maxsus takliflar haqida birinchilardan bo'lib xabardor bo'ling
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <Input placeholder="Email manzilingiz" className="w-full md:w-auto" />
            <Button>Obuna bo'lish</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseCard({ course, inWishlist, onToggleWishlist }) {
  const router = useRouter()

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
          onClick={(e) => onToggleWishlist(course.id, e)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={inWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            className={`h-5 w-5 ${inWishlist ? "text-red-500" : "text-gray-600"}`}
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </Button>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <Badge variant="outline">{course.level}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
        </div>
        <CardTitle className="text-xl mt-2">
          <Link href={`/courses/${course.id}`} className="hover:underline">
            {course.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <GraduationCap className="h-4 w-4 mr-1" />
          <span>{course.instructor}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {course.topics.slice(0, 3).map((topic, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.students} o'quvchi</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="font-bold text-lg">{course.price.toLocaleString()} so'm</div>
        <Button onClick={() => router.push(`/courses/${course.id}`)}>Batafsil</Button>
      </CardFooter>
    </Card>
  )
}

