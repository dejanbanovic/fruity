import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
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
@Injectable()
export class AppService {
  constructor() {
    this.pool = new Pool();
  }
  private pool: Pool;

  private async getConnection() {
    return await this.pool.connect();
  }

  // Customers
  async getCustomer(id: number): Promise<CustomerDTO> {
    const connection = await this.getConnection();
    const result = await connection.query(
      'SELECT id, name, location FROM customer WHERE id = $1',
      [id],
    );
    await connection.release();
    if (result.rowCount === 0) {
      throw new NotFoundException();
    }
    return result.rows[0];
  }

  async listCustomers(query: ListCustomersDTO): Promise<CustomerDTO[]> {
    const connection = await this.getConnection();
    const result = await connection.query(
      'SELECT id, name, location FROM customer WHERE LOWER(location) LIKE $1 AND LOWER(name) LIKE $2 ORDER BY id ASC LIMIT $3 OFFSET $4',
      [`%${query.location}%`, `%${query.name}%`, query.take, query.skip],
    );
    await connection.release();
    return result.rows;
  }

  async createCustomer(customer: CreateCustomerDTO): Promise<CustomerDTO> {
    const connection = await this.getConnection();
    const existingCustomer = await connection.query(
      'SELECT * FROM customer WHERE name = $1',
      [customer.name],
    );
    if (existingCustomer.rowCount > 0) {
      throw new BadRequestException(
        `Customer with name = ${customer.name} already exists`,
      );
    }
    const result = await connection.query(
      'INSERT INTO customer (name, location) VALUES ($1, $2) RETURNING id, name, location',
      [customer.name, customer.location],
    );
    await connection.release();
    return result.rows[0];
  }

  async updateCustomer(
    id: number,
    customer: UpdateCustomerDTO,
  ): Promise<CustomerDTO> {
    const connection = await this.getConnection();
    const existingCustomer = await connection.query(
      'SELECT * FROM customer WHERE id = $1',
      [id],
    );
    if (existingCustomer.rowCount === 0) {
      throw new NotFoundException(`Customer with id = ${id} does not exist`);
    }
    const result = await connection.query(
      'UPDATE customer SET location = $1 WHERE id = $2 RETURNING id, name, location',
      [customer.location, id],
    );
    await connection.release();
    return result.rows[0];
  }

  async deleteCustomer(id: number): Promise<void> {
    const connection = await this.getConnection();
    const existingCustomer = await connection.query(
      'SELECT * FROM customer WHERE id = $1',
      [id],
    );

    if (existingCustomer.rowCount === 0) {
      throw new NotFoundException(`Customer with id = ${id} does not exist`);
    }
    const existingOrderItems = await connection.query(
      'SELECT * FROM order_item WHERE customer_id = $1',
      [id],
    );
    if (existingOrderItems.rowCount > 0) {
      throw new BadRequestException(
        `Customer with id = ${id} still has ${existingOrderItems.rowCount} orders opened`,
      );
    }
    await connection.query('DELETE FROM customer WHERE id = $1', [id]);
    await connection.release();
    return;
  }

  // Fruits
  async getFruit(id: number): Promise<FruitDTO> {
    const connection = await this.getConnection();
    const result = await connection.query(
      'SELECT id, name, stock FROM fruit WHERE id = $1',
      [id],
    );
    await connection.release();
    if (result.rowCount === 0) {
      throw new NotFoundException();
    }
    return result.rows[0];
  }

  async listFruits(query: ListFruitsDTO): Promise<FruitDTO[]> {
    const connection = await this.getConnection();
    const result = await connection.query(
      'SELECT id, name, stock FROM fruit WHERE name LIKE $1 AND stock < $2 AND stock > $3 ORDER BY id ASC LIMIT $4 OFFSET $5',
      [
        `%${query.name}%`,
        query.stockSmallerThen,
        query.stockGreaterThen,
        query.take,
        query.skip,
      ],
    );
    await connection.release();
    return result.rows;
  }

  async createFruit(fruit: CreateFruitDTO): Promise<FruitDTO> {
    const connection = await this.getConnection();
    const existingFruit = await connection.query(
      'SELECT * FROM fruit WHERE name = $1',
      [fruit.name],
    );
    if (existingFruit.rowCount > 0) {
      throw new BadRequestException(
        `Fruit with name = ${fruit.name} already exists`,
      );
    }
    const result = await connection.query(
      'INSERT INTO fruit (name, stock) VALUES ($1, $2) RETURNING id, name, stock',
      [fruit.name, fruit.stock],
    );
    await connection.release();
    return result.rows[0];
  }

  async updateFruit(id: number, fruit: UpdateFruitDTO): Promise<FruitDTO> {
    const connection = await this.getConnection();
    const existingFruit = await connection.query(
      'SELECT * FROM fruit WHERE id = $1',
      [id],
    );
    if (existingFruit.rowCount === 0) {
      throw new NotFoundException(`Fruit with id = ${id} does not exist`);
    }
    const result = await connection.query(
      'UPDATE fruit SET stock = $1 WHERE id = $2 RETURNING id, name, stock',
      [fruit.stock, id],
    );
    await connection.release();
    return result.rows[0];
  }

