-- DropForeignKey
ALTER TABLE "public"."DecisionRecord" DROP CONSTRAINT "DecisionRecord_itemId_fkey";

-- AddForeignKey
ALTER TABLE "public"."DecisionRecord" ADD CONSTRAINT "DecisionRecord_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
