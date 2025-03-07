import {connect} from '@/dbConfig/dbConfig'
import Book from '@/models/bookModel'
import { NextResponse } from 'next/server'


export async function POST(request) {
    try {
  const {name}=await request.json()

        const books=await Book.findOne({
            name:name
        })

const deleted=await Book.findByIdAndDelete(books._id,{
    $set:{
        issue:false
    }
},{new:true})

        return NextResponse.json({message:"Books deleted successfully",success:true,deleted})
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}