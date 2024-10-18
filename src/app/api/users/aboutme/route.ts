import { NextRequest, NextResponse } from "next/server"

import { connectMongo } from "@/dbConfig/dbConfig";
import Users from "@/models/user.model";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectMongo();

export async function GET(req: NextRequest) {
  try {
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token", status: 401 });
    }

    const user = await Users.findById(userId).select("-password");
    //? select helps choose what fields to return and not - means it wont be returned
    
    if (!user) {
      return NextResponse.json({ error: "User does not exist", status: 400});
    }

    return NextResponse.json({
      message: "User found",
      user,
      success: true
    })
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message, 
      status: 500
    });
    
  }
}