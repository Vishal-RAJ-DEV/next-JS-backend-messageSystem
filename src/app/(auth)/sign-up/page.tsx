'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import axios, {  AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/Schemas/signUpSchema'
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

const page = () => {
    const [username, setusername] = useState("")
    const [usenameMessage, setusenameMessage] = useState("")
    const [ischeckingUsername, setischeckingUsername] = useState(false)
    const [isFormSubmitting, setisFormSubmitting] = useState(false)

    //so debouncedUsername will only update 300ms after the user stops typing
    //it uses a custom hook useDebounceValue from usehooks-ts library to implement this functionality
    // so it helps to reduce the number of API calls made while the user is typing by waiting for a pause in input before triggering the username uniqueness check
    const debounced = useDebounceCallback(setusername, 300)
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        }
    })

    useEffect(() => {
        //here we are defining an asynchronous function checkUsernameUnique that checks if the debounced username is unique by making an API call to the /api/check-username-unique endpoint. If the username is unique, it sets a success message; otherwise, it sets an error message based on the response from the server.
        const checkUsernameUnique = async () => {
            if (username) {
                setischeckingUsername(true);
                setusenameMessage(""); // beacuse we are checking a new username so clear previous message
                try {
                    const reponse = await axios.get(`/api/check-username-unique?username=${username}`);
                    if (reponse.data.success) {
                        let message = reponse.data.message;
                        setusenameMessage(message);
                    }
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;//this is axious error typecasting
                    setusenameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    )
                } finally {
                    setischeckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }, [username]); //check whenever the debounced username changes

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setisFormSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/signUp', data);
            if (response.data.success) {
                toast.success(response.data.message);
                router.replace(`/verify/${data.username}`);
                //redirect to verify page with username as query param
            }
            setisFormSubmitting(false);
        } catch (error) {
            console.error("Error during sign up:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            //show error toast with message from server or generic message
            toast.error(
                axiosError.response?.data.message || "Error during sign up"
            );
            setisFormSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Sign Up
                    </h1>
                    <p className="mb-4">Create your account</p>
                </div>
                {/* Inject your shadcn form here */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>

                                    <FormControl>
                                        <Input placeholder="username" {...field}
                                            onChange={(e) => {
                                                field.onChange(e) // react-hook-form's internal state update
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {ischeckingUsername && <Loader className="h-4 w-4 animate-spin" />}
                                    {usenameMessage && (
                                        <FormDescription className={usenameMessage === "Username is unique and available" ? "text-green-600" : "text-red-600"}>
                                            {usenameMessage}
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>

                                    <FormControl>
                                        <Input placeholder="email" {...field} />
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
                                            Signing up...
                                        </>
                                    ) :
                                    ("Sign Up")
                            }
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center">
                    <p>
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page