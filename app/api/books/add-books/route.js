import {connect} from '@/dbConfig/dbConfig'
import Book from '@/models/bookModel'
import { error } from 'console'
import { NextRequest,NextResponse } from 'next/server'

connect()

export async function POST(request){
    try {
       const reqBody = await request.json()
       const {bookName,author,publication,price,bookId} =reqBody
       console.log("requested body:",reqBody)

      const book = await Book.findOne({name:bookName})
      if (book) {
        return NextResponse.json({error:"Book already exists"},{status:400})
      }
console.log("first")

const priceNumber = Number(price);
if (isNaN(priceNumber)) {
    return NextResponse.json({ error: "Invalid price format" }, { status: 400 });
}

const newBook= new Book({
name:bookName,
author,
publication,
price:priceNumber,
bookId
})
console.log("book",newBook)

const savedBook= await newBook.save()
console.log("saved")

return NextResponse.json({
  message:"Book registered successfully",
  success:true,
  savedBook
})
     
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}