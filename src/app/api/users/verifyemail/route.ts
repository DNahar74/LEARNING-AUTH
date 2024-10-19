import { NextRequest, NextResponse } from "next/server"

import { connectMongo } from "@/dbConfig/dbConfig";
import Users from "@/models/user.model";

connectMongo();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();

    const {token} = reqBody;
    if (!token) {
      return NextResponse.json({ error: "No token provided"}, { status: 401});
    }

    console.log(token);

    const user = await Users.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() }                                        //? this checks if the token has expired
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token"}, { status: 400});
    }

    console.log(user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true
    })
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message}, 
      { status: 500}
    );
  }
}