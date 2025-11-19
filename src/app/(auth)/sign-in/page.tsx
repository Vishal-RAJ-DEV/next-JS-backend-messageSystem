'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader } from 'lucide-react';
import { signInSchema } from '@/Schemas/signInSchema'
import { signIn } from 'next-auth/react'

const page = () => {
    const [isFormSubmitting, setisFormSubmitting] = useState(false)

    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      setisFormSubmitting(true);
      const reponse = await signIn("credentials", {
        redirect: false, //because we are handling redirection manually
        identifier: data.identifier,
        password: data.password,

      })
      if(reponse?.error){
        if(reponse.error  === 'credentialsSignin'){
          toast.error("Invalid identifier or password");
        }else{
          toast.error(reponse.error);
        }
      }

      if(reponse?.url){
        toast.success("Signed in successfully");
        router.replace('/dashboard'); //redirect to dashboard on successful sign in
      }
      setisFormSubmitting(false);
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Sign In
            </h1>
            <p className="mb-4">Welcome back! Sign in to your account</p>
          </div>
          {/* Inject your shadcn form here */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>

                    <FormControl>
                      <Input placeholder="email or username" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isFormSubmitting} className='m-auto'>
                {
                  isFormSubmitting ?
                    (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) :
                    ("Sign In")
                }
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <p>
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
}

export default page