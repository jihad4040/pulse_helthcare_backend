-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('SUSPEND', 'INACTIVE', 'ACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "Createntials" AS ENUM ('GOOGLE', 'CREDENTIALS', 'APPLE');

-- CreateEnum
CREATE TYPE "verifidStatus" AS ENUM ('SUSPEND', 'INACTIVE', 'ACTIVE', 'PENDING');

-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "profile" TEXT,
    "age" INTEGER,
    "otp" TEXT,
    "refreshToken" TEXT,
    "creadientials" TEXT,
    "fcmToken" TEXT,
    "status" "status" NOT NULL DEFAULT 'PENDING',
    "credentials" "Createntials"[] DEFAULT ARRAY['CREDENTIALS']::"Createntials"[],
    "isNotification" BOOLEAN NOT NULL DEFAULT true,
    "isAgree" BOOLEAN NOT NULL DEFAULT false,
    "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "verifidStatus" "verifidStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "LogTemperature" (
    "temperatureId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temperature" DECIMAL(4,1) NOT NULL,
    "isFahrenheit" BOOLEAN NOT NULL DEFAULT true,
    "timeMeasured" TEXT DEFAULT '',
    "note" TEXT DEFAULT '',
    "quickTag" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogTemperature_pkey" PRIMARY KEY ("temperatureId")
);

-- CreateTable
CREATE TABLE "Onbording" (
    "onbordingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lifeStage" TEXT NOT NULL,
    "whereFrom" TEXT NOT NULL,
    "helthData" JSONB NOT NULL,

    CONSTRAINT "Onbording_pkey" PRIMARY KEY ("onbordingId")
);

-- CreateTable
CREATE TABLE "groups" (
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
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

-- CreateTable
CREATE TABLE "notifications" (
    "notificationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notificationId")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "commentId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupPostId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("commentId")
);

-- CreateTable
CREATE TABLE "comment_reactions" (
    "reactionId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reaction" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_reactions_pkey" PRIMARY KEY ("reactionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_userId_idx" ON "users"("userId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_verifidStatus_idx" ON "users"("verifidStatus");

-- CreateIndex
CREATE INDEX "LogTemperature_userId_idx" ON "LogTemperature"("userId");

-- CreateIndex
CREATE INDEX "LogTemperature_temperatureId_idx" ON "LogTemperature"("temperatureId");

-- CreateIndex
CREATE UNIQUE INDEX "Onbording_userId_key" ON "Onbording"("userId");

-- CreateIndex
CREATE INDEX "Onbording_userId_idx" ON "Onbording"("userId");

-- CreateIndex
CREATE INDEX "Onbording_onbordingId_idx" ON "Onbording"("onbordingId");

-- CreateIndex
CREATE INDEX "Onbording_email_idx" ON "Onbording"("email");

-- CreateIndex
CREATE INDEX "Onbording_name_idx" ON "Onbording"("name");

-- CreateIndex
CREATE INDEX "groups_groupId_idx" ON "groups"("groupId");

-- CreateIndex
CREATE INDEX "groups_groupName_idx" ON "groups"("groupName");

-- CreateIndex
CREATE INDEX "group_categories_groupCategoryId_idx" ON "group_categories"("groupCategoryId");

-- CreateIndex
CREATE INDEX "group_categories_name_idx" ON "group_categories"("name");

-- CreateIndex
CREATE INDEX "group_categories_isDeleted_idx" ON "group_categories"("isDeleted");

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

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_notificationId_idx" ON "notifications"("notificationId");

-- CreateIndex
CREATE INDEX "post_comments_userId_idx" ON "post_comments"("userId");

-- CreateIndex
CREATE INDEX "post_comments_groupPostId_idx" ON "post_comments"("groupPostId");

-- CreateIndex
CREATE INDEX "post_comments_parentId_idx" ON "post_comments"("parentId");

-- CreateIndex
CREATE INDEX "comment_reactions_commentId_idx" ON "comment_reactions"("commentId");

-- CreateIndex
CREATE INDEX "comment_reactions_userId_idx" ON "comment_reactions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_reactions_commentId_userId_key" ON "comment_reactions"("commentId", "userId");

-- AddForeignKey
ALTER TABLE "LogTemperature" ADD CONSTRAINT "LogTemperature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Onbording" ADD CONSTRAINT "Onbording_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_groupCategoryId_fkey" FOREIGN KEY ("groupCategoryId") REFERENCES "group_categories"("groupCategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "post_comments"("commentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_groupPostId_fkey" FOREIGN KEY ("groupPostId") REFERENCES "group_posts"("groupPostId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "post_comments"("commentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

