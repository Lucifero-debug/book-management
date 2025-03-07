import {connect} from '@/dbConfig/dbConfig'
import { NextRequest,NextResponse } from 'next/server'



export async function POST(request){
    try {
       await connect()
       const response= NextResponse.json({
            messge:"Logout Successfully",
             success:true
        })
        response.cookies.set("token","",{
            httpOnly:true,
            expires:new Date(0)
        })
        return response
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}