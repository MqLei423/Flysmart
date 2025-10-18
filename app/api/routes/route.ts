import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const routes = await prisma.route.findMany({
    include: {
      origin: true,
      destination: true,
      airline: true,
      aircrafts: true,
    },
  });
  return NextResponse.json(routes);
}
