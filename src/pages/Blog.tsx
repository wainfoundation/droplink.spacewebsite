import { useState } from "react";

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author_name: string;
  created_at: string;
  read_time: string;
  featured_image?: string;
  slug: string;
};
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import CommunityLove from "@/components/CommunityLove";
import { useBlogPosts, useFeaturedBlogPost } from "@/hooks/useBlogPosts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoToTop from '@/components/GoToTop';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [email, setEmail] = useState("");
  const { data: blogPosts = [] } = useBlogPosts() as { data: BlogPost[] };
  const { data: featuredPost } = useFeaturedBlogPost() as { data: BlogPost | undefined };

  const categories = [
    "All Posts",
    "Tips & Tricks", 
    "Tutorials",
    "Success Stories",
    "Product Updates",
    "Insights",
    "Design"
  ];

  // Static fallback posts if none are loaded
  const staticPosts: BlogPost[] = [
    {
      id: 1,
      title: "Welcome to Droplink!",
      excerpt: "Discover how Droplink empowers creators and businesses to deliver digital products and build communities.",
      category: "Product Updates",
      author_name: "Droplink Team",
      created_at: new Date().toISOString(),
      read_time: "3 min read",
      featured_image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "welcome-to-droplink"
    },
    {
      id: 2,
      title: "Getting Started with Droplink",
      excerpt: "A quick guide to setting up your first digital product and dashboard on Droplink.",
      category: "Tutorials",
      author_name: "Droplink Team",
      created_at: new Date().toISOString(),
      read_time: "4 min read",
      featured_image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "getting-started-droplink"
    },
    {
      id: 3,
      title: "Droplink Success Stories",
      excerpt: "Read how real users have grown their businesses and communities using Droplink.",
      category: "Success Stories",
      author_name: "Droplink Team",
      created_at: new Date().toISOString(),
      read_time: "5 min read",
      featured_image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "droplink-success-stories"
    },
    {
      id: 4,
      title: "Droplink Design Tips",
      excerpt: "Make your Droplink dashboard stand out with these design best practices.",
      category: "Design",
      author_name: "Droplink Team",
      created_at: new Date().toISOString(),
      read_time: "3 min read",
      featured_image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "droplink-design-tips"
    },
    {
      id: 5,
      title: "Droplink Product Updates - December 2025",
      excerpt: "Check out the latest features and improvements released this month.",
      category: "Product Updates",
      author_name: "Droplink Team",
      created_at: new Date().toISOString(),
      read_time: "2 min read",
      featured_image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "droplink-product-updates-dec-2025"
    }
  ];
  const postsToShow: BlogPost[] = blogPosts.length > 0 ? blogPosts : staticPosts;
  const filteredPosts = selectedCategory === "all" 
    ? postsToShow 
    : postsToShow.filter(post => post.category.toLowerCase() === selectedCategory.replace(" & ", " ").toLowerCase());

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription here
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  // ...existing code...

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">The Droplink Blog</h1>
              <p className="text-xl text-gray-600">
                Insights, updates, and tips to help you grow your online presence with Pi Network
              </p>
            </header>
            
            <div className="flex flex-wrap gap-6 mb-8">
              {categories.map((category, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedCategory(index === 0 ? "all" : category.toLowerCase())}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    (selectedCategory === "all" && index === 0) || 
                    selectedCategory === category.toLowerCase()
                      ? "bg-primary text-white" 
                      : "hover:bg-muted"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-16 bg-muted rounded-xl overflow-hidden shadow-md">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={featuredPost.featured_image || "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={featuredPost.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <span className="text-sm font-semibold text-primary mb-2">FEATURED POST</span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center mr-3">
                        <span className="text-white font-bold">
                          {featuredPost.author_name?.split(' ').map(n => n[0]).join('') || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{featuredPost.author_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(featuredPost.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} • {featuredPost.read_time}
                        </p>
                      </div>
                    </div>
                    <Link 
                      to={`/blog/${featuredPost.slug}`} 
                      className="text-primary font-semibold hover:underline"
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <article key={post.id} className="bg-background rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <Link to={`/blog/${post.slug}`}>
                    <img 
                      src={post.featured_image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={post.title} 
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-primary">{post.category}</span>
                      <span className="text-xs text-gray-500">{post.read_time}</span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{post.title}</h3>
                    </Link>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">
                            {post.author_name?.split(' ').map(n => n[0]).join('') || 'A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">{post.author_name}</span>
                          <p className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-primary text-sm font-semibold hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No posts found in this category.</p>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Load More Articles
              </button>
            </div>
            
            <div className="mt-20 bg-muted rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="mb-6">Get the latest Droplink news, tips, and updates delivered to your inbox</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <Button 
                  type="submit" 
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <CommunityLove />
        <CTA />
      </main>
      <GoToTop />
      <Footer />
    </div>
  );
};

export default Blog;
