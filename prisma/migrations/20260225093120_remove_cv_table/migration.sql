/*
  Warnings:

  - You are about to drop the column `cv_file_name` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `cv_file_path` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `cv_uploaded_at` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `cv_uploaded_by` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the `cvs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cvs" DROP CONSTRAINT "cvs_user_id_fkey";

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "cv_file_name",
DROP COLUMN "cv_file_path",
DROP COLUMN "cv_uploaded_at",
DROP COLUMN "cv_uploaded_by";

-- DropTable
DROP TABLE "cvs";

-- CreateTable
CREATE TABLE "candidate_cvs" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "original_file_name" TEXT NOT NULL,
    "stored_file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "is_latest" BOOLEAN NOT NULL DEFAULT false,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" TEXT,

    CONSTRAINT "candidate_cvs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "candidate_cvs" ADD CONSTRAINT "candidate_cvs_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
