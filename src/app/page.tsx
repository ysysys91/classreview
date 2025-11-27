'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CoursesList from '@/components/CoursesList'
import ProfessorsList from '@/components/ProfessorsList'

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!keyword.trim()) return
    router.push(`/search?keyword=${keyword}`)
  }

  return (
    <div className="p-10 min-h-screen relative">
      <div className="absolute top-5 right-5">
        <Link href="/admin">
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            관리자 페이지
          </button>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-3xl font-bold mb-5">강의 검색</h1>
        <form onSubmit={handleSearch} className="flex mb-5">
          <input
            type="text"
            placeholder="강의명을 입력하세요"
            className="border p-2 mr-2 w-80"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            검색
          </button>
        </form>

        <div className="flex justify-between w-80 mt-5 items-start">
          <div className="flex flex-col space-y-2">
            <Link href="/courses" className="text-blue-600 hover:underline">
              → 강의 목록
            </Link>
            <CoursesList />
          </div>
          <div className="flex flex-col space-y-2">
            <Link href="/professors" className="text-blue-600 hover:underline">
              → 교수 목록
            </Link>

            <ProfessorsList />
          </div>
        </div>
      </div>
    </div>
  )
}
