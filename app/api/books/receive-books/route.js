import {connect} from '@/dbConfig/dbConfig'
import Book from '@/models/bookModel'
import { NextResponse } from 'next/server'


export async function POST(request) {
    try {
        const reqBody = await request.json()
  const {name}=reqBody


        const books=await Book.findOne({
            name:name
        })


const updated=await Book.findByIdAndUpdate(books._id,{
    $set:{
        issue:false,
        borrower:"",
        number:"",
        issueDate:""
    }
},{new:true})


        return NextResponse.json({message:"Books returned successfully",success:true,updated})
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}