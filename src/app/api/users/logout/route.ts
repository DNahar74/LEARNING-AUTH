import { NextResponse } from "next/server"
import { connectMongo } from "@/dbConfig/dbConfig";

connectMongo();

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "User logged out successfully",
      success: true
    })

    response.cookies.set("token", "", {
      httpOnly: true,                                                  //? Means the user cannot change the cookies in the browser
      expires: new Date(0),                                            //? Removes the cookie from the browser
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