import { NextRequest, NextResponse } from "next/server";

const CLOUDINARY_CLOUD_NAME = "i8fusryf";
const CLOUDINARY_UPLOAD_PRESET = "hh_goa_passport";

export async function POST(request: NextRequest) {
  try {
    const incoming = await request.formData();
    const image = incoming.get("image") as File | null;

    if (!image) {
      return NextResponse.json({ error: "missing_image" }, { status: 400 });
    }

    const uploadForm = new FormData();
    uploadForm.append("file", image, "builder-passport.png");
    uploadForm.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: uploadForm }
    );

    const uploadText = await uploadRes.text();

    if (!uploadRes.ok) {
      let detail = uploadText;
      try {
        detail = JSON.parse(uploadText)?.error?.message || uploadText;
      } catch {
      }
      throw new Error(`Cloudinary upload failed (${uploadRes.status}): ${detail}`);
    }

    const uploadData = JSON.parse(uploadText) as { public_id: string };

    return NextResponse.json({ id: uploadData.public_id });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}