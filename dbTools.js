import { PrismaClient } from '@prisma/client'
import { __esModule } from 'prisma';

const prisma = new PrismaClient()

export async function createUser({name, email, college}){
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      college,
    },
  })
  return newUser;
}

export async function getAllUsers(){
  const users = await prisma.user.findMany();
  return users;
}

