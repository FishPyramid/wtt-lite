import { getSession } from "@/lib/session";
import pool from "@/config/db.js";
import CreatePostModal from "@/components/CreatePostModal";
import { revalidatePath } from "next/cache";

export default async function SponsorPostSection() {
  const userId = await getSession(); // getSession returns the ID directly

  let isSponsor = false;

  if (userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT type FROM accounts WHERE id = ?',
        [userId]
      );
      const users = rows as any[];
      if (users.length > 0 && users[0].type === 'sponsor') {
        isSponsor = true;
      }
    } catch (error) {
      console.error("Failed to fetch user type:", error);
    }
  }

  // Server action to handle saving the post
  async function handleCreatePost(formData: FormData) {
    'use server';
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const currentUserId = await getSession();
    
    if (!currentUserId) return;

    try {
      await pool.execute(
        'INSERT INTO posts (user_id, title, description) VALUES (?, ?, ?)',
        [currentUserId, title, description]
      );
      revalidatePath('/');
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  // Only render the modal/button if they are a sponsor
  if (!isSponsor) return null;

  return <CreatePostModal createPostAction={handleCreatePost} />;
}