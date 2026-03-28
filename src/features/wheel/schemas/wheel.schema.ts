import { z } from 'zod'

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

const wheelSegmentSchema = z
  .object({
    id: z.string(),
    label: z.string().min(1, 'Label is required'),
    color: z.string().regex(HEX_COLOR_REGEX, 'Must be a valid hex color (e.g. #FF0000)'),
    weight: z.number().min(0, 'Weight must be non-negative'),
    prizeType: z.enum(['coins', 'freeSpin', 'bonus', 'nothing']),
    prizeAmount: z.number().min(0, 'Amount must be non-negative'),
    imageUrl: z.string(),
  })
  .refine(
    (seg) => {
      if (seg.prizeType === 'nothing') return seg.prizeAmount === 0
      return seg.prizeAmount > 0
    },
    {
      message: 'Amount must be 0 for "nothing" and > 0 for other prize types',
      path: ['prizeAmount'],
    },
  )

export const wheelFormSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(80, 'Name must be at most 80 characters'),
    description: z.string().min(1, 'Description is required'),
    status: z.enum(['draft', 'active', 'inactive']),
    segments: z
      .array(wheelSegmentSchema)
      .min(2, 'Must have at least 2 segments')
      .max(12, 'Cannot have more than 12 segments'),
    maxSpinsPerUser: z.number().int().min(1, 'Must allow at least 1 spin'),
    spinCost: z.number().min(0, 'Spin cost must be 0 or more'),
    backgroundColor: z.string().regex(HEX_COLOR_REGEX, 'Must be a valid hex color'),
    borderColor: z.string().regex(HEX_COLOR_REGEX, 'Must be a valid hex color'),
  })
  .refine(
    (data) => {
      const totalWeight = data.segments.reduce((sum, s) => sum + s.weight, 0)
      return Math.abs(totalWeight - 100) < 0.01
    },
    {
      message: 'Segment weights must sum to exactly 100',
      path: ['segments'],
    },
  )

export type WheelFormValues = z.infer<typeof wheelFormSchema>
