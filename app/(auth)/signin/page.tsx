import AuthForm from '@/components/AuthForm/AuthForm'
import { signInSchema } from '@/lib/authSchema'
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: "Bookari | Sign In Page",
  description: "A Digital Library Management System",
};

const SignInPage = () => {
  return (
    <AuthForm authType="SIGN_IN" schema={signInSchema} defaultValues = {{
      email : "",
      password : ""
    }} 
    />
  )
}

export default SignInPage