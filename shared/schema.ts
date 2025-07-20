import { pgTable, text, serial, integer, decimal, boolean, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  currency: text("currency").notNull(),
  coinRate: decimal("coin_rate", { precision: 10, scale: 6 }).notNull(),
  flag: text("flag").notNull(),
  isActive: boolean("is_active").default(true),
});

export const gifts = pgTable("gifts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  coinCost: integer("coin_cost").notNull(),
  diamondValue: integer("diamond_value").notNull(),
  category: text("category").notNull(),
  rarity: text("rarity").notNull(),
  isActive: boolean("is_active").default(true),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  focusKeyword: text("focus_keyword"),
  canonicalUrl: text("canonical_url"),
  ogImage: text("og_image"),
  category: text("category").default("general"),
  tags: text("tags"),
  featuredImage: text("featured_image"),
  coverImage: text("cover_image"),
  featured: boolean("featured").default(false),
  status: text("status").default("draft"), // draft, published, scheduled
  readingTime: integer("reading_time"), // in minutes
  wordCount: integer("word_count"),
  fleschScore: text("flesch_score"),
  headings: json("headings").$type<Array<{level: number, text: string, anchor: string}>>(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rechargePackages = pgTable("recharge_packages", {
  id: serial("id").primaryKey(),
  countryId: integer("country_id").references(() => countries.id),
  coins: integer("coins").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  isActive: boolean("is_active").default(true),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("admin"), // admin, super_admin
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site settings table
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: text("type").default("text"), // text, image, json, boolean
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Visitor tracking table
export const visitorLogs = pgTable("visitor_logs", {
  id: serial("id").primaryKey(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  country: text("country"),
  city: text("city"),
  userAgent: text("user_agent"),
  referer: text("referer"),
  page: text("page").notNull(),
  visitedAt: timestamp("visited_at").defaultNow(),
});

// AdSense ads table
export const adsense = pgTable("adsense", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  adCode: text("ad_code").notNull(),
  location: text("location").notNull(), // header, sidebar, footer, inside-tool
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Coin rates table for dynamic management
export const coinRates = pgTable("coin_rates", {
  id: serial("id").primaryKey(),
  currency: text("currency").notNull().unique(), // USD, EUR, INR, etc.
  rate: decimal("rate", { precision: 10, scale: 6 }).notNull(), // 1 coin = rate in currency
  symbol: text("symbol").notNull(), // $, €, ₹, etc.
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Commission settings
export const commissionSettings = pgTable("commission_settings", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull().unique(), // tiktok, youtube, etc.
  commissionPercent: decimal("commission_percent", { precision: 5, scale: 2 }).notNull(),
  minimumWithdraw: decimal("minimum_withdraw", { precision: 10, scale: 2 }),
  currency: text("currency").notNull(),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  createdAt: true,
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

export const insertGiftSchema = createInsertSchema(gifts).omit({
  id: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});



export const insertRechargePackageSchema = createInsertSchema(rechargePackages).omit({
  id: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertVisitorLogSchema = createInsertSchema(visitorLogs).omit({
  id: true,
  visitedAt: true,
});

export const insertAdsenseSchema = createInsertSchema(adsense).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCoinRateSchema = createInsertSchema(coinRates).omit({
  id: true,
  updatedAt: true,
});

export const insertCommissionSettingSchema = createInsertSchema(commissionSettings).omit({
  id: true,
  updatedAt: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

// Update blog post schema
export const updateBlogPostSchema = insertBlogPostSchema.partial();

// Site settings response schema
export const siteSettingsResponseSchema = z.object({
  title: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  googleAnalytics: z.string().optional(),
  googleSearchConsole: z.string().optional(),
  facebookPixel: z.string().optional(),
  verificationMeta: z.string().optional(),
});

export type Tool = typeof tools.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Gift = typeof gifts.$inferSelect;
export type InsertGift = z.infer<typeof insertGiftSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type RechargePackage = typeof rechargePackages.$inferSelect;
export type InsertRechargePackage = z.infer<typeof insertRechargePackageSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type VisitorLog = typeof visitorLogs.$inferSelect;
export type InsertVisitorLog = z.infer<typeof insertVisitorLogSchema>;
export type Adsense = typeof adsense.$inferSelect;
export type InsertAdsense = z.infer<typeof insertAdsenseSchema>;
export type CoinRate = typeof coinRates.$inferSelect;
export type InsertCoinRate = z.infer<typeof insertCoinRateSchema>;
export type CommissionSetting = typeof commissionSettings.$inferSelect;
export type InsertCommissionSetting = z.infer<typeof insertCommissionSettingSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SiteSettingsResponse = z.infer<typeof siteSettingsResponseSchema>;
