'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Course {
  _id: string
  title: string
  code: string
  credits: number
  professor: {
    name: string
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword') || ''

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!keyword) return
    setLoading(true)
    setError(null)

    fetch(`/api/courses?keyword=${encodeURIComponent(keyword)}`)
      .then((res) => {
        if (!res.ok) throw new Error('데이터 조회 실패')
        return res.json()
      })
      .then((data) => {
        // API가 { courses: [...] } 형태라면 아래처럼 접근
        const courseArray: Course[] = Array.isArray(data)
          ? data
          : data.courses || []
        setCourses(courseArray)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [keyword])

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>오류: {error}</p>

  return (
    <div className="p-10 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-5">검색 결과: "{keyword}"</h1>
      <Link
        href="/"
        className="mb-5 text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
      >
        홈으로 이동
      </Link>
      {courses.length === 0 ? (
        <p className="text-red-500 font-semibold">강의를 찾을 수 없습니다.</p>
      ) : (
        <ul className="space-y-2 w-80">
          {courses.map((course) => (
            <li key={course._id}>
              <Link
                href={`/courses/${course._id}`}
                className="text-blue-600 hover:underline"
              >
                <strong>{course.title}</strong> ({course.code}) -{' '}
                {course.credits}학점 - 담당 교수:{' '}
                {course.professor?.name || '정보 없음'}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
