import type { NextFunction, Request, Response } from 'express'

type Bucket = { count: number; resetAt: number }

type RateLimitOptions = {
  /** Window length in milliseconds. */
  windowMs: number
  /** Maximum requests allowed per key inside the window. */
  max: number
  /** Namespace so different limiters keep independent counters. */
  keyPrefix: string
}

const buckets = new Map<string, Bucket>()
let insertsSinceSweep = 0

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/**
 * Small dependency-free fixed-window rate limiter. Intended for a single
 * backend instance; behind a reverse proxy it keys on the forwarded client IP.
 */
export function rateLimit({ windowMs, max, keyPrefix }: RateLimitOptions) {
  return function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const now = Date.now()
    const identity = req.ip || req.socket.remoteAddress || 'unknown'
    const key = `${keyPrefix}:${identity}`

    let bucket = buckets.get(key)
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs }
      buckets.set(key, bucket)
      if (++insertsSinceSweep >= 500) {
        insertsSinceSweep = 0
        sweep(now)
      }
    }

    bucket.count += 1
    const remaining = Math.max(0, max - bucket.count)
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))

    res.setHeader('RateLimit-Limit', String(max))
    res.setHeader('RateLimit-Remaining', String(remaining))
    res.setHeader('RateLimit-Reset', String(retryAfterSeconds))

    if (bucket.count > max) {
      res.setHeader('Retry-After', String(retryAfterSeconds))
      return res.status(429).json({ code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' })
    }

    return next()
  }
}
