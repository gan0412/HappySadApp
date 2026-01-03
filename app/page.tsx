import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Happy Sad Editor</h1>
      <div className="flex gap-4">
        <Link
          href="/happy"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Happy Editor
        </Link>
        <Link
          href="/sad"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Sad Editor
        </Link>
      </div>
    </main>
  );
}