  async deleteFruit(id: number): Promise<void> {
    const connection = await this.getConnection();
    const existingFruit = await connection.query(
      'SELECT * FROM fruit WHERE id = $1',
      [id],
    );

    if (existingFruit.rowCount === 0) {
      throw new NotFoundException(`Fruit with id = ${id} does not exist`);
    }
    const existingOrderItems = await connection.query(
      'SELECT * FROM order_item WHERE fruit_id = $1',
      [id],
    );
    if (existingOrderItems.rowCount > 0) {
      throw new BadRequestException(
        `Fruit with id = ${id} still has ${existingOrderItems.rowCount} orders opened`,
      );
    }
    await connection.query('DELETE FROM fruit WHERE id = $1', [id]);
    await connection.release();
    return;
  }

  // Orders
  async listOrders(query: ListOrdersDTO): Promise<OrderDTO[]> {
    let whereCondition = '';
    if (query.fruitIds.length > 0 && query.customerIds.length === 0) {
      whereCondition = `WHERE fruit_id IN (${query.fruitIds})`;
    }
    if (query.fruitIds.length === 0 && query.customerIds.length > 0) {
      whereCondition = `WHERE customer_id IN (${query.customerIds})`;
    }
    if (query.fruitIds.length > 0 && query.customerIds.length > 0) {
      whereCondition = `WHERE fruit_id IN (${query.fruitIds}) AND customer_id IN (${query.customerIds})`;
    }
    console.log(whereCondition);
    const connection = await this.getConnection();
    const result = await connection.query(
      `SELECT id, customer_id, fruit_id, quantity FROM order_item ${whereCondition} ORDER BY id ASC LIMIT $1 OFFSET $2`,
      [query.take, query.skip],
    );
    await connection.release();
    return result.rows;
  }

  async createOrder(order: CreateOrderDTO): Promise<OrderDTO> {
    const connection = await this.getConnection();

    // Check if fruit exists
    const existingFruit = await connection.query(
      'SELECT * FROM fruit WHERE id = $1',
      [order.fruitId],
    );
    if (existingFruit.rowCount === 0) {
      throw new NotFoundException(
        `Fruit with id = ${order.fruitId} does not exist`,
      );
    }

    // Check if customer exists
    const existingCustomer = await connection.query(
      'SELECT * FROM customer WHERE id = $1',
      [order.customerId],
    );
    if (existingCustomer.rowCount === 0) {
      throw new NotFoundException(
        `Customer with id = ${order.customerId} does not exist`,
      );
    }

    // Check if there is enough stock
    const stock = await connection.query(
      'SELECT stock FROM fruit WHERE id = $1',
      [order.fruitId],
    );
    if (stock.rows[0].stock < order.quantity) {
      throw new BadRequestException(
        `Fruit with id = ${order.fruitId} does not have enough stock. Current stock is: ${stock.rows[0].stock}`,
      );
    }

    // Try to write order
    try {
      await connection.query('BEGIN');
      await connection.query(
        'UPDATE fruit SET stock = stock - $1 WHERE id = $2',
        [order.quantity, order.fruitId],
      );
      const result = await connection.query(
        'INSERT INTO order_item (customer_id, fruit_id, quantity) VALUES ($1, $2, $3) RETURNING id, customer_id, fruit_id, quantity',
        [order.customerId, order.fruitId, order.quantity],
      );

      await connection.query('COMMIT');
      await connection.release();
      return result.rows[0];
    } catch (error) {
      await connection.query('ROLLBACK');
      await connection.release();
      throw new BadRequestException('Something went wrong');
    }
  }

  async updateOrder(id: number, order: UpdateOrderDTO): Promise<OrderDTO> {
    const connection = await this.getConnection();

    // Check if order exists
    const existingOrder = await connection.query(
      'SELECT * FROM order_item WHERE id = $1',
      [id],
    );
    if (existingOrder.rowCount === 0) {
      throw new NotFoundException(`Order with id = ${id} does not exist`);
    }

    // Check if there is enough stock
    const stock = await connection.query(
      'SELECT stock FROM fruit WHERE id = $1',
      [existingOrder.rows[0].fruit_id],
    );
    if (stock.rows[0].stock < order.quantity - existingOrder.rows[0].quantity) {
      throw new BadRequestException(
        `Fruit with id = ${existingOrder.rows[0].fruit_id} does not have enough stock. Current stock is: ${stock.rows[0].stock}`,
      );
    }

    // Try to write order
    try {
      await connection.query('BEGIN');
      await connection.query(
        'UPDATE fruit SET stock = stock - $1 WHERE id = $2',
        [
          order.quantity - existingOrder.rows[0].quantity,
          existingOrder.rows[0].fruit_id,
        ],
      );
      const result = await connection.query(
        'UPDATE order_item SET quantity = $1 WHERE id = $2 RETURNING id, customer_id, fruit_id, quantity',
        [order.quantity, id],
      );

      await connection.query('COMMIT');
      await connection.release();
      return result.rows[0];
    } catch (error) {
      await connection.query('ROLLBACK');
      await connection.release();
      throw new BadRequestException('Something went wrong');
    }
  }

  async deleteOrder(id: number): Promise<void> {
    const connection = await this.getConnection();

    // Check if order exists
    const existingOrder = await connection.query(
      'SELECT * FROM order_item WHERE id = $1',
      [id],
    );
    if (existingOrder.rowCount === 0) {
      throw new NotFoundException(`Order with id = ${id} does not exist`);
    }
    await connection.query('DELETE FROM order_item WHERE id = $1', [id]);
    await connection.release();
    return;
  }
}
