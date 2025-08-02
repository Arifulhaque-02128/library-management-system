import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req : NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("TOKEN :::", token);
  
  const isAdmin = token?.role === "ADMIN";
  const isAdminSpecificRoute = req.nextUrl.pathname.startsWith("/admin");
  
  if (!isAdmin && isAdminSpecificRoute) {
    console.log("Can't browse admin authenticated route.")
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isUserAuthenticated = token?.role === "USER" && token?.user_status === "APPROVED";
  const isUserAuthenticatedRoute = req.nextUrl.pathname.startsWith("/user");

  if(!isUserAuthenticated && isUserAuthenticatedRoute) {
    console.log("Can't browse user authenticated route.");
    return NextResponse.redirect(new URL("/", req.url));
  }
  
  return NextResponse.next();
}