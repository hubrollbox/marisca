import { useCallback } from 'react';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export const useLogger = () => {
  const log = useCallback((level: LogLevel, message: string, metadata?: Record<string, any>) => {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata
    };

    // In development, log to console
    if (import.meta.env.DEV) {
      console[level](`[${level.toUpperCase()}] ${message}`, metadata);
    }

    // In production, you might want to send to a logging service
    if (import.meta.env.PROD) {
      // Example: Send to external logging service
      // loggingService.send(entry);
      
      // For now, we'll store critical errors in localStorage for debugging
      if (level === 'error') {
        try {
          const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
          errors.push(entry);
          // Keep only last 10 errors
          const recentErrors = errors.slice(-10);
          localStorage.setItem('app_errors', JSON.stringify(recentErrors));
        } catch (e) {
          console.error('Failed to store error log:', e);
        }
      }
    }
  }, []);

  const debug = useCallback((message: string, metadata?: Record<string, any>) => {
    log('debug', message, metadata);
  }, [log]);

  const info = useCallback((message: string, metadata?: Record<string, any>) => {
    log('info', message, metadata);
  }, [log]);

  const warn = useCallback((message: string, metadata?: Record<string, any>) => {
    log('warn', message, metadata);
  }, [log]);

  const error = useCallback((message: string, metadata?: Record<string, any>) => {
    log('error', message, metadata);
  }, [log]);

  return {
    debug,
    info,
    warn,
    error,
    log
  };
};
