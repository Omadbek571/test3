"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle, Search, ArrowLeft, Filter, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import axios from "axios"

const API_BASE_URL = "https://testonline.pythonanywhere.com"

interface ApiSubject {
  id: number
  name: string
  icon?: string
}

interface ApiTest {
  id: number
  title: string
  subject: ApiSubject
  test_type: "free" | "premium"
  type_display: string
  question_count: number
  difficulty: "oson" | "orta" | "qiyin" | "murakkab"
  difficulty_display: string
  price: string
  price_display: string
  time_limit?: number
  reward_points?: number
  status?: string
  status_display?: string
  created_at?: string
}

interface PaginationData {
  count: number
  next: string | null
  previous: string | null
}

const difficultyOptions = [
  { value: "all", label: "Barcha qiyinliklar" },
  { value: "oson", label: "Oson" },
  { value: "orta", label: "O'rta" },
  { value: "qiyin", label: "Qiyin" },
  { value: "murakkab", label: "Murakkab" },
]

const typeOptions = [
  { value: "all", label: "Barcha turlar" },
  { value: "free", label: "Bepul" },
  { value: "premium", label: "Premium" },
]

export default function AllTestsPage() {
  const router = useRouter()
  const [tests, setTests] = useState<ApiTest[]>([])
  const [subjects, setSubjects] = useState<ApiSubject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 9

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/subjects/`)
      .then(response => {
        const data = response.data
        if (Array.isArray(data)) {
          setSubjects(data)
        } else if (data && Array.isArray(data.results)) {
          setSubjects(data.results)
        } else {
          console.warn("API /api/subjects/ dan kutilgan javob massiv emas:", data)
          setSubjects([])
        }
      })
      .catch(err => {
        console.error("Fanlarni yuklashda xatolik:", err)
        setError("Fanlar ro'yxatini yuklab bo'lmadi.")
        setSubjects([])
      })
  }, [])

  const fetchTests = useCallback(() => {
    setIsLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (searchTerm) params.append('search', searchTerm)
    if (subjectFilter !== "all") params.append('subject', subjectFilter)
    if (difficultyFilter !== "all") params.append('difficulty', difficultyFilter)
    if (typeFilter !== "all") params.append('test_type', typeFilter)
    params.append('page', currentPage.toString())
    params.append('page_size', PAGE_SIZE.toString())

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    axios.get(`${API_BASE_URL}/api/tests/?${params.toString()}`, { headers })
      .then(response => {
        setTests(response.data.results || [])
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        })
      })
      .catch(err => {
        console.error("Testlarni yuklashda xatolik:", err)
        let errorMsg = "Testlarni yuklashda xatolik yuz berdi."
        if (err.response?.status === 401 && token) {
          errorMsg = "Sessiya muddati tugagan yoki token yaroqsiz."
        } else if (err.response?.data?.detail) {
          errorMsg = err.response.data.detail
        }
        setError(errorMsg)
        setTests([])
        setPagination(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [searchTerm, subjectFilter, difficultyFilter, typeFilter, currentPage, token, PAGE_SIZE])

  useEffect(() => {
    fetchTests()
  }, [fetchTests])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleSubjectFilterChange = (value: string) => {
    setSubjectFilter(value)
    setCurrentPage(1)
  }

  const handleDifficultyFilterChange = (value: string) => {
    setDifficultyFilter(value)
    setCurrentPage(1)
  }

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value)
    setCurrentPage(1)
  }
  
  const handleStartTest = (testId: number) => {
    router.push(`/tests/take/${testId}`)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    if (pagination && newPage > Math.ceil(pagination.count / PAGE_SIZE)) return;
    setCurrentPage(newPage)
  }

  if (isLoading && tests.length === 0 && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Testlar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (error && tests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <CardTitle className="text-red-600">Xatolik!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={fetchTests} className="w-full">
              Qayta urinish
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Mavjud Testlar</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Test nomi bo'yicha qidirish..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <Select value={subjectFilter} onValueChange={handleSubjectFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Fan bo'yicha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha fanlar</SelectItem>
                  {Array.isArray(subjects) && subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={handleDifficultyFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Qiyinlik darajasi" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map((diff) => (
                    <SelectItem key={diff.value} value={diff.value}>
                      {diff.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Test turi" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((typeOpt) => (
                    <SelectItem key={typeOpt.value} value={typeOpt.value}>
                      {typeOpt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {isLoading && <div className="text-center py-6"><Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" /></div>}
        
        {!isLoading && error && tests.length > 0 && (
             <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center text-sm">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0"/>
                {error} Sinab ko'ring: <Button variant="link" size="sm" onClick={fetchTests} className="p-0 h-auto ml-1">qayta yuklash</Button>
            </div>
        )}

        {!isLoading && tests.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <Card key={test.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2 leading-tight">{test.title}</CardTitle>
                       <Badge 
                          variant={test.test_type === "premium" ? "destructive" : "secondary"}
                          className="ml-2 flex-shrink-0"
                        >
                          {test.type_display}
                        </Badge>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground pt-1">
                      {test.subject.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-1.5">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Qiyinlik:</span>
                      <span className="font-medium text-gray-700">{test.difficulty_display}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Savollar soni:</span>
                      <span className="font-medium text-gray-700">{test.question_count}</span>
                    </div>
                    {test.time_limit && (
                       <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Vaqt chegarasi:</span>
                        <span className="font-medium text-gray-700">{test.time_limit} daqiqa</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Narxi:</span>
                        <span className={`font-medium ${test.price === "0.00" || test.test_type === "free" ? "text-green-600" : "text-orange-600"}`}>
                            {test.price_display}
                        </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleStartTest(test.id)}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Testni Boshlash
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {pagination && pagination.count > PAGE_SIZE && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.previous || isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Oldingi
                </Button>
                <span className="text-sm text-muted-foreground">
                  Sahifa {currentPage} / {Math.ceil(pagination.count / PAGE_SIZE)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.next || isLoading}
                >
                  Keyingi <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          !isLoading && !error && (
            <div className="text-center py-10">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-muted-foreground">Testlar topilmadi</h2>
              <p className="text-muted-foreground">Tanlangan filtrlar bo'yicha testlar mavjud emas yoki testlar hali qo'shilmagan.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}