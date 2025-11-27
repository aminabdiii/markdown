import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { rehype } from "rehype";
import rehypePrism from "rehype-prism-plus";

export async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "public", "posts", `${slug}.md`);
  const file = fs.readFileSync(filePath, "utf-8");

  const { content, data } = matter(file);

  const processed = await remark().use(gfm).use(html).process(content);

  const highlighted = await rehype()
    .data("settings", { fragment: true })
    .use(rehypePrism)
    .process(processed.toString());

  const contentHtml = highlighted.toString();

  return {
    metadata: data,
    contentHtml,
  };
}

const postsDir = path.join(process.cwd(), "public", "posts");

export function getPosts() {
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));

  const posts = files.map((file) => {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const { data } = matter(fileContent);

    return {
      slug: file.replace(/\.md$/, ""),
      metadata: data,
    };
  });

  posts.sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA;
  });

  return posts;
}
