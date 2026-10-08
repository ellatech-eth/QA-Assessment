# Manual Test Cases

## 1. Test Scope

Manual functional and exploratory testing was performed against the Ella API using Swagger UI.

| Item          | Details                       |
| ------------- | ----------------------------- |
| API           | Ella API                      |
| OpenAPI       | OAS 3.0                       |
| Base URL      | `http://localhost:4000`       |
| Documentation | `http://localhost:4000/api`   |
| Modules       | Users, Products, Transactions |

Testing covered:

* CRUD operations
* Input validation
* Error handling
* Duplicate email handling
* Invalid IDs and input values
* Repeated transaction requests

---

## 2. Test Case Summary

| ID                 | Module       | Scenario                         | Type       | Expected                            | Actual                                | Status |
| ------------------ | ------------ | -------------------------------- | ---------- | ----------------------------------- | ------------------------------------- | ------ |
| TC-USER-001        | Users        | Create user with valid data      | Positive   | `201 Created`                       | User created successfully             | PASS   |
| TC-USER-002        | Users        | Empty name and email             | Validation | `400 Bad Request`                   | `400` with required-field messages    | PASS   |
| TC-USER-003        | Users        | Retrieve all users               | Positive   | `200 OK`                            | Users returned successfully           | PASS   |
| TC-USER-004        | Users        | Retrieve user by valid ID        | Positive   | User returned                       | User returned successfully            | PASS   |
| TC-USER-005        | Users        | Retrieve user with ID `0` / `-1` | Negative   | `404 Not Found`                     | `404` returned                        | PASS   |
| TC-USER-006        | Users        | Update user                      | Positive   | User updated                        | Update successful                     | PASS   |
| TC-USER-007        | Users        | Duplicate email                  | Negative   | Conflict/error response             | Corrected to return conflict response | PASS   |
| TC-USER-008        | Users        | Malformed JSON                   | Validation | `400 Bad Request`                   | `400` JSON parsing error              | PASS   |
| TC-PRODUCT-001     | Products     | Create product                   | Positive   | `201 Created`                       | Product created successfully          | PASS   |
| TC-PRODUCT-002     | Products     | Retrieve all products            | Positive   | `200 OK`                            | Products returned successfully        | PASS   |
| TC-PRODUCT-003     | Products     | Retrieve product by valid ID     | Positive   | Product returned                    | Product returned successfully         | PASS   |
| TC-PRODUCT-004     | Products     | Update product                   | Positive   | Product updated                     | Update successful                     | PASS   |
| TC-TRANSACTION-001 | Transactions | Create transaction               | Positive   | `201 Created`                       | Transaction created successfully      | PASS   |
| TC-TRANSACTION-002 | Transactions | Retrieve all transactions        | Positive   | `200 OK`                            | Transactions returned successfully    | PASS   |
| TC-TRANSACTION-003 | Transactions | Retrieve transaction by valid ID | Positive   | Transaction returned                | Transaction returned successfully     | PASS   |
| TC-TRANSACTION-004 | Transactions | Repeat same transaction payload  | Edge       | Process according to business rules | Separate transaction IDs created      | PASS   |
| TC-VALIDATION-001  | Validation   | Invalid user ID `0` / `-1`       | Negative   | `404 Not Found`                     | `404` returned                        | PASS   |
| TC-VALIDATION-002  | Validation   | Malformed JSON                   | Negative   | `400 Bad Request`                   | `400` returned                        | PASS   |

---

## 3. Key Test Evidence

### TC-USER-002: Required Field Validation

**Request**

```json
{
  "name": "",
  "email": ""
}
```

**Actual Response**

```json
{
  "message": [
    "Name is required",
    "Email is required"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

**Result:** PASS

---

### TC-USER-005: Invalid User IDs

**Test values**

* `id = 0`
* `id = -1`

**Actual responses**

`User with ID 0 not found`

`User with ID -1 not found`

Both returned:

`404 Not Found`

**Result:** PASS

---

### TC-USER-007: Duplicate Email

**Expected**

A duplicate email should not create another user and should return an appropriate conflict response.

**Initial Result**

The original implementation incorrectly handled the PostgreSQL unique constraint and returned a successful response.

**Action Taken**

The duplicate-email handling was corrected to detect the PostgreSQL unique-constraint violation and return a conflict response.

**Verification**

The corrected implementation was tested successfully.

**Result:** PASS after fix

**Related Bug:** `BUG-001` in `BUGS.md`

---

### TC-USER-008: Malformed JSON

**Example**

```json
{
  "name": "yonas",
  "email": SDS
}
```

**Actual Response**

```json
{
  "message": "Unexpected token 'S' ... is not valid JSON",
  "error": "Bad Request",
  "statusCode": 400
}
```

**Result:** PASS

---

### TC-TRANSACTION-001: Create Transaction

**Request**

```json
{
  "userId": 1,
  "productId": 1,
  "quantity": 1
}
```

**Actual Result**

`201 Created`

Returned:

* Transaction ID: `5`
* User ID: `1`
* Product ID: `1`
* Quantity: `1`
* Product price: `10`
* Product status: `FOR_SALE`

**Result:** PASS

---

### TC-TRANSACTION-004: Repeated Transaction

The same transaction payload was submitted multiple times.

**Actual Result**

Each request created a separate transaction with a different transaction ID.

**Assessment**

This was not classified as a defect because no requirement was identified stating that identical transaction requests must be rejected.

**Result:** PASS

---

## 4. Test Execution Summary

| Module       | Positive | Negative / Validation | Edge Cases | Result   |
| ------------ | -------: | --------------------: | ---------: | -------- |
| Users        |        4 |                     4 |          0 | PASS     |
| Products     |        4 |                     0 |          0 | PASS     |
| Transactions |        3 |                     0 |          1 | PASS     |
| Validation   |        0 |                     2 |          0 | PASS     |
| **Total**    |   **11** |                 **6** |      **1** | **PASS** |

---

## 5. Overall Result

Manual testing covered the main API functionality across the Users, Products, and Transactions modules.

The API successfully handled the tested positive scenarios and returned appropriate validation/error responses for the negative scenarios.

One confirmed implementation defect was identified during testing:

* **BUG-001:** Incorrect duplicate-email handling in `UsersService`

The defect was corrected and verified.

The repeated transaction scenario was investigated and was not classified as a defect because separate transaction IDs for separate requests are valid unless the business requirements explicitly prohibit duplicate transactions.

**Overall manual testing status: PASS**
