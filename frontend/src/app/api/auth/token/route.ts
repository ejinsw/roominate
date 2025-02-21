import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  return NextResponse.json({ token: token ?? null, status: 200 });
}

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  return NextResponse.json({ message: "Sucess", status: 200 });
}

export async function DELETE() {
  const cookieStore = await cookies();

  cookieStore.delete("token");

  return NextResponse.json({ message: "Success", status: 200 });
}