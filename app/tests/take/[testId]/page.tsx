"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import axios, { CancelTokenSource, AxiosError } from "axios";
import {
  Clock,
  HelpCircle,
  BarChart2,
  Tag,
  Award,
  Calendar,
  Info,
  ListChecks,
  AlertTriangle,
  Loader2,
  PlayCircle,
  ShieldCheck,
  CheckCircle,
  XCircle,
  LogIn,
  Send,
  RefreshCw,
} from "lucide-react";

interface Subject {
  id: number;
  name: string;
  icon: string | null;
}
interface QuestionDetailForInfo {
  id: number;
  order: number;
  question_text: string;
  difficulty: string;
  difficulty_display: string;
  points: number;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}
interface TestDetailData {
  id: number;
  title: string;
  subject: Subject;
  test_type: string;
  type_display: string;
  question_count: number;
  difficulty: string;
  difficulty_display: string;
  price: string;
  price_display: string;
  time_limit: number;
  reward_points: number;
  status: string;
  status_display: string;
  created_at: string;
  description: string;
  questions: QuestionDetailForInfo[];
}
interface QuestionFromResult {
  id: number;
  order: number;
  question_text: string;
  difficulty_display: string;
  points: number;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
}
interface UserAnswerDetail {
  question: QuestionFromResult;
  selected_answer: string | null;
  is_correct: boolean;
}
interface UserTestResultData {
  id: number;
  user: number;
  test: TestDetailData;
  score: number;
  score_display: string;
  total_questions: number;
  percentage: number;
  start_time: string;
  end_time: string;
  time_spent_display: string;
  status_display: string;
  user_answers: UserAnswerDetail[];
}
interface ActualParamsType {
  testId: string;
}
interface TestDetailPageProps {
  params: Promise<ActualParamsType> | ActualParamsType;
}

interface SelectedAnswers {
  [questionId: string]: string | null;
}

