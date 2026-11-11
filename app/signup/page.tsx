import { redirect } from "next/navigation"
import pool from "@/config/db.js"
import { createSession } from "@/lib/session";

export default function Signup() {
  async function createAccount(formData: FormData) {
    'use server';

    const username = formData.get('username') as string;
    const type = formData.get('type') as string;

    let userId;

    try{
      const [result] = await pool.execute(
        'INSERT INTO accounts (username, type) VALUES (?, ?)',
        [username, type]
      )
      userId = (result as any).insertId;
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
          Create Account
        </p>
        <form action={createAccount} className="flex flex-col gap-1 pt-6">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username" required/>
          <label htmlFor="type" className="mt-6">Account type</label>
          <select id="type" name="type" className="mb-6">
            <option value="sponsor">Sponsor</option>
            <option value="student">Student</option>
            <option value="administrator">Administrator</option>
          </select>
          <button type="submit" className="bg-emerald-800/75 rounded-lg py-2 hover:bg-emerald-800 transition-all text-white">Create Account</button>
        </form>
      </div>
    </div>
  );
}
