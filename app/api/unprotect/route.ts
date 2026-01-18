import { NextRequest, NextResponse } from "next/server";
import { unprotectDocx } from "@/lib/docx-unprotect";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".docx")) {
      return NextResponse.json(
        { error: "File must be a .docx file" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const unprotectedBuffer = await unprotectDocx(buffer);

    // Generate the output filename
    const originalName = file.name.replace(/\.docx$/i, "");
    const outputFilename = `${originalName}_unprotected.docx`;

    return new NextResponse(new Uint8Array(unprotectedBuffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${outputFilename}"`,
      },
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
