'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Course = {
  _id: string
  title: string
  code: string
  credits: number
  professor?: {
    _id: string
    name: string
  }
}

export default function CourseDetailPage() {
  const params = useParams()
  const id = params?.id || ''
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => setCourse(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-10">로딩중...</p>
  if (!course)
    return <p className="p-10 text-red-500">존재하지 않는 강의입니다.</p>

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-5">{course.title}</h1>
      <p>
        <strong>코드:</strong> {course.code}
      </p>
      <p>
        <strong>학점:</strong> {course.credits}
      </p>
      <p>
        <strong>담당 교수:</strong>{' '}
        {course.professor ? (
          <Link
            href={`/professors/${course.professor._id}`}
            className="text-blue-600 hover:underline"
          >
            {course.professor.name}
          </Link>
        ) : (
          '정보 없음'
        )}
      </p>
    </div>
  )
}
