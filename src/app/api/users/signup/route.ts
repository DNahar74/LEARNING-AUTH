//? We are using bcryptjs for hashing the password

import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { sendEmail } from "@/utils/mailer";

import { connectMongo } from "@/dbConfig/dbConfig";
import Users from "@/models/user.model";

connectMongo();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const {username, email, password} = reqBody;

    //todo: validate these parameters

    const user = await Users.findOne({email});
    if (user) {
      return NextResponse.json({ error: "User already exists", status: 400});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Users({
      username,
      email,
      password: hashedPassword
    })

    const savedUser = await newUser.save();
    console.log(savedUser);

    await sendEmail({email, emailType: "VERIFICATION", userId: savedUser._id})                            // Send verification email

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      savedUser
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message, 
      status: 500
    });
  }
}