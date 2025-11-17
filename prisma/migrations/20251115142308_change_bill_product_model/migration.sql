/*
  Warnings:

  - You are about to drop the column `productId` on the `BillProduct` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `BillProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BillProduct" DROP CONSTRAINT "BillProduct_productId_fkey";

-- DropIndex
DROP INDEX "BillProduct_productId_idx";

-- AlterTable
ALTER TABLE "BillProduct" DROP COLUMN "productId",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Product";
