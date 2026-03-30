import { z } from 'zod'

const rafflePrizeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Prize name is required'),
  type: z.enum(['coins', 'freeSpin', 'bonus']),
  amount: z.number().positive('Amount must be positive'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  imageUrl: z.string(),
})

export const raffleFormSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(80, 'Name must be at most 80 characters'),
    description: z.string().min(1, 'Description is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    drawDate: z.string().min(1, 'Draw date is required'),
    status: z.enum(['draft', 'active', 'drawn', 'cancelled']),
    ticketPrice: z.number().min(0, 'Ticket price must be 0 or more'),
    maxTicketsPerUser: z.number().int().min(1, 'Must allow at least 1 ticket per user'),
    prizes: z.array(rafflePrizeSchema).min(1, 'At least one prize is required'),
    totalTicketLimit: z.number().int().positive('Must be a positive number').nullable(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine((data) => new Date(data.drawDate) > new Date(data.endDate), {
    message: 'Draw date must be after end date',
    path: ['drawDate'],
  })

export type RaffleFormValues = z.infer<typeof raffleFormSchema>
