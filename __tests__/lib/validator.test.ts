jest.mock('query-string', () => ({
  parse: jest.fn((str) => ({})),
  stringifyUrl: jest.fn(({ url, query }) => url),
}))

import {
  UserSignInSchema,
  UserSignUpSchema,
  UserUpdateSchema,
  ProductInputSchema,
  ProductUpdateSchema,
  OrderItemSchema,
  ShippingAddressSchema,
  OrderInputSchema,
  CartSchema,
  ReviewInputSchema,
  WebPageInputSchema,
  WebPageUpdateSchema,
  UserNameSchema,
  SiteLanguageSchema,
  CarouselSchema,
  SiteCurrencySchema,
  PaymentMethodSchema,
  DeliveryDateSchema,
} from '@/lib/validator'

describe('lib/validator - User Schemas', () => {
  describe('UserSignInSchema', () => {
    it('should validate correct email and password', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
      }
      expect(() => UserSignInSchema.parse(data)).not.toThrow()
    })

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
      }
      expect(() => UserSignInSchema.parse(data)).toThrow()
    })

    it('should reject short password', () => {
      const data = {
        email: 'test@example.com',
        password: 'ab',
      }
      expect(() => UserSignInSchema.parse(data)).toThrow()
    })

    it('should reject missing email', () => {
      const data = {
        password: 'password123',
      }
      expect(() => UserSignInSchema.parse(data)).toThrow()
    })

    it('should reject empty email', () => {
      const data = {
        email: '',
        password: 'password123',
      }
      expect(() => UserSignInSchema.parse(data)).toThrow()
    })
  })

  describe('UserSignUpSchema', () => {
    it('should validate correct signup data', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }
      expect(() => UserSignUpSchema.parse(data)).not.toThrow()
    })

    it('should reject mismatched passwords', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password456',
      }
      expect(() => UserSignUpSchema.parse(data)).toThrow()
    })

    it('should reject short name', () => {
      const data = {
        name: 'J',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }
      expect(() => UserSignUpSchema.parse(data)).toThrow()
    })

    it('should reject very long name', () => {
      const data = {
        name: 'a'.repeat(51),
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }
      expect(() => UserSignUpSchema.parse(data)).toThrow()
    })
  })

  describe('UserUpdateSchema', () => {
    it('should validate complete user update', () => {
      const data = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Updated Name',
        email: 'new@example.com',
        role: 'Admin',
      }
      expect(() => UserUpdateSchema.parse(data)).not.toThrow()
    })

    it('should reject invalid MongoDB ID', () => {
      const data = {
        _id: 'invalid-id',
        name: 'Updated Name',
        email: 'new@example.com',
        role: 'Admin',
      }
      expect(() => UserUpdateSchema.parse(data)).toThrow()
    })
  })

  describe('UserNameSchema', () => {
    it('should validate valid username', () => {
      const data = { name: 'John Doe' }
      expect(() => UserNameSchema.parse(data)).not.toThrow()
    })

    it('should reject short username', () => {
      const data = { name: 'J' }
      expect(() => UserNameSchema.parse(data)).toThrow()
    })
  })
})

describe('lib/validator - Product Schemas', () => {
  const validProduct = {
    name: 'Test Product',
    slug: 'test-product',
    category: 'Electronics',
    images: ['https://example.com/image1.jpg'],
    brand: 'Test Brand',
    description: 'A great product',
    isPublished: true,
    price: 99.99,
    listPrice: 149.99,
    countInStock: 10,
    avgRating: 4.5,
    numReviews: 10,
    ratingDistribution: [],
    numSales: 50,
  }

  describe('ProductInputSchema', () => {
    it('should validate complete product', () => {
      expect(() => ProductInputSchema.parse(validProduct)).not.toThrow()
    })

    it('should require at least one image', () => {
      expect(() =>
        ProductInputSchema.parse({ ...validProduct, images: [] })
      ).toThrow()
    })

    it('should reject short name', () => {
      expect(() =>
        ProductInputSchema.parse({ ...validProduct, name: 'AB' })
      ).toThrow()
    })

    it('should reject price with wrong decimal format', () => {
      expect(() =>
        ProductInputSchema.parse({ ...validProduct, price: 99.999 })
      ).toThrow()
    })

    it('should have default empty arrays', () => {
      const product = ProductInputSchema.parse(validProduct)
      expect(Array.isArray(product.tags)).toBe(true)
      expect(Array.isArray(product.sizes)).toBe(true)
      expect(Array.isArray(product.colors)).toBe(true)
    })

    it('should reject negative countInStock', () => {
      expect(() =>
        ProductInputSchema.parse({ ...validProduct, countInStock: -1 })
      ).toThrow()
    })

    it('should reject invalid rating', () => {
      expect(() =>
        ProductInputSchema.parse({ ...validProduct, avgRating: 6 })
      ).toThrow()
    })
  })

  describe('ProductUpdateSchema', () => {
    it('should validate product with ID', () => {
      const data = {
        ...validProduct,
        _id: '507f1f77bcf86cd799439011',
      }
      expect(() => ProductUpdateSchema.parse(data)).not.toThrow()
    })
  })
})

