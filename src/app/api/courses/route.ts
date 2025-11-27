import connectMongoDB from '@/libs/mongodb'
import Course from '@/models/course'
import Professor from '@/models/professor'
import Evaluation from '@/models/evaluation'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/libs/auth'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { title, code, professor, credits } = await request.json()
    if (!title || !code || !professor || !credits) {
      return NextResponse.json(
        { message: '과목명, 코드, 교수ID, 학점은 필수입니다.' },
        { status: 400 }
      )
    }
    await connectMongoDB()
    const professorExists = await Professor.exists({ _id: professor })
    if (!professorExists) {
      return NextResponse.json(
        { message: '유효하지 않은 교수 ID 입니다.' },
        { status: 400 }
      )
    }
    await Course.create({ title, code, professor, credits })
    return NextResponse.json({ message: '과목 생성됨' }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'unauthorized') {
        return NextResponse.json(
          { message: '로그인이 필요합니다' },
          { status: 401 }
        )
      }
      if (error.message === 'forbidden') {
        return NextResponse.json(
          { message: '관리자 권한이 필요합니다' },
          { status: 403 }
        )
      }
    }
    console.error('POST 오류 발생 /api/courses :', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// 🔹 GET 함수 수정: keyword 적용
export async function GET(request: NextRequest) {
  try {
    await connectMongoDB()

    const keyword = request.nextUrl.searchParams.get('keyword') || ''

    let query = {}
    if (keyword) {
      // MongoDB 정규식으로 강의명 부분 검색
      query = { title: { $regex: keyword, $options: 'i' } }
    }

    const courses = await Course.find(query).populate('professor')

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('GET 오류 발생 /api/courses :', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request) // 관리자 권한 체크

    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'ID가 필요합니다' }, { status: 400 })
    }

    await connectMongoDB()

    const course = await Course.findById(id)
    if (!course) {
      return NextResponse.json(
        { message: '강의를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    await Evaluation.deleteMany({ course: id })
    await Course.findByIdAndDelete(id)

    return NextResponse.json({
      message: '강의와 해당 강의 평가들이 삭제되었습니다',
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'unauthorized') {
        return NextResponse.json(
          { message: '로그인이 필요합니다' },
          { status: 401 }
        )
      }
      if (error.message === 'forbidden') {
        return NextResponse.json(
          { message: '관리자 권한이 필요합니다' },
          { status: 403 }
        )
      }
    }
    console.error('DELETE 오류:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
