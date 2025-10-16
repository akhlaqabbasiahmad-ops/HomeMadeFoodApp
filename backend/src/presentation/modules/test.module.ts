import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../infrastructure/database/entities/category.entity';
import { FoodItemEntity } from '../../infrastructure/database/entities/food-item.entity';
import { TestController } from '../controllers/test.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FoodItemEntity, Category])],
  controllers: [TestController],
})
export class TestModule {}