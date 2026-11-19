import type { NextFunction, Request, Response } from 'express'
import { prisma } from '../config/prisma.js'
import { verifyAccessToken } from '../utils/jwt.js'

export type AuthRequest = Request & {
  user?: { id: string; sessionId: string; role?: string; isAdmin?: boolean }
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = req.header('Authorization')
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ code: 'AUTH_REQUIRED', message: 'Bearer token required.' })
    const payload = verifyAccessToken(header.slice(7))
    const session = await prisma.userSession.findUnique({ where: { id: payload.sid } })
    if (!session || session.revokedAt || session.expiresAt < new Date()) return res.status(401).json({ code: 'AUTH_SESSION_EXPIRED', message: 'Session expired.' })
    // Verify the session actually belongs to the user claimed in the token
    if (session.userId !== payload.sub) return res.status(401).json({ code: 'AUTH_INVALID_TOKEN', message: 'Invalid token.' })
    req.user = { id: payload.sub, sessionId: payload.sid }
    return next()
  } catch {
    return res.status(401).json({ code: 'AUTH_INVALID_TOKEN', message: 'Invalid token.' })
  }
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ code: 'AUTH_REQUIRED', message: 'Authentication required.' })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, role: true, isAdmin: true, createdAt: true },
    })

    if (!user) {
      return res.status(401).json({ code: 'USER_NOT_FOUND', message: 'User not found.' })
    }

    // Role-based authorization: check if marked admin or if oldest user in database
    let isAdmin = user.isAdmin || user.role === 'admin'
    if (!isAdmin) {
      const firstUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' }, select: { id: true } })
      if (firstUser && firstUser.id === user.id) {
        isAdmin = true
      }
    }

    if (!isAdmin) {
      return res.status(403).json({ code: 'FORBIDDEN', message: 'Admin access required.' })
    }

    req.user.isAdmin = true
    req.user.role = 'admin'
    return next()
  } catch (error) {
    return next(error)
  }
}
