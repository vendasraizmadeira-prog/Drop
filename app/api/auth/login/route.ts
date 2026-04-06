import { NextRequest, NextResponse } from 'next/server'
import { createSession, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const validUser = process.env.ADMIN_USERNAME || 'admin'
    const validPass = process.env.ADMIN_PASSWORD || '123456'

    if (username !== validUser || password !== validPass) {
      return NextResponse.json(
        { message: 'Usuário ou senha inválidos' },
        { status: 401 }
      )
    }

    const token = await createSession(username)

    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
