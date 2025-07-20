import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save, 
  ArrowLeft, 
  Image, 
  Upload,
  Eye,
  Globe,
  Star,
  Calendar,
  Tag,
  Hash,
  FileText,
  Search,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLayout from "@/components/admin/AdminLayout";

// Validation schema for SEO-optimized blog posts
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be under 100 characters"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(50, "Excerpt should be at least 50 characters").max(160, "Excerpt should be under 160 characters"),
  content: z.string().min(100, "Content should be at least 100 characters"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published"]),
  featuredImage: z.string().optional(),
  metaTitle: z.string().min(30, "Meta title should be at least 30 characters").max(70, "Meta title should be under 70 characters"),
  metaDescription: z.string().min(120, "Meta description should be at least 120 characters").max(160, "Meta description should be under 160 characters"),
  keywords: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean(),
});

type BlogFormData = z.infer<typeof blogPostSchema>;

export default function AdminBlogEditPage() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [editorContent, setEditorContent] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [seoScore, setSeoScore] = useState(0);
  const editorRef = useRef<any>(null);
  
  const token = localStorage.getItem("admin_token");
  const isEdit = id !== "new";

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "tiktok-coins",
      status: "draft",
      featuredImage: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      tags: "",
      featured: false,
    },
  });

  // Fetch existing blog post if editing
  const { data: blogPost, isLoading } = useQuery({
    queryKey: ["/api/admin/blog", id],
    queryFn: async () => {
      if (!isEdit) return null;
      return await fetch(`/api/admin/blog/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      }).then(res => res.json());
    },
    enabled: isEdit,
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Auto-generate meta title and description
  const generateMetaFromContent = (title: string, content: string) => {
    const metaTitle = title.length > 60 ? title.substring(0, 57) + "..." : title;
    const plainContent = content.replace(/<[^>]*>/g, '').substring(0, 155);
    const metaDescription = plainContent.length === 155 ? plainContent + "..." : plainContent;
    
    return { metaTitle, metaDescription };
  };

  // SEO Analysis function
  const calculateSEOScore = (formData: Partial<BlogFormData>) => {
    let score = 0;
    const checks = [];

    // Title optimization (25 points)
    if (formData.title) {
      if (formData.title.length >= 30 && formData.title.length <= 70) {
        score += 15;
        checks.push({ type: "success", message: "Title length is SEO optimized" });
      } else {
        checks.push({ type: "warning", message: "Title should be 30-70 characters for better SEO" });
      }
      
      if (formData.title.toLowerCase().includes("tiktok") || formData.title.toLowerCase().includes("coin")) {
        score += 10;
        checks.push({ type: "success", message: "Title contains target keywords" });
      }
    }

    // Meta description (25 points)
    if (formData.metaDescription) {
      if (formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160) {
        score += 20;
        checks.push({ type: "success", message: "Meta description length is optimal" });
      } else {
        checks.push({ type: "warning", message: "Meta description should be 120-160 characters" });
      }
      
      if (formData.metaDescription.toLowerCase().includes("tiktok") || formData.metaDescription.toLowerCase().includes("coin")) {
        score += 5;
        checks.push({ type: "success", message: "Meta description contains keywords" });
      }
    }

    // Content optimization (25 points)
    if (formData.content) {
      const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      if (wordCount >= 300) {
        score += 15;
        checks.push({ type: "success", message: `Content length is good (${wordCount} words)` });
      } else {
        checks.push({ type: "warning", message: `Content should be at least 300 words (current: ${wordCount})` });
      }

      // Check for headings
      if (formData.content.includes('<h1>') || formData.content.includes('<h2>') || formData.content.includes('<h3>')) {
        score += 10;
        checks.push({ type: "success", message: "Content includes structured headings" });
      } else {
        checks.push({ type: "warning", message: "Add headings (H1, H2, H3) to improve content structure" });
      }
    }

    // Technical SEO (25 points)
    if (formData.slug && formData.slug.length > 0 && /^[a-z0-9-]+$/.test(formData.slug)) {
      score += 10;
      checks.push({ type: "success", message: "URL slug is SEO-friendly" });
    }

    if (formData.featuredImage) {
      score += 5;
      checks.push({ type: "success", message: "Featured image added" });
    } else {
      checks.push({ type: "info", message: "Consider adding a featured image" });
    }

    if (formData.excerpt && formData.excerpt.length >= 50) {
      score += 10;
      checks.push({ type: "success", message: "Excerpt is well-optimized" });
    }

    return { score: Math.min(score, 100), checks };
  };

  // Watch all form values for real-time SEO analysis
  const watchedValues = form.watch();
  
  useEffect(() => {
    const { score, checks } = calculateSEOScore(watchedValues);
    setSeoScore(score);
  }, [watchedValues]);

  // CKEditor configuration
  const editorConfig = {
    toolbar: {
      items: [
        'heading', '|',
        'bold', 'italic', 'link', '|',
        'bulletedList', 'numberedList', '|',
        'outdent', 'indent', '|',
        'imageUpload', 'blockQuote', 'insertTable', '|',
        'undo', 'redo', '|',
        'code', 'codeBlock'
      ]
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    },
    link: {
      decorators: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
      }
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    }
  };

  // Watch title changes to auto-generate slug and meta
  const watchTitle = form.watch("title");
  const watchContent = form.watch("content");

  useEffect(() => {
    if (watchTitle && !isEdit) {
      const slug = generateSlug(watchTitle);
      form.setValue("slug", slug);
      
      if (watchContent) {
        const { metaTitle, metaDescription } = generateMetaFromContent(watchTitle, watchContent);
        if (!form.getValues("metaTitle")) form.setValue("metaTitle", metaTitle);
        if (!form.getValues("metaDescription")) form.setValue("metaDescription", metaDescription);
      }
    }
  }, [watchTitle, watchContent, form, isEdit]);

  // Populate form when editing
  useEffect(() => {
    if (blogPost && isEdit) {
      form.reset({
        title: blogPost.title,
        slug: blogPost.slug,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        category: blogPost.category,
        status: blogPost.status,
        featuredImage: blogPost.featuredImage || "",
        metaTitle: blogPost.metaTitle || "",
        metaDescription: blogPost.metaDescription || "",
        tags: blogPost.tags || "",
        featured: blogPost.featured || false,
      });
      setEditorContent(blogPost.content);
    }
  }, [blogPost, form, isEdit]);

  const saveMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const url = isEdit ? `/api/admin/blog/${id}` : "/api/admin/blog";
      const method = isEdit ? "PUT" : "POST";
      
      return await apiRequest(url, {
        method,
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: isEdit ? "Blog post updated!" : "Blog post created!",
        description: "Your changes have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setLocation("/admin/blog");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      
      const result = await response.json();
      if (result.url) {
        form.setValue("featuredImage", result.url);
        toast({
          title: "Image uploaded!",
          description: "Featured image has been uploaded successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = (data: BlogFormData) => {
    saveMutation.mutate({
      ...data,
      content: editorContent,
    });
  };

  const categories = [
    { value: "tiktok-coins", label: "TikTok Coins" },
    { value: "gift-calculator", label: "Gift Calculator" },
    { value: "creator-earnings", label: "Creator Earnings" },
    { value: "recharge-guide", label: "Recharge Guide" },
    { value: "tips-tricks", label: "Tips & Tricks" },
    { value: "updates", label: "Updates" },
  ];

  if (isLoading) {
    return (
      <AdminLayout title={isEdit ? "Edit Blog Post" : "Create Blog Post"} subtitle="Manage your blog content">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Get current SEO analysis
  const seoAnalysis = calculateSEOScore(watchedValues);

  return (
    <AdminLayout 
      title={isEdit ? "Edit Blog Post" : "Create Blog Post"}
      subtitle="Manage your blog content with SEO optimization"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Main Content Card */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-500" />
                  Content Details
                </CardTitle>
                <CardDescription>Basic information about your blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title and Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter blog post title..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="auto-generated-from-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Excerpt */}
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Brief description of the blog post..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Rich Text Editor */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            Rich text editor with headings (H1-H6), formatting, links, lists, and tables
                          </div>
                          <div className="border rounded-lg min-h-[400px]">
                            <CKEditor
                              editor={ClassicEditor}
                              config={editorConfig}
                              data={editorContent}
                              onReady={(editor) => {
                                editorRef.current = editor;
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setEditorContent(data);
                                field.onChange(data);
                              }}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* SEO & Meta Card */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-orange-500" />
                  SEO & Meta Information
                </CardTitle>
                <CardDescription>Optimize your content for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SEO optimized title (60 chars max)" maxLength={60} />
                      </FormControl>
                      <div className="text-xs text-gray-500">{field.value?.length || 0}/60 characters</div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="SEO description for search results (155 chars max)"
                          maxLength={155}
                          rows={3}
                        />
                      </FormControl>
                      <div className="text-xs text-gray-500">{field.value?.length || 0}/155 characters</div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="tag1, tag2, tag3 (comma separated)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Settings & Media Card */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-orange-500" />
                  Publication Settings
                </CardTitle>
                <CardDescription>Category, status, and media settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Featured Image Upload */}
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input {...field} placeholder="Image URL or upload below" />
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={imageUploading}
                              onClick={() => document.getElementById('image-upload')?.click()}
                            >
                              {imageUploading ? (
                                <>Uploading...</>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Image
                                </>
                              )}
                            </Button>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </div>
                          {field.value && (
                            <div className="mt-2">
                              <img 
                                src={field.value} 
                                alt="Featured" 
                                className="w-32 h-32 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Featured Toggle */}
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          Featured Post
                        </FormLabel>
                        <div className="text-sm text-gray-600">
                          Pin this post as featured content
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin/blog")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
              
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.setValue("status", "draft");
                    form.handleSubmit(onSubmit)();
                  }}
                  disabled={saveMutation.isPending}
                >
                  Save as Draft
                </Button>
                
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={saveMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveMutation.isPending ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
                </Button>
              </div>
            </div>
          </form>
          </Form>
        </div>

        {/* SEO Analysis Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-500" />
                SEO Analysis
              </CardTitle>
              <CardDescription>Real-time content optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* SEO Score */}
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={seoScore >= 80 ? "#10b981" : seoScore >= 60 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="3"
                      strokeDasharray={`${seoScore}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{seoScore}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">SEO Score</p>
              </div>

              {/* SEO Checks */}
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  SEO Checklist
                </h4>
                <div className="space-y-2">
                  {seoAnalysis.checks.map((check, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className="mt-0.5">
                        {check.type === "success" && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                        {check.type === "warning" && (
                          <AlertCircle className="w-3 h-3 text-yellow-500" />
                        )}
                        {check.type === "info" && (
                          <TrendingUp className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                      <span className={
                        check.type === "success" ? "text-green-700" :
                        check.type === "warning" ? "text-yellow-700" :
                        "text-blue-700"
                      }>
                        {check.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick SEO Tips */}
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Quick Tips</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Use focus keywords in title and first paragraph</li>
                  <li>• Add internal links to related posts</li>
                  <li>• Include relevant headings (H1, H2, H3)</li>
                  <li>• Optimize images with alt text</li>
                  <li>• Write compelling meta descriptions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Keywords Analysis */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2 text-orange-500" />
                Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Focus Keywords</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Enter focus keywords (comma separated)"
                        rows={3}
                      />
                    </FormControl>
                    <div className="text-xs text-gray-500">
                      Target 3-5 keywords relevant to your content
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Word Count */}
              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <div className="text-sm font-medium">Content Analysis</div>
                <div className="text-xs text-gray-600 mt-1">
                  Words: {editorContent.replace(/<[^>]*>/g, '').split(/\s+/).length}
                  <br />
                  Characters: {editorContent.replace(/<[^>]*>/g, '').length}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-orange-500" />
                Search Preview
              </CardTitle>
              <CardDescription>How it appears in search results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
                <div className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
                  {form.watch("metaTitle") || form.watch("title") || "Your blog post title"}
                </div>
                <div className="text-green-700 text-xs">
                  tokRecharge.com › blog › {form.watch("slug") || "your-post-slug"}
                </div>
                <div className="text-gray-700 text-sm">
                  {form.watch("metaDescription") || form.watch("excerpt") || "Your meta description will appear here..."}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}