'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValues, SubmitHandler, useForm, UseFormReturn } from "react-hook-form"
import { z, ZodType } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FileUpload from '@/components/FileUpload/FileUpload'
import ColorPicker from '@/components/ColorPicker/ColorPicker'
import { useUpdateBookByIdMutation } from '@/lib/Redux/features/handleApi'



interface Props<T extends FieldValues> {
    formType : "CREATE_NEW_BOOK" | "UPDATE_BOOK";
    schema : ZodType<T>;
    defaultValues : T,
}

function BookForm <T extends FieldValues> ({ formType, schema, defaultValues}: Props<T>) {

  const isBookExist = formType === "UPDATE_BOOK";
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {coverColor, coverUrl} = defaultValues;

//   console.log("Default :::", defaultValues)

  const [updateBook] = useUpdateBookByIdMutation();

  
  // @ts-ignore
  const form : UseFormReturn<T> = useForm<T>({
    // @ts-ignore
    resolver: zodResolver(schema),
    // @ts-ignore
    defaultValues
  });

  const router = useRouter();

 const handleSubmit: SubmitHandler<T> = async (data : T) => {
    setIsLoading(true);
    // console.log("Data:::", data); 

    if(!isBookExist) {
        const res = await fetch("/api/books", {
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
            setIsLoading(false);
            toast.success(result?.message || "Book inserted successfully");
            router.push("/admin/books");

        } else {
            toast.error(result?.message || "Failed to insert book");
            console.log("ERR :::", res);
            setIsLoading(false);
        }
    } else {
        const payload = {...defaultValues, ...data, availableCopies : data.totalCopies}
        // console.log("Payload :::", payload);
        const res : any = await updateBook({ id: defaultValues._id, data : payload });

        if(res?.data?.message){
            // console.log("CLIENT :::", res);
            form.reset();
            setIsLoading(false);
            toast.success(res?.data?.message || "Book updated successfully");
            await router.push("/admin/books");

        } else {
            toast.error(res?.error?.data?.message || "Failed to update book");
            console.log("ERR :::", res);
            setIsLoading(false);
        }
    }
  };
    

  return (
    <div className='flex flex-col gap-4'>
        <Toaster />
        {
            isBookExist ? 
            <h1 className='text-2xl font-semibold'> Update Book </h1> 
            : 
            <h1 className='text-2xl font-semibold'>Create A New Book</h1>
        }
        
        <Form {...form}>
            
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                
                <FormField
                    control={form.control}
                    //@ts-ignore
                    name={"title"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> Book Title </FormLabel>
                            <FormControl>
                                
                                <Input placeholder='Book Name...'
                                    type="text" 
                                    {...field} 
                                    required = {!isBookExist}
                                    className='book-form_input'
                                    // value={title}
                                />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    //@ts-ignore
                    name={"author"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> Author </FormLabel>
                            <FormControl>
                                
                                <Input placeholder='Author Name...'
                                    type="text" 
                                    {...field} 
                                    required = {!isBookExist}
                                    className='book-form_input'
                                    // value={author}
                                />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    //@ts-ignore
                    name={"genre"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> Genre </FormLabel>
                            <FormControl>
                                
                                <Input placeholder='Book Genre...'
                                    type="text" 
                                    {...field} 
                                    required = {!isBookExist}
                                    className='book-form_input'
                                />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    //@ts-ignore
                    name={"description"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> Book Description </FormLabel>
                            <FormControl>
                                
                                <Textarea placeholder='Write description here...'
                                    {...field} 
                                    required = {!isBookExist}
                                    className='book-form_input'
                                />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    //@ts-ignore
                    name={"rating"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> Rating <span className='font-light'>(out of 10)</span> </FormLabel>
                            <FormControl>
                                
                                <Input placeholder='Book Rating...'
                                    type="number" 
                                    min={1}
                                    max={10}
                                    {...field} 
                                    required = {!isBookExist}
                                    className='book-form_input'
                                />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    //@ts-ignore
                    name={"totalCopies"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> Total Copies </FormLabel>
                            <FormControl>
                                
                                <Input placeholder='Total Book Copies...'
                                    type="number" 
                                    min={1}
                                    max={1000}
                                    {...field} 
                                    required = {!isBookExist}
                                    className='book-form_input'
                                />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Book Cover Image Upload */}
                
                <FileUpload 
                    // @ts-ignore
                    setValue={form.setValue} 
                    isFieldRequired={!isBookExist}
                    value={coverUrl}
                />

                {/* Book Cover Color Input */}

                <ColorPicker 
                    //@ts-ignore
                    setValue={form.setValue}
                    value={coverColor}
                    isFieldRequired={!isBookExist}
                />

                <FormField
                    control={form.control}
                    //@ts-ignore
                    name={"summary"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel> Book Summary </FormLabel>
                            <FormControl>
                                
                                <Textarea placeholder='Write book summary here...'
                                    {...field} 
                                    required = {!isBookExist}
                                    className='book-form_input'
                                />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button type='submit' className='book-form_btn text-white' 
                disabled={isLoading}
                > 
                    {
                        isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    }
                    <span> Add Book To Library </span>
                </Button>


            </form>
        </Form>
    </div>
  )
}

export default BookForm;