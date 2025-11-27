'use client';

import { useTheme } from 'next-themes';

function RenderDynamicHTML({ html }: { html: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`prose ${
        theme === 'dark' ? 'prose-invert' : 'prose-neutral'
      } max-w-full`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default RenderDynamicHTML;
