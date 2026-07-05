# signup-service

A flexible, framework-agnostic TypeScript library for implementing user registration, email verification, and account activation.

`signup-service` provides the complete signup workflow while remaining independent of databases, web frameworks, password hashing algorithms, mail providers, and storage implementations.

Instead of forcing you to use a particular stack, the library allows you to plug in your own repository, password hasher, email sender, and verification code storage.

---

## Features

* ✔ Complete signup workflow
* ✔ Email or phone verification
* ✔ Account activation
* ✔ Password hashing abstraction
* ✔ Verification code hashing
* ✔ Configurable validators
* ✔ Generic repository interfaces
* ✔ SQL repository implementation included
* ✔ Database-independent design
* ✔ Framework-independent
* ✔ Configurable field mapping
* ✔ Audit fields support
* ✔ Password expiration support
* ✔ TypeScript-first

---

# Installation

```bash
npm install signup-core
```

---

# Architecture

```
                SignupService
                      │
        ┌─────────────┼─────────────┐
        │             │             │
 Repository      Comparator     Mail Sender
        │
 Passcode Repository
        │
 Verification Code Storage
```

Everything is injected through interfaces, allowing you to integrate with any backend technology.

---

# Signup Workflow

```
User
 │
 ▼
Validate Input
 │
 ▼
Check Username
 │
 ▼
Check Contact
 │
 ▼
Hash Password
 │
 ▼
Save User
 │
 ▼
Generate Verification Code
 │
 ▼
Hash Verification Code
 │
 ▼
Store Verification Code
 │
 ▼
Send Email / SMS
 │
 ▼
User Verifies Code
 │
 ▼
Activate Account
```

---

# Quick Example

```typescript
import {
    SignupService,
    Validator
} from "signup-core";

const validator = new Validator();

const signup = new SignupService(
    status,
    repository,
    generateId,
    passwordComparator,
    passcodeComparator,
    passcodeRepository,
    sender,
    300,
    validator.validate
);
```

Register a user:

```typescript
await signup.signup({
    username: "john",
    password: "Password@123",
    contact: "john@example.com"
});
```

Verify the account:

```typescript
await signup.verify(
    userId,
    verificationCode
);
```

---

# Core Components

## SignupService

Coordinates the complete registration workflow.

Responsibilities include:

* validating user input
* checking duplicate usernames
* checking duplicate contacts
* hashing passwords
* saving users
* generating verification codes
* sending verification emails
* activating accounts

---

## Validator

Built-in validation for:

* username
* email
* phone number
* password complexity

Validators are replaceable with custom implementations.

---

## Repository

```typescript
interface Repository<ID, T> {
    checkUsername(username: string): Promise<boolean>;
    checkContact(contact: string): Promise<boolean>;
    save(id: ID, user: T): Promise<boolean>;
    verify(id: ID): Promise<boolean>;
    activate(id: ID, password?: string): Promise<boolean>;
}
```

Implement this interface for any storage engine.

Examples:

* PostgreSQL
* MySQL
* SQL Server
* SQLite
* Oracle
* MongoDB
* DynamoDB

---

## Passcode Repository

Stores verification codes separately from user data.

```typescript
interface PasscodeRepository<ID> {
    save(...)
    load(...)
    delete(...)
}
```

Supports:

* Redis
* SQL
* MongoDB
* Memory
* Custom implementations

---

## Comparator

Password hashing is completely pluggable.

```typescript
interface Comparator {
    hash(plaintext: string): Promise<string>;
    compare(data: string, encrypted: string): Promise<boolean>;
}
```

Compatible with:

* bcrypt
* argon2
* scrypt
* PBKDF2
* custom algorithms

---

## Mail Sender

The library is mail-provider agnostic.

```typescript
send(
    to,
    passcode,
    expireAt
)
```

Can be integrated with:

* SMTP
* SendGrid
* Amazon SES
* Mailgun
* Postmark
* Azure Email
* Custom services

---

# SQL Repository

The package includes a reusable SQL repository implementation.

Features:

* configurable table names
* configurable field names
* automatic INSERT generation
* status updates
* account activation
* field mapping
* audit fields
* optimistic version support

---

# Configurable Field Mapping

Existing database schema?

No problem.

```typescript
{
    username: "user_name",
    contact: "email_address",
    password: "password_hash"
}
```

No schema migration required.

---

# Status Workflow

The registration lifecycle is configurable.

Example:

```
REGISTERED

↓

CODE_SENT

↓

ACTIVATED
```

Applications may define any status values.

---

# Password Policies

Built-in support for:

* minimum length
* uppercase letters
* lowercase letters
* numbers
* special characters

Custom validators may also be supplied.

---

# Utility Functions

Included helpers:

* isEmail()
* isPhone()
* isUsername()
* isPassword()
* generate()
* addSeconds()
* buildConfirmUrl()

---

# Design Goals

The library follows several design principles:

* Dependency Injection
* Interface-first design
* Database independence
* Framework independence
* Single Responsibility Principle
* Open/Closed Principle

---

# Typical Use Cases

* SaaS applications
* Enterprise systems
* Internal business applications
* REST APIs
* GraphQL APIs
* Microservices
* Serverless applications

---

# Why signup-core?

Unlike authentication frameworks that require a specific stack, `signup-core` focuses only on the signup and account verification workflow.

You choose:

* your database
* your ORM
* your password hashing algorithm
* your mail provider
* your web framework

The library provides the business logic while leaving infrastructure decisions to your application.

---

# License

MIT
