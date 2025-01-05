"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Bold, Italic, List, Link } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapLink from "@tiptap/extension-link";
import { toast } from "sonner";

const EmailPlatform = () => {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, TipTapLink],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-5 focus:outline-none",
      },
    },
  });

  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="border-b p-2 flex gap-2">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const generateEmail = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt for email generation");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate email");

      const data = await response.json();
      editor?.commands.setContent(data.email);
      toast.success("Email generated successfully");
    } catch (error) {
      toast.error("Failed to generate email");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!editor) return;

    if (!recipients) {
      toast.error("Please enter recipients");
      return;
    }

    if (!subject) {
      toast.error("Please enter a subject");
      return;
    }

    if (editor.isEmpty) {
      toast.error("Please generate or write an email body");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/send-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          recipients: recipients.split(",").map((email) => email.trim()),
          subject,
          content: editor.getHTML(),
        }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      const data = await response.json();
      if (data.success) {
        toast.success("Email sent successfully");
        setRecipients("");
        setSubject("");
        setPrompt("");
        editor.commands.setContent("");
      }
    } catch (error) {
      toast.error("Failed to send email");
      console.error("Error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-white shadow-lg">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold mb-6">Dynamic Email Platform</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Recipients (comma-separated)
              </label>
              <Input
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="john@example.com, jane@example.com"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Prompt
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt for AI email generation..."
                className="w-full min-h-24"
              />
              <Button
                onClick={generateEmail}
                disabled={isLoading}
                className="mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Email"
                )}
              </Button>
            </div>

            {editor && (
              <div className="border rounded-md overflow-hidden">
                <MenuBar />
                <EditorContent editor={editor} className="min-h-[200px]" />
              </div>
            )}
          </div>

          <Button onClick={sendEmail} className="w-full mt-4">
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailPlatform;