export default function TestDetailPage({
  params: paramsProp,
}: TestDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(paramsProp as Promise<ActualParamsType>);
  const { testId } = resolvedParams;

  const [testInfo, setTestInfo] = useState<TestDetailData | null>(null);
  const [userResult, setUserResult] = useState<UserTestResultData | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [isLoadingResult, setIsLoadingResult] = useState(true);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [isTakingTest, setIsTakingTest] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    let infoSource: CancelTokenSource | null = null;
    let resultSource: CancelTokenSource | null = null;

    const fetchTestInfo = async () => {
      if (
        !testId ||
        typeof testId !== "string" ||
        testId.trim() === "" ||
        testId === "undefined"
      ) {
        setInfoError("Noto'g'ri Test ID formati.");
        setIsLoadingInfo(false);
        return;
      }
      setIsLoadingInfo(true);
      setInfoError(null);
      setTestInfo(null);
      infoSource = axios.CancelToken.source();
      try {
        const response = await axios.get<TestDetailData>(
          `https://testonline.pythonanywhere.com/api/tests/${testId}/`,
          { cancelToken: infoSource.token }
        );
        setTestInfo(response.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        const axiosError = err as AxiosError<{ detail?: string }>;
        if (axiosError.response?.status === 404)
          setInfoError(`Bunday ID (${testId}) bilan test ma'lumoti topilmadi.`);
        else
          setInfoError(
            axiosError.response?.data?.detail ||
              axiosError.message ||
              "Test ma'lumotlarini yuklashda xatolik."
          );
      } finally {
        if (infoSource && !axios.isCancel(infoSource.token?.reason))
          setIsLoadingInfo(false);
      }
    };

    const fetchTestResult = async () => {
      if (
        !testId ||
        typeof testId !== "string" ||
        testId.trim() === "" ||
        testId === "undefined"
      ) {
        setIsLoadingResult(false);
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoadingResult(false);
        setShowLoginPrompt(false);
        return;
      }
      setIsLoadingResult(true);
      setResultError(null);
      setUserResult(null);
      setShowLoginPrompt(false);
      resultSource = axios.CancelToken.source();
      try {
        const response = await axios.get<UserTestResultData>(
          `https://testonline.pythonanywhere.com/api/tests/${testId}/results/`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cancelToken: resultSource.token,
          }
        );
        setUserResult(response.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        const axiosError = err as AxiosError<{
          detail?: string;
          code?: string;
          messages?: any[];
        }>;
        if (axiosError.response?.status === 401) {
          if (axiosError.response?.data?.code === "token_not_valid") {
            setResultError("Sessiyangiz muddati tugagan. Qayta kiring.");
            localStorage.removeItem("token");
            setShowLoginPrompt(true);
          } else {
            setResultError("Avtorizatsiya xatoligi. Ruxsat yo'q.");
            setShowLoginPrompt(true);
          }
        } else if (axiosError.response?.status === 404) {
          setResultError(null);
        } else
          setResultError(
            axiosError.response?.data?.detail ||
              axiosError.message ||
              "Test natijalarini yuklashda xatolik."
          );
      } finally {
        if (resultSource && !axios.isCancel(resultSource.token?.reason))
          setIsLoadingResult(false);
      }
    };

    if (!isTakingTest) {
      fetchTestInfo();
      fetchTestResult();
    }

    return () => {
      infoSource?.cancel();
      resultSource?.cancel();
    };
  }, [testId, isTakingTest]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleStartOrRetryTest = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setResultError("Testni yechish uchun tizimga kiring.");
      setShowLoginPrompt(true);
      return;
    }
    setUserResult(null);
    setResultError(null);
    setShowLoginPrompt(false);
    setIsTakingTest(true);
    setSelectedAnswers({});
    setSubmissionError(null);
  };

  const handleSubmitAnswers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSubmissionError("Javoblarni yuborish uchun tizimga kiring.");
      setShowLoginPrompt(true);
      return;
    }
    if (!testInfo || Object.keys(selectedAnswers).length === 0) {
      setSubmissionError("Iltimos, kamida bitta savolga javob bering.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const answersToSubmit: { [key: string]: string | null } = {};
    testInfo.questions.forEach((q) => {
      answersToSubmit[q.id.toString()] =
        selectedAnswers[q.id.toString()] || null;
    });

    try {
      const response = await axios.post<UserTestResultData>(
        `https://testonline.pythonanywhere.com/api/tests/${testId}/submit/`,
        { answers: answersToSubmit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserResult(response.data);
      setIsTakingTest(false);
      setResultError(null);
    } catch (err) {
      const axiosError = err as AxiosError<{
        detail?: string;
        answers?: string[];
        code?: string;
      }>;
      if (axiosError.response?.status === 401) {
        setSubmissionError(
          "Sessiyangiz muddati tugagan yoki token yaroqsiz. Qayta kiring."
        );
        localStorage.removeItem("token");
        setShowLoginPrompt(true);
      } else if (axiosError.response?.status === 400) {
        let errorMsg = "Javoblarni yuborishda xatolik: ";
        if (axiosError.response?.data?.detail)
          errorMsg += axiosError.response.data.detail;
        else if (axiosError.response?.data?.answers)
          errorMsg += axiosError.response.data.answers.join(", ");
        else errorMsg += "Noto'g'ri so'rov formati.";
        setSubmissionError(errorMsg);
      } else {
        setSubmissionError(
          axiosError.message ||
            "Javoblarni yuborishda noma'lum xatolik yuz berdi."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Noma'lum sana";
    try {
      return new Date(dateString).toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Noto'g'ri sana formati";
    }
  };
  const getQuestionOptions = (
    question: QuestionDetailForInfo | QuestionFromResult
  ) => {
    return [
      { label: "A", text: question.option_a },
      { label: "B", text: question.option_b },
      { label: "C", text: question.option_c },
      { label: "D", text: question.option_d },
    ].filter((opt) => opt.text);
  };
  const DetailItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
  }> = ({ icon, label, value }) => (
    <div className="flex items-center p-3 bg-slate-50 rounded-md border border-slate-200">
      <div className="mr-3 shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );

  if (isLoadingInfo && !isTakingTest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-slate-50 text-slate-700">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg font-semibold">Yuklanmoqda...</p>
      </div>
    );
  }
  if (infoError && !testInfo && !isTakingTest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-red-50 p-4 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-xl font-semibold text-red-700">Xatolik!</p>
        <p className="text-red-600">{infoError}</p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Ortga
        </button>
      </div>
    );
  }
  if (!testInfo && !isTakingTest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-slate-50 text-slate-700">
        <Info className="h-12 w-12 text-slate-500" />
        <p className="mt-4 text-lg font-semibold">
          Test ma'lumotlari topilmadi.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Ortga
        </button>
      </div>
    );
  }

  const domainForMedia = "https://testonline.pythonanywhere.com";

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {!isTakingTest && !userResult && testInfo && (
          <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 mb-8 border-t-4 border-blue-600">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center sm:text-left">
              {testInfo.title}
            </h1>
            <p className="text-blue-600 font-semibold text-lg mb-4 text-center sm:text-left">
              {testInfo.subject.name}
            </p>
            {testInfo.subject.icon && (
              <div className="flex justify-center sm:justify-start mb-4">
                <img
                  src={
                    testInfo.subject.icon.startsWith("http")
                      ? testInfo.subject.icon
                      : `${domainForMedia}${testInfo.subject.icon}`
                  }
                  alt={testInfo.subject.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-blue-200 p-1"
                />
              </div>
            )}
            {testInfo.description && (
              <div className="mb-6 p-4 bg-slate-50 rounded-md border border-slate-200">
                <div className="flex items-center text-slate-700 mb-1">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  <h2 className="text-lg font-semibold">Test Haqida</h2>
                </div>
                <p className="text-slate-600 text-sm sm:text-base">
                  {testInfo.description}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm sm:text-base">
              <DetailItem
                icon={<ListChecks />}
                label="Savollar soni"
                value={testInfo.question_count}
              />
              <DetailItem
                icon={<Clock />}
                label="Vaqt chegarasi"
                value={`${testInfo.time_limit} daqiqa`}
              />
              <DetailItem
                icon={<BarChart2 />}
                label="Qiyinlik"
                value={testInfo.difficulty_display}
              />
              <DetailItem
                icon={<Tag />}
                label="Test turi"
                value={testInfo.type_display}
              />
              <DetailItem
                icon={<Award />}
                label="Mukofot ballari"
                value={testInfo.reward_points}
              />
              <DetailItem
                icon={<ShieldCheck />}
                label="Holati"
                value={testInfo.status_display}
              />
              <DetailItem
                icon={<Calendar />}
                label="Yaratilgan"
                value={formatDate(testInfo.created_at)}
              />
              <DetailItem
                icon={<Tag />}
                label="Narxi"
                value={testInfo.price_display}
              />
            </div>
            {!userResult &&
              !isLoadingResult &&
              !showLoginPrompt &&
              testInfo.status === "active" && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleStartOrRetryTest}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" /> Testni Boshlash
                  </button>
                </div>
              )}
            {testInfo.status !== "active" && (
              <p className="text-sm text-center text-yellow-600 mt-4">
                Bu test hozircha faol emas.
              </p>
            )}
          </div>
        )}

        {isTakingTest && testInfo && (
          <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 mb-8 border-t-4 border-orange-500">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 text-center">
              {testInfo.title} - Test Yechish
            </h2>
            <div className="space-y-8">
              {testInfo.questions.map((question, qIndex) => (
                <div
                  key={question.id}
                  className="p-4 border border-slate-200 rounded-lg"
                >
                  <p className="font-semibold text-slate-800 mb-4">
                    <span className="text-orange-600">{qIndex + 1}.</span>{" "}
                    {question.question_text}
                  </p>
                  <div className="space-y-2">
                    {getQuestionOptions(question).map((option) => (
                      <label
                        key={option.label}
                        className="flex items-center p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.label}
                          checked={
                            selectedAnswers[question.id.toString()] ===
                            option.label
                          }
                          onChange={() =>
                            handleAnswerChange(
                              question.id.toString(),
                              option.label
                            )
                          }
                          className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-3 text-slate-700">
                          {option.label}) {option.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {submissionError && (
              <div
                className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Xatolik: </strong>
                <span className="block sm:inline">{submissionError}</span>
              </div>
            )}
            <div className="mt-8 text-center">
              <button
                onClick={handleSubmitAnswers}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {isSubmitting ? "Yuborilmoqda..." : "Javoblarni Yuborish"}
              </button>
            </div>
          </div>
        )}

        {isLoadingResult && !isTakingTest && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="mt-3 text-slate-600">Natijalar yuklanmoqda...</p>
          </div>
        )}
        {resultError && !isLoadingResult && !isTakingTest && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-md shadow">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{resultError}</p>
                {showLoginPrompt && (
                  <button
                    onClick={() => router.push("/login")}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <LogIn className="mr-1.5 h-4 w-4" /> Tizimga kirish
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {userResult && !isLoadingResult && !isTakingTest && (
          <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 mb-8 border-t-4 border-green-600">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center sm:text-left">
                Sizning Natijangiz
              </h2>
              {testInfo &&
                testInfo.status === "active" && ( // Faqat aktiv testlar uchun qayta yechish
                  <button
                    onClick={handleStartOrRetryTest}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Qayta Yechish
                  </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-center md:text-left">
              <div>
                <p className="text-sm text-slate-500">Test Nomi</p>
                <p className="text-lg font-semibold text-slate-700">
                  {userResult.test.title}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">To'plangan Ball</p>
                <p className="text-2xl font-bold text-green-600">
                  {userResult.score_display}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Foizda</p>
                <p className="text-lg font-semibold text-slate-700">
                  {userResult.percentage.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Sarflangan Vaqt</p>
                <p className="text-lg font-semibold text-slate-700">
                  {userResult.time_spent_display}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Holati</p>
                <p className="text-lg font-semibold text-slate-700">
                  {userResult.status_display}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tugatilgan Sana</p>
                <p className="text-lg font-semibold text-slate-700">
                  {formatDate(userResult.end_time)}
                </p>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mt-8 mb-4">
              Javoblar Tafsiloti:
            </h3>
            <div className="space-y-6">
              {userResult.user_answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    answer.is_correct
                      ? "border-green-300 bg-green-50/50"
                      : "border-red-300 bg-red-50/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-slate-800">
                      <span className="text-blue-600">
                        {answer.question.order}.
                      </span>{" "}
                      {answer.question.question_text}
                    </p>
                    {answer.is_correct ? (
                      <CheckCircle className="h-6 w-6 text-green-500 shrink-0 ml-2" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500 shrink-0 ml-2" />
                    )}
                  </div>
                  <div className="text-sm space-y-1 mb-2">
                    <p>
                      <strong>Sizning javobingiz:</strong>{" "}
                      <span
                        className={
                          answer.is_correct ? "text-green-700" : "text-red-700"
                        }
                      >
                        {answer.selected_answer || "Javob berilmagan"}
                      </span>
                    </p>
                    {!answer.is_correct && (
                      <p>
                        <strong>To'g'ri javob:</strong>{" "}
                        <span className="text-green-700">
                          {answer.question.correct_answer}
                        </span>
                      </p>
                    )}
                  </div>
                  {answer.question.explanation && (
                    <div className="mt-2 p-2 text-xs bg-slate-100 border border-slate-200 rounded">
                      <strong>Izoh:</strong> {answer.question.explanation}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-slate-500 text-right">
                    Ball: {answer.question.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <footer className="mt-12 text-center text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} "Bilimdon Abituriyent" Platformasi.
            Barcha huquqlar himoyalangan.
          </p>
        </footer>
      </div>
    </div>
  );
}
