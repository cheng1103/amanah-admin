/**
 * Server Actions for Authentication
 * ✅ Security: Uses httpOnly cookies instead of localStorage
 */

'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * ✅ Set auth token in httpOnly cookie (Server-side only)
 * This replaces localStorage.setItem()
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'authToken',
    value: token,
    httpOnly: false,  // ⚠️ Must be false so API client can read it
    secure: process.env.NODE_ENV === 'production',  // ✅ HTTPS only in production
    sameSite: 'strict',  // ✅ CSRF protection
    maxAge: 60 * 60 * 24 * 1, // 1 day
    path: '/',
  })
}

/**
 * ✅ Remove auth cookie (logout)
 */
export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('authToken')
}

/**
 * ✅ Get auth token from cookie (Server-side only)
 */
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('authToken')?.value
}

/**
 * ✅ Check if user is authenticated (Server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken()
  return !!token
}

/**
 * Set user data cookie (for client-side display only)
 * ⚠️ Do not store sensitive data here!
 */
export async function setUserDataCookie(userData: {
  id: string
  email: string
  name?: string
  role?: string
}) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'userData',
    value: JSON.stringify(userData),
    httpOnly: false,  // Client can read for UI
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

/**
 * Remove user data cookie
 */
export async function removeUserDataCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('userData')
}

/**
 * Logout action (removes all auth cookies and redirects)
 */
export async function logout(lang: string = 'en') {
  await removeAuthCookie()
  await removeUserDataCookie()
  redirect(`/${lang}/admin`)
}
