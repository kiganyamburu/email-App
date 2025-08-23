/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Email sending request and response types
 */
export interface SendEmailRequest {
  to: string[];
  subject: string;
  message: string;
  isHtml?: boolean;
  template?: "notification" | "password-reset";
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
}

export interface EmailHistoryItem {
  id: string;
  to: string[];
  subject: string;
  status: "sent" | "failed" | "pending";
  sentAt: string;
  error?: string;
}
