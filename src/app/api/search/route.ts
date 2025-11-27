import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Lecture from '@/models/Lecture'

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB()

    const keyword = req.nextUrl.searchParams.get('keyword') || ''

    const lectures = await Lecture.find({
      name: { $regex: keyword, $options: 'i' },
    })

    return NextResponse.json(lectures)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
