import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    isOnSale: boolean;
    originalPrice?: number;
    salePrice?: number;
  };
  images: string[];
  category: string;
  tags: string[];
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  shippingInfo?: {
    freeShipping: boolean;
    shippingCost?: number;
    estimatedDelivery: string;
  };
  sellerInfo?: {
    name: string;
    email: string;
    phone?: string;
    website?: string;
  };
  isActive: boolean;
  isDigital: boolean;
  digitalFileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  addedAt: string;
}

export interface ShoppingCart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  items: Array<{
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: string;
  paymentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  paymentMethod: string;
  clientSecret?: string;
  piPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalProduct {
  id: string;
  productId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  downloadUrl: string;
  downloadLimit?: number;
  downloadCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

class EcommerceService {
  private static instance: EcommerceService;

  public static getInstance(): EcommerceService {
    if (!EcommerceService.instance) {
      EcommerceService.instance = new EcommerceService();
    }
    return EcommerceService.instance;
  }

  // Product Management
  public async createProduct(
    userId: string,
    productData: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          user_id: userId,
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as Product };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getProducts(
    userId: string,
    filters?: {
      category?: string;
      inStock?: boolean;
      isActive?: boolean;
      search?: string;
    }
  ): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('user_id', userId);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as Product[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async updateProduct(
    productId: string,
    updates: Partial<Product>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Shopping Cart Management
  public async addToCart(
    userId: string,
    productId: string,
    quantity: number = 1
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError || !product) {
        return { success: false, error: 'Product not found' };
      }

      if (!product.in_stock || (product.stock_quantity && product.stock_quantity < quantity)) {
        return { success: false, error: 'Product out of stock' };
      }

      // Get or create cart
      const { data: cart, error: cartError } = await supabase
        .from('shopping_carts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (cartError && cartError.code !== 'PGRST116') {
        return { success: false, error: cartError.message };
      }

      let cartData: ShoppingCart;
      if (cart) {
        // Update existing cart
        const existingItem = cart.items.find((item: CartItem) => item.productId === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({
            id: `item_${Date.now()}`,
            productId,
            quantity,
            price: product.price.amount,
            addedAt: new Date().toISOString()
          });
        }

        cartData = {
          ...cart,
          subtotal: this.calculateSubtotal(cart.items),
          total: this.calculateTotal(cart.items, cart.tax || 0, cart.shipping || 0),
          updated_at: new Date().toISOString()
        };
      } else {
        // Create new cart
        cartData = {
          id: `cart_${Date.now()}`,
          userId,
          items: [{
            id: `item_${Date.now()}`,
            productId,
            quantity,
            price: product.price.amount,
            addedAt: new Date().toISOString()
          }],
          subtotal: product.price.amount * quantity,
          tax: 0,
          shipping: 0,
          total: product.price.amount * quantity,
          currency: product.price.currency,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      const { error: upsertError } = await supabase
        .from('shopping_carts')
        .upsert(cartData);

      if (upsertError) {
        return { success: false, error: upsertError.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getCart(userId: string): Promise<{ success: boolean; data?: ShoppingCart; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('shopping_carts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as ShoppingCart };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async updateCartItem(
    userId: string,
    itemId: string,
    quantity: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: cart, error: cartError } = await supabase
        .from('shopping_carts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (cartError) {
        return { success: false, error: cartError.message };
      }

      const itemIndex = cart.items.findIndex((item: CartItem) => item.id === itemId);
      if (itemIndex === -1) {
        return { success: false, error: 'Item not found' };
      }

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }

      const updatedCart = {
        ...cart,
        subtotal: this.calculateSubtotal(cart.items),
        total: this.calculateTotal(cart.items, cart.tax || 0, cart.shipping || 0),
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('shopping_carts')
        .update(updatedCart)
        .eq('user_id', userId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async removeFromCart(
    userId: string,
    itemId: string
  ): Promise<{ success: boolean; error?: string }> {
    return this.updateCartItem(userId, itemId, 0);
  }

  public async clearCart(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('shopping_carts')
        .delete()
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Order Management
  public async createOrder(
    userId: string,
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as Order };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getOrders(
    userId: string,
    status?: Order['status']
  ): Promise<{ success: boolean; data?: Order[]; error?: string }> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as Order[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    trackingNumber?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (trackingNumber) {
        updates.tracking_number = trackingNumber;
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Payment Processing
  public async createPaymentIntent(
    orderId: string,
    amount: number,
    currency: string
  ): Promise<{ success: boolean; data?: PaymentIntent; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('payment_intents')
        .insert({
          order_id: orderId,
          amount,
          currency,
          status: 'pending',
          payment_method: 'pi_network',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as PaymentIntent };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async processPiPayment(
    paymentIntentId: string,
    piPaymentId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('payment_intents')
        .update({
          status: 'succeeded',
          pi_payment_id: piPaymentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentIntentId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Digital Product Management
  public async createDigitalProduct(
    productId: string,
    digitalData: Omit<DigitalProduct, 'id' | 'productId' | 'downloadCount' | 'createdAt'>
  ): Promise<{ success: boolean; data?: DigitalProduct; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('digital_products')
        .insert({
          product_id: productId,
          ...digitalData,
          download_count: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as DigitalProduct };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async downloadDigitalProduct(
    digitalProductId: string,
    orderId: string
  ): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
    try {
      // Verify order and digital product
      const { data: digitalProduct, error: productError } = await supabase
        .from('digital_products')
        .select('*')
        .eq('id', digitalProductId)
        .single();

      if (productError || !digitalProduct) {
        return { success: false, error: 'Digital product not found' };
      }

      // Check download limit
      if (digitalProduct.download_limit && digitalProduct.download_count >= digitalProduct.download_limit) {
        return { success: false, error: 'Download limit reached' };
      }

      // Check expiration
      if (digitalProduct.expires_at && new Date(digitalProduct.expires_at) < new Date()) {
        return { success: false, error: 'Download link expired' };
      }

      // Update download count
      const { error: updateError } = await supabase
        .from('digital_products')
        .update({
          download_count: digitalProduct.download_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', digitalProductId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, downloadUrl: digitalProduct.download_url };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Helper Methods
  private calculateSubtotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private calculateTotal(items: CartItem[], tax: number, shipping: number): number {
    const subtotal = this.calculateSubtotal(items);
    return subtotal + tax + shipping;
  }

  public calculateTax(subtotal: number, taxRate: number = 0.08): number {
    return subtotal * taxRate;
  }

  public calculateShipping(items: CartItem[], freeShippingThreshold: number = 50): number {
    const subtotal = this.calculateSubtotal(items);
    return subtotal >= freeShippingThreshold ? 0 : 5.99; // Default shipping cost
  }
}

export const ecommerceService = EcommerceService.getInstance();
