import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const routes = await prisma.route.findMany({
    include: {
      origin: true,
      destination: true,
      airline: true,
      aircraft: true,
    },
  });
  return NextResponse.json(routes);
}
