import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-8">
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Welcome to MessageApp
      </h1>
      
      <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl">
        Send and receive anonymous messages securely. Connect with others while maintaining your privacy.
      </p>

      <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
        <Link href="/dashboard">
          <Button size="lg" className="px-8 py-3">
            Go to Dashboard
          </Button>
        </Link>
        
        <Link href="/messages">
          <Button variant="outline" size="lg" className="px-8 py-3">
            View Messages
          </Button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="p-6 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <h3 className="text-lg font-semibold mb-2">Anonymous Messaging</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Send messages without revealing your identity
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Your messages are encrypted and secure
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <h3 className="text-lg font-semibold mb-2">AI Suggestions</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Get AI-powered message suggestions
          </p>
        </div>
      </div>
    </div>
  );
}
