/**
 * 🛡️ Security Layer - TAMV MD-X4™
 * Advanced security, fraud prevention, and compliance
 */

export interface SecurityEvent {
  type: 'auth' | 'data_access' | 'transaction' | 'anomaly' | 'threat';
  severity: 'info' | 'warning' | 'critical';
  userId?: string;
  details: Record<string, any>;
  timestamp: Date;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: any) => string;
}

export interface InputValidationRule {
  field: string;
  type: 'string' | 'number' | 'email' | 'url' | 'json';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

class SecurityLayer {
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
  private auditLog: SecurityEvent[] = [];
  private blockedIPs: Set<string> = new Set();
  private suspiciousPatterns: RegExp[] = [
    /(\<script\>)|(\<\/script\>)/gi, // XSS
    /(union.*select)|(select.*from)|(insert.*into)/gi, // SQL injection
    /(\.\.\/)|(\.\.\/%2F)/gi, // Path traversal
  ];

  /**
   * Validate and sanitize input
   */
  validateInput(input: any, rules: InputValidationRule[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = input[rule.field];

      // Check required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      if (value === undefined || value === null) continue;

      // Type validation
      switch (rule.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${rule.field} must be a string`);
          } else {
            if (rule.minLength && value.length < rule.minLength) {
              errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
            }
            if (rule.maxLength && value.length > rule.maxLength) {
              errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
            }
            if (rule.pattern && !rule.pattern.test(value)) {
              errors.push(`${rule.field} format is invalid`);
            }
          }
          break;

        case 'number':
          if (typeof value !== 'number' && isNaN(Number(value))) {
            errors.push(`${rule.field} must be a number`);
          }
          break;

        case 'email':
          const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
          if (!emailPattern.test(value)) {
            errors.push(`${rule.field} must be a valid email`);
          }
          break;

        case 'url':
          try {
            new URL(value);
          } catch {
            errors.push(`${rule.field} must be a valid URL`);
          }
          break;

        case 'json':
          try {
            JSON.parse(value);
          } catch {
            errors.push(`${rule.field} must be valid JSON`);
          }
          break;
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push(`${rule.field} failed custom validation`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize input to prevent XSS/injection
   */
  sanitizeInput(input: string): string {
    let sanitized = input;

    // Remove suspicious patterns
    this.suspiciousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // HTML encode special characters
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#x27;',
      '/': '&#x2F;'
    };

    sanitized = sanitized.replace(/[&<>"'\/]/g, char => htmlEscapes[char]);

    return sanitized;
  }

  /**
   * Rate limiting check
   */
  checkRateLimit(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.rateLimitStore.get(key);

    if (!record || now >= record.resetTime) {
      // Reset or new entry
      const resetTime = now + config.windowMs;
      this.rateLimitStore.set(key, { count: 1, resetTime });
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime
      };
    }

    if (record.count >= config.maxRequests) {
      // Rate limit exceeded
      this.logSecurityEvent({
        type: 'anomaly',
        severity: 'warning',
        details: { key, message: 'Rate limit exceeded' },
        timestamp: new Date()
      });

      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      };
    }

    // Increment counter
    record.count++;
    this.rateLimitStore.set(key, record);

    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime
    };
  }

  /**
   * Detect anomalous behavior
   */
  detectAnomaly(userId: string, action: string, metadata?: Record<string, any>): boolean {
    // Check for rapid successive actions
    const recentEvents = this.auditLog
      .filter(e => e.userId === userId && e.timestamp > new Date(Date.now() - 60000))
      .length;

    if (recentEvents > 100) {
      this.logSecurityEvent({
        type: 'anomaly',
        severity: 'critical',
        userId,
        details: { action, message: 'Suspicious rapid activity detected', metadata },
        timestamp: new Date()
      });
      return true;
    }

    return false;
  }

  /**
   * Block IP address
   */
  blockIP(ip: string, reason: string): void {
    this.blockedIPs.add(ip);
    this.logSecurityEvent({
      type: 'threat',
      severity: 'critical',
      details: { ip, reason },
      timestamp: new Date()
    });
  }

  /**
   * Check if IP is blocked
   */
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Log security event
   */
  logSecurityEvent(event: SecurityEvent): void {
    this.auditLog.push(event);

    // Keep only last 10000 events
    if (this.auditLog.length > 10000) {
      this.auditLog.shift();
    }

    // In production: send to external logging service
    if (event.severity === 'critical') {
      console.error('🚨 CRITICAL SECURITY EVENT:', event);
    }
  }

  /**
   * Get security audit log
   */
  getAuditLog(filters?: {
    userId?: string;
    type?: SecurityEvent['type'];
    severity?: SecurityEvent['severity'];
    since?: Date;
  }): SecurityEvent[] {
    let filtered = this.auditLog;

    if (filters) {
      if (filters.userId) {
        filtered = filtered.filter(e => e.userId === filters.userId);
      }
      if (filters.type) {
        filtered = filtered.filter(e => e.type === filters.type);
      }
      if (filters.severity) {
        filtered = filtered.filter(e => e.severity === filters.severity);
      }
      if (filters.since) {
        filtered = filtered.filter(e => e.timestamp >= filters.since!);
      }
    }

    return filtered;
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate CSRF token
   */
  validateCSRFToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken || token.length !== expectedToken.length) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    let result = 0;
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Get security headers for HTTP responses
   */
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  /**
   * Hash password securely
   */
  async hashPassword(password: string): Promise<string> {
    // In production: use bcrypt or argon2
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify password hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  /**
   * Clear rate limit for a key
   */
  clearRateLimit(key: string): void {
    this.rateLimitStore.delete(key);
  }

  /**
   * Get security metrics
   */
  getMetrics(): {
    totalEvents: number;
    criticalEvents: number;
    blockedIPs: number;
    rateLimitedKeys: number;
  } {
    return {
      totalEvents: this.auditLog.length,
      criticalEvents: this.auditLog.filter(e => e.severity === 'critical').length,
      blockedIPs: this.blockedIPs.size,
      rateLimitedKeys: this.rateLimitStore.size
    };
  }
}

export const securityLayer = new SecurityLayer();
