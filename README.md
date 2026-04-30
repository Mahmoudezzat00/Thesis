# Ecommerce Storefront

A full-stack ecommerce application built with Next.js, React, MongoDB, Mongoose, Tailwind CSS, Auth.js, PayPal, Stripe, UploadThing, and Resend.

## Getting Started

1. Install dependencies:

   ```shell
   npm install --legacy-peer-deps
   ```

2. Create a local environment file:

   ```shell
   cp .example-env .env.local
   ```

3. Update `.env.local` with your MongoDB, authentication, payment, upload, and email settings.

4. Seed the database:

   ```shell
   npm run seed
   ```

5. Start the development server:

   ```shell
   npm run dev
   ```

6. Open `http://localhost:3000`.

## Scripts

- `npm run dev` starts the Next.js development server.
- `npm run build` builds the production app.
- `npm run start` starts the production server.
- `npm run seed` seeds the database.
- `npm run email` starts the email preview server.

## Notes

This project is ready to initialize as a fresh repository:

```shell
git init
git add .
git commit -m "Initial commit"
```
