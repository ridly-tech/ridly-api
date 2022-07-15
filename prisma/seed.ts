import { PrismaClient, Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    firstName: 'Daniel',
    lastName: 'Lord-Doyle',
    email: 'tech@ridly.com.au',
    password: '$2a$10$8yuES8eIrlZDmds3CNSznuNIPeb3h5A5BQfxOgeoy0OtjjzAVrbcW', // password
    role: 'admin',
    phone: '0451087593',
    image: 'image coming later'
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
