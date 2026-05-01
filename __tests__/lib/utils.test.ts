jest.mock('query-string', () => ({
  parse: jest.fn((str) => ({})),
  stringifyUrl: jest.fn(({ url, query }) => url),
}))

import {
  cn,
  formatNumberWithDecimal,
  toSlug,
  formatCurrency,
  formatNumber,
  round2,
  generateId,
  formatError,
  formatId,
  calculateFutureDate,
  calculatePastDate,
  getMonthName,
  formatDateTime,
  timeUntilMidnight,
  getFilterUrl,
} from '@/lib/utils'

describe('lib/utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('px-2', 'py-2')).toBe('px-2 py-2')
    })

    it('should handle tailwind conflicts correctly', () => {
      expect(cn('px-2 px-4')).toBe('px-4')
    })

    it('should handle conditional classes', () => {
      const condition = true
      expect(cn(condition && 'block', 'text-red-500')).toBe('block text-red-500')
    })

    it('should handle undefined values', () => {
      expect(cn('px-2', undefined, 'py-2')).toBe('px-2 py-2')
    })

    it('should handle false conditions', () => {
      expect(cn(false && 'hidden', 'block')).toBe('block')
    })
  })

  describe('formatNumberWithDecimal', () => {
    it('should format number with 2 decimal places', () => {
      expect(formatNumberWithDecimal(49.9)).toBe('49.90')
    })

    it('should handle integer numbers', () => {
      expect(formatNumberWithDecimal(50)).toBe('50')
    })

    it('should handle already correct decimals', () => {
      expect(formatNumberWithDecimal(49.99)).toBe('49.99')
    })

    it('should handle zero', () => {
      expect(formatNumberWithDecimal(0)).toBe('0')
    })

    it('should handle large numbers with decimals', () => {
      expect(formatNumberWithDecimal(9999.1)).toBe('9999.10')
    })
  })

  describe('toSlug', () => {
    it('should convert text to lowercase slug', () => {
      expect(toSlug('Hello World')).toBe('hello-world')
    })

    it('should remove special characters', () => {
      expect(toSlug('Hello! World?')).toBe('hello-world')
    })

    it('should replace spaces with hyphens', () => {
      expect(toSlug('The Quick Brown Fox')).toBe('the-quick-brown-fox')
    })

    it('should remove leading and trailing hyphens', () => {
      expect(toSlug('-hello-world-')).toBe('hello-world')
    })

    it('should collapse multiple hyphens', () => {
      expect(toSlug('hello--world')).toBe('hello-world')
    })

    it('should handle strings with numbers', () => {
      expect(toSlug('Product 123')).toBe('product-123')
    })

    it('should handle empty string', () => {
      expect(toSlug('')).toBe('')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency with USD symbol', () => {
      expect(formatCurrency(100)).toBe('$100.00')
    })

    it('should handle decimal values', () => {
      expect(formatCurrency(49.99)).toBe('$49.99')
    })

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-50)).toBe('-$50.00')
    })
  })

  describe('formatNumber', () => {
    it('should format number with commas', () => {
      expect(formatNumber(1000000)).toBe('1,000,000')
    })

    it('should handle small numbers', () => {
      expect(formatNumber(100)).toBe('100')
    })

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0')
    })

    it('should handle negative numbers', () => {
      expect(formatNumber(-5000)).toBe('-5,000')
    })
  })

  describe('round2', () => {
    it('should round to 2 decimal places', () => {
      expect(round2(0.1 + 0.2)).toBe(0.3)
    })

    it('should handle exact values', () => {
      expect(round2(1.23)).toBe(1.23)
    })

    it('should round up correctly', () => {
      expect(round2(1.235)).toBe(1.24)
    })

    it('should round down correctly', () => {
      expect(round2(1.234)).toBe(1.23)
    })

    it('should handle zero', () => {
      expect(round2(0)).toBe(0)
    })

    it('should handle negative numbers', () => {
      expect(round2(-1.235)).toBe(-1.23)
    })
  })

  describe('generateId', () => {
    it('should generate 24 character ID', () => {
      const id = generateId()
      expect(id.length).toBe(24)
    })

    it('should generate numeric string', () => {
      const id = generateId()
      expect(/^\d+$/.test(id)).toBe(true)
    })

    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should generate multiple unique IDs', () => {
      const ids = Array.from({ length: 10 }, () => generateId())
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(10)
    })
  })

  describe('formatError', () => {
    it('should handle ZodError', () => {
      const error = {
        name: 'ZodError',
        errors: {
          email: { path: 'email', message: 'Invalid email' },
        },
      }
      expect(formatError(error)).toContain('email')
    })

    it('should handle generic Error', () => {
      const error = new Error('Something went wrong')
      expect(formatError(error)).toBe('Something went wrong')
    })

    it('should handle duplicate key error', () => {
      const error = {
        code: 11000,
        keyValue: { email: 'test@example.com' },
      }
      expect(formatError(error)).toBe('email already exists')
    })

    it('should handle ValidationError', () => {
      const error = {
        name: 'ValidationError',
        errors: {
          field1: { message: 'Field is required' },
        },
      }
      expect(formatError(error)).toContain('Field is required')
    })

    it('should handle non-string message error', () => {
      const error = {
        message: { error: 'test' },
      }
      const result = formatError(error)
      expect(typeof result).toBe('string')
    })
  })

  describe('formatId', () => {
    it('should return last 6 characters of ID', () => {
      const id = '123456789012345678901234'
      expect(formatId(id)).toBe('..901234')
    })

    it('should handle short IDs', () => {
      const id = '12345'
      expect(formatId(id)).toBe('..' + id)
    })

    it('should handle 6 character ID', () => {
      const id = '123456'
      expect(formatId(id)).toBe('..123456')
    })
  })

  describe('calculateFutureDate', () => {
    it('should calculate date 7 days in future', () => {
      const futureDate = calculateFutureDate(7)
      const today = new Date()
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() + 7)

      expect(futureDate.getDate()).toBe(expectedDate.getDate())
      expect(futureDate.getMonth()).toBe(expectedDate.getMonth())
    })

    it('should handle 0 days', () => {
      const today = new Date()
      const result = calculateFutureDate(0)
      expect(result.getDate()).toBe(today.getDate())
    })

    it('should handle negative days', () => {
      const pastDate = calculateFutureDate(-5)
      const today = new Date()
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - 5)

      expect(pastDate.getDate()).toBe(expectedDate.getDate())
    })
  })

  describe('calculatePastDate', () => {
    it('should calculate date 7 days in past', () => {
      const pastDate = calculatePastDate(7)
      const today = new Date()
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - 7)

      expect(pastDate.getDate()).toBe(expectedDate.getDate())
    })

    it('should handle 0 days', () => {
      const today = new Date()
      const result = calculatePastDate(0)
      expect(result.getDate()).toBe(today.getDate())
    })
  })

  describe('getMonthName', () => {
    it('should return month name for past date', () => {
      const monthName = getMonthName('2023-01')
      expect(monthName).toBe('January')
    })

    it('should return month name with Ongoing for current month', () => {
      const now = new Date()
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      const monthName = getMonthName(currentMonth)
      expect(monthName).toContain('Ongoing')
    })

    it('should handle all months', () => {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
      months.forEach((month, index) => {
        const result = getMonthName(`2023-${String(index + 1).padStart(2, '0')}`)
        expect(result).toBe(month)
      })
    })
  })

  describe('formatDateTime', () => {
    it('should format date with time, date only, and time only', () => {
      const date = new Date('2024-01-15T10:30:00')
      const result = formatDateTime(date)

      expect(result).toHaveProperty('dateTime')
      expect(result).toHaveProperty('dateOnly')
      expect(result).toHaveProperty('timeOnly')
      expect(typeof result.dateTime).toBe('string')
      expect(typeof result.dateOnly).toBe('string')
      expect(typeof result.timeOnly).toBe('string')
    })

    it('should include month and day in dateOnly format', () => {
      const date = new Date('2024-01-15T10:30:00')
      const result = formatDateTime(date)
      expect(result.dateOnly).toContain('Jan')
      expect(result.dateOnly).toContain('15')
    })

    it('should include time in timeOnly format', () => {
      const date = new Date('2024-01-15T10:30:00')
      const result = formatDateTime(date)
      expect(result.timeOnly).toMatch(/\d{1,2}:\d{2}/)
    })
  })

  describe('timeUntilMidnight', () => {
    it('should return object with hours and minutes', () => {
      const result = timeUntilMidnight()
      expect(result).toHaveProperty('hours')
      expect(result).toHaveProperty('minutes')
      expect(typeof result.hours).toBe('number')
      expect(typeof result.minutes).toBe('number')
    })

    it('should return non-negative values', () => {
      const result = timeUntilMidnight()
      expect(result.hours).toBeGreaterThanOrEqual(0)
      expect(result.minutes).toBeGreaterThanOrEqual(0)
      expect(result.minutes).toBeLessThan(60)
    })

    it('should return hours less than 24', () => {
      const result = timeUntilMidnight()
      expect(result.hours).toBeLessThanOrEqual(24)
    })
  })

  describe('getFilterUrl', () => {
    it('should construct search URL with params', () => {
      const url = getFilterUrl({
        params: { q: 'laptop' },
        category: 'Electronics',
      })
      expect(url).toContain('/search?')
      expect(url).toContain('category=Electronics')
    })

    it('should preserve existing params', () => {
      const url = getFilterUrl({
        params: { q: 'laptop', page: '1' },
        price: '100-500',
      })
      expect(url).toContain('price=100-500')
      expect(url).toContain('/search?')
    })

    it('should handle empty params', () => {
      const url = getFilterUrl({ params: {} })
      expect(url).toContain('/search?')
    })

    it('should convert tag to slug', () => {
      const url = getFilterUrl({
        params: {},
        tag: 'Best Seller',
      })
      expect(url).toContain('tag=best-seller')
    })

    it('should handle all filter options', () => {
      const url = getFilterUrl({
        params: {},
        category: 'Electronics',
        tag: 'New',
        sort: 'newest',
        price: '0-1000',
        rating: '4',
        page: '2',
      })
      expect(url).toContain('category=Electronics')
      expect(url).toContain('sort=newest')
      expect(url).toContain('price=0-1000')
      expect(url).toContain('rating=4')
      expect(url).toContain('page=2')
    })
  })
})
