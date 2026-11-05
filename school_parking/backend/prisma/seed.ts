import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.parkingSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default' },
    update: {},
  })

  const email = process.env.SEED_USER_EMAIL?.trim().toLocaleLowerCase('en-US')
  const password = process.env.SEED_USER_PASSWORD
  if (!email || !password) {
    console.log('Default parking settings are ready. Register an account through the app to get started.')
    return
  }
  if (password.length < 12) {
    throw new Error('SEED_USER_PASSWORD must contain at least 12 characters.')
  }

  const passwordHash = await hash(password, 12)
  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, name: 'Người dùng Parkly' },
    update: { passwordHash, name: 'Người dùng Parkly' },
  })

  console.log('Default parking settings and configured account are ready.')
}

seed()
  .catch((error: unknown) => {
    console.error('Failed to initialize the application.', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
