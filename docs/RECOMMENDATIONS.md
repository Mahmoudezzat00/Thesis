# Smart Recommendation Method

## Purpose

Smart Recommendations improve product discovery by ranking catalog items according to a customer's browsing context and general product-performance signals. The feature is designed to be explainable for a thesis demonstration.

## Location

- Homepage component: `components/shared/home/smart-recommendations.tsx`
- API route: `app/api/products/recommendations/route.ts`
- Browsing history store: `hooks/use-browsing-history.ts`

## Inputs

The recommendation API receives:

- recently viewed product IDs,
- recently viewed product categories.

Viewed product IDs are excluded so the user is shown new products instead of the same items again.

## Recommendation Score

Each candidate product receives a score from 0 to 100 using:

| Factor | Weight | Reason |
| --- | ---: | --- |
| Category affinity | 35% | Products from categories the user viewed are more relevant. |
| Sales signal | 25% | Popular products are more likely to be useful recommendations. |
| Average rating | 20% | Higher-rated products represent stronger customer satisfaction. |
| Review volume | 10% | More reviews increase confidence in the rating. |
| Stock availability | 10% | In-stock products are more actionable for shoppers. |

## Explainability

Each recommendation includes short reasons such as:

- matches your interest in a category,
- highly rated by customers,
- popular with shoppers,
- limited stock,
- trending product from the catalog.

This makes the recommendation system easier to defend academically because users and evaluators can understand why a product appears.

## Future Improvements

- Use authenticated order history in addition to local browsing history.
- Add collaborative filtering based on similar customers.
- Track recommendation clicks and conversion rate.
- Compare the explainable weighted model with a machine-learning model.
- Add A/B testing between trending, category-based, and personalized recommendations.