describe('lib/validator - Order Schemas', () => {
  const validAddress = {
    fullName: 'John Doe',
    street: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    province: 'NY',
    phone: '1234567890',
    country: 'USA',
  }

  const validOrderItem = {
    clientId: '123456',
    product: '507f1f77bcf86cd799439011',
    name: 'Test Product',
    slug: 'test-product',
    category: 'Electronics',
    quantity: 2,
    countInStock: 10,
    image: 'https://example.com/image.jpg',
    price: 99.99,
  }

  describe('ShippingAddressSchema', () => {
    it('should validate complete address', () => {
      expect(() => ShippingAddressSchema.parse(validAddress)).not.toThrow()
    })

    it('should reject missing required fields', () => {
      const { fullName, ...incomplete } = validAddress
      expect(() => ShippingAddressSchema.parse(incomplete)).toThrow()
    })

    it('should reject empty fullName', () => {
      expect(() =>
        ShippingAddressSchema.parse({ ...validAddress, fullName: '' })
      ).toThrow()
    })

    it('should reject empty street', () => {
      expect(() =>
        ShippingAddressSchema.parse({ ...validAddress, street: '' })
      ).toThrow()
    })
  })

  describe('OrderItemSchema', () => {
    it('should validate correct order item', () => {
      expect(() => OrderItemSchema.parse(validOrderItem)).not.toThrow()
    })

    it('should accept optional size and color', () => {
      const itemWithOptions = {
        ...validOrderItem,
        size: 'L',
        color: 'Red',
      }
      expect(() => OrderItemSchema.parse(itemWithOptions)).not.toThrow()
    })

    it('should reject negative quantity', () => {
      expect(() =>
        OrderItemSchema.parse({ ...validOrderItem, quantity: -1 })
      ).toThrow()
    })

    it('should reject negative countInStock', () => {
      expect(() =>
        OrderItemSchema.parse({ ...validOrderItem, countInStock: -1 })
      ).toThrow()
    })

    it('should allow zero quantity', () => {
      expect(() =>
        OrderItemSchema.parse({ ...validOrderItem, quantity: 0 })
      ).not.toThrow()
    })
  })

  describe('ReviewInputSchema', () => {
    it('should validate complete review', () => {
      const review = {
        product: '507f1f77bcf86cd799439011',
        user: '507f1f77bcf86cd799439012',
        isVerifiedPurchase: true,
        title: 'Great Product',
        comment: 'This product is excellent',
        rating: 5,
      }
      expect(() => ReviewInputSchema.parse(review)).not.toThrow()
    })

    it('should reject rating outside range', () => {
      const review = {
        product: '507f1f77bcf86cd799439011',
        user: '507f1f77bcf86cd799439012',
        isVerifiedPurchase: true,
        title: 'Great Product',
        comment: 'This product is excellent',
        rating: 6,
      }
      expect(() => ReviewInputSchema.parse(review)).toThrow()
    })

    it('should reject zero rating', () => {
      const review = {
        product: '507f1f77bcf86cd799439011',
        user: '507f1f77bcf86cd799439012',
        isVerifiedPurchase: true,
        title: 'Great Product',
        comment: 'This product is excellent',
        rating: 0,
      }
      expect(() => ReviewInputSchema.parse(review)).toThrow()
    })
  })

  describe('CartSchema', () => {
    it('should validate cart with items', () => {
      const cart = {
        items: [validOrderItem],
        itemsPrice: 99.99,
        totalPrice: 99.99,
      }
      expect(() => CartSchema.parse(cart)).not.toThrow()
    })

    it('should reject empty items array', () => {
      const cart = {
        items: [],
        itemsPrice: 0,
        totalPrice: 0,
      }
      expect(() => CartSchema.parse(cart)).toThrow()
    })

    it('should accept optional shipping info', () => {
      const cart = {
        items: [validOrderItem],
        itemsPrice: 99.99,
        taxPrice: 10,
        shippingPrice: 5,
        totalPrice: 114.99,
        shippingAddress: validAddress,
      }
      expect(() => CartSchema.parse(cart)).not.toThrow()
    })
  })
})

