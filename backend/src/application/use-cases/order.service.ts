import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../../infrastructure/database/entities/order-item.entity';
import { Order, OrderStatus } from '../../infrastructure/database/entities/order.entity';

export interface CreateOrderDto {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: {
    foodItemId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
  }[];
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  deliveryAddress: {
    title: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  paymentMethod: string;
  specialInstructions?: string;
  promoCode?: string;
  promoDiscount?: number;
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      // Validate order data
      this.validateOrderData(createOrderDto);

      // Create order entity
      const order = new Order();
      order.userId = createOrderDto.userId;
      order.restaurantId = createOrderDto.restaurantId;
      order.restaurantName = createOrderDto.restaurantName;
      order.totalAmount = createOrderDto.totalAmount;
      order.deliveryFee = createOrderDto.deliveryFee;
      order.tax = createOrderDto.tax;
      order.grandTotal = createOrderDto.grandTotal;
      order.status = OrderStatus.PENDING;
      order.deliveryAddress = {
        title: createOrderDto.deliveryAddress.title,
        address: createOrderDto.deliveryAddress.address,
        latitude: createOrderDto.deliveryAddress.latitude,
        longitude: createOrderDto.deliveryAddress.longitude,
      };
      order.paymentMethod = createOrderDto.paymentMethod;
      order.orderDate = new Date();
      order.estimatedDeliveryTime = new Date(Date.now() + 35 * 60 * 1000); // 35 minutes from now
      order.trackingId = `TRK_${Date.now()}`;
      order.specialInstructions = createOrderDto.specialInstructions;

      // Save order first to get the ID
      const savedOrder = await this.orderRepository.save(order);

      // Create order items
      const orderItems = createOrderDto.items.map(item => {
        const orderItem = new OrderItem();
        orderItem.orderId = savedOrder.id;
        orderItem.foodItemId = item.foodItemId;
        orderItem.name = item.name;
        orderItem.image = item.image;
        orderItem.price = item.price;
        orderItem.quantity = item.quantity;
        orderItem.totalPrice = item.price * item.quantity;
        orderItem.specialInstructions = item.specialInstructions;
        return orderItem;
      });

      // Save order items
      await this.orderItemRepository.save(orderItems);

      // Return the complete order with items
      const completeOrder = await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['items']
      });

      console.log('💾 Order saved to database:', completeOrder.id);
      return completeOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new BadRequestException('Failed to create order');
    }
  }

  async getOrderHistory(userId: string, page: number = 1, limit: number = 10) {
    try {
      console.log(`📊 Fetching order history for user ${userId}, page ${page}, limit ${limit}`);
      
      // Query database for user's orders
      const [orders, total] = await this.orderRepository.findAndCount({
        where: { userId },
        relations: ['items'],
        order: { orderDate: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      console.log(`📊 Found ${total} orders in database for user ${userId}`);

      // If no orders found, return some mock data for development
      if (total === 0) {
        console.log('📊 No orders found, returning mock data for development');
        const mockOrders = this.getMockOrderHistory(userId);
        
        return {
          orders: mockOrders,
          total: mockOrders.length,
          page: page,
          totalPages: Math.ceil(mockOrders.length / limit),
          hasNext: false,
          hasPrevious: false
        };
      }

      return {
        orders,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNext: (page * limit) < total,
        hasPrevious: page > 1
      };
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw new NotFoundException('Failed to fetch order history');
    }
  }

  async getOrderById(orderId: string, userId: string): Promise<Order> {
    try {
      // For now, return mock data
      // In a real implementation, you'd query the database
      const mockOrders = this.getMockOrderHistory(userId);
      const order = mockOrders.find(o => o.id === orderId);
      
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch order');
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, userId?: string): Promise<Order> {
    try {
      // For now, return mock updated order
      // In a real implementation, you'd update the database
      const mockOrders = this.getMockOrderHistory(userId || '');
      const order = mockOrders.find(o => o.id === orderId);
      
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      order.status = status;
      order.updatedAt = new Date();
      console.log(`Order ${orderId} status updated to ${status}`);
      
      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update order status');
    }
  }

  async cancelOrder(orderId: string, userId: string, reason?: string): Promise<Order> {
    try {
      const order = await this.getOrderById(orderId, userId);
      
      // Check if order can be cancelled
      if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
        throw new BadRequestException('Order cannot be cancelled in current status');
      }

      order.status = OrderStatus.CANCELLED;
      order.updatedAt = new Date();
      console.log(`Order ${orderId} cancelled. Reason: ${reason}`);
      
      return order;
    } catch (error) {
      console.error('Error cancelling order:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to cancel order');
    }
  }

  private validateOrderData(orderData: CreateOrderDto): void {
    if (!orderData.items || orderData.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    if (!orderData.deliveryAddress || !orderData.deliveryAddress.address) {
      throw new BadRequestException('Delivery address is required');
    }

    if (!orderData.paymentMethod) {
      throw new BadRequestException('Payment method is required');
    }

    if (orderData.totalAmount <= 0 || orderData.grandTotal <= 0) {
      throw new BadRequestException('Invalid order amounts');
    }
  }

  private getMockOrderHistory(userId: string): Order[] {
    const mockOrderItems1 = new OrderItem();
    mockOrderItems1.id = 'item_1';
    mockOrderItems1.foodItemId = 'food_1';
    mockOrderItems1.name = 'Margherita Pizza';
    mockOrderItems1.image = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b';
    mockOrderItems1.price = 18.99;
    mockOrderItems1.quantity = 1;
    mockOrderItems1.totalPrice = 18.99;
    mockOrderItems1.specialInstructions = 'Extra cheese';

    const mockOrderItems2 = new OrderItem();
    mockOrderItems2.id = 'item_2';
    mockOrderItems2.foodItemId = 'food_2';
    mockOrderItems2.name = 'Classic Burger';
    mockOrderItems2.image = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd';
    mockOrderItems2.price = 12.99;
    mockOrderItems2.quantity = 2;
    mockOrderItems2.totalPrice = 25.98;
    mockOrderItems2.specialInstructions = 'No onions';

    const mockOrderItems3 = new OrderItem();
    mockOrderItems3.id = 'item_3';
    mockOrderItems3.foodItemId = 'food_3';
    mockOrderItems3.name = 'California Roll';
    mockOrderItems3.image = 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351';
    mockOrderItems3.price = 8.99;
    mockOrderItems3.quantity = 3;
    mockOrderItems3.totalPrice = 26.97;
    mockOrderItems3.specialInstructions = 'Extra wasabi';

    const mockOrder1 = new Order();
    mockOrder1.id = '1';
    mockOrder1.userId = userId;
    mockOrder1.restaurantId = 'rest_1';
    mockOrder1.restaurantName = "Mario's Pizzeria";
    mockOrder1.items = [mockOrderItems1];
    mockOrder1.totalAmount = 18.99;
    mockOrder1.deliveryFee = 2.99;
    mockOrder1.tax = 2.17;
    mockOrder1.grandTotal = 24.15;
    mockOrder1.status = OrderStatus.DELIVERED;
    mockOrder1.deliveryAddress = {
      title: 'Home',
      address: '123 Main Street',
      latitude: 40.7128,
      longitude: -74.0060
    };
    mockOrder1.paymentMethod = 'Credit Card';
    mockOrder1.orderDate = new Date('2025-10-14T05:30:00.000Z');
    mockOrder1.estimatedDeliveryTime = new Date('2025-10-14T06:00:00.000Z');
    mockOrder1.trackingId = 'TRK_1729000000001';
    mockOrder1.createdAt = new Date('2025-10-14T05:30:00.000Z');
    mockOrder1.updatedAt = new Date('2025-10-14T06:00:00.000Z');

    const mockOrder2 = new Order();
    mockOrder2.id = '2';
    mockOrder2.userId = userId;
    mockOrder2.restaurantId = 'rest_2';
    mockOrder2.restaurantName = "Burger Palace";
    mockOrder2.items = [mockOrderItems2];
    mockOrder2.totalAmount = 25.98;
    mockOrder2.deliveryFee = 2.99;
    mockOrder2.tax = 2.90;
    mockOrder2.grandTotal = 31.87;
    mockOrder2.status = OrderStatus.ON_THE_WAY;
    mockOrder2.deliveryAddress = {
      title: 'Office',
      address: '456 Business Ave',
      latitude: 40.7589,
      longitude: -73.9851
    };
    mockOrder2.paymentMethod = 'PayPal';
    mockOrder2.orderDate = new Date('2025-10-14T09:15:00.000Z');
    mockOrder2.estimatedDeliveryTime = new Date('2025-10-14T10:00:00.000Z');
    mockOrder2.trackingId = 'TRK_1729000000002';
    mockOrder2.createdAt = new Date('2025-10-14T09:15:00.000Z');
    mockOrder2.updatedAt = new Date('2025-10-14T09:45:00.000Z');

    const mockOrder3 = new Order();
    mockOrder3.id = '3';
    mockOrder3.userId = userId;
    mockOrder3.restaurantId = 'rest_3';
    mockOrder3.restaurantName = "Sushi Express";
    mockOrder3.items = [mockOrderItems3];
    mockOrder3.totalAmount = 26.97;
    mockOrder3.deliveryFee = 3.99;
    mockOrder3.tax = 3.10;
    mockOrder3.grandTotal = 34.06;
    mockOrder3.status = OrderStatus.PREPARING;
    mockOrder3.deliveryAddress = {
      title: 'Home',
      address: '123 Main Street',
      latitude: 40.7128,
      longitude: -74.0060
    };
    mockOrder3.paymentMethod = 'Credit Card';
    mockOrder3.orderDate = new Date('2025-10-14T14:00:00.000Z');
    mockOrder3.estimatedDeliveryTime = new Date('2025-10-14T15:00:00.000Z');
    mockOrder3.trackingId = 'TRK_1729000000003';
    mockOrder3.createdAt = new Date('2025-10-14T14:00:00.000Z');
    mockOrder3.updatedAt = new Date('2025-10-14T14:15:00.000Z');

    return [mockOrder1, mockOrder2, mockOrder3];
  }
}