/*
  Warnings:

  - Added the required column `frequency` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Route" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "originCode" TEXT NOT NULL,
    "destCode" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "aircraft" TEXT NOT NULL,
    "lieFlat" BOOLEAN NOT NULL,
    "frequency" TEXT NOT NULL,
    CONSTRAINT "Route_originCode_fkey" FOREIGN KEY ("originCode") REFERENCES "Airport" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_destCode_fkey" FOREIGN KEY ("destCode") REFERENCES "Airport" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Route" ("aircraft", "airline", "destCode", "id", "lieFlat", "originCode") SELECT "aircraft", "airline", "destCode", "id", "lieFlat", "originCode" FROM "Route";
DROP TABLE "Route";
ALTER TABLE "new_Route" RENAME TO "Route";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
