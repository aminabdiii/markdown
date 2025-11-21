import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);
  const file = fs.readFileSync(filePath, 'utf-8');

  const { content, data } = matter(file);

  const processed = await remark().use(html).process(content);

  const contentHtml = processed.toString();

  return {
    metadata: data,
    contentHtml,
  };
}
