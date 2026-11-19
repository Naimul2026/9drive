import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Zod validation errors → 400 with field-level issues
  if (error instanceof ZodError) {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed.',
      issues: error.issues.map((i) => ({ path: i.path, message: i.message })),
    })
  }

  // Prisma known-request errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'The requested resource was not found.' })
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ code: 'CONFLICT', message: 'A record with that value already exists.' })
    }
  }

  // Log the real error server-side; never expose it to the client
  console.error('[error]', error instanceof Error ? error.stack || error.message : error)
  return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' })
}
