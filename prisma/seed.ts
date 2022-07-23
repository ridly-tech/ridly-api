import { PrismaClient, Prisma } from '@prisma/client'
import { getUserId } from '../src/utils'


const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    firstName: 'Daniel',
    lastName: 'Lord-Doyle',
    email: 'tech@ridly.com.au',
    password: '$2a$10$8yuES8eIrlZDmds3CNSznuNIPeb3h5A5BQfxOgeoy0OtjjzAVrbcW', // password
    role: 'admin',
    phone: '0451087593',
    image: 'image coming later',
  },
]

const createJobData = (userId: string) => {
  return ({
    ownerId: userId,
    creatorId: userId,
    street: '6/2a Dumaresq Road',
    suburb: 'Rose Bay',
    city: 'Sydney',
    postcode: '2029',
  })
}

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
    const jobData = createJobData(user.id)
    const job = await prisma.job.create({
      data: jobData
    })
    console.log(`A new job has been created with id: ${job.id}`)
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
