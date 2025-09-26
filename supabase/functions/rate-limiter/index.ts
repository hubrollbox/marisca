// Rate limiting utility for Supabase Edge Functions
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyPrefix: string; // Prefix for rate limit keys
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limiting (for demonstration - use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private cleanupExpired() {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime <= now) {
        rateLimitStore.delete(key);
      }
    }
  }

  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanupExpired();
    
    const key = `${this.config.keyPrefix}:${identifier}`;
    const now = Date.now();
    const resetTime = now + this.config.windowMs;

    const existing = rateLimitStore.get(key);
    
    if (!existing || existing.resetTime <= now) {
      // First request or window expired
      rateLimitStore.set(key, { count: 1, resetTime });
      return { 
        allowed: true, 
        remaining: this.config.maxRequests - 1, 
        resetTime 
      };
    }

    if (existing.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return { 
        allowed: false, 
        remaining: 0, 
        resetTime: existing.resetTime 
      };
    }

    // Increment counter
    existing.count++;
    rateLimitStore.set(key, existing);

    return { 
      allowed: true, 
      remaining: this.config.maxRequests - existing.count, 
      resetTime: existing.resetTime 
    };
  }
}

// Pre-configured rate limiters
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  keyPrefix: 'auth'
});

export const paymentRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 3, // 3 payment requests per minute
  keyPrefix: 'payment'
});

export const adminRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 admin operations per minute
  keyPrefix: 'admin'
});

// Helper function to get client IP
export function getClientIP(req: Request): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  const xRealIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  return (
    cfConnectingIP ||
    xRealIP ||
    (xForwardedFor && xForwardedFor.split(',')[0].trim()) ||
    'unknown'
  );
}

// Security logging function
export function logSecurityEvent(event: string, details: any) {
  console.log(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    ...details
  });
}