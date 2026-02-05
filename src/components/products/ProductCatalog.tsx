import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  ShoppingCart,
  DollarSign,
  FileText,
  Image,
  Settings,
  BarChart3,
  Users,
  TrendingUp,
  Upload,
  Save,
  X
} from 'lucide-react';
import { createPiPayment } from '@/utils/pi-payments';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  fileUrl: string;
  downloadLimit: number;
  isActive: boolean;
  salesCount: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductOrder {
  id: string;
  productId: string;
  customerId: string;
  customerEmail: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  downloadUrl?: string;
  downloadExpiry?: string;
  createdAt: string;
}

interface ProductCatalogProps {
  userId: string;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ userId }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    downloadLimit: 1,
    fileUrl: ''
  });

  // Mock data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Digital Marketing Guide',
      description: 'Complete guide to digital marketing strategies for 2024',
      price: 25,
      currency: 'π',
      fileUrl: 'https://example.com/marketing-guide.pdf',
      downloadLimit: 3,
      isActive: true,
      salesCount: 45,
      revenue: 1125,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Social Media Templates',
      description: 'Professional templates for Instagram, Facebook, and Twitter',
      price: 15,
      currency: 'π',
      fileUrl: 'https://example.com/social-templates.zip',
      downloadLimit: 5,
      isActive: true,
      salesCount: 78,
      revenue: 1170,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      name: 'E-commerce Strategy',
      description: 'Step-by-step guide to building a successful online store',
      price: 35,
      currency: 'π',
      fileUrl: 'https://example.com/ecommerce-guide.pdf',
      downloadLimit: 2,
      isActive: false,
      salesCount: 23,
      revenue: 805,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-15'
    }
  ];

  const mockOrders: ProductOrder[] = [
    {
      id: '1',
      productId: '1',
      customerId: 'customer1',
      customerEmail: 'john@example.com',
      amount: 25,
      status: 'completed',
      downloadUrl: 'https://example.com/download/1',
      downloadExpiry: '2024-02-20',
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      productId: '2',
      customerId: 'customer2',
      customerEmail: 'sarah@example.com',
      amount: 15,
      status: 'completed',
      downloadUrl: 'https://example.com/download/2',
      downloadExpiry: '2024-02-18',
      createdAt: '2024-01-18'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setOrders(mockOrders);
      setIsLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.description || productForm.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productForm.name,
      description: productForm.description,
      price: productForm.price,
      currency: 'π',
      fileUrl: productForm.fileUrl,
      downloadLimit: productForm.downloadLimit,
      isActive: true,
      salesCount: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProducts([...products, newProduct]);
    setShowAddProduct(false);
    resetForm();
    
    toast({
      title: "Product Added",
      description: "Your product has been added successfully.",
    });
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    const updatedProducts = products.map(product =>
      product.id === editingProduct.id
        ? { ...editingProduct, updatedAt: new Date().toISOString() }
        : product
    );

    setProducts(updatedProducts);
    setEditingProduct(null);
    
    toast({
      title: "Product Updated",
      description: "Your product has been updated successfully.",
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    
    toast({
      title: "Product Deleted",
      description: "Your product has been deleted successfully.",
    });
  };

  const handlePurchaseProduct = async (product: Product) => {
    try {
      const paymentData = {
        amount: product.price,
        memo: `Purchase: ${product.name}`,
        metadata: {
          productId: product.id,
          productName: product.name,
          type: 'product_purchase'
        }
      };

      const result = await createPiPayment(paymentData, {
        onReadyForServerApproval: (paymentId) => {
          console.log('Payment ready for server approval:', paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log('Payment ready for server completion:', paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.log('Payment cancelled:', paymentId);
          toast({
            title: "Purchase Cancelled",
            description: "Your purchase was cancelled.",
            variant: "destructive"
          });
        },
        onError: (error, payment) => {
          console.error('Payment error:', error, payment);
          toast({
            title: "Purchase Failed",
            description: "There was an error processing your purchase.",
            variant: "destructive"
          });
        }
      });

      if (result.success) {
        // Create order
        const newOrder: ProductOrder = {
          id: Date.now().toString(),
          productId: product.id,
          customerId: 'current-user',
          customerEmail: 'user@example.com',
          amount: product.price,
          status: 'completed',
          downloadUrl: `https://example.com/download/${product.id}`,
          downloadExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          createdAt: new Date().toISOString()
        };

        setOrders([...orders, newOrder]);
        
        // Update product sales
        const updatedProducts = products.map(p =>
          p.id === product.id
            ? { ...p, salesCount: p.salesCount + 1, revenue: p.revenue + p.price }
            : p
        );
        setProducts(updatedProducts);

        toast({
          title: "Purchase Successful!",
          description: `You can now download ${product.name}`,
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      downloadLimit: 1,
      fileUrl: ''
    });
  };

  const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0);
  const totalSales = products.reduce((sum, product) => sum + product.salesCount, 0);
  const activeProducts = products.filter(product => product.isActive).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Digital Products</h2>
          <p className="text-gray-600">Sell digital products and earn Pi cryptocurrency</p>
        </div>
        <Button onClick={() => setShowAddProduct(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{totalRevenue}π</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold">{totalSales}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Products</p>
                <p className="text-2xl font-bold">{activeProducts}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{product.price}π</span>
                      <div className="text-sm text-gray-600">
                        {product.salesCount} sales
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Download className="w-4 h-4" />
                      <span>{product.downloadLimit} downloads</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handlePurchaseProduct(product)}
                        className="flex-1"
                        disabled={!product.isActive}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => {
                  const product = products.find(p => p.id === order.productId);
                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{product?.name || 'Unknown Product'}</h4>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                        <p className="text-xs text-gray-500">{order.createdAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.amount}π</p>
                        <Badge variant={
                          order.status === 'completed' ? 'default' :
                          order.status === 'pending' ? 'secondary' :
                          'destructive'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products
                    .sort((a, b) => b.salesCount - a.salesCount)
                    .slice(0, 5)
                    .map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{product.salesCount} sales</p>
                          <p className="text-sm text-gray-600">{product.revenue}π</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{totalRevenue}π</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">{totalSales}</p>
                      <p className="text-sm text-gray-600">Total Sales</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{activeProducts}</p>
                      <p className="text-sm text-gray-600">Active Products</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Price (π)</label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Download Limit</label>
                <Input
                  type="number"
                  value={productForm.downloadLimit}
                  onChange={(e) => setProductForm({ ...productForm, downloadLimit: Number(e.target.value) })}
                  placeholder="1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">File URL</label>
              <Input
                value={productForm.fileUrl}
                onChange={(e) => setProductForm({ ...productForm, fileUrl: e.target.value })}
                placeholder="https://example.com/file.pdf"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddProduct} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Add Product
              </Button>
              <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price (π)</label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Download Limit</label>
                  <Input
                    type="number"
                    value={editingProduct.downloadLimit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, downloadLimit: Number(e.target.value) })}
                    placeholder="1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">File URL</label>
                <Input
                  value={editingProduct.fileUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fileUrl: e.target.value })}
                  placeholder="https://example.com/file.pdf"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingProduct.isActive}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" className="text-sm font-medium">Active</label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleEditProduct} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCatalog;
