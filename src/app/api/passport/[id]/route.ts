import { NextRequest, NextResponse } from "next/server";

const CLOUDINARY_CLOUD_NAME = "i8fusryf";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const imageUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${id}.png`;

  return NextResponse.redirect(imageUrl);
}