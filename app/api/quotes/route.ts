import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://github.com/skolakoda/programming-quotes-api/raw/master/Data/quotes.json"
    );
    const quotes = await response.json();
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
