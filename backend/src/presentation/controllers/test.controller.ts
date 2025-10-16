import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../infrastructure/database/entities/category.entity';
import { FoodItemEntity } from '../../infrastructure/database/entities/food-item.entity';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(
    @InjectRepository(FoodItemEntity)
    private foodRepository: Repository<FoodItemEntity>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  @Get('seed')
  @ApiOperation({ summary: 'Seed test data' })
  @ApiResponse({ status: 200, description: 'Test data seeded successfully' })
  async seedTestData() {
    console.log('🎯 API HIT: /api/v1/test/seed - Seeding test data');
    console.log('📅 Timestamp:', new Date().toISOString());
    // First, create categories
    const categories = [
      { name: 'Pizza', icon: '🍕', description: 'Delicious wood-fired and traditional pizzas' },
      { name: 'Burger', icon: '🍔', description: 'Juicy burgers and sandwiches' },
      { name: 'Pasta', icon: '🍝', description: 'Fresh Italian pasta dishes' },
      { name: 'Salad', icon: '🥗', description: 'Fresh and healthy salads' },
      { name: 'Sushi', icon: '🍣', description: 'Fresh sushi and Japanese cuisine' },
      { name: 'Mexican', icon: '🌮', description: 'Authentic Mexican food' },
      { name: 'Chinese', icon: '🥢', description: 'Traditional Chinese dishes' },
      { name: 'Dessert', icon: '🍰', description: 'Sweet treats and desserts' },
      { name: 'Drinks', icon: '🥤', description: 'Refreshing beverages' },
      { name: 'Breakfast', icon: '🥞', description: 'Morning favorites' },
    ];

    for (const categoryData of categories) {
      const existing = await this.categoryRepository.findOne({ 
        where: { name: categoryData.name } 
      });
      if (!existing) {
        await this.categoryRepository.save(categoryData);
      }
    }

    // Then create some food items
    const foodItems = [
      // Pizza items
      {
        name: 'Margherita Pizza',
        description: 'Fresh tomatoes, mozzarella, and basil on crispy thin crust',
        price: 12.99,
        originalPrice: 15.99,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
        category: 'Pizza',
        restaurantId: 'restaurant-1',
        restaurantName: "Tony's Pizzeria",
        rating: 4.5,
        reviews: 128,
        preparationTime: 20,
        ingredients: ['tomato sauce', 'mozzarella', 'fresh basil', 'olive oil'],
        allergens: ['gluten', 'dairy'],
        isVegetarian: true,
        calories: 280,
        isFeatured: true,
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with mozzarella cheese',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop',
        category: 'Pizza',
        restaurantId: 'restaurant-1',
        restaurantName: "Tony's Pizzeria",
        rating: 4.6,
        reviews: 201,
        preparationTime: 22,
        ingredients: ['tomato sauce', 'mozzarella', 'pepperoni'],
        allergens: ['gluten', 'dairy'],
        isVegetarian: false,
        calories: 320,
        isPopular: true,
      },
      {
        name: 'Veggie Supreme Pizza',
        description: 'Loaded with bell peppers, mushrooms, onions, and olives',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=300&h=200&fit=crop',
        category: 'Pizza',
        restaurantId: 'restaurant-1',
        restaurantName: "Tony's Pizzeria",
        rating: 4.4,
        reviews: 89,
        preparationTime: 25,
        ingredients: ['tomato sauce', 'mozzarella', 'bell peppers', 'mushrooms', 'onions', 'olives'],
        allergens: ['gluten', 'dairy'],
        isVegetarian: true,
        calories: 290,
      },

      // Burger items
      {
        name: 'Classic Beef Burger',
        description: 'Juicy beef patty with lettuce, tomato, and our secret sauce',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
        category: 'Burger',
        restaurantId: 'restaurant-2',
        restaurantName: "Joe's Burgers",
        rating: 4.3,
        reviews: 156,
        preparationTime: 15,
        ingredients: ['beef patty', 'lettuce', 'tomato', 'onion', 'special sauce'],
        allergens: ['gluten'],
        isVegetarian: false,
        calories: 420,
        isPopular: true,
      },
      {
        name: 'Chicken Deluxe Burger',
        description: 'Grilled chicken breast with avocado and bacon',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
        category: 'Burger',
        restaurantId: 'restaurant-2',
        restaurantName: "Joe's Burgers",
        rating: 4.5,
        reviews: 134,
        preparationTime: 18,
        ingredients: ['grilled chicken', 'avocado', 'bacon', 'lettuce', 'mayo'],
        allergens: ['gluten'],
        isVegetarian: false,
        calories: 380,
      },
      {
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=300&h=200&fit=crop',
        category: 'Burger',
        restaurantId: 'restaurant-2',
        restaurantName: "Joe's Burgers",
        rating: 4.1,
        reviews: 78,
        preparationTime: 12,
        ingredients: ['plant-based patty', 'lettuce', 'tomato', 'cucumber', 'vegan mayo'],
        allergens: ['gluten'],
        isVegetarian: true,
        isVegan: true,
        calories: 280,
      },

      // Pasta items
      {
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with pancetta and parmesan',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
        category: 'Pasta',
        restaurantId: 'restaurant-3',
        restaurantName: "Mama Mia's",
        rating: 4.7,
        reviews: 189,
        preparationTime: 20,
        ingredients: ['spaghetti', 'pancetta', 'parmesan', 'cream', 'eggs'],
        allergens: ['gluten', 'dairy', 'eggs'],
        isVegetarian: false,
        calories: 450,
        isFeatured: true,
      },
      {
        name: 'Penne Arrabbiata',
        description: 'Spicy tomato sauce with garlic and chili',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1621590466002-a714c973e1cc?w=300&h=200&fit=crop',
        category: 'Pasta',
        restaurantId: 'restaurant-3',
        restaurantName: "Mama Mia's",
        rating: 4.4,
        reviews: 145,
        preparationTime: 18,
        ingredients: ['penne pasta', 'tomato sauce', 'garlic', 'chili', 'basil'],
        allergens: ['gluten'],
        isVegetarian: true,
        isSpicy: true,
        calories: 380,
      },

      // Salad items
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with caesar dressing and croutons',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300&h=200&fit=crop',
        category: 'Salad',
        restaurantId: 'restaurant-4',
        restaurantName: "Green Garden",
        rating: 4.3,
        reviews: 67,
        preparationTime: 8,
        ingredients: ['romaine lettuce', 'caesar dressing', 'parmesan', 'croutons'],
        allergens: ['gluten', 'dairy'],
        isVegetarian: true,
        calories: 180,
      },
      {
        name: 'Greek Salad',
        description: 'Fresh vegetables with feta cheese and olives',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
        category: 'Salad',
        restaurantId: 'restaurant-4',
        restaurantName: "Green Garden",
        rating: 4.5,
        reviews: 92,
        preparationTime: 10,
        ingredients: ['cucumber', 'tomato', 'feta cheese', 'olives', 'red onion', 'olive oil'],
        allergens: ['dairy'],
        isVegetarian: true,
        calories: 220,
      },

      // Sushi items
      {
        name: 'Salmon Roll',
        description: 'Fresh salmon with avocado and cucumber',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
        category: 'Sushi',
        restaurantId: 'restaurant-5',
        restaurantName: "Tokyo Sushi",
        rating: 4.8,
        reviews: 167,
        preparationTime: 15,
        ingredients: ['salmon', 'avocado', 'cucumber', 'sushi rice', 'nori'],
        allergens: ['fish'],
        isVegetarian: false,
        calories: 250,
        isFeatured: true,
      },
      {
        name: 'Veggie Roll',
        description: 'Cucumber, avocado, and carrot roll',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300&h=200&fit=crop',
        category: 'Sushi',
        restaurantId: 'restaurant-5',
        restaurantName: "Tokyo Sushi",
        rating: 4.2,
        reviews: 89,
        preparationTime: 12,
        ingredients: ['cucumber', 'avocado', 'carrot', 'sushi rice', 'nori'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        calories: 180,
      },

      // Mexican items
      {
        name: 'Chicken Tacos',
        description: 'Grilled chicken with salsa and guacamole',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1565299585323-38174c8c4120?w=300&h=200&fit=crop',
        category: 'Mexican',
        restaurantId: 'restaurant-6',
        restaurantName: "El Sombrero",
        rating: 4.4,
        reviews: 156,
        preparationTime: 12,
        ingredients: ['grilled chicken', 'corn tortilla', 'salsa', 'guacamole', 'onions'],
        allergens: [],
        isVegetarian: false,
        calories: 320,
        isPopular: true,
      },
      {
        name: 'Vegetarian Burrito',
        description: 'Black beans, rice, and fresh vegetables',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop',
        category: 'Mexican',
        restaurantId: 'restaurant-6',
        restaurantName: "El Sombrero",
        rating: 4.2,
        reviews: 134,
        preparationTime: 15,
        ingredients: ['black beans', 'rice', 'bell peppers', 'onions', 'salsa', 'flour tortilla'],
        allergens: ['gluten'],
        isVegetarian: true,
        calories: 400,
      },

      // Dessert items
      {
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with chocolate ganache',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
        category: 'Dessert',
        restaurantId: 'restaurant-7',
        restaurantName: "Sweet Dreams",
        rating: 4.6,
        reviews: 203,
        preparationTime: 5,
        ingredients: ['chocolate', 'flour', 'sugar', 'eggs', 'butter'],
        allergens: ['gluten', 'dairy', 'eggs'],
        isVegetarian: true,
        calories: 380,
        isFeatured: true,
      },
      {
        name: 'Cheesecake',
        description: 'Creamy New York style cheesecake',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=300&h=200&fit=crop',
        category: 'Dessert',
        restaurantId: 'restaurant-7',
        restaurantName: "Sweet Dreams",
        rating: 4.5,
        reviews: 178,
        preparationTime: 5,
        ingredients: ['cream cheese', 'graham cracker', 'sugar', 'eggs'],
        allergens: ['gluten', 'dairy', 'eggs'],
        isVegetarian: true,
        calories: 420,
      },

      // Breakfast items
      {
        name: 'Pancakes',
        description: 'Fluffy pancakes with maple syrup and butter',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop',
        category: 'Breakfast',
        restaurantId: 'restaurant-8',
        restaurantName: "Morning Bliss",
        rating: 4.3,
        reviews: 145,
        preparationTime: 12,
        ingredients: ['flour', 'milk', 'eggs', 'sugar', 'maple syrup', 'butter'],
        allergens: ['gluten', 'dairy', 'eggs'],
        isVegetarian: true,
        calories: 350,
      },
      {
        name: 'Avocado Toast',
        description: 'Smashed avocado on sourdough bread',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=200&fit=crop',
        category: 'Breakfast',
        restaurantId: 'restaurant-8',
        restaurantName: "Morning Bliss",
        rating: 4.4,
        reviews: 112,
        preparationTime: 8,
        ingredients: ['avocado', 'sourdough bread', 'lime', 'salt', 'pepper'],
        allergens: ['gluten'],
        isVegetarian: true,
        isVegan: true,
        calories: 280,
        isPopular: true,
      },
    ];

    for (const foodData of foodItems) {
      const existing = await this.foodRepository.findOne({ 
        where: { name: foodData.name } 
      });
      if (!existing) {
        await this.foodRepository.save(foodData);
      }
    }

    return {
      success: true,
      message: 'Test data seeded successfully',
      data: {
        categoriesCount: categories.length,
        foodItemsCount: foodItems.length,
      }
    };
  }

  @Get('food')
  @ApiOperation({ summary: 'Get all food items' })
  @ApiResponse({ status: 200, description: 'Food items retrieved successfully' })
  async getAllFoodItems() {
    console.log('🎯 API HIT: /api/v1/test/food - Getting all food items');
    console.log('📅 Timestamp:', new Date().toISOString());
    const items = await this.foodRepository.find();
    return {
      success: true,
      data: {
        items,
        total: items.length,
      }
    };
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getAllCategories() {
    console.log('🎯 API HIT: /api/v1/test/categories - Getting all categories');
    console.log('📅 Timestamp:', new Date().toISOString());
    const categories = await this.categoryRepository.find();
    return {
      success: true,
      data: categories,
    };
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(@Body() categoryData: {
    name: string;
    description?: string;
    icon?: string;
  }) {
    console.log('🎯 API HIT: /api/v1/test/categories - Creating new category');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('📦 Category Data:', categoryData);

    try {
      // Check if category with same name exists
      const existing = await this.categoryRepository.findOne({
        where: { name: categoryData.name }
      });

      if (existing) {
        return {
          success: false,
          error: 'Category with this name already exists',
        };
      }

      const category = await this.categoryRepository.save(categoryData);
      console.log('✅ Category created successfully:', category);

      return {
        success: true,
        data: category,
        message: 'Category created successfully'
      };
    } catch (error) {
      console.error('❌ Error creating category:', error);
      return {
        success: false,
        error: 'Failed to create category'
      };
    }
  }

  @Post('food')
  @ApiOperation({ summary: 'Create a new food item' })
  @ApiResponse({ status: 201, description: 'Food item created successfully' })
  async createFoodItem(@Body() foodData: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    restaurantId: string;
    restaurantName: string;
    ingredients: string[];
    allergens?: string[];
    isVegetarian?: boolean;
    isVegan?: boolean;
    isSpicy?: boolean;
    preparationTime: number;
    calories?: number;
    isFeatured?: boolean;
    isPopular?: boolean;
  }) {
    console.log('🎯 API HIT: /api/v1/test/food - Creating new food item');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('📦 Food Data:', foodData);

    try {
      // Check if food item with same name exists
      const existing = await this.foodRepository.findOne({
        where: { name: foodData.name }
      });

      if (existing) {
        return {
          success: false,
          error: 'Food item with this name already exists',
        };
      }

      // Set default values
      const foodItem = {
        ...foodData,
        rating: 0,
        reviews: 0,
        isAvailable: true,
        isVegetarian: foodData.isVegetarian || false,
        isVegan: foodData.isVegan || false,
        isSpicy: foodData.isSpicy || false,
        isFeatured: foodData.isFeatured || false,
        isPopular: foodData.isPopular || false,
      };

      const savedFoodItem = await this.foodRepository.save(foodItem);
      console.log('✅ Food item created successfully:', savedFoodItem);

      return {
        success: true,
        data: savedFoodItem,
        message: 'Food item created successfully'
      };
    } catch (error) {
      console.error('❌ Error creating food item:', error);
      return {
        success: false,
        error: 'Failed to create food item'
      };
    }
  }
}