-- CreateTable
CREATE TABLE "public"."DecisionRecord" (
    "id" SERIAL NOT NULL,
    "type" "public"."Decision" NOT NULL,
    "notes" TEXT,
    "itemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DecisionRecord" ADD CONSTRAINT "DecisionRecord_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
