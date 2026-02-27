import type { UploadResult } from "./types";
import { parseLinkedInXlsx } from "./parse-xlsx";
import { parseCompanyXls } from "./parse-company-xls";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function detectAndParse(XLSX: any, buffer: ArrayBuffer): UploadResult {
  const workbook = XLSX.read(buffer, { type: "array", cellDates: false });
  const sheetNames = workbook.SheetNames.map((s: string) => s.toLowerCase());

  if (sheetNames.includes("metrics") && sheetNames.includes("all posts")) {
    return { type: "company", data: parseCompanyXls(XLSX, buffer) };
  }

  // Creator format has ENGAGEMENT and TOP POSTS sheets
  if (
    sheetNames.some((s: string) => s.includes("engagement")) &&
    sheetNames.some((s: string) => s.includes("top post"))
  ) {
    return { type: "creator", data: parseLinkedInXlsx(XLSX, buffer) };
  }

  throw new Error(
    "Unrecognized file format. Upload a LinkedIn Creator or Company Page analytics export."
  );
}
