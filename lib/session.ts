import { cookies } from "next/headers"

export async function createSession(userId: string | number) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'session_user_id',
        value: String(userId),
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    })
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session_user_id');
  return session ? session.value : null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session_user_id');
}