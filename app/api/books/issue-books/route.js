import {connect} from '@/dbConfig/dbConfig'
import Book from '@/models/bookModel'
import { NextResponse } from 'next/server'

connect()

export async function POST(request) {
    try {
        const reqBody = await request.json()
const {name,bookName,mobile}=reqBody

        const books=await Book.findOne({
          name:bookName
        })

    

        const issueBook=await Book.findByIdAndUpdate(
            books._id,
            {
                $set:{
                    issue:true,
                    borrower:name,
                    number:mobile,
                    issueDate:Date.now()
                }
            },
            {new:true}
        )
        console.log("success",issueBook)
        return NextResponse.json({message:"Books fetched successfully",success:true,issueBook})
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}