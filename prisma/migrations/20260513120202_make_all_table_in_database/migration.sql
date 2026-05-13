-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- DropForeignKey
ALTER TABLE "LogTemperature" DROP CONSTRAINT "LogTemperature_userId_fkey";

-- DropForeignKey
ALTER TABLE "Onbording" DROP CONSTRAINT "Onbording_userId_fkey";

-- CreateTable
CREATE TABLE "groups" (
    "groupId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "groupCategoryId" TEXT NOT NULL,
    "groupCoverPicture" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("groupId")
);

-- CreateTable
CREATE TABLE "group_categories" (
    "groupCategoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_categories_pkey" PRIMARY KEY ("groupCategoryId")
);

-- CreateTable
CREATE TABLE "group_members" (
    "groupMemberId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("groupMemberId")
);

-- CreateTable
CREATE TABLE "group_posts" (
    "groupPostId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_posts_pkey" PRIMARY KEY ("groupPostId")
);

-- CreateTable
CREATE TABLE "partner_messages" (
    "partnerMessageId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_messages_pkey" PRIMARY KEY ("partnerMessageId")
);

-- CreateTable
CREATE TABLE "post_reactions" (
    "postReactionId" TEXT NOT NULL,
    "groupPostId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reaction" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("postReactionId")
);

-- CreateIndex
CREATE INDEX "groups_groupId_idx" ON "groups"("groupId");

-- CreateIndex
CREATE INDEX "groups_groupName_idx" ON "groups"("groupName");

-- CreateIndex
CREATE INDEX "group_categories_groupCategoryId_idx" ON "group_categories"("groupCategoryId");

-- CreateIndex
CREATE INDEX "group_categories_name_idx" ON "group_categories"("name");

-- CreateIndex
CREATE INDEX "group_members_groupMemberId_idx" ON "group_members"("groupMemberId");

-- CreateIndex
CREATE INDEX "group_members_groupId_idx" ON "group_members"("groupId");

-- CreateIndex
CREATE INDEX "group_members_userId_idx" ON "group_members"("userId");

-- CreateIndex
CREATE INDEX "group_posts_groupPostId_idx" ON "group_posts"("groupPostId");

-- CreateIndex
CREATE INDEX "group_posts_groupId_idx" ON "group_posts"("groupId");

-- CreateIndex
CREATE INDEX "group_posts_userId_idx" ON "group_posts"("userId");

-- CreateIndex
CREATE INDEX "partner_messages_partnerMessageId_idx" ON "partner_messages"("partnerMessageId");

-- CreateIndex
CREATE INDEX "partner_messages_senderId_idx" ON "partner_messages"("senderId");

-- CreateIndex
CREATE INDEX "partner_messages_receiverId_idx" ON "partner_messages"("receiverId");

-- CreateIndex
CREATE INDEX "post_reactions_postReactionId_idx" ON "post_reactions"("postReactionId");

-- CreateIndex
CREATE INDEX "post_reactions_groupPostId_idx" ON "post_reactions"("groupPostId");

-- CreateIndex
CREATE INDEX "post_reactions_userId_idx" ON "post_reactions"("userId");

-- AddForeignKey
ALTER TABLE "LogTemperature" ADD CONSTRAINT "LogTemperature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Onbording" ADD CONSTRAINT "Onbording_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_groupCategoryId_fkey" FOREIGN KEY ("groupCategoryId") REFERENCES "group_categories"("groupCategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_posts" ADD CONSTRAINT "group_posts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_posts" ADD CONSTRAINT "group_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_messages" ADD CONSTRAINT "partner_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_messages" ADD CONSTRAINT "partner_messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_groupPostId_fkey" FOREIGN KEY ("groupPostId") REFERENCES "group_posts"("groupPostId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
