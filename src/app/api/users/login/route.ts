import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

import { connectMongo } from "@/dbConfig/dbConfig";
import Users from "@/models/user.model";

connectMongo();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const {email, password} = reqBody;

    //todo: validate these parameters

    const user = await Users.findOne({email});
    if (!user) {
      return NextResponse.json({ error: "User does not exist"}, { status: 400});
    }

    console.log(user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Please check your credentials"}, { status: 400});
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    }

    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '1D'});

    const response = NextResponse.json({
      message: "User logged in successfully",
      success: true
    })

    response.cookies.set("token", token, {
      httpOnly: true                                                  //? Means the user cannot change the cookies in the browser
    })

    return response;
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message}, 
      { status: 500}
    );
  }
}