import JSZip from "jszip";

/**
 * Removes document protection from a .docx file
 * Handles: forms, readOnly, comments, trackedChanges protections
 */
export async function unprotectDocx(buffer: Buffer): Promise<Buffer> {
  const zip = await JSZip.loadAsync(buffer);

  // Get the settings.xml file
  const settingsFile = zip.file("word/settings.xml");
  if (!settingsFile) {
    throw new Error("Invalid docx file: word/settings.xml not found");
  }

  let settingsXml = await settingsFile.async("string");

  // Remove the documentProtection element
  // Handles both self-closing and regular tags
  // <w:documentProtection ... /> or <w:documentProtection ...>...</w:documentProtection>
  const protectionRegex =
    /<w:documentProtection[^>]*(?:\/>|>.*?<\/w:documentProtection>)/gs;

  const hadProtection = protectionRegex.test(settingsXml);

  if (hadProtection) {
    settingsXml = settingsXml.replace(protectionRegex, "");
    zip.file("word/settings.xml", settingsXml);
  }

  // Generate the new docx file
  const newBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  return newBuffer;
}
