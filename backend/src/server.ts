import { app } from './app.js'
import { env } from './config/env.js'
import { prisma } from './config/prisma.js'

async function init() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE \`users\` ADD COLUMN \`role\` VARCHAR(32) NOT NULL DEFAULT 'user'`)
  } catch {}
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE \`users\` ADD COLUMN \`is_admin\` BOOLEAN NOT NULL DEFAULT false`)
  } catch {}

  // Ensure first registered user is granted admin status
  try {
    const firstUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } })
    if (firstUser && (!firstUser.isAdmin || firstUser.role !== 'admin')) {
      await prisma.user.update({
        where: { id: firstUser.id },
        data: { role: 'admin', isAdmin: true },
      })
      console.log(`[security] Promoted first user (${firstUser.email}) to administrator.`)
    }
  } catch (err) {
    console.warn('[security] Could not verify/promote first user to admin:', err)
  }

  app.listen(env.APP_PORT, () => {
    console.log(`Backend running on http://localhost:${env.APP_PORT}`)
  })
}

init().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
