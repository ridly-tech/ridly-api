import {
  PrismaClient,
  Prisma,
  TimeWindow,
  TypeOfRubbish,
  Role,
} from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    firstName: 'Dan',
    lastName: 'Lord',
    email: 'tech@ridly.com.au',
    password: '$2a$10$8yuES8eIrlZDmds3CNSznuNIPeb3h5A5BQfxOgeoy0OtjjzAVrbcW', // password
    role: 'admin' as Role,
    phone: '0451087593',
    image: 'busy man',
  },
  {
    firstName: 'Tom',
    lastName: 'Piehler',
    email: 'tom@ridly.com.au',
    password: '$2a$10$8yuES8eIrlZDmds3CNSznuNIPeb3h5A5BQfxOgeoy0OtjjzAVrbcW', // password
    role: 'admin' as Role,
    phone: '0123456789',
    image: 'handsome man',
  },
  {
    firstName: 'Larry',
    lastName: 'David',
    email: 'larry@ridly.com.au',
    password: '$2a$10$8yuES8eIrlZDmds3CNSznuNIPeb3h5A5BQfxOgeoy0OtjjzAVrbcW', // password
    role: 'driver' as Role,
    phone: '9876543210',
    image: 'old man',
  },
]

const jobData = [
  {
    street: '6/2a Dumaresq Road',
    suburb: 'Rose Bay',
    city: 'Sydney',
    postcode: '2029',
    timeWindow: 'six_am' as TimeWindow,
    typeOfRubbish: [
      'fridge' as TypeOfRubbish,
      'mattress' as TypeOfRubbish,
      'sofa' as TypeOfRubbish,
    ],
    bookingDateTime: '2007-12-03T10:15:30Z',
  },
  {
    street: '27 Beach Road',
    suburb: 'Bondi Beach',
    city: 'Sydney',
    postcode: '2026',
    timeWindow: 'none' as TimeWindow,
    typeOfRubbish: ['misc' as TypeOfRubbish],
    bookingDateTime: '2007-11-03T12:15:30Z',
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
  const dan = await prisma.user.findUnique({
    where: {
      email: 'tech@ridly.com.au',
    },
  })
  if (dan) {
    const danId = dan.id
    for (const j of jobData) {
      const job = await prisma.job.create({
        data: {
          ownerId: danId,
          ...j,
        },
      })
      console.log(`Created job with id: ${job.id}`)
    }
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
