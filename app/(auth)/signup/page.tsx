import AuthForm from '@/components/AuthForm/AuthForm'
import { signUpSchema } from '@/lib/authSchema'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Bookari | Sign Up Page",
  description: "A Digital Library Management System",
};


const SignUpPage = () => {
  return (
    <AuthForm authType="SIGN_UP" schema={signUpSchema} defaultValues = {{
      username : "",
      libraryId : 0,
      email : "",
      password : "",
    }} 
    />
  )
}

export default SignUpPage