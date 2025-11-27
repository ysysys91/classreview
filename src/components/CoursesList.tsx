'use client'

import React, { useEffect, useState } from 'react'
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

interface CoursesListProps {
  keyword?: string
}

export default function CoursesList({ keyword = '' }: CoursesListProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses${query}`)
      .then((res) => {
        if (!res.ok) throw new Error('데이터 조회 실패')
        return res.json()
      })
      .then((data) => {
        const formatted = (data.courses || data).map((c: any) => ({
          ...c,
          _id: c._id.toString(),
        }))
        setCourses(formatted)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [keyword])

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>오류: {error}</p>
  if (courses.length === 0) return <p>검색 결과가 없습니다.</p>

  return (
    <ul className="space-y-2">
      {courses.map((course) => (
        <li key={course._id}>
          <Link href={`/courses/${course._id}`}>
            <p>
              <strong>{course.title}</strong> ({course.code}) - {course.credits}
              학점 - 담당 교수: {course.professor?.name || '정보 없음'}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
