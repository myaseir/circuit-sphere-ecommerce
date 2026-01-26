import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Glacia Labs | Empowering Innovators in Pakistan",
  description: "Founded by engineers for engineers. Glacia Labs provides authentic Arduino, IoT, and Robotics components for students and hobbyists across Pakistan.",
};

const AboutPage = () => {
  return (
    <main className="pb-16 pt-24 bg-gray-50">
      {/* 1. HERO SECTION */}
      <section className="relative bg-white py-20 border-b border-gray-200">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 text-center">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-dark mt-4 mb-6">
            Empowering Pakistan's <br className="hidden md:block" />
            <span className="text-blue-600">Next Generation</span> of Innovators
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Glacia Labs isn't just a store; it's a movement. We are bridging the gap 
            between ideas and reality by providing affordable, high-quality electronics 
            to every student, hobbyist, and engineer in the country.
          </p>
        </div>
      </section>

      {/* 2. THE MISSION (Grid Layout) */}
      <section className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
            {/* Using a tech/lab image placeholder */}
            <Image
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80"
              alt="Engineering Lab"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-dark mb-6">
              Why We Started
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              As computer science students, we faced a common problem: 
              <strong> finding reliable parts for our Final Year Projects (FYP) was a nightmare.</strong> 
              Local markets were overpriced, and online stores took weeks to deliver.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We decided to fix that. Glacia Labs was born out of a dorm room with a simple mission: 
              To deliver authentic components (Arduino, ESP32, Sensors) to your doorstep 
              fast, so you can focus on building, not waiting.
            </p>
            
            <div className="flex gap-4">
              <div className="text-center px-6 py-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-blue-600">2,000+</h3>
                <p className="text-sm text-gray-500">Orders Shipped</p>
              </div>
              <div className="text-center px-6 py-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-blue-600">500+</h3>
                <p className="text-sm text-gray-500">FYPs Powered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES (Cards) */}
      <section className="bg-white py-20">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark">What Sets Us Apart</h2>
            <p className="text-gray-500 mt-2">We don't just sell parts; we provide solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100 group">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Authentic Components</h3>
              <p className="text-gray-500 leading-relaxed">
                No fake clones that burn out. We source directly from reputable manufacturers to ensure your project runs perfectly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100 group">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Fast Shipping</h3>
              <p className="text-gray-500 leading-relaxed">
                We know deadlines matter. We ship via TCS/Leopards to ensure you get your parts in 24-48 hours across Pakistan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-100 group">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Technical Support</h3>
              <p className="text-gray-500 leading-relaxed">
                Stuck on code? Need a wiring diagram? Check our <Link href="/blog" className="text-blue-600 underline">Tutorials</Link> or contact us. We are engineers too.
              </p>
            </div>
          </div>
        </div>
      </section>

     
    </main>
  );
};

export default AboutPage;