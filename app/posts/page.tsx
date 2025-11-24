import { getPosts } from '@/client/lib/post';
import Link from 'next/link';

export default function PostsPage() {
  const posts = getPosts();

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="text-3xl font-bold mb-8">All Posts</h1>

      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-gray-200 pb-5">
            <Link
              href={`/posts/${post.slug}`}
              className="text-xl font-semibold hover:underline">
              {post.metadata.title}
            </Link>

            {post.metadata.date && (
              <p className="text-gray-500 text-sm mt-1">
                {new Date(post.metadata.date).toLocaleDateString()}
              </p>
            )}

            {post.metadata.description && (
              <p className="mt-3 text-gray-700">{post.metadata.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
