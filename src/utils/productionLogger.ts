/**
 * Production Logger
 * Handles logging in production environment with proper error tracking
 */

interface LogData {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
}

class ProductionLogger {
  private isProduction = import.meta.env.PROD;
  private isDevelopment = import.meta.env.DEV;

  private formatLogData(level: LogData['level'], message: string, data?: any): LogData {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };
  }

  private getCurrentUserId(): string | undefined {
    try {
      // Get user ID from localStorage or context
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || user.user_id;
      }
    } catch (error) {
      // Ignore errors in getting user ID
    }
    return undefined;
  }

  private sendToMonitoringService(logData: LogData) {
    if (!this.isProduction) return;

    try {
      // In production, send to monitoring service
      // Example: Sentry, LogRocket, or custom monitoring
      console.log('[MONITORING]', logData);
      
      // Example implementation for external monitoring:
      // fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logData)
      // }).catch(() => {
      //   // Ignore monitoring errors
      // });
    } catch (error) {
      // Ignore monitoring errors to prevent infinite loops
    }
  }

  info(message: string, data?: any) {
    const logData = this.formatLogData('info', message, data);
    
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data);
    }
    
    this.sendToMonitoringService(logData);
  }

  warn(message: string, data?: any) {
    const logData = this.formatLogData('warn', message, data);
    
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
    
    this.sendToMonitoringService(logData);
  }

  error(message: string, error?: Error, data?: any) {
    const logData = this.formatLogData('error', message, {
      ...data,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
    
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error, data);
    }
    
    this.sendToMonitoringService(logData);
  }

  debug(message: string, data?: any) {
    if (!this.isDevelopment) return;
    
    const logData = this.formatLogData('debug', message, data);
    console.debug(`[DEBUG] ${message}`, data);
  }

  // Performance logging
  performance(operation: string, startTime: number, data?: any) {
    const duration = performance.now() - startTime;
    const logData = this.formatLogData('info', `Performance: ${operation}`, {
      ...data,
      duration: `${duration.toFixed(2)}ms`
    });
    
    if (this.isDevelopment) {
      console.log(`[PERFORMANCE] ${operation}: ${duration.toFixed(2)}ms`, data);
    }
    
    this.sendToMonitoringService(logData);
  }

  // User action logging
  userAction(action: string, data?: any) {
    const logData = this.formatLogData('info', `User Action: ${action}`, data);
    
    if (this.isDevelopment) {
      console.log(`[USER ACTION] ${action}`, data);
    }
    
    this.sendToMonitoringService(logData);
  }

  // API call logging
  apiCall(method: string, url: string, status: number, duration: number, data?: any) {
    const logData = this.formatLogData('info', `API Call: ${method} ${url}`, {
      ...data,
      method,
      url,
      status,
      duration: `${duration.toFixed(2)}ms`
    });
    
    if (this.isDevelopment) {
      console.log(`[API] ${method} ${url} - ${status} (${duration.toFixed(2)}ms)`, data);
    }
    
    this.sendToMonitoringService(logData);
  }
}

// Export singleton instance
export const logger = new ProductionLogger();

// Export individual methods for convenience
export const { info, warn, error, debug, performance, userAction, apiCall } = logger;
