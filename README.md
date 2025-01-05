# Dynamic Email Platform

A modern email generation platform that leverages Groq LLM for AI-powered email content creation. Built with Next.js 14, TypeScript, and Tailwind CSS.

<img width="945" alt="Screenshot 2025-01-05 at 8 21 53 PM" src="https://github.com/user-attachments/assets/b808bac3-5ebe-489e-8493-41a8b7ef930a" />

## Features

- 📧 AI-powered email content generation using Groq LLM
- 📝 Rich text editor for content customization
- 👥 Multiple recipient support
- 🚀 Real-time email preview
- 🎨 Clean, modern UI with Tailwind CSS
- 🌐 Responsive design
- ⚡ Server-side email handling with Nodemailer
- 🔔 Toast notifications for user feedback

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tiptap](https://tiptap.dev/) - Rich text editor
- [Groq](https://groq.com/) - LLM API for email generation
- [Nodemailer](https://nodemailer.com/) - Email sending
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- Groq API key
- SMTP server credentials

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dynamic-email-platform.git
cd dynamic-email-platform
```

2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
Create a .env.local file in the root directory:
```bash
GROQ_API_KEY=your_groq_api_key
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_EMAIL=your_from_email
SMTP_FROM_NAME=Your Company Name
```

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser.

## Acknowledgements

- Groq for their powerful LLM API
- shadcn/ui for the beautiful UI components
- Tiptap for the rich text editor
- Vercel for hosting inspiration
