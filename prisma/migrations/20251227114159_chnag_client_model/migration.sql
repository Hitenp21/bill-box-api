/*
  Warnings:

  - A unique constraint covering the columns `[email,user_id]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber,user_id]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "clients_email_key";

-- DropIndex
DROP INDEX "clients_phoneNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_user_id_key" ON "clients"("email", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_phoneNumber_user_id_key" ON "clients"("phoneNumber", "user_id");
