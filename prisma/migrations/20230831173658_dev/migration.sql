/*
  Warnings:

  - You are about to drop the column `stripe_current_period_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_current_period_end]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_stripe_current_period_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripe_current_period_id",
ADD COLUMN     "stripe_current_period_end" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_current_period_end_key" ON "users"("stripe_current_period_end");
