"use client"
import { z } from "zod"
 
export const signUpSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters."
  }).max(50, {
    message: "Username must be less than 50 characters."
  }),

  email : z.string().email(),

  libraryId : z.coerce.number(),

  password : z.string().min(8, {
    message : "Pasword must be at least 8 characters."
  })

});

export const signInSchema = z.object({
  email : z.string().email(),
  password : z.string().min(8)
});

export const BookSchema = z.object({
  title : z.string().trim().min(2).max(100),
  description : z.string().trim().min(10).max(1000),
  author : z.string().trim().min(2).max(50),
  genre : z.string().trim().min(2).max(50),
  summary : z.string().trim().min(10).max(1000),
  rating : z.coerce.number().min(1).max(10),
  totalCopies : z.coerce.number().int().positive().lte(1000),
  coverUrl : z.string().nonempty(),
  coverColor : z.string().trim().regex(/^#[0-9A-Z]{6}$/i)
});