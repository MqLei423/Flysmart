-- CreateTable
CREATE TABLE "Airport" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lon" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Route" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "originCode" TEXT NOT NULL,
    "destCode" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "aircraft" TEXT NOT NULL,
    "lieFlat" BOOLEAN NOT NULL,
    CONSTRAINT "Route_originCode_fkey" FOREIGN KEY ("originCode") REFERENCES "Airport" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_destCode_fkey" FOREIGN KEY ("destCode") REFERENCES "Airport" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
