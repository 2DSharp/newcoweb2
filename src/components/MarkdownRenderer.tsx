'use client';

import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from 'mdx/types';

const components: MDXComponents = {
  h1: (props) => <h1 className="text-2xl font-bold mb-4" {...props} />,
  h2: (props) => <h2 className="text-xl font-bold mb-3" {...props} />,
  h3: (props) => <h3 className="text-lg font-bold mb-2" {...props} />,
  p: (props) => <p className="mb-4" {...props} />,
  ul: (props) => <ul className="list-disc pl-4 mb-4" {...props} />,
  ol: (props) => <ol className="list-decimal pl-4 mb-4" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
  a: (props) => <a className="text-blue-600 hover:underline" {...props} />,
  strong: (props) => <strong className="font-bold" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  blockquote: (props) => <blockquote className="border-l-4 border-gray-300 pl-4 italic" {...props} />,
};

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose max-w-none">
      <MDXRemote source={content} components={components} />
    </div>
  );
} 