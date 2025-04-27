'use server'

import { prisma } from "@/common/prisma"
import bcrypt from "bcryptjs"

export default async function registerNewUser(formData: FormData) {
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")
  if ( !name || !email || !password ) {
    throw new Error("cannot register")
  }

  const hashedPassword = await bcrypt.hash(password as string, 12)
  console.log(name, email, password, hashedPassword)
  await prisma.user.create({
    data: {
      name: name as string,
      email: email as string,    
      hashedPassword: hashedPassword,
    }
  })
}