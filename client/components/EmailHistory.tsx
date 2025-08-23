import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  RefreshCw,
  History,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";
import { EmailHistoryItem } from "@shared/api";
import { toast } from "sonner";

export const EmailHistory: React.FC = () => {
  const [emails, setEmails] = useState<EmailHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/email-history");
      if (response.ok) {
        const data = await response.json();
        setEmails(data);
      } else {
        toast.error("Failed to fetch email history");
      }
    } catch (error) {
      toast.error("Network error occurred");
      console.error("Error fetching email history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusIcon = (status: EmailHistoryItem["status"]) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: EmailHistoryItem["status"]) => {
    switch (status) {
      case "sent":
        return "default";
      case "failed":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <CardTitle>Email History</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHistory}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        <CardDescription>
          View the status and details of previously sent emails
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emails.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No emails sent yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {emails.map((email, index) => (
                <div key={email.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(email.status)}
                        <h4 className="font-medium truncate">
                          {email.subject}
                        </h4>
                        <Badge
                          variant={getStatusVariant(email.status)}
                          className="ml-auto"
                        >
                          {email.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Users className="h-3 w-3" />
                        <span>
                          {email.to.length === 1
                            ? email.to[0]
                            : `${email.to.length} recipients`}
                        </span>
                        <span>•</span>
                        <span>{formatDate(email.sentAt)}</span>
                      </div>

                      {email.to.length > 1 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {email.to.slice(0, 3).map((recipient, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {recipient}
                            </Badge>
                          ))}
                          {email.to.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{email.to.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {email.error && (
                        <p className="text-sm text-destructive bg-destructive/10 rounded p-2 mt-2">
                          Error: {email.error}
                        </p>
                      )}
                    </div>
                  </div>

                  {index < emails.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
