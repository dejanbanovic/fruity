import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  constructor(private readonly appService: AppService) {}

  @Get('customer/:id')
  getCustomer(@Param('id') id: number): CustomerDTO {
    return new CustomerDTO();
  }

  @Get('customer')
  listCustomers(@Query() query: ListCustomersDTO): CustomerDTO[] {
    return [new CustomerDTO()];
  }

  @Post('customer')
  createCustomer(@Body() customer: CreateCustomerDTO): CustomerDTO {
    return new CustomerDTO();
  }

  @Put('customer/:id')
  updateCustomer(
    @Param('id') id: number,
    @Body() customer: UpdateCustomerDTO,
  ): CustomerDTO {
    return new CustomerDTO();
  }

  @Delete('customer/:id')
  deleteCustomer(@Param('id') id: number): void {
    return;
  }

  @Get('fruit/:id')
  getFruit(@Param('id') id: number): FruitDTO {
    return new FruitDTO();
  }

  @Get('fruit')
  listFruits(@Query() query: ListFruitsDTO): FruitDTO[] {
    return [new FruitDTO()];
  }

  @Post('fruit')
  createFruit(@Body() fruit: CreateFruitDTO): FruitDTO {
    return new FruitDTO();
  }

  @Put('fruit/:id')
  updateFruit(
    @Param('id') id: number,
    @Body() fruit: UpdateFruitDTO,
  ): FruitDTO {
    return new FruitDTO();
  }

  @Delete('fruit/:id')
  deleteFruit(@Param('id') id: number): void {
    return;
  }

  @Get('order/:id')
  getOrder(@Param('id') id: number): OrderDTO {
    return new OrderDTO();
  }

  @Get('order')
  listOrder(@Query() query: ListOrdersDTO): OrderDTO[] {
    return [new OrderDTO()];
  }

  @Post('order')
  createOrder(@Body() order: CreateOrderDTO): OrderDTO {
    return new OrderDTO();
  }

  @Put('order/:id')
  updateOrder(
    @Param('id') id: number,
    @Body() order: UpdateOrderDTO,
  ): OrderDTO {
    return new OrderDTO();
  }

  @Delete('order/:id')
  deleteOrder(@Param('id') id: number): void {
    return;
  }
}
