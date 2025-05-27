"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CreditCard, Wallet } from "lucide-react"
import { motion } from "framer-motion"

export default function PaymentsAddPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialAmount = searchParams.get("amount") || ""

  const [amount, setAmount] = useState(initialAmount)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleAmountSelect = (value: string) => {
    setAmount(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/profile")
      }, 2000)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-green-600">To'lov muvaffaqiyatli amalga oshirildi</CardTitle>
              <CardDescription className="text-center">Hisobingiz muvaffaqiyatli to'ldirildi</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-2xl font-bold mb-2">{Number.parseInt(amount).toLocaleString()} so'm</p>
              <p className="text-gray-500 mb-4">Hisobingizga qo'shildi</p>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                className="h-2 bg-green-500 rounded-full mb-4"
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/profile")}>
                Profilga qaytish
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-md">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/profile")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>
          <h1 className="text-2xl font-bold">Hisobni to'ldirish</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>To'lov ma'lumotlari</CardTitle>
            <CardDescription>Hisobingizni to'ldirish uchun ma'lumotlarni kiriting</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Summa</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={amount === "10000" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col"
                      onClick={() => handleAmountSelect("10000")}
                    >
                      <span className="text-lg font-bold">10,000</span>
                      <span className="text-sm text-gray-500">so'm</span>
                    </Button>
                    <Button
                      type="button"
                      variant={amount === "50000" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col"
                      onClick={() => handleAmountSelect("50000")}
                    >
                      <span className="text-lg font-bold">50,000</span>
                      <span className="text-sm text-gray-500">so'm</span>
                    </Button>
                    <Button
                      type="button"
                      variant={amount === "100000" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col"
                      onClick={() => handleAmountSelect("100000")}
                    >
                      <span className="text-lg font-bold">100,000</span>
                      <span className="text-sm text-gray-500">so'm</span>
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="custom-amount">Boshqa summa</Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Summani kiriting"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1000"
                      step="1000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>To'lov usuli</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
                        Bank kartasi
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Karta raqami</Label>
                      <Input
                        id="card-number"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry-date">Amal qilish muddati</Label>
                        <Input
                          id="expiry-date"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="***"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button className="w-full mt-6" type="submit" disabled={isProcessing || !amount}>
                {isProcessing ? "To'lov amalga oshirilmoqda..." : "To'lash"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

