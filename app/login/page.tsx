import { redirect } from "next/navigation"
import pool from "@/config/db.js"
import { createSession } from "@/lib/session";

export default function Login() {
  async function createAccount(formData: FormData) {
    'use server';

    const username = formData.get('username') as string;

    let userId;

    try{
      const [rows] = await pool.execute(
        'SELECT id, username FROM accounts WHERE username = ?',
        [username]
      )
      const users = rows as any[];
      if(users.length == 0){
        console.error("User does not exist.")
        return;
      }
      userId = users[0].id;
    } catch (error) {
      console.error("error: ", error);
      return;
    }
    await createSession(userId);
    redirect('/');
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="border border-gray-300 p-4 rounded-lg bg-white min-w-100">
        <p className="text-xl font-bold text-center">
          Log In
        </p>
        <form action={createAccount} className="flex flex-col gap-1 pt-6">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username" required/>
          <label htmlFor="type" className="mt-6">Account type</label>
          <button type="submit" className="bg-emerald-800/75 rounded-lg py-2 hover:bg-emerald-800 transition-all text-white">Log In</button>
        </form>
      </div>
    </div>
  );
}
