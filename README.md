# signup-service

A flexible, framework-agnostic TypeScript library for implementing user registration, email verification, and account activation.

`signup-service` provides the complete signup workflow while remaining independent of databases, web frameworks, password hashing algorithms, mail providers, and storage implementations.

Instead of forcing you to use a particular stack, the library allows you to plug in your own repository, password hasher, email sender, and verification code storage.



# Main Workflow

```
Sign up
 │
 ▼
Verify email/phone
 │
 ▼
Activate account
```

### Step 1: sign up
```
sign up
   │
   ├── check username
   ├── check contact
   ├── hash password
   ├── save user
   ├── create passcode
   ├── send email
   └── mark "code sent"
```

### Step 2: verify email/phone and activate account

```
verify email/phone (by sent-code)

   │
   ▼
check passcode

   │
   ▼
activate account
```

# Signup Detailed Workflow

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

# Architecture
```
Validator

SignupService
│
├── Repository
├── PasscodeRepository
├── Password Comparator
├── Passcode Comparator
├── Mail Sender
└── ID Generator

SQL Repository

Mail Sender

Utilities
```

Everything depends on interfaces.

That's a very strong design.

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
npm install signup-service
```

or

```bash
yarn add signup-service
```

---

# Quick Example

```typescript
import { SignupService, Validator } from "signup-service";

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
await signup.verify(userId, verificationCode);
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
send(to, passcode, expireAt)
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

## Nice Design Choices
### Field mapping
```typescript
map
```

lets users map
```text
username

   ↓

user_name
```
without modifying the code.

Very useful.

### Tracking
```text
createdAt
updatedAt
createdBy
updatedBy
```
is optional.

Good.

### Version field
Supports optimistic locking style versioning.

Nice feature.

### Password expiry
Supports
```text
maxPasswordAge
```
Not common in npm libraries.

## Configurable Field Mapping

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


## Audit Fields

The SQL repository can automatically populate

* createdAt
* createdBy
* updatedAt
* updatedBy
* version

This makes it suitable for enterprise applications.

---

## Password Storage

Passwords are never stored in plaintext.

The library hashes passwords before persistence using the injected comparator.

---

## Verification Codes

Verification codes are:

* randomly generated
* hashed before storage
* compared securely
* expiration-aware

The application decides where they are stored.

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

* SaaS platforms
* Enterprise systems
* Banking platforms
* Insurance platforms
* Government systems
* Healthcare systems
* Internal business applications
* Microservices
* Serverless applications
* REST APIs
* GraphQL APIs

---

# Why signup-service?

Unlike authentication frameworks that require a specific stack, `signup-service` focuses only on the signup and account verification workflow.

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
