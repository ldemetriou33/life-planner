import { NextResponse } from "next/server";
import { getEmails } from "../../../lib/emailStorage";

export async function GET() {
  try {
    const emails = await getEmails();
    return NextResponse.json({ emails, count: emails.length });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails', emails: [], count: 0 },
      { status: 500 }
    );
  }
}

