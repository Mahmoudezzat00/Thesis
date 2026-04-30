# Thesis Overview

## Working Title

SmartShop Thesis: A Full-Stack Ecommerce Platform with Administrative Commerce Intelligence

## Problem Statement

Small and medium-sized online stores often need more than a product catalog and checkout page. They need a platform that helps customers discover products efficiently while helping administrators understand sales, stock, product performance, and customer behavior. This project explores how a full-stack ecommerce application can combine storefront functionality with decision-support features.

## Project Objectives

- Build a complete ecommerce workflow from product discovery to order tracking.
- Support customer and administrator roles with separate responsibilities.
- Provide multilingual browsing for a wider audience.
- Integrate payment, upload, and email service boundaries.
- Add a commerce-intelligence module that summarizes product performance signals.
- Prepare the system for future recommendation and inventory analysis features.

## Current Scope

The current implementation includes:

- Product catalog, category browsing, tags, search, sorting, and filtering.
- Cart, checkout, order creation, and order history.
- Admin management for products, users, orders, settings, and web pages.
- Reviews and ratings.
- Stripe and PayPal payment integration points.
- Email integration points for receipts and review reminders.
- Seeded demonstration data.
- Homepage Commerce Intelligence Snapshot.

## Original Thesis Contribution

The first custom thesis-oriented feature is the Commerce Intelligence Snapshot. It aggregates live product data and presents:

- number of published products,
- sales-signal total,
- average customer rating,
- low-stock product count,
- top category,
- top product signal.

This creates a foundation for deeper thesis work, such as recommendation algorithms, stock-risk detection, product-performance scoring, and admin decision support.

## Suggested Research Questions

- How can ecommerce platforms improve product discovery using browsing and sales signals?
- What operational metrics are most useful for small-store administrators?
- How can product ratings, stock, and sales history support recommendation or inventory decisions?
- How does multilingual support affect ecommerce accessibility and usability?

## Future Work

- Personalized recommendations based on browsing history and order history.
- Inventory alerts for low-stock and high-demand products.
- Product-performance score combining sales, reviews, rating, and stock.
- Admin export reports for products, orders, and users.
- Automated test coverage for auth, cart, checkout, admin, and seed flows.
- Production deployment with real service credentials.
