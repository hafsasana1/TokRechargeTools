import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
// Rich text editor will be implemented with a simple textarea for now
// Can be enhanced with a proper editor like CKEditor later
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLayout from "@/components/admin/AdminLayout";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: "draft" | "published";
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  featured: boolean;
}

export default function AdminBlogEditPage() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [editorContent, setEditorContent] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  
  const token = localStorage.getItem("admin_token");
  const isEdit = id !== "new";

  const form = useForm<BlogFormData>({
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

  return (
    <AdminLayout 
      title={isEdit ? "Edit Blog Post" : "Create Blog Post"}
      subtitle="Manage your blog content with SEO optimization"
    >
      <div className="max-w-4xl mx-auto space-y-6">
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
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                            HTML formatting supported: &lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;h4&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;blockquote&gt;
                          </div>
                          <Textarea
                            {...field}
                            value={editorContent}
                            onChange={(e) => {
                              setEditorContent(e.target.value);
                              field.onChange(e.target.value);
                            }}
                            placeholder="Write your blog content here. You can use HTML tags for formatting..."
                            rows={15}
                            className="font-mono text-sm"
                          />
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
    </AdminLayout>
  );
}