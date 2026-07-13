'use server'

import { COOKIE_KEYS } from '@/api/cookie'
import { cookies } from 'next/headers'


export async function getCookie(name: string) {
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies()
  cookieStore.delete(name)
  cookieStore.delete("bs_logged_in")
  cookieStore.delete("bs_access_token")
}

export async function createSession(access: string, refresh: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_KEYS.ACCESS_TOKEN, access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  cookieStore.set(COOKIE_KEYS.REFRESH_TOKEN, refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  cookieStore.set("bs_logged_in", "true", {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  cookieStore.set("bs_access_token", access, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}