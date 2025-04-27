import { authOptions } from "@/common/nextAuth";
import { prisma } from "@/common/prisma";
import { getServerSession } from "next-auth";

export default async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return null;
    }
  
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return null;
    }
    return user;

  } catch {
    return null;
  } 
}