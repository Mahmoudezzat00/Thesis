# Product Intelligence Method

## Purpose

The Product Intelligence feature gives administrators a quick way to identify strong products, category performance, and possible restock risks. It is designed as an explainable decision-support feature for the thesis project.

## Location

- Admin route: `/admin/intelligence`
- Server action: `getProductIntelligenceReport` in `lib/actions/product.actions.ts`

## Performance Score

Each published product receives a score from 0 to 100. The score is calculated from four factors:

| Factor | Weight | Reason |
| --- | ---: | --- |
| Sales velocity | 40% | High sales indicate demand. |
| Average rating | 25% | Ratings estimate customer satisfaction. |
| Review volume | 15% | More reviews improve confidence in the rating signal. |
| Stock health | 20% | Products with enough stock are more commercially ready. |

## Restock Risk

Restock risk is based on demand and available stock:

- **High:** product sales are at least 60% of the top-selling product and stock is 10 or less.
- **Medium:** product sales are at least 35% of the top-selling product and stock is 15 or less.
- **Low:** product does not currently match the higher-risk conditions.

## Thesis Value

This feature supports the thesis by showing how raw ecommerce data can be transformed into operational insight. It can be evaluated through:

- accuracy of identifying high-demand products,
- usefulness for inventory decisions,
- clarity of the scoring method,
- administrator usability during product planning.

## Future Improvements

- Add real order-history weighting instead of seeded `numSales`.
- Include seasonality and date ranges.
- Use browsing history and cart abandonment signals.
- Add alert thresholds configurable by admins.
- Compare the explainable model against a machine-learning recommender.
