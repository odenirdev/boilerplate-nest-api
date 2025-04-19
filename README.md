# Boilerplate NestJS – User Management

**Created by Odenir Gomes**

---

## 📄 Description

A production-ready NestJS boilerplate featuring:

- **User CRUD** (registration, retrieval, pagination)
- **Validation and global pipes** for input sanitization
- **Prisma ORM** integration (PostgreSQL)
- **Automated tests** (unit & E2E) using Jest + Supertest

Ideal starting point for new back-end projects with NestJS.

---

## ⚙️ Features

- **User module**
  - `POST /users` → Create a new user
  - `GET /users/:id` → Fetch user by ID
  - `GET /users` → Paginated list of users
- **DTOs & Pipes**: Input validation via `class-validator` and custom `QueryPipe`
- **Prisma**: Database modeling, migrations, type-safe client
- **Testing**:
  - Unit tests for services and controllers
  - E2E tests with isolated test database
- **Environment support**: `development`, `production`, `test`

---

## 🚀 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/boilerplate-nestjs.git
   cd boilerplate-nestjs
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

---

## 🔧 Configuration

Create a `.env` file in the project root:

```env
# Development environment
NODE_ENV=development
DATABASE_URL="postgres://user:password@localhost:5432/mydatabase"
```

For testing, copy and adjust to `.env.test`:

```env
NODE_ENV=test
DATABASE_URL="postgres://user:password@localhost:5432/mydatabase_test"
```

---

## 🏃 Usage

### Development

1. Start PostgreSQL via Docker Compose:
   ```bash
   docker-compose up -d db
   ```
2. Run the application in dev mode:
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```
3. Visit `http://localhost:3000`

### Production

```bash
npm run build
npm run start:prod
```

---

## 🧪 Testing

### Unit Tests

```bash
npm run test
# or
yarn test
```

### E2E Tests

```bash
npm run test:e2e
# or
yarn test:e2e
```

---

## 📂 Project Structure

```
src/
├── app.module.ts          # Root module
├── main.ts                # Application entrypoint
├── modules/
│   └── user/
│       ├── dtos/          # UserDto, PaginatedRequestDto
│       ├── services/      # UserService
│       └── user.controller.ts
├── shared/
│   ├── prisma/            # PrismaService
│   ├── utils/             # BaseController, Result types
│   └── pipes/             # QueryPipe
prisma/
├── schema.prisma
└── migrations/
test/
├── global-setup.ts        # DB setup for tests
├── app.e2e-spec.ts
└── user.e2e-spec.ts
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/foo`
3. Commit your changes: `git commit -m 'feat: add foo'`
4. Push to the branch: `git push origin feature/foo`
5. Open a Pull Request

---

## 📝 License

MIT © Odenir Gomes

