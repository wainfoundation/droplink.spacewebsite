import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ShoppingCart, 
  DollarSign,
  Eye,
  Star,
  Heart,
  Share2,
  Copy,
  Check,
  X,
  Save,
  Upload,
  Package,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Globe,
  Link as LinkIcon,
  Image,
  Video,
  FileText,
  Music,
  BookOpen,
  Code,
  Palette,
  Briefcase,
  Award,
  Target,
  Zap,
  Crown,
  Gift,
  ShoppingBag,
  Tag,
  Percent,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Send,
  MessageCircle,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'PI';
  category: string;
  type: 'digital' | 'physical' | 'service';
  imageUrl?: string;
  tags: string[];
  featured: boolean;
  inStock: boolean;
  stockQuantity?: number;
  views: number;
  sales: number;
  revenue: number;
  createdAt: string;
  status: 'active' | 'draft' | 'archived';
}

const StorefrontSection = () => {
  const { toast } = useToast();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'UI/UX Design Course',
      description: 'Complete course on modern UI/UX design principles and tools',
      price: 99,
      currency: 'USD',
      category: 'Education',
      type: 'digital',
      imageUrl: '/api/placeholder/400/300',
      tags: ['Design', 'Course', 'UI/UX'],
      featured: true,
      inStock: true,
      views: 1250,
      sales: 45,
      revenue: 4455,
      createdAt: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Website Template Pack',
      description: '10 modern website templates for various industries',
      price: 5.2,
      currency: 'PI',
      category: 'Templates',
      type: 'digital',
      imageUrl: '/api/placeholder/400/300',
      tags: ['Templates', 'Web Design', 'HTML/CSS'],
      featured: false,
      inStock: true,
      views: 890,
      sales: 23,
      revenue: 119.6,
      createdAt: '2024-01-10',
      status: 'active'
    },
    {
      id: '3',
      name: 'Consulting Session',
      description: '1-hour consultation for web development projects',
      price: 150,
      currency: 'USD',
      category: 'Services',
      type: 'service',
      imageUrl: '/api/placeholder/400/300',
      tags: ['Consulting', 'Development', '1-on-1'],
      featured: true,
      inStock: true,
      views: 2100,
      sales: 12,
      revenue: 1800,
      createdAt: '2024-01-05',
      status: 'active'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'USD' as Product['currency'],
    category: '',
    type: 'digital' as Product['type'],
    tags: [] as string[],
    featured: false,
    inStock: true,
    stockQuantity: 0
  });

  const categories = ['All', 'Education', 'Templates', 'Services', 'Digital Products', 'Physical Products'];
  const productTypes = [
    { value: 'digital', label: 'Digital Product', icon: <FileText className="h-4 w-4" /> },
    { value: 'physical', label: 'Physical Product', icon: <Package className="h-4 w-4" /> },
    { value: 'service', label: 'Service', icon: <Briefcase className="h-4 w-4" /> }
  ];

  const handleAddProduct = () => {
    if (!newProduct.name.trim()) {
      toast({
        title: "Product Name Required",
        description: "Please enter a name for your product",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
      views: 0,
      sales: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setProducts([product, ...products]);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      category: '',
      type: 'digital',
      tags: [],
      featured: false,
      inStock: true,
      stockQuantity: 0
    });
    setIsAddingProduct(false);

    toast({
      title: "Product Added",
      description: "Your product has been added to the storefront"
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Deleted",
      description: "Product has been removed from storefront"
    });
  };

  const handleToggleFeatured = (id: string) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, featured: !product.featured } : product
    ));
  };

  const getTypeIcon = (type: Product['type']) => {
    switch (type) {
      case 'digital': return <FileText className="h-4 w-4" />;
      case 'physical': return <Package className="h-4 w-4" />;
      case 'service': return <Briefcase className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0);
  const totalSales = products.reduce((sum, product) => sum + product.sales, 0);
  const totalViews = products.reduce((sum, product) => sum + product.views, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Storefront</h2>
          <p className="text-gray-600">Manage your products and services</p>
        </div>
        <Button
          onClick={() => setIsAddingProduct(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +12% this month
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Sales</p>
                <p className="text-2xl font-bold text-blue-900">{totalSales}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +8% this month
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Product Views</p>
                <p className="text-2xl font-bold text-purple-900">{totalViews.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +15% this month
                </div>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Product Form */}
      {isAddingProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Describe your product..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={newProduct.currency}
                  onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value as Product['currency'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="PI">Pi (π)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="type">Product Type</Label>
                <select
                  id="type"
                  value={newProduct.type}
                  onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value as Product['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {productTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={handleAddProduct}>
                <Save className="h-4 w-4 mr-2" />
                Add Product
              </Button>
              <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">
              Start selling by adding your first product or service.
            </p>
            <Button onClick={() => setIsAddingProduct(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="text-gray-400">
                        {getTypeIcon(product.type)}
                      </div>
                    )}
                  </div>
                  
                  {product.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button size="sm" variant="secondary">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(product.type)}
                    <span className="text-sm text-gray-500 capitalize">{product.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {product.currency === 'PI' ? `${product.price} π` : `$${product.price}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="h-3 w-3" />
                      {product.views}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {product.sales} sales
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {product.currency === 'PI' ? `${product.revenue} π` : `$${product.revenue}`}
                      </span>
                    </div>
                    <Badge 
                      variant={product.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StorefrontSection;
