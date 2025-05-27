import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bilimdon Abituriyent</h1>
          <p className="text-gray-600 mt-2">Ta'lim platformasiga xush kelibsiz</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
