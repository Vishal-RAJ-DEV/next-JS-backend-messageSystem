'use client'
import React, { useState } from 'react'
import { MessageSchema } from '@/Schemas/messgaeSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import * as z from 'zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send, ArrowLeft, Sparkles } from 'lucide-react'
import { toast } from 'react-toastify'
import axios, { AxiosError } from 'axios'

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
}

const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?||Tell me something interesting about yourself||What makes you happy?||Share a fun fact!";

const SendMessagePage = () => {
  const params = useParams<{ username: string }>()
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);

  // Parse suggested messages
  const suggestedMessages = parseStringMessages(initialMessageString);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      message: '' // ← Fix: Use 'message' not 'content'
    }
  })

  const { setValue } = form;

  // Fix: Watch the correct field name from schema
  const messageContent = form.watch('message'); // ← Fix: Use 'message' not 'content'

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/send-messages', {
        content: data.message, // Send as 'content' to API but use 'message' in form
        username: username,
      });

      toast.success("Message sent successfully!");
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast.error(
        axiosError.response?.data.message || "Failed to send message"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleSuggestedMessage = (message: string) => {
    setValue('message', message); // ← Fix: Use 'message' field
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Send Anonymous Message to @{username}
        </h1>
        <p className="text-muted-foreground">
          Your message will be sent anonymously. Be kind and respectful.
        </p>
      </div>

      {/* Suggested Messages */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Suggested Messages
          </CardTitle>
          <CardDescription>
            Click on any suggestion to use it as your message
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedMessages.map((message, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left justify-start"
                onClick={() => handleSuggestedMessage(message)}
              >
                <div className="text-sm">{message}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Form */}
      <Card>
        <CardHeader>
          <CardTitle>Write Your Message</CardTitle>
          <CardDescription>
            Compose an anonymous message to send to {username}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="message" // ← Fix: Use 'message' field name
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your anonymous message here..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {messageContent?.length || 0} / 500 characters
                </span>
                <span>
                  Minimum 10 characters required
                </span>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Anonymous Message
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="mt-6 border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Guidelines</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Be respectful and kind in your message</li>
            <li>• No hate speech, harassment, or offensive content</li>
            <li>• Your identity will remain completely anonymous</li>
            <li>• Messages must be between 10-500 characters</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default SendMessagePage