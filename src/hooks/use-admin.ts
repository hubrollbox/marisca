import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;
      
      if (!user?.id) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (error && error.code !== 'PGRST116') {
          // Log security event - potential unauthorized access attempt
          console.warn('Admin check failed:', { 
            userId: user.id, 
            email: user.email,
            timestamp: new Date().toISOString()
          });
          throw error;
        }

        const hasAdminRole = !!data;
        setIsAdmin(hasAdminRole);

        // Log admin access for security monitoring
        if (hasAdminRole) {
          console.info('Admin access granted:', {
            userId: user.id,
            email: user.email,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
}