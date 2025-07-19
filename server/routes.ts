import type { Express } from "express";
import { createServer, type Server } from "http";
import { Request, Response } from "express";
import { storage } from "./storage";
import { AuthService, requireAuth, requireSuperAdmin, type AuthRequest } from "./auth";
import { apiLimiter, authLimiter, sanitizeInput } from "./middleware";
import multer from "multer";
import { 
  insertBlogPostSchema, insertToolSchema, insertCountrySchema, insertGiftSchema, insertRechargePackageSchema,
  insertAdminUserSchema, insertSiteSettingSchema, insertAdsenseSchema, insertCoinRateSchema, 
  insertCommissionSettingSchema, loginSchema, updateBlogPostSchema, siteSettingsResponseSchema
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply middleware
  app.use('/api', apiLimiter);
  app.use(sanitizeInput);

  // =============================================================================
  // PUBLIC API ENDPOINTS
  // =============================================================================

  // Site settings for frontend injection
  app.get("/api/site-settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSiteSettings();
      const settingsObj: Record<string, string> = {};
      
      settings.forEach(setting => {
        settingsObj[setting.key] = setting.value || '';
      });

      const result = siteSettingsResponseSchema.safeParse({
        title: settingsObj.title || 'TokRecharge.com',
        metaTitle: settingsObj.metaTitle || 'TikTok Coin Calculator & Tools',
        metaDescription: settingsObj.metaDescription || 'Calculate TikTok coin values and more',
        logo: settingsObj.logo,
        favicon: settingsObj.favicon,
        googleAnalytics: settingsObj.googleAnalytics,
        googleSearchConsole: settingsObj.googleSearchConsole,
        facebookPixel: settingsObj.facebookPixel,
        verificationMeta: settingsObj.verificationMeta,
      });

      res.json(result.success ? result.data : settingsObj);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  // Tools endpoints
  app.get("/api/tools", async (req: Request, res: Response) => {
    try {
      const tools = await storage.getTools();
      res.json(tools);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tools" });
    }
  });

  app.get("/api/tools/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const tool = await storage.getToolBySlug(slug);
      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }
      res.json(tool);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tool" });
    }
  });

  // Countries endpoints
  app.get("/api/countries", async (req: Request, res: Response) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  app.get("/api/countries/:code", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const country = await storage.getCountryByCode(code.toUpperCase());
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch country" });
    }
  });

  // Gifts endpoints
  app.get("/api/gifts", async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const gifts = category 
        ? await storage.getGiftsByCategory(category as string)
        : await storage.getGifts();
      res.json(gifts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gifts" });
    }
  });

  // Blog posts endpoints (public - only published)
  app.get("/api/blog", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post || post.status !== 'published') {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Recharge packages endpoints
  app.get("/api/recharge-packages", async (req: Request, res: Response) => {
    try {
      const { countryId } = req.query;
      const packages = countryId 
        ? await storage.getRechargePackagesByCountry(parseInt(countryId as string))
        : await storage.getRechargePackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recharge packages" });
    }
  });

  // Coin rates endpoints
  app.get("/api/coin-rates", async (req: Request, res: Response) => {
    try {
      const { currency } = req.query;
      const rates = currency 
        ? await storage.getCoinRateByCurrency(currency as string)
        : await storage.getCoinRates();
      res.json(rates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coin rates" });
    }
  });

  // Commission settings endpoints
  app.get("/api/commission/:platform", async (req: Request, res: Response) => {
    try {
      const { platform } = req.params;
      const setting = await storage.getCommissionSettingByPlatform(platform);
      if (!setting) {
        return res.status(404).json({ error: "Commission setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch commission setting" });
    }
  });

  // AdSense ads by location
  app.get("/api/ads/:location", async (req: Request, res: Response) => {
    try {
      const { location } = req.params;
      const ads = await storage.getAdsenseAdsByLocation(location);
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ads" });
    }
  });

  // Get all AdSense ads (Admin)
  app.get("/api/admin/adsense", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const ads = await storage.getAdsenseAds();
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AdSense ads" });
    }
  });

  // Create AdSense ad (Admin)
  app.post("/api/admin/adsense", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const result = z.object({
        name: z.string().min(1),
        adSlot: z.string().min(1),
        adFormat: z.string(),
        location: z.string(),
        isActive: z.boolean(),
        code: z.string().optional()
      }).safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error.errors });
      }

      const ad = await storage.createAdsenseAd(result.data);
      res.json(ad);
    } catch (error) {
      res.status(500).json({ error: "Failed to create AdSense ad" });
    }
  });

  // Update AdSense ad (Admin)
  app.put("/api/admin/adsense/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = z.object({
        name: z.string().min(1),
        adSlot: z.string().min(1),
        adFormat: z.string(),
        location: z.string(),
        isActive: z.boolean(),
        code: z.string().optional()
      }).safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error.errors });
      }

      const ad = await storage.updateAdsenseAd(id, result.data);
      res.json(ad);
    } catch (error) {
      res.status(500).json({ error: "Failed to update AdSense ad" });
    }
  });

  // Delete AdSense ad (Admin)
  app.delete("/api/admin/adsense/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAdsenseAd(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete AdSense ad" });
    }
  });

  // =============================================================================
  // AUTHENTICATION ENDPOINTS
  // =============================================================================

  app.post("/api/auth/login", authLimiter, async (req: Request, res: Response) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error.errors });
      }

      const { username, password } = result.data;
      const authResult = await AuthService.login(username, password);
      
      res.json(authResult);
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Login failed" });
    }
  });

  app.post("/api/auth/verify", requireAuth, async (req: AuthRequest, res: Response) => {
    res.json({ user: req.user });
  });

  // =============================================================================
  // ADMIN ENDPOINTS (Protected)
  // =============================================================================

  // Dashboard stats
  app.get("/api/admin/dashboard", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const [
        totalTools,
        totalCountries,
        totalBlogPosts,
        recentVisitors,
        countryStats,
        pageStats,
        dailyStats
      ] = await Promise.all([
        storage.getTools().then(tools => tools.length),
        storage.getCountries().then(countries => countries.length),
        storage.getBlogPosts().then(posts => posts.length),
        storage.getVisitorLogs(100),
        storage.getVisitorStatsByCountry(),
        storage.getVisitorStatsByPage(),
        storage.getDailyVisitorCount()
      ]);

      res.json({
        stats: {
          totalTools,
          totalCountries,
          totalBlogPosts,
          totalVisitors: recentVisitors.length
        },
        recentVisitors: recentVisitors.slice(0, 10),
        analytics: {
          topCountries: countryStats.slice(0, 5),
          topPages: pageStats.slice(0, 5),
          dailyVisitors: dailyStats.slice(-7) // Last 7 days
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Admin user management
  app.get("/api/admin/users", requireAuth, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const users = await storage.getAdminUsers();
      // Remove password hashes from response
      const safeUsers = users.map(user => {
        const { passwordHash, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", requireAuth, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const result = insertAdminUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error.errors });
      }

      const hashedPassword = await AuthService.hashPassword(result.data.passwordHash);
      const user = await storage.createAdminUser({
        ...result.data,
        passwordHash: hashedPassword
      });

      const { passwordHash, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Site settings management
  app.get("/api/admin/settings", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings/:key", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      
      if (!value && value !== '') {
        return res.status(400).json({ error: "Value is required" });
      }

      const setting = await storage.updateSiteSetting(key, value);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }

      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  // Visitor analytics
  app.get("/api/admin/analytics/visitors", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const visitors = await storage.getVisitorLogs(limit);
      res.json(visitors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch visitor data" });
    }
  });

  app.get("/api/admin/analytics/countries", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const stats = await storage.getVisitorStatsByCountry();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch country stats" });
    }
  });

  app.get("/api/admin/analytics/pages", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const stats = await storage.getVisitorStatsByPage();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page stats" });
    }
  });

  // Blog management (admin - all posts)
  app.get("/api/admin/blog", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/admin/blog/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/admin/blog", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const result = insertBlogPostSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error.errors });
      }

      const post = await storage.createBlogPost(result.data);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = updateBlogPostSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error.errors });
      }

      const post = await storage.updateBlogPost(id, result.data);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // AdSense management
  app.get("/api/admin/adsense", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const ads = await storage.getAdsenseAds();
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ads" });
    }
  });

  app.post("/api/admin/adsense", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const result = insertAdsenseSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error.errors });
      }

      const ad = await storage.createAdsenseAd(result.data);
      res.status(201).json(ad);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ad" });
    }
  });

  app.put("/api/admin/adsense/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const ad = await storage.updateAdsenseAd(id, req.body);
      if (!ad) {
        return res.status(404).json({ error: "Ad not found" });
      }
      res.json(ad);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ad" });
    }
  });

  app.delete("/api/admin/adsense/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAdsenseAd(id);
      if (!success) {
        return res.status(404).json({ error: "Ad not found" });
      }
      res.json({ message: "Ad deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete ad" });
    }
  });

  // Tools management
  app.post("/api/admin/tools", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const result = insertToolSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input", details: result.error.errors });
      }

      const tool = await storage.createTool(result.data);
      res.status(201).json(tool);
    } catch (error) {
      res.status(500).json({ error: "Failed to create tool" });
    }
  });

  app.put("/api/admin/tools/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const tool = await storage.updateTool(id, req.body);
      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }
      res.json(tool);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tool" });
    }
  });

  app.delete("/api/admin/tools/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTool(id);
      if (!success) {
        return res.status(404).json({ error: "Tool not found" });
      }
      res.json({ message: "Tool deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete tool" });
    }
  });

  // File upload endpoint
  app.post("/api/admin/upload", requireAuth, upload.single('file'), async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // In a real app, you'd save to cloud storage (AWS S3, Cloudinary, etc.)
      // For now, we'll just return a mock URL
      const filename = `${Date.now()}-${req.file.originalname}`;
      const url = `/uploads/${filename}`;

      res.json({ url, filename });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}