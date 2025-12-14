-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "isSampleBill" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "bills_isSampleBill_idx" ON "bills"("isSampleBill");
