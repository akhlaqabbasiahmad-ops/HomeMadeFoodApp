import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { FoodItemEntity } from '../entities/food-item.entity';
import { RestaurantEntity } from '../entities/restaurant.entity';
import { UserEntity } from '../entities/user.entity';

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    await this.seedCategories();
    await this.seedUsers();
    await this.seedRestaurants();
    await this.seedFoodItems();

    console.log('✅ Database seeding completed!');
  }

  private async seedCategories(): Promise<void> {
    const categoryRepository = this.dataSource.getRepository(Category);
    
    const categories = [
      { name: 'Italian', description: 'Traditional Italian cuisine', icon: '🍝' },
      { name: 'Asian', description: 'Asian fusion and traditional dishes', icon: '🥢' },
      { name: 'Mexican', description: 'Authentic Mexican food', icon: '🌮' },
      { name: 'American', description: 'Classic American dishes', icon: '🍔' },
      { name: 'Pizza', description: 'Fresh baked pizzas', icon: '🍕' },
      { name: 'Desserts', description: 'Sweet treats and desserts', icon: '🍰' },
      { name: 'Beverages', description: 'Drinks and beverages', icon: '🥤' },
      { name: 'Indian', description: 'Spicy and flavorful Indian cuisine', icon: '🍛' },
      { name: 'Mediterranean', description: 'Healthy Mediterranean dishes', icon: '🥗' },
      { name: 'Chinese', description: 'Traditional Chinese cuisine', icon: '🥡' },
    ];

    for (const categoryData of categories) {
      const existingCategory = await categoryRepository.findOne({
        where: { name: categoryData.name }
      });

      if (!existingCategory) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`Created category: ${categoryData.name}`);
      }
    }
  }

  private async seedUsers(): Promise<void> {
    const userRepository = this.dataSource.getRepository(UserEntity);

    const users = [
      {
        email: 'admin@homemadefood.com',
        password: await bcrypt.hash('admin123', 10),
        fullName: 'Admin User',
        phoneNumber: '+1234567890',
        role: 'admin',
      },
      {
        email: 'customer@example.com',
        password: await bcrypt.hash('customer123', 10),
        fullName: 'John Doe',
        phoneNumber: '+1987654321',
        role: 'customer',
      },
      {
        email: 'restaurant@example.com',
        password: await bcrypt.hash('restaurant123', 10),
        fullName: 'Restaurant Owner',
        phoneNumber: '+1122334455',
        role: 'restaurant_owner',
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOne({
        where: { email: userData.email }
      });

      if (!existingUser) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
        console.log(`Created user: ${userData.email}`);
      }
    }
  }

  private async seedRestaurants(): Promise<void> {
    const restaurantRepository = this.dataSource.getRepository(RestaurantEntity);
    const userRepository = this.dataSource.getRepository(UserEntity);

    const restaurantOwner = await userRepository.findOne({
      where: { email: 'restaurant@example.com' }
    });

    if (!restaurantOwner) {
      console.log('Restaurant owner not found, skipping restaurant seeding');
      return;
    }

    const restaurants = [
      {
        name: "Mario's Italian Kitchen",
        description: "Authentic Italian cuisine with traditional recipes passed down through generations",
        address: "123 Main St, New York, NY 10001",
        phoneNumber: "+1234567890",
        email: "info@mariositaliankitchen.com",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        rating: 4.5,
        deliveryFee: 2.99,
        minimumOrder: 15.00,
        ownerId: restaurantOwner.id,
      },
      {
        name: "Dragon Palace",
        description: "Premium Chinese cuisine with modern twist",
        address: "456 Oak Ave, New York, NY 10002",
        phoneNumber: "+1234567891",
        email: "contact@dragonpalace.com",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        rating: 4.3,
        deliveryFee: 3.49,
        minimumOrder: 20.00,
        ownerId: restaurantOwner.id,
      },
      {
        name: "Taco Fiesta",
        description: "Fresh Mexican street food and traditional dishes",
        address: "789 Pine Rd, New York, NY 10003",
        phoneNumber: "+1234567892",
        email: "hello@tacofiesta.com",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
        rating: 4.2,
        deliveryFee: 2.49,
        minimumOrder: 12.00,
        ownerId: restaurantOwner.id,
      },
      {
        name: "Burger Junction",
        description: "Gourmet burgers and classic American comfort food",
        address: "321 Elm St, New York, NY 10004",
        phoneNumber: "+1234567893",
        email: "info@burgerjunction.com",
        imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800",
        rating: 4.1,
        deliveryFee: 2.99,
        minimumOrder: 10.00,
        ownerId: restaurantOwner.id,
      },
    ];

    for (const restaurantData of restaurants) {
      const existingRestaurant = await restaurantRepository.findOne({
        where: { name: restaurantData.name }
      });

      if (!existingRestaurant) {
        const restaurant = restaurantRepository.create(restaurantData);
        await restaurantRepository.save(restaurant);
        console.log(`Created restaurant: ${restaurantData.name}`);
      }
    }
  }

  private async seedFoodItems(): Promise<void> {
    const foodItemRepository = this.dataSource.getRepository(FoodItemEntity);
    const restaurantRepository = this.dataSource.getRepository(RestaurantEntity);
    const categoryRepository = this.dataSource.getRepository(Category);

    const restaurants = await restaurantRepository.find();
    const categories = await categoryRepository.find();

    if (restaurants.length === 0 || categories.length === 0) {
      console.log('No restaurants or categories found, skipping food items seeding');
      return;
    }

    const mariosRestaurant = restaurants.find(r => r.name.includes("Mario's"));
    const dragonPalace = restaurants.find(r => r.name.includes("Dragon"));
    const tacoFiesta = restaurants.find(r => r.name.includes("Taco"));
    const burgerJunction = restaurants.find(r => r.name.includes("Burger"));

    const italianCategory = categories.find(c => c.name === 'Italian');
    const chineseCategory = categories.find(c => c.name === 'Chinese');
    const mexicanCategory = categories.find(c => c.name === 'Mexican');
    const americanCategory = categories.find(c => c.name === 'American');
    const pizzaCategory = categories.find(c => c.name === 'Pizza');
    const dessertsCategory = categories.find(c => c.name === 'Desserts');

    const foodItems = [
      // Mario's Italian Kitchen
      {
        name: "Spaghetti Carbonara",
        description: "Classic Italian pasta with eggs, cheese, pancetta, and black pepper",
        price: 16.99,
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800",
        isVegetarian: false,
        preparationTime: 25,
        calories: 620,
        rating: 4.6,
        reviewCount: 128,
        restaurantId: mariosRestaurant?.id,
        categoryId: italianCategory?.id,
      },
      {
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomatoes, and basil on thin crust",
        price: 14.99,
        imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800",
        isVegetarian: true,
        preparationTime: 20,
        calories: 540,
        rating: 4.5,
        reviewCount: 95,
        restaurantId: mariosRestaurant?.id,
        categoryId: pizzaCategory?.id,
      },
      {
        name: "Tiramisu",
        description: "Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone",
        price: 7.99,
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800",
        isVegetarian: true,
        preparationTime: 10,
        calories: 340,
        rating: 4.8,
        reviewCount: 67,
        restaurantId: mariosRestaurant?.id,
        categoryId: dessertsCategory?.id,
      },

      // Dragon Palace
      {
        name: "Sweet and Sour Pork",
        description: "Crispy pork with pineapple, bell peppers in tangy sauce",
        price: 18.99,
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
        isVegetarian: false,
        preparationTime: 30,
        calories: 680,
        rating: 4.4,
        reviewCount: 82,
        restaurantId: dragonPalace?.id,
        categoryId: chineseCategory?.id,
      },
      {
        name: "Kung Pao Chicken",
        description: "Spicy stir-fried chicken with peanuts and vegetables",
        price: 17.99,
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800",
        isVegetarian: false,
        preparationTime: 25,
        calories: 580,
        rating: 4.3,
        reviewCount: 94,
        restaurantId: dragonPalace?.id,
        categoryId: chineseCategory?.id,
      },

      // Taco Fiesta
      {
        name: "Carnitas Tacos",
        description: "Slow-cooked pork with onions, cilantro, and salsa verde (3 tacos)",
        price: 12.99,
        imageUrl: "https://images.unsplash.com/photo-1565299585323-38174c13a7d4?w=800",
        isVegetarian: false,
        preparationTime: 15,
        calories: 480,
        rating: 4.5,
        reviewCount: 156,
        restaurantId: tacoFiesta?.id,
        categoryId: mexicanCategory?.id,
      },
      {
        name: "Guacamole & Chips",
        description: "Fresh avocado dip with tortilla chips",
        price: 8.99,
        imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=800",
        isVegetarian: true,
        isVegan: true,
        preparationTime: 10,
        calories: 320,
        rating: 4.2,
        reviewCount: 73,
        restaurantId: tacoFiesta?.id,
        categoryId: mexicanCategory?.id,
      },

      // Burger Junction
      {
        name: "Classic Cheeseburger",
        description: "Beef patty with cheddar cheese, lettuce, tomato, onion",
        price: 13.99,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
        isVegetarian: false,
        preparationTime: 20,
        calories: 650,
        rating: 4.3,
        reviewCount: 112,
        restaurantId: burgerJunction?.id,
        categoryId: americanCategory?.id,
      },
      {
        name: "Crispy Chicken Wings",
        description: "Buffalo wings served with celery and blue cheese dip",
        price: 11.99,
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800",
        isVegetarian: false,
        preparationTime: 25,
        calories: 580,
        rating: 4.1,
        reviewCount: 89,
        restaurantId: burgerJunction?.id,
        categoryId: americanCategory?.id,
      },
    ];

    for (const itemData of foodItems) {
      if (!itemData.restaurantId || !itemData.categoryId) continue;

      const existingItem = await foodItemRepository.findOne({
        where: { 
          name: itemData.name,
          restaurantId: itemData.restaurantId 
        }
      });

      if (!existingItem) {
        const foodItem = foodItemRepository.create(itemData);
        await foodItemRepository.save(foodItem);
        console.log(`Created food item: ${itemData.name}`);
      }
    }
  }
}