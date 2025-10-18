-- CreateTable
CREATE TABLE "airport" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "airport_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "route" (
    "id" SERIAL NOT NULL,
    "originCode" TEXT NOT NULL,
    "destCode" TEXT NOT NULL,
    "lieFlat" BOOLEAN NOT NULL DEFAULT true,
    "frequency" TEXT NOT NULL DEFAULT 'Year-round',

    CONSTRAINT "route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airline" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "airline_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "aircraft" (
    "code" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "class" TEXT NOT NULL,

    CONSTRAINT "aircraft_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "_airlineToroute" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_airlineToroute_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_aircraftToroute" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_aircraftToroute_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_airlineToroute_B_index" ON "_airlineToroute"("B");

-- CreateIndex
CREATE INDEX "_aircraftToroute_B_index" ON "_aircraftToroute"("B");

-- AddForeignKey
ALTER TABLE "route" ADD CONSTRAINT "route_originCode_fkey" FOREIGN KEY ("originCode") REFERENCES "airport"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route" ADD CONSTRAINT "route_destCode_fkey" FOREIGN KEY ("destCode") REFERENCES "airport"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_airlineToroute" ADD CONSTRAINT "_airlineToroute_A_fkey" FOREIGN KEY ("A") REFERENCES "airline"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_airlineToroute" ADD CONSTRAINT "_airlineToroute_B_fkey" FOREIGN KEY ("B") REFERENCES "route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_aircraftToroute" ADD CONSTRAINT "_aircraftToroute_A_fkey" FOREIGN KEY ("A") REFERENCES "aircraft"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_aircraftToroute" ADD CONSTRAINT "_aircraftToroute_B_fkey" FOREIGN KEY ("B") REFERENCES "route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
