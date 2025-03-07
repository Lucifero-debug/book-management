import {connect} from '@/dbConfig/dbConfig'
import Book from '@/models/bookModel'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const books=await Book.find({
            issue:true
        })
        return NextResponse.json({message:"Books fetched successfully",success:true,books})
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}