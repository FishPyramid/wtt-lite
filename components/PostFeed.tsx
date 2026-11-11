import pool from "@/config/db.js";
import Link from "next/link";

export default async function PostFeed() {
  let posts: any[] = [];

  try {
    const [rows] = await pool.execute(
      `SELECT posts.id, posts.title, posts.description, posts.created_at, accounts.username 
       FROM posts 
       JOIN accounts ON posts.user_id = accounts.id 
       ORDER BY posts.created_at DESC`
    );
    posts = rows as any[];
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No projects found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 px-10">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between"
        >
          <div>
            {/* Clickable Title linking to dynamic post page */}
            <Link href={`/posts/${post.id}`}>
              <h3 className="text-lg font-bold text-gray-900 hover:text-emerald-800 transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>
            </Link>

            {/* Post Description */}
            <p className="text-gray-600 mb-6 whitespace-pre-wrap line-clamp-4 text-sm">
              {post.description}
            </p>
          </div>

          {/* Post Footer (Author & Date) */}
          <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="font-semibold text-emerald-800">
              {post.username || 'Anonymous'}
            </span>
            <span>
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}