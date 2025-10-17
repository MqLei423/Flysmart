/*
  Warnings:

  - You are about to drop the column `aircraft` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `airline` on the `Route` table. All the data in the column will be lost.
  - Added the required column `aircraftCode` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airlineCode` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Airline" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Aircraft" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "model" TEXT NOT NULL,
    "class" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Route" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "originCode" TEXT NOT NULL,
    "destCode" TEXT NOT NULL,
    "airlineCode" TEXT NOT NULL,
    "aircraftCode" TEXT NOT NULL,
    "lieFlat" BOOLEAN NOT NULL,
    "frequency" TEXT NOT NULL,
    CONSTRAINT "Route_originCode_fkey" FOREIGN KEY ("originCode") REFERENCES "Airport" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_destCode_fkey" FOREIGN KEY ("destCode") REFERENCES "Airport" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_airlineCode_fkey" FOREIGN KEY ("airlineCode") REFERENCES "Airline" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_aircraftCode_fkey" FOREIGN KEY ("aircraftCode") REFERENCES "Aircraft" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Route" ("destCode", "frequency", "id", "lieFlat", "originCode") SELECT "destCode", "frequency", "id", "lieFlat", "originCode" FROM "Route";
DROP TABLE "Route";
ALTER TABLE "new_Route" RENAME TO "Route";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
