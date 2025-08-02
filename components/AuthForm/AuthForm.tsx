'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, FieldValues, SubmitHandler, useForm, UseFormReturn } from "react-hook-form"
import { z, ZodType } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import Link from 'next/link'
import FIELD_NAMES from '@/constants/fieldNames'
import { FIELD_TYPES } from '@/constants/data'
import toast, { Toaster } from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'



interface Props<T extends FieldValues> {
    authType : "SIGN_IN" | "SIGN_UP";
    schema : ZodType<T>;
    defaultValues : T,
}

function AuthForm <T extends FieldValues> ({ authType, schema, defaultValues}: Props<T>) {

  const haveAccount = authType === "SIGN_IN";
  
  // @ts-ignore
  const form : UseFormReturn<T> = useForm<T>({
    // @ts-ignore
    resolver: zodResolver(schema),
    // @ts-ignore
    defaultValues
  });

  const router = useRouter();

 const handleSubmit: SubmitHandler<T> = async (data : T) => {
    // console.log(data); 

    if(!haveAccount) {
        const res = await fetch("/api/createUser", {
            method : "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body : JSON.stringify(data),
        });

        const result = await res.json();

        if(res?.ok){
            // console.log("CLIENT :::", result);
            form.reset();
            toast.success(result?.message || "User created successfully");

            const res2 = await signIn("credentials", {
                email: data.email,
                password: data.password,
                // callbackUrl : "/",
                redirect : false
            });

            if(res2?.ok){
                // console.log("sign in :::", res2);
                router.push("/");
                toast.success("User Singned In successfully");

            } else {
                toast.error("Failed to Sign In");
                console.log("ERR :::", res2);
            }


        } else {
            toast.error(result?.message || "Failed to create user");
            console.log("ERR :::", res);
        }
    } else {

        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            // callbackUrl : "/",
            redirect : false
        });

        if(res?.ok){
            // console.log("sign in :::", res);
            form.reset();
            router.push("/");
            toast.success("User Signed In successfully");

        } else {
            toast.error(res?.error || "Failed to Sign In");
            console.log("ERR :::", res);
        }

    }
    
  };

  return (
    <div className='flex flex-col gap-4'>
        <Toaster />
        {
            haveAccount ? 
            <h1 className='text-2xl font-semibold'> Welcome Back To Bookari </h1> 
            : 
            <h1 className='text-2xl font-semibold'>Create Your Library Account</h1>
        }
        <p className='text-lime-50'>
            {
                haveAccount ? "Access the vast collection of resources, and stay updated" 
                : "Please complete all fields and upload a valid Library ID to gain access to the library"
            }
        </p>
        
        <Form {...form}>
            
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                {
                   (Object.keys(defaultValues) as (keyof typeof defaultValues)[]).map((val) => {
                        
                        return (
                            <FormField
                                key={val as string}
                                control={form.control}
                                //@ts-ignore
                                name={val as string}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel> {FIELD_NAMES[val as keyof typeof FIELD_NAMES]} </FormLabel>
                                    <FormControl>
                                        
                                        <Input placeholder={`${FIELD_NAMES[val as keyof typeof FIELD_NAMES]}...`}
                                            type={FIELD_TYPES[val as keyof typeof FIELD_TYPES]} 
                                            {...field} 
                                            required
                                            className='form-input'
                                        />

                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )
                    })
                }
                <Button type="submit" className='form-btn'>
                    {
                        haveAccount ? "Sign In" : "Sign Up"
                    }
                </Button>
            </form>
        </Form>

        <div className='flex flex-row gap-2 items-center justify-center'>
            <p className='text-center'>
                {
                    haveAccount ? "New to Bookari? " : "Already have an account? "
                }
            </p>
            {
                haveAccount ? 
                <Link href={"/signup"} className='text-light-200 underline'> Create Account </Link> 
                : 
                <Link href={"/signin"} className='text-light-200 underline'> Sign In </Link>
            }

        </div>
    </div>
  )
}

export default AuthForm