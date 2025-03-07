import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import User from "@/models/userModel"; // Import your MongoDB User model
import {connect} from '@/dbConfig/dbConfig'// MongoDB connection function

export async function POST(req) {
  await connect();
  const { email } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

console.log("first")
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.tokenExpiry = Date.now() + 36000000;
  await user.save();

  console.log("Updated user:", user);
  const resend = new Resend(process.env.RESEND_API_KEY);

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

  const data = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: "Reset Your Password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
  console.log("success",data)

  return NextResponse.json({ message: "Password reset link sent to your email." });
}
