import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookType {
    author?: string,
    availableCopies?: number,
    coverColor?: string,
    coverUrl?: string,
    createdAt?: string,
    description?: string,
    genre?: string,
    isLoanedBook?: boolean,
    rating?: number,
    summary?: string
    title?: string,
    totalCopies?: number,
    _id?: string
}


interface BookState {
  books?: BookType[];
}

const initialState : BookState = { books: [] };

const BookSlice = createSlice({
    name: "handleBook/",
    initialState,
    reducers: {
        addBook: (state : any, action : PayloadAction<BookType>) => {
            state.books.push(action.payload);
        },
        setBooks : (state : any, action : PayloadAction<BookType[]>) => {
            state.books = action.payload;
        }, 
        removeBook : (state : any, action : PayloadAction<string>) => {
            state.books = state.books.filter((book : any) => book._id !== action.payload);
        },
    }
});

export const {addBook, setBooks, removeBook} = BookSlice.actions;
export default BookSlice.reducer;