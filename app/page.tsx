import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <AnimatedBackground />
      <div className="relative z-10">
        <h1 className="text-6xl font-bold mb-4 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Happy Sad Editor
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          AI-powered text editor with emotional transformation
        </p>
        <div className="flex gap-4">
          <Link
            href="/happy"
            className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all hover:scale-105 shadow-lg"
          >
            😊 Happy Editor
          </Link>
          <Link
            href="/sad"
            className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105 shadow-lg"
          >
            😢 Sad Editor
          </Link>
        </div>
      </div>
    </main>
  );
}
