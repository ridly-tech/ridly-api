import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()


const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Daniel',
    email: 'daniel@ridly.com.au',
    password: '$2a$10$Gj0LXd5cWQzWz6Xl4K7oY.WhrVTRyyWy227rspmCS200O2tMLyyna', // password
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
