import pool from "@/config/db.js";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/session";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function PostDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rawUserId = await getSession();
  const currentUserId = rawUserId ? Number(rawUserId) : null; 

  let post = null;
  let currentUserType = null;
  let applicants: any[] = [];
  let hasApplied = false;

  try {
    // 1. Fetch post and author info
    const [postRows] = await pool.execute(
      `SELECT posts.id, posts.user_id AS sponsor_id, posts.title, posts.description, posts.created_at, accounts.username 
       FROM posts 
       JOIN accounts ON posts.user_id = accounts.id 
       WHERE posts.id = ?`,
      [id]
    );
    const posts = postRows as any[];
    if (posts.length > 0) {
      post = posts[0];
    }

    if (!post) notFound();

    // 2. Fetch current user role
    if (currentUserId) {
      const [userRows] = await pool.execute(
        `SELECT type FROM accounts WHERE id = ?`,
        [currentUserId]
      );
      const users = userRows as any[];
      if (users.length > 0) {
        // Normalize role to lowercase (e.g. 'Sponsor' -> 'sponsor')
        currentUserType = String(users[0].type).toLowerCase().trim(); 
      }

      // Check if student has already applied
      if (currentUserType === 'student') {
        const [appRows] = await pool.execute(
          `SELECT id FROM applications WHERE post_id = ? AND user_id = ?`,
          [id, currentUserId]
        );
        hasApplied = (appRows as any[]).length > 0;
      }

      // 3. Check ownership and permissions safely
      const isOwner = Number(post.sponsor_id) === currentUserId;
      const isAdmin = currentUserType === 'administrator';
      const isSponsor = currentUserType === 'sponsor';

      // Fetch applicants if Admin OR (Sponsor and owner of this post)
      if (isAdmin || (isSponsor && isOwner)) {
        const [applicantRows] = await pool.execute(
          `SELECT accounts.id, accounts.username, applications.created_at 
           FROM applications 
           JOIN accounts ON applications.user_id = accounts.id 
           WHERE applications.post_id = ?`,
          [id]
        );
        applicants = applicantRows as any[];
      }
    }
  } catch (error) {
    console.error("Error loading post details:", error);
  }

  // Server Action: Handle Student Application
  async function applyToPost() {
    'use server';
    const userId = await getSession();
    if (!userId) return;

    try {
      await pool.execute(
        `INSERT IGNORE INTO applications (post_id, user_id) VALUES (?, ?)`,
        [id, Number(userId)]
      );
    } catch (err) {
      console.error("Error applying:", err);
    }
    redirect(`/posts/${id}`);
  }

  // Server Action: Handle Post Deletion
  async function deletePost() {
    'use server';
    const userId = Number(await getSession());
    if (!userId) return;

    try {
      const [userRows] = await pool.execute(`SELECT type FROM accounts WHERE id = ?`, [userId]);
      const userType = String((userRows as any[])[0]?.type || '').toLowerCase();

      const [postRows] = await pool.execute(`SELECT user_id FROM posts WHERE id = ?`, [id]);
      const postSponsorId = Number((postRows as any[])[0]?.user_id);

      if (userType === 'administrator' || (userType === 'sponsor' && postSponsorId === userId)) {
        await pool.execute(`DELETE FROM posts WHERE id = ?`, [id]);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
    redirect(`/`);
  }

  const isOwner = post && currentUserId ? Number(post.sponsor_id) === currentUserId : false;
  const isAdmin = currentUserType === 'administrator';
  const isSponsor = currentUserType === 'sponsor';
  const canDelete = isAdmin || (isSponsor && isOwner);

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-sm font-medium text-emerald-800 hover:underline">
          ← Back to Home
        </Link>

        {canDelete && (
          <form action={deletePost}>
            <button 
              type="submit" 
              className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Post
            </button>
          </form>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

      <div className="text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100 flex justify-between items-center">
        <span>Posted by <strong className="text-emerald-800">{post.username}</strong></span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      <div className="text-gray-800 whitespace-pre-wrap leading-relaxed mb-8">
        {post.description}
      </div>

      {currentUserType === 'student' && (
        <div className="border-t pt-6">
          {hasApplied ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-center font-medium">
              Applied
            </div>
          ) : (
            <form action={applyToPost}>
              <button
                type="submit"
                className="w-full bg-emerald-800 text-white py-3 rounded-lg font-medium hover:bg-emerald-900 transition-colors"
              >
                Apply to this Project
              </button>
            </form>
          )}
        </div>
      )}

      {applicants.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Applicants ({applicants.length})</h3>
          <div className="space-y-3">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                <span className="font-medium text-gray-800">{applicant.username}</span>
                <span className="text-xs text-gray-500">Applied on {new Date(applicant.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PostPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading post...</div>}>
        <PostDetails params={params} />
      </Suspense>
    </div>
  );
}