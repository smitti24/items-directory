import { z } from "zod"

export const CATEGORIES = [
  "Restaurant Meals",
  "Groceries",
  "Liquor",
  "Pharmacy & Beauty",
  "Pet Supplies",
  "Flowers & Gifts"
] as const

export const categorySchema = z.enum(CATEGORIES)

export const catalogItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: categorySchema,
  merchant: z.string().min(1),
  basePrice: z.number().positive(),
  popularity: z.number().int().min(0).max(100),
  tags: z.array(z.string().min(1)).min(1)
})

export const availableQuoteSchema = z.object({
  status: z.literal("available"),
  price: z.number().positive(),
  etaMinutes: z.number().int().positive()
})

export const soldOutQuoteSchema = z.object({
  status: z.literal("sold_out")
})

export const quoteSchema = z.discriminatedUnion("status", [
  availableQuoteSchema,
  soldOutQuoteSchema
])

export const itemSchema = catalogItemSchema.extend({
  quote: quoteSchema.optional()
})

export type Category = z.infer<typeof categorySchema>
export type CatalogItem = z.infer<typeof catalogItemSchema>
export type Quote = z.infer<typeof quoteSchema>
export type Item = z.infer<typeof itemSchema>
