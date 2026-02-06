import { motion } from 'framer-motion';
import { Clock, FileCheck, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const PendingApprovalPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2">
          <CardContent className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
                <Clock className="h-10 w-10 text-warning animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center text-foreground mb-3">
              Application Under Review
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Thank you for registering, {user?.name}!
            </p>

            {/* Status Card */}
            <Card className="bg-muted/50 mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">
                      Your documents are being reviewed
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our admin team is currently reviewing your submitted documents. This process typically takes 1-3 business days.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-muted-foreground">Documents received</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-warning animate-pulse"></div>
                        <span className="text-muted-foreground">Under review</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-muted"></div>
                        <span className="text-muted-foreground">Approval pending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What happens next */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-foreground">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Document Verification</p>
                    <p className="text-xs text-muted-foreground">
                      Our team will verify the authenticity of your submitted documents
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Admin Review</p>
                    <p className="text-xs text-muted-foreground">
                      An administrator will review your application and credentials
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Notification</p>
                    <p className="text-xs text-muted-foreground">
                      You'll receive an email once your application is approved or if we need additional information
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email notification */}
            <Card className="bg-blue-500/10 border-blue-500/20 mb-6">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Check your email
                    </p>
                    <p className="text-xs text-muted-foreground">
                      We'll send updates to <span className="font-medium">{user?.email}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important note */}
            <Card className="bg-warning/10 border-warning/20 mb-6">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Important
                    </p>
                    <p className="text-xs text-muted-foreground">
                      You won't be able to access the platform until your application is approved. Please ensure your email is correct and check your spam folder.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={logout}
              >
                Logout
              </Button>
              <Button
                variant="default"
                className="flex-1"
                asChild
              >
                <Link to="/auth/login">
                  Back to Login
                </Link>
              </Button>
            </div>

            {/* Support */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              Need help? Contact us at{' '}
              <a href="mailto:support@afedulight.com" className="text-primary hover:underline">
                support@afedulight.com
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PendingApprovalPage;
