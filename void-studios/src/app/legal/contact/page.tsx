"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/lib/api-client";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const res = await apiFetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ name, email, message }),
    });
    setSending(false);
    if (res.ok) {
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Message sent! We'll be in touch.");
    } else {
      toast.error(res.error || "Failed to send message");
    }
  };

  return (
    <>
      <h1 className="font-display text-3xl font-bold">Contact us</h1>
      <p>Have a question or need help? Send us a message and we&apos;ll get back to you.</p>

      <div className="not-prose mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Mail className="h-4 w-4 text-primary" /> support@voidstudios.app
      </div>

      {sent ? (
        <div className="not-prose mt-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-6">
          <MessageSquare className="h-5 w-5 text-primary" />
          <p className="text-sm">Thanks! Your message has been received.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="not-prose mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <Button type="submit" disabled={sending}>{sending ? "Sending…" : "Send message"}</Button>
        </form>
      )}
    </>
  );
}
