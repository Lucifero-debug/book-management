import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest,NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

connect()

export async function POST(request){
try {
    const reqBody = await request.json()
    const {username,password} =reqBody


   const user= await User.findOne({username})
   if (!user) {
    return NextResponse.json({error:"User not made"},{status:400})
   }
 const validPassword = await bcryptjs.compare(password,user.password)
 if (!validPassword) {
    return NextResponse.json({error:"check your credentials"},{status:400})
 }
 const tokenData = {
    id:user._id,
    username:user.username,
    email:user.email
 }

 const token=  jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:'1d'})

const response =NextResponse.json({
    message:"Logged IN Success",
    success:true,
    token   
 })

response.cookies.set("token",token,{
    httpOnly:true
})
return response

} catch (error) {
    return NextResponse.json({error:error.message},{status:500})
}
}