describe('lib/validator - Content Schemas', () => {
  describe('WebPageInputSchema', () => {
    it('should validate complete webpage', () => {
      const data = {
        title: 'About Us',
        slug: 'about-us',
        content: 'This is our about page content',
        isPublished: true,
      }
      expect(() => WebPageInputSchema.parse(data)).not.toThrow()
    })

    it('should reject short title', () => {
      const data = {
        title: 'AB',
        slug: 'about',
        content: 'Content',
        isPublished: true,
      }
      expect(() => WebPageInputSchema.parse(data)).toThrow()
    })

    it('should reject empty content', () => {
      const data = {
        title: 'About Us',
        slug: 'about-us',
        content: '',
        isPublished: true,
      }
      expect(() => WebPageInputSchema.parse(data)).toThrow()
    })
  })

  describe('WebPageUpdateSchema', () => {
    it('should validate webpage with ID', () => {
      const data = {
        _id: '507f1f77bcf86cd799439011',
        title: 'About Us',
        slug: 'about-us',
        content: 'Content',
        isPublished: true,
      }
      expect(() => WebPageUpdateSchema.parse(data)).not.toThrow()
    })
  })
})

describe('lib/validator - Settings Schemas', () => {
  describe('SiteLanguageSchema', () => {
    it('should validate language', () => {
      const data = { name: 'English', code: 'en' }
      expect(() => SiteLanguageSchema.parse(data)).not.toThrow()
    })

    it('should reject empty code', () => {
      const data = { name: 'English', code: '' }
      expect(() => SiteLanguageSchema.parse(data)).toThrow()
    })
  })

  describe('CarouselSchema', () => {
    it('should validate carousel', () => {
      const data = {
        title: 'Summer Sale',
        url: '/summer',
        image: 'https://example.com/image.jpg',
        buttonCaption: 'Shop Now',
      }
      expect(() => CarouselSchema.parse(data)).not.toThrow()
    })

    it('should reject missing required fields', () => {
      const data = {
        title: 'Summer Sale',
        url: '/summer',
      }
      expect(() => CarouselSchema.parse(data)).toThrow()
    })
  })

  describe('SiteCurrencySchema', () => {
    it('should validate currency', () => {
      const data = {
        name: 'US Dollar',
        code: 'USD',
        convertRate: 1,
        symbol: '$',
      }
      expect(() => SiteCurrencySchema.parse(data)).not.toThrow()
    })

    it('should reject negative convert rate', () => {
      const data = {
        name: 'US Dollar',
        code: 'USD',
        convertRate: -1,
        symbol: '$',
      }
      expect(() => SiteCurrencySchema.parse(data)).toThrow()
    })
  })

  describe('PaymentMethodSchema', () => {
    it('should validate payment method', () => {
      const data = { name: 'Credit Card', commission: 2.5 }
      expect(() => PaymentMethodSchema.parse(data)).not.toThrow()
    })

    it('should allow zero commission', () => {
      const data = { name: 'Bank Transfer', commission: 0 }
      expect(() => PaymentMethodSchema.parse(data)).not.toThrow()
    })
  })

  describe('DeliveryDateSchema', () => {
    it('should validate delivery date', () => {
      const data = {
        name: 'Standard',
        daysToDeliver: 5,
        shippingPrice: 10,
        freeShippingMinPrice: 100,
      }
      expect(() => DeliveryDateSchema.parse(data)).not.toThrow()
    })

    it('should reject negative days to deliver', () => {
      const data = {
        name: 'Standard',
        daysToDeliver: -1,
        shippingPrice: 10,
        freeShippingMinPrice: 100,
      }
      expect(() => DeliveryDateSchema.parse(data)).toThrow()
    })
  })
})
