import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // CUSTOMER
  it('Get customer - Existing customer', () => {
    return request(app.getHttpServer()).get('/customer/6').expect(200, {
      id: 6,
      name: 'Luka',
      location: 'Dallas',
    });
  });

  it('Get customer - Non-existing customer', () => {
    return request(app.getHttpServer()).get('/customer/100').expect(404, {
      statusCode: 404,
      message: 'Not Found',
    });
  });

  it('Get customer - Validation check', () => {
    return request(app.getHttpServer()).get('/customer/fff').expect(400, {
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('List customers - Pagination check', () => {
    return request(app.getHttpServer())
      .get('/customer')
      .query({ skip: 1, take: 2, name: '', location: '' })
      .expect(200, [
        {
          id: 2,
          name: 'Adam',
          location: 'Los Angeles',
        },
        {
          id: 3,
          name: 'Phil',
          location: 'Dallas',
        },
      ]);
  });

  it('List customers - Name filter check', () => {
    return request(app.getHttpServer())
      .get('/customer')
      .query({ skip: 0, take: 100, name: 'a', location: '' })
      .expect(200, [
        {
          id: 2,
          name: 'Adam',
          location: 'Los Angeles',
        },
        {
          id: 4,
          name: 'Stan',
          location: 'Milwaukee',
        },
        {
          id: 6,
          name: 'Luka',
          location: 'Dallas',
        },
      ]);
  });

  it('List customers - Location filter check', () => {
    return request(app.getHttpServer())
      .get('/customer')
      .query({ skip: 0, take: 100, name: '', location: 'dal' })
      .expect(200, [
        {
          id: 3,
          name: 'Phil',
          location: 'Dallas',
        },
        {
          id: 6,
          name: 'Luka',
          location: 'Dallas',
        },
      ]);
  });

  it('Create customer - Non-existing customer', () => {
    return request(app.getHttpServer())
      .post('/customer')
      .send({ name: 'Goran', location: 'San Antonio' })
      .expect(201, { id: 7, name: 'Goran', location: 'San Antonio' });
  });

  it('Create customer - Existing customer', () => {
    return request(app.getHttpServer())
      .post('/customer')
      .send({ name: 'Luka', location: 'Phoenix' })
      .expect(400, {
        statusCode: 400,
        message: 'Customer with name = Luka already exists',
        error: 'Bad Request',
      });
  });

  it('Update customer - Existing customer', () => {
    return request(app.getHttpServer())
      .put('/customer/7')
      .send({ location: 'Phoenix' })
      .expect(200, { id: 7, name: 'Goran', location: 'Phoenix' });
  });

  it('Update customer - Non-existing customer', () => {
    return request(app.getHttpServer())
      .put('/customer/100')
      .send({ location: 'Phoenix' })
      .expect(404, {
        statusCode: 404,
        message: 'Customer with id = 100 does not exist',
        error: 'Not Found',
      });
  });

  it('Delete customer - Existing customer', () => {
    return request(app.getHttpServer()).delete('/customer/2').expect(200);
  });

  it('Delete customer - Non-existing customer', () => {
    return request(app.getHttpServer()).delete('/customer/100').expect(404, {
      statusCode: 404,
      message: 'Customer with id = 100 does not exist',
      error: 'Not Found',
    });
  });

  it('Delete customer - Has existing order', () => {
    return request(app.getHttpServer()).delete('/customer/1').expect(400, {
      statusCode: 400,
      message: 'Customer with id = 1 still has 3 orders opened',
      error: 'Bad Request',
    });
  });

  // FRUIT
  it('Get fruit - Existing fruit', () => {
    return request(app.getHttpServer()).get('/fruit/1').expect(200, {
      id: 1,
      name: 'Pineapple',
      stock: 500,
    });
  });

  it('Get fruit - Non-existing fruit', () => {
    return request(app.getHttpServer()).get('/fruit/100').expect(404, {
      statusCode: 404,
      message: 'Not Found',
    });
  });

  it('Get fruit - Validation check', () => {
    return request(app.getHttpServer()).get('/fruit/fff').expect(400, {
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('List fruits - Pagination check', () => {
    return request(app.getHttpServer())
      .get('/fruit')
      .query({
        skip: 1,
        take: 2,
        name: '',
        stockGreaterThen: 0,
        stockSmallerThen: 2147483647,
      })
      .expect(200, [
        {
          id: 2,
          name: 'Banana',
          stock: 800,
        },
        {
          id: 3,
          name: 'Blueberry',
          stock: 1500,
        },
      ]);
  });

  it('List fruits - Name filter check', () => {
    return request(app.getHttpServer())
      .get('/fruit')
      .query({
        skip: 0,
        take: 100,
        name: 'a',
        stockGreaterThen: 0,
        stockSmallerThen: 2147483647,
      })
      .expect(200, [
        {
          id: 1,
          name: 'Pineapple',
          stock: 500,
        },
        {
          id: 2,
          name: 'Banana',
          stock: 800,
        },
        {
          id: 4,
          name: 'Mango',
          stock: 200,
        },
      ]);
  });

  it('List fruits - Stock filter check', () => {
    return request(app.getHttpServer())
      .get('/fruit')
      .query({
        skip: 0,
        take: 100,
        name: '',
        stockGreaterThen: 100,
        stockSmallerThen: 600,
      })
      .expect(200, [
        {
          id: 1,
          name: 'Pineapple',
          stock: 500,
        },
        {
          id: 4,
          name: 'Mango',
          stock: 200,
        },
      ]);
  });

  it('Create fruit - Non-existing fruit', () => {
    return request(app.getHttpServer())
      .post('/fruit')
      .send({ name: 'Strawberry', stock: 2000 })
      .expect(201, {
        id: 5,
        name: 'Strawberry',
        stock: 2000,
      });
  });

  it('Create fruit - Existing fruit', () => {
    return request(app.getHttpServer())
      .post('/fruit')
      .send({ name: 'Pineapple', stock: 600 })
      .expect(400, {
        statusCode: 400,
        message: 'Fruit with name = Pineapple already exists',
        error: 'Bad Request',
      });
  });

  it('Update fruit - Existing fruit', () => {
    return request(app.getHttpServer())
      .put('/fruit/5')
      .send({ stock: 2500 })
      .expect(200, { id: 5, name: 'Strawberry', stock: 2500 });
  });

  it('Update fruit - Non-existing fruit', () => {
    return request(app.getHttpServer())
      .put('/fruit/100')
      .send({ stock: 5000 })
      .expect(404, {
        statusCode: 404,
        message: 'Fruit with id = 100 does not exist',
        error: 'Not Found',
      });
  });

  it('Delete fruit - Existing fruit', () => {
    return request(app.getHttpServer()).delete('/fruit/2').expect(200);
  });

  it('Delete fruit - Non-existing fruit', () => {
    return request(app.getHttpServer()).delete('/fruit/100').expect(404, {
      statusCode: 404,
      message: 'Fruit with id = 100 does not exist',
      error: 'Not Found',
    });
  });

  it('Delete fruit - Has existing order', () => {
    return request(app.getHttpServer()).delete('/fruit/1').expect(400, {
      statusCode: 400,
      message: 'Fruit with id = 1 still has 2 orders opened',
      error: 'Bad Request',
    });
  });

  // ORDER
  it('List orders - Pagination check', () => {
    return request(app.getHttpServer())
      .get('/order')
      .query({
        skip: 1,
        take: 2,
        fruitIds: '',
        customerIds: '',
      })
      .expect(200, [
        { id: 2, customer_id: 1, fruit_id: 3, quantity: 20 },
        { id: 3, customer_id: 1, fruit_id: 4, quantity: 100 },
      ]);
  });

  it('List orders - Fruit filter check', () => {
    return request(app.getHttpServer())
      .get('/order')
      .query({
        skip: 0,
        take: 100,
        fruitIds: '4',
        customerIds: '',
      })
      .expect(200, [
        {
          id: 3,
          customer_id: 1,
          fruit_id: 4,
          quantity: 100,
        },
        {
          id: 5,
          customer_id: 3,
          fruit_id: 4,
          quantity: 45,
        },
      ]);
  });

  it('List orders - Customer filter check', () => {
    return request(app.getHttpServer())
      .get('/order')
      .query({
        skip: 0,
        take: 100,
        fruitIds: '',
        customerIds: '4,5',
      })
      .expect(200, [
        {
          id: 6,
          customer_id: 4,
          fruit_id: 3,
          quantity: 120,
        },
        {
          id: 7,
          customer_id: 5,
          fruit_id: 1,
          quantity: 350,
        },
      ]);
  });

  it('Create order - Successful creation', () => {
    return request(app.getHttpServer())
      .post('/order')
      .send({ fruitId: 1, customerId: 1, quantity: 50 })
      .expect(201, {
        id: 8,
        customer_id: 1,
        fruit_id: 1,
        quantity: 50,
      });
  });

  it('Create order - Fruit does not exist', () => {
    return request(app.getHttpServer())
      .post('/order')
      .send({ fruitId: 100, customerId: 1, quantity: 5 })
      .expect(404, {
        statusCode: 404,
        message: 'Fruit with id = 100 does not exist',
        error: 'Not Found',
      });
  });

  it('Create order - Customer does not exist', () => {
    return request(app.getHttpServer())
      .post('/order')
      .send({ fruitId: 1, customerId: 100, quantity: 5 })
      .expect(404, {
        statusCode: 404,
        message: 'Customer with id = 100 does not exist',
        error: 'Not Found',
      });
  });

  it('Create order - Not enough stock', () => {
    return request(app.getHttpServer())
      .post('/order')
      .send({ fruitId: 3, customerId: 1, quantity: 5000 })
      .expect(400, {
        statusCode: 400,
        message:
          'Fruit with id = 3 does not have enough stock. Current stock is: 1500',
        error: 'Bad Request',
      });
  });

  it('Update order - Successful update', () => {
    return request(app.getHttpServer())
      .put('/order/2')
      .send({ quantity: 50 })
      .expect(200, {
        id: 2,
        customer_id: 1,
        fruit_id: 3,
        quantity: 50,
      });
  });

  it('Update order - Not enough stock', () => {
    return request(app.getHttpServer())
      .put('/order/2')
      .send({ quantity: 50000 })
      .expect(400, {
        statusCode: 400,
        message:
          'Fruit with id = 3 does not have enough stock. Current stock is: 1470',
        error: 'Bad Request',
      });
  });

  it('Update order - Non-existing order', () => {
    return request(app.getHttpServer())
      .put('/order/100')
      .send({ quantity: 50 })
      .expect(404, {
        statusCode: 404,
        message: 'Order with id = 100 does not exist',
        error: 'Not Found',
      });
  });

  it('Delete order - Successful delete', () => {
    return request(app.getHttpServer()).delete('/order/1').expect(200);
  });

  it('Delete order - Non-existing order', () => {
    return request(app.getHttpServer()).delete('/order/100').expect(404, {
      statusCode: 404,
      message: 'Order with id = 100 does not exist',
      error: 'Not Found',
    });
  });
});
