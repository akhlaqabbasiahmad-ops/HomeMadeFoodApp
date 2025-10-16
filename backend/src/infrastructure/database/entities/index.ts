import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  ON_THE_WAY = 'on_the_way',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  restaurantId: string;

  @Column()
  restaurantName: string;

  @OneToMany(() => OrderItemEntity, item => item.order, { cascade: true, eager: true })
  items: OrderItemEntity[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column('decimal', { precision: 10, scale: 2 })
  grandTotal: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('json')
  deliveryAddress: {
    title: string;
    address: string;
    latitude: number;
    longitude: number;
  };

  @Column()
  paymentMethod: string;

  @Column({ type: 'timestamp' })
  orderDate: Date;

  @Column({ type: 'timestamp' })
  estimatedDeliveryTime: Date;

  @Column({ nullable: true })
  trackingId?: string;

  @Column({ nullable: true, type: 'text' })
  specialInstructions?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  orderId: string;

  @ManyToOne(() => OrderEntity, order => order.items)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column()
  foodItemId: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true, type: 'text' })
  specialInstructions?: string;
}

@Entity('food_items')
export class FoodItemEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  originalPrice?: number;

  @Column()
  image: string;

  @Column()
  category: string;

  @Column()
  restaurantId: string;

  @Column()
  restaurantName: string;

  @Column('int', { default: 15 })
  preparationTime: number;

  @Column('float', { default: 4.0 })
  rating: number;

  @Column('int', { default: 0 })
  reviews: number;

  @Column('int', { default: 0 })
  calories: number;

  @Column('boolean', { default: false })
  isVegetarian: boolean;

  @Column('boolean', { default: false })
  isVegan: boolean;

  @Column('boolean', { default: false })
  isSpicy: boolean;

  @Column('simple-array', { nullable: true })
  ingredients?: string[];

  @Column('simple-array', { nullable: true })
  allergens?: string[];

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  color: string;

  @Column('int', { default: 0 })
  itemCount: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}