"use client";
import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import axios, { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { message } from '@/model/user'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react';
import { AcceptMessageSchema } from '@/Schemas/acceptMesageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { fi } from 'zod/v4/locales';
import { User } from 'next-auth';

const DashboardPage = () => {
  const [messgage, setmessgage] = useState<message[]>([]) //here we will store the messages with the message type
  const [isLoading, setisLoading] = useState(false)
  const [isSwitchLoading, setisSwitchLoading] = useState(false)

  const handleDeleteMessgae = async (messageId: string) => {
    setmessgage((prev) => prev.filter((msg) => msg._id !== messageId))
  }

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof AcceptMessageSchema>>({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      isAcceptingMessages: true
    }
  })


  const { register, watch, setValue } = form;
  //this will track the isAcceptingMessages value in the form so that we can use it to set the switch state
  const isAcceptingMessages = watch("isAcceptingMessages"); //for the form purpose
  //this is will toggle the isAcceptingMessages value and send the request to the server to update the user preference 
  //is he accepting messages or not

  //this only fetch which is the current value of isAcceptingMessages from the server
  const fetchAcceptingMessages = useCallback(async () => {
    setisSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('api/accept-messages')
      setValue( 'isAcceptingMessages' ,  response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch message acceptance preference"
      );
    }
  }, [setValue , toast])


  //fetching the messges from the server
  const fetchMessages = useCallback(async (refresh: boolean = false) => { //here refresh indicates whether we are refreshing the messages or loading for the first time
    setisLoading(true)
    setisSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('api/get-messages');
      setmessgage(response.data.messages || [])
      if (refresh) {
        toast.success("Messages refreshed successfully");
      }

    } catch (error) {
      {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to fetch messages"
        );
      }
    }finally {
      setisLoading(false)
      setisSwitchLoading(false)
    }
  }, [setisLoading , setmessgage , toast]) //so these are the dependencies of this useCallback

  //whenever the session changes we will fetch the isAcceptingMessages value and the messages
  //so that when the user logs in we have the latest data
  useEffect(() =>{
    if( !session || !session.user) return;
    fetchAcceptingMessages();
    fetchMessages();
  }, [session , setValue , fetchAcceptingMessages , fetchMessages])
  

  const toggleAcceptMessages = async () => {
    try {
      const response = await axios.post<ApiResponse>('api/accept-messages', {
        isAcceptingMessages: !isAcceptingMessages
      })
      setValue("isAcceptingMessages", !isAcceptingMessages)
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to update message acceptance preference"
      );
    }
  }
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[...new Array(4)].map((_, i) => (
          <div
            key={"stats-" + i}
            className="h-32 rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 flex items-center justify-center"
          >
            <p className="text-neutral-600 dark:text-neutral-400">Stat Card {i + 1}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...new Array(2)].map((_, i) => (
          <div
            key={"content-" + i}
            className="h-64 rounded-lg bg-gray-100 dark:bg-neutral-800 p-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400">Content Area {i + 1}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage