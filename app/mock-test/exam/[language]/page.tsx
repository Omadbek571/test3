"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { motion } from "framer-motion"

export default function MockTestLanguagePage({ params }: { params: { language: string } }) {
  const router = useRouter()
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedTest, setSelectedTest] = useState<number | null>(null)
  const [userBalance, setUserBalance] = useState(100000) // Mock balance
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)

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

  // Load user balance from localStorage
  useEffect(() => {
    const storedBalance = localStorage.getItem("userBalance")
    if (storedBalance) {
      setUserBalance(Number(storedBalance))
    }
  }, [])

  // Mock test data
  const mockTests = {
    english: [
      {
        id: 1,
        title: "IELTS Mock Test 1",
        date: "2023-05-15",
        completed: false,
        price: 50000,
        description:
          "Bu test IELTS imtihonining to'liq simulyatsiyasi bo'lib, barcha bo'limlarni o'z ichiga oladi: Listening, Reading, Writing va Speaking.",
      },
      {
        id: 2,
        title: "IELTS Mock Test 2",
        date: "2023-05-22",
        completed: false,
        price: 50000,
        description:
          "Bu test IELTS imtihonining to'liq simulyatsiyasi bo'lib, barcha bo'limlarni o'z ichiga oladi: Listening, Reading, Writing va Speaking.",
      },
      {
        id: 3,
        title: "IELTS Mock Test 3",
        date: "2023-05-29",
        completed: false,
        price: 50000,
        description:
          "Bu test IELTS imtihonining to'liq simulyatsiyasi bo'lib, barcha bo'limlarni o'z ichiga oladi: Listening, Reading, Writing va Speaking.",
      },
      {
        id: 4,
        title: "IELTS Mock Test 4",
        date: "2023-06-15",
        completed: false,
        price: 50000,
        description:
          "Bu test IELTS imtihonining to'liq simulyatsiyasi bo'lib, barcha bo'limlarni o'z ichiga oladi: Listening, Reading, Writing va Speaking.",
      },
    ],
    turkish: [
      {
        id: 1,
        title: "Türkçe Seviye Testi 1",
        date: "2023-05-18",
        completed: false,
        price: 50000,
        description:
          "Bu test Turk tili imtihonining to'liq simulyatsiyasi bo'lib, barcha bo'limlarni o'z ichiga oladi: Tinglash, O'qish, Yozish va Gapirish.",
      },
      {
        id: 2,
        title: "Türkçe Seviye Testi 2",
        date: "2023-05-25",
        completed: false,
        price: 50000,
        description:
          "Bu test Turk tili imtihonining to'liq simulyatsiyasi bo'lib, barcha bo'limlarni o'z ichiga oladi: Tinglash, O'qish, Yozish va Gapirish.",
      },
      {
        id: 3,
        title: "Türkçe Seviye Testi 3",
        date: "2023-06-20",
        completed: false,
        price: 50000,
        description:
          "Bu test Turk tili imtihonining to'liq simulyatsiyasi bo'lib, barcha bo'limlarni o'z ichiga oladi: Tinglash, O'qish, Yozish va Gapirish.",
      },
    ],
    arabic: [
      {
        id: 1,
        title: "اختبار اللغة العربية 1",
        date: "2023-05-20",
        completed: false,
        price: 50000,
        description:
          "Bu test Arab tili imtihonining to'liq simulyatsiyasi bo'lib, barcha bo'limlarni o'z ichiga oladi: Tinglash, O'qish, Yozish va Gapirish.",
      },
      {
        id: 2,
        title: "اختبار اللغة العربية 2",
        date: "2023-06-25",
        completed: false,
        price: 50000,
        description:
          "Bu test Arab tili imtihonining to'liq simulyatsiyasi bo'lib, barcha bo'limlarni o'z ichiga oladi: Tinglash, O'qish, Yozish va Gapirish.",
      },
    ],
  }

  const tests = mockTests[params.language as keyof typeof mockTests] || []

  const handleStartTest = (testId: number) => {
    setSelectedTest(testId)
    setShowPaymentDialog(true)
  }

  const handleConfirmPayment = () => {
    // Deduct the payment from balance
    const newBalance = userBalance - 50000
    setUserBalance(newBalance)
    localStorage.setItem("userBalance", newBalance.toString())

    // Close the dialog
    setShowPaymentDialog(false)
    setShowPaymentSuccess(true)

    // Navigate to the exam page after showing payment success
    setTimeout(() => {
      if (selectedTest) {
        router.push(`/mock-test/exam/${params.language}/${selectedTest}`)
      }
    }, 2000)
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

  if (showPaymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              To'lov muvaffaqiyatli amalga oshirildi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            <p>
              Hisobingizdan <strong>50,000 so'm</strong> yechib olindi.
            </p>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-2 bg-green-500 rounded-full mt-6"
            />
            <p className="mt-4">Test boshlanmoqda...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/mock-test")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">{getLanguageName(params.language)} Mock Testlari</h1>
        </div>

        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            Mock testlarni topshirish uchun hisobingizda yetarli mablag' bo'lishi kerak. Har bir test narxi: 50,000
            so'm.
          </AlertDescription>
        </Alert>

        <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
          {tests.map((test) => (
            <motion.div key={test.id} variants={item}>
              <Card className="border hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{test.title}</CardTitle>
                  <CardDescription>{new Date(test.date).toLocaleDateString("uz-UZ")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{test.description}</p>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">{test.price.toLocaleString()} so'm</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleStartTest(test.id)}>Testni boshlash</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

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
              <AlertDialogAction onClick={handleConfirmPayment} disabled={userBalance < 50000}>
                {userBalance < 50000 ? "Mablag' yetarli emas" : "Roziman"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

