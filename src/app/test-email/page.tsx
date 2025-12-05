"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import axios from "axios";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testEmail = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🧪 Sending test email to:", email);
      
      const response = await axios.post("/api/test-email", {
        email: email
      });

      if (response.data.success) {
        toast.success("Test email sent successfully! Check your inbox.");
        console.log("✅ Response:", response.data);
      } else {
        toast.error(response.data.message);
        console.error("❌ Error:", response.data.message);
      }

    } catch (error: any) {
      console.error("❌ Request failed:", error);
      toast.error("Failed to send test email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Email Test Page</h1>
        <p className="text-center text-gray-600">
          Test the verification email functionality
        </p>
        
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          
          <Button 
            onClick={testEmail} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send Test Email"}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p className="text-sm text-gray-600">
            Check your browser console and terminal for detailed logs.
          </p>
          <p className="text-sm text-gray-600">
            API Key exists: {process.env.NEXT_PUBLIC_TEST_MODE ? "Check terminal" : "Check server logs"}
          </p>
        </div>
      </div>
    </div>
  );
}