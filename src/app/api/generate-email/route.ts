// app/api/generate-email/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert email writer. Format your responses with proper spacing and paragraphs. Include appropriate salutations and closings. Separate paragraphs with line breaks. Do not include any HTML tags - just focus on the content structure with proper spacing and line breaks.",
            },
            {
              role: "user",
              content: `Write a professional email with the following instructions: ${prompt}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      throw new Error(
        `API error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    console.log("Groq API Response:", data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from Groq API");
    }

    // Convert the plain text to HTML with proper formatting
    const plainText = data.choices[0].message.content;
    const htmlContent = convertToHTML(plainText);

    return NextResponse.json({ email: htmlContent }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate email",
      },
      { status: 500 }
    );
  }
}

function convertToHTML(text: string) {
  // Split text into paragraphs
  const paragraphs = text.split("\n\n");

  // Basic email template with some styling
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      ${paragraphs
        .map((para) =>
          // If the paragraph is empty or just whitespace, return a spacer div
          !para.trim()
            ? '<div style="height: 16px;"></div>'
            : `<p style="margin: 0 0 16px 0;">${para
                .replace(/\n/g, "<br/>") // Convert single line breaks to <br/>
                .trim()}</p>`
        )
        .join("")}
    </div>
  `.trim();
}
