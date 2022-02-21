import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { CreateFruitDTO } from './dto/create-fruit.dto';
import { CreateOrderDTO } from './dto/create-order.dto';
import { CustomerDTO } from './dto/customer.dto';
import { FruitDTO } from './dto/fruit.dto';
import { ListCustomersDTO } from './dto/list-customers.dto';
import { ListFruitsDTO } from './dto/list-fruits.dto';
import { ListOrdersDTO } from './dto/list-orders.dto';
import { OrderDTO } from './dto/order.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';
import { UpdateFruitDTO } from './dto/update-fruit.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('customer/:id')
  async getCustomer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerDTO> {
    try {
      return await this.service.getCustomer(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('customer')
  async listCustomers(
    @Query() query: ListCustomersDTO,
  ): Promise<CustomerDTO[]> {
    try {
      return await this.service.listCustomers(query);
    } catch (error) {
      throw error;
    }
  }

  @Post('customer')
  async createCustomer(
    @Body() customer: CreateCustomerDTO,
  ): Promise<CustomerDTO> {
    try {
      return await this.service.createCustomer(customer);
    } catch (error) {
      throw error;
    }
  }

  @Put('customer/:id')
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() customer: UpdateCustomerDTO,
  ): Promise<CustomerDTO> {
    try {
      return await this.service.updateCustomer(id, customer);
    } catch (error) {
      throw error;
    }
  }

  @Delete('customer/:id')
  async deleteCustomer(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.service.deleteCustomer(id);
      return;
    } catch (error) {
      throw error;
    }
  }

  @Get('fruit/:id')
  async getFruit(@Param('id', ParseIntPipe) id: number): Promise<FruitDTO> {
    try {
      return await this.service.getFruit(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('fruit')
  async listFruits(@Query() query: ListFruitsDTO): Promise<FruitDTO[]> {
    try {
      return await this.service.listFruits(query);
    } catch (error) {
      throw error;
    }
  }

  @Post('fruit')
  async createFruit(@Body() fruit: CreateFruitDTO): Promise<FruitDTO> {
    try {
      return await this.service.createFruit(fruit);
    } catch (error) {
      throw error;
    }
  }

  @Put('fruit/:id')
  async updateFruit(
    @Param('id', ParseIntPipe) id: number,
    @Body() fruit: UpdateFruitDTO,
  ): Promise<FruitDTO> {
    try {
      return await this.service.updateFruit(id, fruit);
    } catch (error) {
      throw error;
    }
  }

  @Delete('fruit/:id')
  async deleteFruit(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.service.deleteFruit(id);
      return;
    } catch (error) {
      throw error;
    }
  }

  @Get('order')
  async listOrder(@Query() query: ListOrdersDTO): Promise<OrderDTO[]> {
    try {
      return await this.service.listOrders(query);
    } catch (error) {
      throw error;
    }
  }

  @Post('order')
  async createOrder(@Body() order: CreateOrderDTO): Promise<OrderDTO> {
    try {
      return await this.service.createOrder(order);
    } catch (error) {
      throw error;
    }
  }

  @Put('order/:id')
  async updateOrder(
    @Param('id') id: number,
    @Body() order: UpdateOrderDTO,
  ): Promise<OrderDTO> {
    try {
      return await this.service.updateOrder(id, order);
    } catch (error) {
      throw error;
    }
  }

  @Delete('order/:id')
  async deleteOrder(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.service.deleteOrder(id);
      return;
    } catch (error) {
      throw error;
    }
  }
}
