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

  // public_id from Cloudinary can contain folder slashes (e.g. "hh_goa_passport/abc123"),
  // which arrive here URL-encoded as %2F in a single [id] segment — decode before use.
  const publicId = decodeURIComponent(id);

  // f_auto lets Cloudinary pick the best/actual format instead of us guessing an extension.
  const imageUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto/${publicId}`;

  const upstream = await fetch(imageUrl, { cache: "no-store" });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "not_found", detail: `Cloudinary responded ${upstream.status} for ${publicId}` },
      { status: 404 }
    );
  }

  const contentType = upstream.headers.get("content-type") || "image/png";

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}