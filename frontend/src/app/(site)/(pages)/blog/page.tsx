import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glacia Labs Tutorials | Learn Robotics & IoT",
  description: "Step-by-step guides for Arduino, ESP32, and coding. Learn how to build your Final Year Project (FYP) with our expert tutorials.",
};

const getPosts = () => {
  const contentDir = path.join(process.cwd(), "content");
  // Safety check if folder is missing
  if (!fs.existsSync(contentDir)) return [];
  
  const files = fs.readdirSync(contentDir);

  const posts = files.map((filename) => {
    const slug = filename.replace(".mdx", "");
    const markdownWithMeta = fs.readFileSync(
      path.join(contentDir, filename),
      "utf-8"
    );
    const { data: frontmatter } = matter(markdownWithMeta);

    return {
      slug,
      frontmatter,
    };
  });

  return posts;
};

const BlogPage = () => {
  const posts = getPosts();

  return (
    // ✅ FIX: Added 'mt-10' (40px margin-top). Kept 'pt-24' for internal padding.
    <main className="mt-10 pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">
            Learning Hub
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-dark mt-3 mb-4">
            Tutorials & Project Guides
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Stuck on your FYP? Want to learn Arduino? Browse our library of 
            step-by-step guides written by engineers.
          </p>
        </div>

        {/* Grid of Tutorials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.slug}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Cover */}
              <div className="relative h-48 w-full bg-gray-200">
                <Image
                  src={post.frontmatter.image || "https://images.unsplash.com/photo-1555676140-71292050f556?auto=format&fit=crop&w=800&q=80"}
                  alt={post.frontmatter.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {post.frontmatter.tags?.[0] || "Tutorial"}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span>{post.frontmatter.date}</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
                
                <h2 className="text-xl font-bold text-dark mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.frontmatter.title}
                </h2>
                
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                  {post.frontmatter.description}
                </p>

                <span className="inline-flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Read Guide 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BlogPage;