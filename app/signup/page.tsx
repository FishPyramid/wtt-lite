import { redirect } from "next/navigation"

export default function Home() {
  async function createAccount(formData: FormData) {
    'use server';

    const username = formData.get('username') as string;
    const type = formData.get('type') as string;

    redirect('/dashboard')
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="border border-gray-300 p-4 rounded-lg">
        <p className="text-xl font-bold text-center">
          Create Account
        </p>
        <form action="{createAccount}" className="flex flex-col gap-1 pt-6">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username" required/>
          <label htmlFor="type" className="mt-6">Account type</label>
          <select id="type" name="type" className="mb-6">
            <option value="sponsor">Sponsor</option>
            <option value="student">Student</option>
            <option value="administrator">Administrator</option>
          </select>
          <button type="submit" className="bg-green-300 rounded-lg">Create Account</button>
        </form>
      </div>
    </div>
  );
}
