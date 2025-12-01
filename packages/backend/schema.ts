import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Internal auth tables
  ...authTables,

  // User profile (linked to auth user)
  userProfiles: defineTable({
    userId: v.id("users"), // id coming from authTables
    role: v.union(v.literal("student"), v.literal("tutor"), v.literal("admin")),
    displayName: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_role", ["role"]),

  // Student profile
  studentProfiles: defineTable({
    userId: v.id("users"), // id coming from authTables
    displayName: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Tutor profile
  tutorProfiles: defineTable({
    userId: v.id("users"), // id coming from authTables
    displayName: v.string(),
    bio: v.string(),
    subjectIds: v.array(v.id("subjects")),
    hourlyCreditsPrice: v.number(), // ex: credits per session
    avatarStorageId: v.optional(v.id("_storage")), // for profile picture later
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_subject", ["subjectIds"]),

  // Subjects
  subjects: defineTable({
    name: v.string(),
    slug: v.string(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_name", ["name"]),

  // Sessions
  sessions: defineTable({
    studentProfileId: v.id("studentProfiles"),
    tutorProfileId: v.id("tutorProfiles"),
    subjectId: v.id("subjects"),
    startTime: v.number(), // Date.now() in ms
    endTime: v.optional(v.number()),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    creditsCost: v.number(),

    // Integration with Agora (can start empty / fake)
    agoraChannelName: v.optional(v.string()),
    agoraHostPassPhrase: v.optional(v.string()),
    agoraViewerPassPhrase: v.optional(v.string()),
    videoSessionUrl: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tutor_and_time", ["tutorProfileId", "startTime"])
    .index("by_student_and_time", ["studentProfileId", "startTime"])
    .index("by_status_and_time", ["status", "startTime"]),
});
