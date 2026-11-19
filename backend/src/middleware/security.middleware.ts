import type { NextFunction, Request, Response } from 'express'

const oneYearSeconds = 60 * 60 * 24 * 365

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('X-DNS-Prefetch-Control', 'off')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  // Allow the separate frontend origin to embed previews/downloads.
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')

  const forwardedProto = req.header('x-forwarded-proto')
  const isHttps = req.secure || forwardedProto === 'https' || forwardedProto?.startsWith('https,')
  if (isHttps) res.setHeader('Strict-Transport-Security', `max-age=${oneYearSeconds}; includeSubDomains`)

  next()
}
