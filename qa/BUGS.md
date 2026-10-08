# Ella API - Bug Reports

## Overview

Exploratory and functional testing was performed against the Ella API using Swagger UI.

The following modules and areas were tested:

* Users
* Products
* Transactions
* Input validation
* Duplicate email handling
* Transaction creation and retrieval

Only confirmed and reproducible issues are documented below. Behaviors that appeared unusual but were not confirmed as defects were not reported as bugs.

---

## BUG-001: UsersService fails TypeScript compilation due to invalid User type

**Severity:** High

**Module:** Users

**Type:** Build / Code Quality

### Description

The original `UsersService.create()` implementation contained error-handling logic for duplicate user emails that returned a manually constructed object cast to the `User` entity type.

The object did not contain all required properties of the `User` entity, including `createdAt` and `updatedAt`.

As a result, the application failed TypeScript compilation.

### Steps to Reproduce

1. Clone the Ella API repository.
2. Install the project dependencies.
3. Configure the application environment.
4. Start the required database services.
5. Run the application build:

npm run build

### Actual Result

The TypeScript compiler reported an error in:

`src/users/users.service.ts`

The error indicated that the manually constructed object could not safely be converted to the `User` type because required properties were missing.

Example error:

`TS2352: Conversion of type ... to type 'User' may be a mistake`

The missing properties included:

* `createdAt`
* `updatedAt`

### Expected Result

The application should compile successfully without TypeScript errors.

The duplicate-email scenario should be handled using an appropriate HTTP error response rather than returning a manually constructed `User` object.

### Root Cause

The duplicate-email error-handling branch manually created an incomplete `User` object and used a type assertion to cast it to `User`.

The approach was effectively returning an object similar to:

`{ ...dto, id: 0, transactions: [] } as User`

This object did not represent a complete `User` entity and therefore violated the expected TypeScript type.

### Resolution

The `UsersService` was refactored to:

1. Save the actual user entity through the repository.
2. Detect PostgreSQL unique-constraint violations.
3. Return a `ConflictException` for duplicate emails.
4. Avoid manually constructing an incomplete `User` object.
5. Use the PostgreSQL driver error information when checking for error code `23505`.

### Verification

After the service was corrected:

* The application compiled successfully.
* The NestJS API started successfully.
* Swagger became available.
* User endpoints were tested through Swagger.
* Duplicate email handling returned an appropriate conflict response.

---

## Additional Exploratory Testing Notes

### Duplicate Transactions

The same transaction payload was submitted multiple times:

{
"userId": 1,
"productId": 1,
"quantity": 1
}

The API created separate transaction records with different IDs.

This behavior was **not classified as a bug** because a user may legitimately purchase the same product multiple times, and no requirement was identified stating that identical transactions must be rejected.

### Inventory Behavior

During transaction testing, product quantity behavior was observed and requires additional verification before being classified as a defect.

The expected behavior depends on the application's intended inventory rules.

Further testing should verify whether creating a transaction correctly updates the available product quantity and whether the API prevents purchasing more units than are available.

---

## Testing Summary

The following areas were successfully exercised during exploratory testing:

* User creation
* User retrieval
* User update
* User deletion
* Duplicate email handling
* User input validation
* Product endpoints
* Transaction creation
* Transaction retrieval
* Repeated transaction scenarios

Further negative and edge-case testing may identify additional defects.
