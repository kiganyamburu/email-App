import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailCompose } from '@/components/EmailCompose';
import { EmailHistory } from '@/components/EmailHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Send, 
  History, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';

export const EmailApp: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [activeTab, setActiveTab] = useState('compose');

  // Test email configuration on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/email-test');
        const result = await response.json();
        
        if (result.success) {
          setConnectionStatus('connected');
          toast.success('Email service is ready');
        } else {
          setConnectionStatus('error');
          toast.error('Email configuration error');
        }
      } catch (error) {
        setConnectionStatus('error');
        toast.error('Failed to connect to email service');
      }
    };

    testConnection();
  }, []);

  const ConnectionIndicator = () => {
    switch (connectionStatus) {
      case 'checking':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full" />
            Checking connection...
          </Badge>
        );
      case 'connected':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-600">
            <Wifi className="h-3 w-3" />
            Connected
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <WifiOff className="h-3 w-3" />
            Connection Error
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Email Sending App
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Send automated notifications and custom emails
                </p>
              </div>
            </div>
            <ConnectionIndicator />
          </div>

          {/* Connection Error Alert */}
          {connectionStatus === 'error' && (
            <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                Email service configuration error. Please check your SMTP settings in environment variables.
                You can still use the interface, but emails won't be sent until the configuration is fixed.
              </AlertDescription>
            </Alert>
          )}

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Send className="h-5 w-5 text-blue-600" />
                  Custom Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Send personalized emails to multiple recipients with HTML support
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Email Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Pre-built templates for notifications and password resets
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="h-5 w-5 text-purple-600" />
                  Email Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track email delivery status and view sending history
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <EmailCompose />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <EmailHistory />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Built with React, Express, and Nodemailer • 
            Configure SMTP settings in environment variables
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailApp;
