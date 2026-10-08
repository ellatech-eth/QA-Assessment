import { test, expect } from '@playwright/test';

test.describe('Ella API - Critical Purchase Flow', () => {
  test('should create user, product, transaction, and retrieve transaction', async ({
    request,
  }) => {
    const uniqueEmail = 'qa_' + Date.now() + '@example.com';
    const uniqueProductName = 'QA Product ' + Date.now();

    const userResponse = await request.post('/users', {
      data: {
        name: 'QA Automation User',
        email: uniqueEmail,
      },
    });

    expect(userResponse.status()).toBe(201);

    const userBody = await userResponse.json();

    expect(userBody.data).toHaveProperty('id');
    expect(userBody.data.name).toBe('QA Automation User');
    expect(userBody.data.email).toBe(uniqueEmail);

    const userId = userBody.data.id;

    const productResponse = await request.post('/products', {
      data: {
        name: uniqueProductName,
        price: 100,
        quantity: 10,
        status: 'FOR_SALE',
      },
    });

    expect(productResponse.status()).toBe(201);

    const productBody = await productResponse.json();

    expect(productBody.data).toHaveProperty('id');
    expect(productBody.data.name).toBe(uniqueProductName);
    expect(productBody.data.price).toBe(100);
    expect(productBody.data.quantity).toBe(10);
    expect(productBody.data.status).toBe('FOR_SALE');

    const productId = productBody.data.id;

    const transactionResponse = await request.post('/transactions', {
      data: {
        userId,
        productId,
        quantity: 1,
      },
    });

    expect(transactionResponse.status()).toBe(201);

    const transactionBody = await transactionResponse.json();

    console.log('Transaction response:', JSON.stringify(transactionBody, null, 2));

    expect(transactionBody.data).toHaveProperty('id');

    const transactionId = transactionBody.data.id;

    const getTransactionResponse = await request.get(
      '/transactions/' + transactionId,
    );

    expect(getTransactionResponse.status()).toBe(200);

    const retrievedTransaction = await getTransactionResponse.json();

    console.log(
      'Retrieved transaction:',
      JSON.stringify(retrievedTransaction, null, 2),
    );

    expect(retrievedTransaction.data.id).toBe(transactionId);
  });
});

test.describe('Ella API - Users Validation', () => {
  test('should reject a user with missing required fields', async ({
    request,
  }) => {
    const response = await request.post('/users', {
      data: {},
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.message).toContain('Name is required');
    expect(body.message).toContain('Email is required');
    expect(body.error).toBe('Bad Request');
  });

  test('should reject a duplicate user email', async ({ request }) => {
    const email = 'duplicate_' + Date.now() + '@example.com';

    const firstResponse = await request.post('/users', {
      data: {
        name: 'First User',
        email,
      },
    });

    expect(firstResponse.status()).toBe(201);

    const duplicateResponse = await request.post('/users', {
      data: {
        name: 'Duplicate User',
        email,
      },
    });

    expect(duplicateResponse.status()).toBe(409);

    const body = await duplicateResponse.json();

    expect(body.message).toBe('Email already exists');
  });
});

test.describe('Ella API - Transaction Validation', () => {
  test('should reject a transaction with a non-existent user', async ({
    request,
  }) => {
    const response = await request.post('/transactions', {
      data: {
        userId: 999999,
        productId: 1,
        quantity: 1,
      },
    });

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.error).toBe('Not Found');
  });

  test('should reject a transaction with an invalid user ID of zero', async ({
    request,
  }) => {
    const response = await request.post('/transactions', {
      data: {
        userId: 0,
        productId: 1,
        quantity: 1,
      },
    });

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.message).toBe('User with ID 0 not found');
  });

  test('should reject a transaction with a negative user ID', async ({
    request,
  }) => {
    const response = await request.post('/transactions', {
      data: {
        userId: -1,
        productId: 1,
        quantity: 1,
      },
    });

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.message).toBe('User with ID -1 not found');
  });
});