// Development Helper Component - Firebase Status
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { checkFirebaseServices, getFirebaseSetupInstructions, type FirebaseServiceStatus } from '@/lib/firebaseChecker';

export const FirebaseStatus = () => {
  const [status, setStatus] = useState<FirebaseServiceStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const serviceStatus = await checkFirebaseServices();
      setStatus(serviceStatus);
    } catch (error) {
      console.error('Error checking Firebase status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Only show in development mode
    if (import.meta.env.DEV) {
      checkStatus();
    }
  }, []);

  // Don't render in production
  if (!import.meta.env.DEV || !status) {
    return null;
  }

  const allServicesEnabled = status.auth && status.firestore;
  const instructions = getFirebaseSetupInstructions(status);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant={allServicesEnabled ? "default" : "destructive"}
        size="sm"
        className="mb-2 shadow-lg"
      >
        <Settings className="h-4 w-4 mr-2" />
        Firebase Status
        {allServicesEnabled ? (
          <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
        )}
      </Button>

      {/* Status Panel */}
      {isVisible && (
        <Alert className={`w-80 shadow-lg ${allServicesEnabled ? 'border-green-500' : 'border-red-500'}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-semibold">Firebase Services Status:</div>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  {status.auth ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                  Authentication: {status.auth ? 'Enabled' : 'Disabled'}
                </div>
                
                <div className="flex items-center gap-2">
                  {status.firestore ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                  Firestore: {status.firestore ? 'Enabled' : 'Disabled'}
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-blue-500" />
                  Storage: Cloudinary (External)
                </div>
              </div>

              {!allServicesEnabled && (
                <div className="mt-3 p-2 bg-muted rounded text-xs">
                  <div className="font-semibold mb-1">Setup Instructions:</div>
                  {instructions.map((instruction, index) => (
                    <div key={index} className="mb-1">{instruction}</div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <Button
                  onClick={checkStatus}
                  disabled={isChecking}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  {isChecking ? 'Checking...' : 'Refresh'}
                </Button>
                
                <Button
                  onClick={() => window.open('https://console.firebase.google.com/project/eduvaza-cfbec', '_blank')}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  Open Console
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};