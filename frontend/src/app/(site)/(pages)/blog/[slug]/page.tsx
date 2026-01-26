import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";

// 1. Safe path helper
const getContentPath = () => {
  return path.join(process.cwd(), "content");
};

export async function generateStaticParams() {
  const contentDir = getContentPath();
  if (!fs.existsSync(contentDir)) return [];
  const files = fs.readdirSync(contentDir);
  return files.map((filename) => ({
    slug: filename.replace(".mdx", ""),
  }));
}

// ✅ FIX 1: Update type to Promise (for Next.js 15 support)
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  // ✅ FIX 2: Await the params
  const { slug } = await params;
  
  const filePath = path.join(getContentPath(), `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return { title: "Post Not Found" };
  }

  const markdownWithMeta = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter } = matter(markdownWithMeta);
  
  return {
    title: `${frontmatter.title} | Glacia Labs`,
    description: frontmatter.description,
  };
}

// ✅ FIX 3: Make component async and await params
export default async function PostPage({ params }: Props) {
  const { slug } = await params; // <--- This line fixes the "undefined" error
  
  const contentDir = getContentPath();
  const filePath = path.join(contentDir, `${slug}.mdx`);

  // --- DEBUGGING LOGIC (Keep this just in case) ---
  const fileExists = fs.existsSync(filePath);
  
  if (!fileExists) {
    return (
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl">
          <h1 className="text-xl font-bold mb-2">Tutorial Not Found</h1>
          <p className="mb-4">The file could not be found.</p>
          <div className="bg-black text-white p-4 rounded text-xs font-mono">
             <p><strong>Looking for:</strong> {filePath}</p>
             <p><strong>Slug:</strong> {slug}</p>
          </div>
          <Link href="/blog" className="inline-block mt-4 text-red-700 underline font-bold">
            ← Back to Tutorials List
          </Link>
        </div>
      </div>
    );
  }

  const markdownWithMeta = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(markdownWithMeta);

  return (
    <main className="pt-24 pb-20 bg-white">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          ← Back to Tutorials
        </Link>

        <header className="mb-10 text-center">
          <div className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
             {frontmatter.tags?.[0] || "Guide"}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-dark mb-6 leading-tight">
            {frontmatter.title}
          </h1>
          <p className="text-gray-500 text-sm">Published on {frontmatter.date}</p>
        </header>

        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-12 shadow-lg bg-gray-100">
           <Image 
             src={frontmatter.image || "https://images.unsplash.com/photo-1555676140-71292050f556?auto=format&fit=crop&w=1000&q=80"} 
             alt={frontmatter.title} 
             fill 
             className="object-cover"
             priority
           />
        </div>

        <div className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:text-dark prose-p:text-gray-600 prose-img:rounded-xl">
          <MDXRemote source={content} />
        </div>

        <div className="mt-16 p-8 bg-green-50 rounded-2xl border border-green-100 text-center">
  <h3 className="text-2xl font-bold text-dark mb-3">Ready to build this?</h3>
  <Link 
    href="/shop" 
    // ✅ FIX: Changed 'bg-blue-600' to 'bg-blue' and added 'hover:opacity-90' for effect
    className="inline-block bg-blue text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition shadow-lg"
  >
    Shop Components
  </Link>
</div>

      </article>
    </main>
  );
}