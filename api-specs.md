---
title: Bookstore API Spec
description: The OpenAPI spec used throughout the APIOps Bootcamp labs.
---

# Bookstore API Spec

::: tip This is the API you'll manage with decK
The Bookstore API is a fictional API backed by **httpbun.com** (an HTTP echo service). You don't need to run a backend - httpbun echoes every request back so you can focus on `deck file openapi2kong`, gateway sync, and multi-team workflows.
:::

## How this spec is used

| Lab | What you do with it |
|---|---|
| **Module 01 - deck gateway** | Sync gateway config derived from this spec |
| **Module 02 - deck file** | Convert this OpenAPI spec to Kong config with `deck file openapi2kong` |
| **Module 03 - Multi-Team Workflows** | Merge and patch specs across teams |

## API overview

| Detail | Value |
|---|---|
| **Title** | Bookstore API |
| **Version** | 1.0.0 |
| **Backend** | https://httpbun.com (echo service - no real server needed) |
| **Auth** | API Key (`apikey` header) |

### Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/books` | List all books (supports `limit` and `genre` query params) |
| POST | `/books` | Add a new book |
| GET | `/books/{bookId}` | Get a book by ID |
| PUT | `/books/{bookId}` | Update a book |
| DELETE | `/books/{bookId}` | Delete a book |
| GET | `/authors` | List all authors |
| GET | `/authors/{authorId}` | Get an author by ID |
| GET | `/reviews` | List all reviews |
| POST | `/reviews` | Submit a book review |

---

## Full OpenAPI 3.0 Spec

Copy this spec or save it as `bookstore-api.yaml` for use in the labs.

::: details Click to expand the full Bookstore API spec

```yaml
openapi: 3.0.3
info:
  title: Bookstore API
  version: 1.0.0
  description: |
    A bookstore API for the APIOps bootcamp.
    This spec will be converted to Kong Gateway config using deck file openapi2kong.
  contact:
    name: Bookstore Team
    email: bookstore@example.com
servers:
- url: https://httpbun.com
  description: Mock backend (httpbun echoes requests)
paths:
  /books:
    get:
      operationId: listBooks
      summary: List all books
      tags:
      - books
      parameters:
      - name: limit
        in: query
        description: Maximum number of books to return
        schema:
          type: integer
          default: 20
      - name: genre
        in: query
        description: Filter by genre
        schema:
          type: string
      responses:
        "200":
          description: A list of books
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Book"
    post:
      operationId: createBook
      summary: Add a new book
      tags:
      - books
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Book"
      responses:
        "201":
          description: Book created
  /books/{bookId}:
    get:
      operationId: getBookById
      summary: Get a book by ID
      tags:
      - books
      parameters:
      - name: bookId
        in: path
        required: true
        schema:
          type: string
      responses:
        "200":
          description: A single book
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Book"
        "404":
          description: Book not found
    put:
      operationId: updateBook
      summary: Update a book
      tags:
      - books
      parameters:
      - name: bookId
        in: path
        required: true
        schema:
          type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Book"
      responses:
        "200":
          description: Book updated
    delete:
      operationId: deleteBook
      summary: Delete a book
      tags:
      - books
      parameters:
      - name: bookId
        in: path
        required: true
        schema:
          type: string
      responses:
        "204":
          description: Book deleted
  /authors:
    get:
      operationId: listAuthors
      summary: List all authors
      tags:
      - authors
      responses:
        "200":
          description: A list of authors
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Author"
  /authors/{authorId}:
    get:
      operationId: getAuthorById
      summary: Get an author by ID
      tags:
      - authors
      parameters:
      - name: authorId
        in: path
        required: true
        schema:
          type: string
      responses:
        "200":
          description: A single author
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Author"
  /reviews:
    get:
      operationId: listReviews
      summary: List all reviews
      tags:
      - reviews
      responses:
        "200":
          description: A list of reviews
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Review"
    post:
      operationId: createReview
      summary: Submit a book review
      tags:
      - reviews
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Review"
      responses:
        "201":
          description: Review submitted
security:
- ApiKeyAuth: []
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: apikey
      description: API key issued via Developer Portal app registration
  schemas:
    Book:
      type: object
      required:
      - title
      - author
      properties:
        id:
          type: integer
          format: int64
        title:
          type: string
          example: "The Great Gatsby"
        author:
          type: string
          example: "F. Scott Fitzgerald"
        isbn:
          type: string
          example: "978-0743273565"
        genre:
          type: string
          example: "Fiction"
        price:
          type: number
          format: float
          example: 12.99
    Author:
      type: object
      required:
      - name
      properties:
        id:
          type: integer
        name:
          type: string
          example: "F. Scott Fitzgerald"
        bio:
          type: string
        books_count:
          type: integer
    Review:
      type: object
      required:
      - bookId
      - rating
      properties:
        id:
          type: integer
        bookId:
          type: integer
        rating:
          type: integer
          minimum: 1
          maximum: 5
        comment:
          type: string
        reviewer:
          type: string
```

:::

---

## Convert to Kong config with decK

This is the key APIOps command — generate Kong Gateway configuration directly from this spec:

```bash
deck file openapi2kong -s bookstore-api.yaml -o kong.yaml
```

Then sync to your control plane:

```bash
deck gateway sync kong.yaml \
  --konnect-token $KONNECT_TOKEN \
  --konnect-control-plane-name $KONNECT_CP_NAME
```

---

## Quick test with curl

Since the backend is httpbun (echo service), these requests return echoed request data:

```bash
# List books (echoed GET)
curl -s https://httpbun.com/books | jq .

# Create a book (echoed POST)
curl -s -X POST https://httpbun.com/books \
  -H "Content-Type: application/json" \
  -d '{"title": "The Great Gatsby", "author": "F. Scott Fitzgerald"}' | jq .
```

---

*← [✅ Prerequisites](/prerequisites) · [Start Module 01 →](/module-01-deck-gateway/)*
