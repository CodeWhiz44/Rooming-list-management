## Plan: Rooming List Management Update & Improvements
A update plan to take this MVP from ~40% to production-ready by addressing security gaps, completing missing features, and improving code quality.

- Fix Security & Authentication — Add password hashing with bcrypt, create a User model in prisma/schema.prisma, implement proper login/registration in auth.controller.ts, and enforce JWT_SECRET environment validation in jwt.ts.
- Add Input Validation & Error Handling — Install Zod/Joi, create validation schemas for all request bodies, add a global error handler middleware in middleware, and centralize PrismaClient as a singleton.
- Implement CRUD Operations — Extend roomingLists.controller.ts and bookings.controller.ts with create, update, and delete endpoints; update routes accordingly.
- Add Frontend Routing & Protected Routes — Install React Router, create route structure in App.tsx, add login/register pages, implement auth state in roomingListStore.ts, and protect dashboard routes.
- Improve Testing & DevOps — Move Jest to devDependencies in package.json, remove duplicate @types/react from package.json, add frontend tests with Vitest, and add rate limiting + health check endpoint.
- Add Documentation & Production Config — Add Swagger/OpenAPI docs, update docker-compose.yml for production builds, and document API endpoints in README.md.
