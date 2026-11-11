import { getSession } from "@/lib/session";
import Sidebar from "./Sidebar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import pool from "@/config/db";

export default async function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
    const userId = await getSession();
    const isLoggedIn = !!userId;
    let username
    let usertype
    if (isLoggedIn){
        const [rows] = await pool.execute(
        'SELECT id, username, type FROM accounts WHERE id = ?',
        [userId]
        )
        const users = rows as any[];
        if(users.length == 0){
            console.error("User does not exist.")
            return;
        }
        username = users[0].username;
        usertype = users[0].type;
    }
    async function handleLogout() {
        'use server';
        const cookieStore = await cookies();
        cookieStore.delete('session_user_id');
        redirect('/');
    }
    return (
        <Sidebar isLoggedIn={isLoggedIn} logoutFunction={handleLogout} username={username} usertype={usertype}>
            {children}
        </Sidebar>
    )
}