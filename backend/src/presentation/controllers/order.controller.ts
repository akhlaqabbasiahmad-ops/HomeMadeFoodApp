import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto, OrderService } from '../../application/use-cases/order.service';
import { OrderStatus } from '../../domain/entities/order.entity';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  
  @Get('history')
  @ApiOperation({ summary: 'Get user order history' })
  @ApiResponse({ status: 200, description: 'Order history retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  async getOrderHistory(
    @Request() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const userId = req.user.id;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await this.orderService.getOrderHistory(userId, pageNum, limitNum);
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrderById(
    @Request() req: any,
    @Param('id') orderId: string
  ) {
    const userId = req.user.id;
    
    // Mock order data
    const mockOrder = {
      id: orderId,
      userId: userId,
      restaurantId: 'rest_1',
      restaurantName: "Mario's Pizzeria",
      items: [
        {
          id: 'item_1',
          foodItemId: 'food_1',
          name: 'Margherita Pizza',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
          price: 18.99,
          quantity: 1,
          totalPrice: 18.99,
          specialInstructions: 'Extra cheese'
        }
      ],
      totalAmount: 18.99,
      deliveryFee: 2.99,
      tax: 2.17,
      grandTotal: 24.15,
      status: OrderStatus.DELIVERED,
      deliveryAddress: {
        title: 'Home',
        address: '123 Main Street',
        latitude: 40.7128,
        longitude: -74.0060
      },
      paymentMethod: 'Credit Card',
      orderDate: new Date('2025-10-14T10:30:00'),
      estimatedDeliveryTime: new Date('2025-10-14T11:00:00'),
      trackingId: `TRK_${orderId}`,
      createdAt: new Date('2025-10-14T10:30:00'),
      updatedAt: new Date('2025-10-14T11:00:00')
    };

    return mockOrder;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createOrder(
    @Request() req: any,
    @Body() orderData: CreateOrderDto
  ) {
    const userId = req.user.id;
    
    const createOrderPayload = {
      ...orderData,
      userId: userId
    };
    
    const newOrder = await this.orderService.createOrder(createOrderPayload);

    return {
      success: true,
      message: 'Order created successfully',
      order: newOrder
    };
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateOrderStatus(
    @Request() req: any,
    @Param('id') orderId: string,
    @Body() statusData: { status: OrderStatus }
  ) {
    const userId = req.user.id;
    
    // Mock status update
    return {
      success: true,
      message: 'Order status updated successfully',
      orderId: orderId,
      status: statusData.status,
      updatedAt: new Date()
    };
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Order cannot be cancelled' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async cancelOrder(
    @Request() req: any,
    @Param('id') orderId: string,
    @Body() cancelData?: { reason?: string }
  ) {
    const userId = req.user.id;
    
    // Mock order cancellation
    return {
      success: true,
      message: 'Order cancelled successfully',
      orderId: orderId,
      status: OrderStatus.CANCELLED,
      reason: cancelData?.reason,
      cancelledAt: new Date()
    };
  }
}