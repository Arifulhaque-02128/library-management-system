interface Book {
    _id: number,
    title: string,
    author: string,
    genre: string,
    rating: number,
    totalCopies: number,
    availableCopies: number,
    description: string,
    coverUrl: string,
    coverColor : string,
    summary: string,
    isLoanedBook? : boolean
}