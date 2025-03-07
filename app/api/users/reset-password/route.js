import { NextResponse } from "next/server";
import User from "@/models/userModel"; 
import bcrypt from "bcryptjs";
import {connect} from '@/dbConfig/dbConfig'

export async function POST(req) {
  await connect();
  const { token, newPassword } = await req.json();

  const user = await User.findOne({
    resetToken: token,
    tokenExpiry: { $gt: Date.now() }, 
  });
console.log("firsr",user)
  if (!user) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  user.password = await bcrypt.hash(newPassword, 10); 
  user.resetToken = undefined;
  user.tokenExpiry = undefined;
  await user.save();
console.log("second")
  return NextResponse.json({ message: "Password successfully reset!" });
}
