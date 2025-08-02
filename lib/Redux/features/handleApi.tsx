import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl
    }),
    endpoints: (builder) => ({
        // Query for getting all books
        getBooks: builder.query({
            query: (endPath) => `${endPath}`
        }),
        
        // Query for getting a single book by ID
        getBookById: builder.query({
            query: (endPath) => `${endPath}`
        }),

        deleteBookById: builder.mutation({
            query: (endPath) => ({
                url: `${endPath}`,
                method: "DELETE"
            })
        }),

        UpdateBookById: builder.mutation({
            query: ({id, data}) => (
            {
                url: `/api/books/${id}`,
                method: "PATCH",
                body : data
            })
        }),

        getUserRequests : builder.query({
            query : (endPath) => `${endPath}`
        }),

        rejectAccountRequest: builder.mutation({
            query: (endPath) => ({
                url: `${endPath}`,
                method: "DELETE"
            })
        }),

        approveAccountRequest : builder.mutation({
            query : ({id, data}) => ({
                url : `/api/userRequests/${id}`,
                method : "PATCH",
                body : data
            })
        }),

        getAllUsers : builder.query({
            query : (endPath) => `${endPath}`
        }),

        postBorrowBook : builder.mutation({
            query : ({data}) => ({
                url : 'api/borrowBook',
                method : "POST",
                body : data
            })
        }),

        getBorrowedBookByLibId : builder.query({
            query : (endpath) => `${endpath}`
        }),

        getAllBorrowedBooks : builder.query({
            query : (endpath) => `${endpath}`
        }),

        rejectBorrowReqById : builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/borrowBook/${id}`,
                method: 'PUT', 
                body: data,
            }),
        }),

        updateBorrowStatus : builder.mutation({
            query : ({data, id}) => ({
                url : `/api/borrowBook/${id}`,
                method : "PATCH",
                body : data
            })
        }),

        updateOnReturnBook : builder.mutation({
            query : ({data, id}) => ({
                url : `/api/borrowBook/${id}/return`,
                method : "PUT",
                body : data
            })
        })
    })
});

export const { 
    useGetBooksQuery, 
    useGetBookByIdQuery, 
    useDeleteBookByIdMutation,
    useUpdateBookByIdMutation,
    useGetUserRequestsQuery,
    useRejectAccountRequestMutation,
    useApproveAccountRequestMutation,
    useGetAllUsersQuery,
    usePostBorrowBookMutation,
    useGetBorrowedBookByLibIdQuery,
    useGetAllBorrowedBooksQuery,
    useRejectBorrowReqByIdMutation,
    useUpdateBorrowStatusMutation,
    useUpdateOnReturnBookMutation
} = baseApi;
export default baseApi;