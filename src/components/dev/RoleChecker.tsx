import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Development component to debug user roles
 * Add this to any page to see current user info
 */
export const RoleChecker = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 z-50 border-2 border-destructive">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            Not Authenticated
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const isAdmin = user.role === 'super_admin';
  const roleColor = isAdmin ? 'bg-green-500' : 'bg-yellow-500';

  return (
    <Card className={`fixed bottom-4 right-4 w-80 z-50 border-2 ${isAdmin ? 'border-green-500' : 'border-yellow-500'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          {isAdmin ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              Admin Role Detected
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Role Issue Detected
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <span className="font-semibold">Email:</span>
          <p className="text-muted-foreground break-all">{user.email}</p>
        </div>
        <div>
          <span className="font-semibold">Name:</span>
          <p className="text-muted-foreground">{user.name}</p>
        </div>
        <div>
          <span className="font-semibold">Current Role:</span>
          <div className="mt-1">
            <Badge className={roleColor}>
              {user.role || 'undefined'}
            </Badge>
          </div>
        </div>
        <div>
          <span className="font-semibold">Expected Role:</span>
          <div className="mt-1">
            <Badge className="bg-green-500">super_admin</Badge>
          </div>
        </div>
        {!isAdmin && (
          <div className="mt-3 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
            <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
              ⚠️ Role Mismatch!
            </p>
            <p className="text-yellow-600 dark:text-yellow-400 mt-1">
              Update Firestore role to: <code className="bg-black/10 px-1 rounded">super_admin</code>
            </p>
          </div>
        )}
        <div className="mt-3 pt-3 border-t">
          <span className="font-semibold">User ID:</span>
          <p className="text-muted-foreground break-all text-[10px]">{user.id}</p>
        </div>
      </CardContent>
    </Card>
  );
};
