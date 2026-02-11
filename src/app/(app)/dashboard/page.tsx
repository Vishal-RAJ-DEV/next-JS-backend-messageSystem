"use client";
import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import axios, { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { zodResolver } from '@hookform/resolvers/zod'
import { Message } from '@/model/user'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import { AcceptMessageSchema } from '@/Schemas/acceptMesageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { User } from 'next-auth'
import { 
  Copy, 
  RefreshCw, 
  MessageSquare, 
  Users, 
  Settings,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react'

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/deleteMesssage/${messageId}`)
      toast.success(response.data.message);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId))
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to delete message"
      );
    }
  }

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof AcceptMessageSchema>>({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      isAcceptingMessages: true
    }
  })

  const { setValue } = form;
  const isAcceptingMessages = form.watch("isAcceptingMessages"); //this will watch the isAcceptingMessages field value is true or false 

  // Fetch accepting messages preference
  const fetchAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('isAcceptingMessages', response.data.isAcceptingMessages || false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch message acceptance preference"
      );
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  // Fetch messages
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success("Messages refreshed successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch messages"
      );
    } finally {
      setIsLoading(false)
    }
  },[])

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptingMessages();
    fetchMessages();
  }, [session?.user?.id])

  const toggleAcceptMessages = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        isAcceptingMessages: !isAcceptingMessages
      })
      setValue("isAcceptingMessages", !isAcceptingMessages)
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to update message acceptance preference"
      );
    } finally {
      setIsSwitchLoading(false)
    }
  }

  if (!session || !session.user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Settings className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Please log in</h3>
              <p className="mt-1 text-sm text-gray-500">You need to be logged in to view the dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = session?.user as User
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const userProfileLink = `${baseUrl}/u/${user.username || user.email}`;

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(userProfileLink);
      toast.success("Profile link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy profile link");
    }
  }

  return (
    <div className="w-full min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.username || user.email}! Manage your anonymous messages here.
        </p>
      </div>

      {/* Profile Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Your Message Link
          </CardTitle>
          <CardDescription>
            Share this link to receive anonymous messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              value={userProfileLink} 
              readOnly 
              className="flex-1"
            />
            <Button onClick={copyProfileLink} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">
              Messages received so far
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {isAcceptingMessages ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isAcceptingMessages ? 'Active' : 'Inactive'}
            </div>
            <p className="text-xs text-muted-foreground">
              Message acceptance status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Message Settings</CardTitle>
          <CardDescription>
            Control whether you want to accept new messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="accept-messages" className="text-sm font-medium">
                Accept Messages
              </Label>
              <div className="text-sm text-muted-foreground">
                Allow others to send you anonymous messages
              </div>
            </div>
            <Switch
              id="accept-messages"
              checked={isAcceptingMessages}
              onCheckedChange={toggleAcceptMessages} //this will call the toggleAcceptMessages function which will flip the isAcceptingMessages value
              disabled={isSwitchLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Your received anonymous messages
              </CardDescription>
            </div>
            <Button 
              onClick={() => fetchMessages(true)} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={`loading-${i}`} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Share your link to start receiving anonymous messages!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <Card key={message._id?.toString() || `message-${index}`} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 mb-2">
                          {message.content}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMessage(message._id?.toString() || '')}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage