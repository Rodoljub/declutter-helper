-- AlterTable
ALTER TABLE "public"."Item" ALTER COLUMN "decision" DROP NOT NULL,
ALTER COLUMN "decision" DROP DEFAULT;
