/*
  Warnings:

  - You are about to drop the column `statur` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "statur",
ADD COLUMN     "status" "CommentStatus" NOT NULL DEFAULT 'APPROVED';
