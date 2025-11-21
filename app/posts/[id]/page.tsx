import RenderDynamicHTML from '@/components/renderDynamicHTML';
import { getPost } from '@/lib/post';
import Link from 'next/link';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await getPost(id);

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <Link href="/posts" className="text-sm text-blue-600 hover:underline">
        ← Back
      </Link>

      <div className="flex items-center justify-between my-5">
        <h1 className="text-3xl font-bold mt-4">{post.metadata.title}</h1>

        {post.metadata.date && (
          <p className="text-gray-500 my-5">
            {new Date(post.metadata.date).toLocaleDateString()}
          </p>
        )}
      </div>

      <RenderDynamicHTML html={post.contentHtml} />
    </div>
  );
}
