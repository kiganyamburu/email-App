import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { X, Send, Plus, Mail } from "lucide-react";
import { toast } from "sonner";
import { SendEmailRequest, SendEmailResponse } from "@shared/api";

const emailSchema = z.object({
  recipients: z
    .array(z.string().email("Invalid email address"))
    .min(1, "At least one recipient is required"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject too long"),
  message: z.string().min(1, "Message is required"),
  template: z.enum(["none", "notification", "password-reset"]).default("none"),
  isHtml: z.boolean().default(false),
});

type EmailFormData = z.infer<typeof emailSchema>;

export const EmailCompose: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recipientInput, setRecipientInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      recipients: [],
      subject: "",
      message: "",
      template: "none",
      isHtml: false,
    },
  });

  const recipients = watch("recipients");
  const template = watch("template");
  const isHtml = watch("isHtml");

  const addRecipient = () => {
    if (recipientInput.trim()) {
      const email = recipientInput.trim();
      if (recipients.includes(email)) {
        toast.error("Email already added");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format");
        return;
      }

      setValue("recipients", [...recipients, email]);
      setRecipientInput("");
    }
  };

  const removeRecipient = (email: string) => {
    setValue(
      "recipients",
      recipients.filter((r) => r !== email),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRecipient();
    }
  };

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const requestData: SendEmailRequest = {
        to: data.recipients,
        subject: data.subject,
        message: data.message,
        isHtml: data.isHtml,
        template: data.template !== "none" ? data.template : undefined,
      };

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result: SendEmailResponse = await response.json();

      if (result.success) {
        toast.success("Email sent successfully!");
        reset();
      } else {
        toast.error(`Failed to send email: ${result.message}`);
      }
    } catch (error) {
      toast.error("Network error occurred");
      console.error("Email sending error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const templateDescriptions = {
    none: "Custom email content",
    notification: "Automated notification template",
    "password-reset": "Password reset template with secure styling",
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Compose Email
        </CardTitle>
        <CardDescription>
          Send emails to multiple recipients with customizable templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Recipients */}
          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients</Label>
            <div className="flex gap-2">
              <Input
                id="recipients"
                type="email"
                placeholder="Enter email address"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRecipient}
                className="px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Recipients list */}
            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {recipients.map((email, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {email}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => removeRecipient(email)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {errors.recipients && (
              <p className="text-sm text-destructive">
                {errors.recipients.message}
              </p>
            )}
          </div>

          {/* Email Template */}
          <div className="space-y-2">
            <Label htmlFor="template">Email Template</Label>
            <Select
              value={template}
              onValueChange={(value) => setValue("template", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Custom Email</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
                <SelectItem value="password-reset">Password Reset</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {templateDescriptions[template]}
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              {...register("subject")}
              placeholder={
                template === "password-reset"
                  ? "Subject will be auto-generated"
                  : "Enter email subject"
              }
              disabled={template === "password-reset"}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder={
                template === "password-reset"
                  ? "Enter the password reset link"
                  : "Enter your email message"
              }
              rows={8}
              className="resize-none"
            />
            {errors.message && (
              <p className="text-sm text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* HTML Toggle */}
          {template === "none" && (
            <div className="flex items-center space-x-2">
              <Switch
                id="isHtml"
                checked={isHtml}
                onCheckedChange={(checked) => setValue("isHtml", checked)}
              />
              <Label htmlFor="isHtml">Send as HTML</Label>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || recipients.length === 0}
            className="w-full"
          >
            {isLoading ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
