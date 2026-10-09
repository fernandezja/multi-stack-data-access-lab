import { z } from 'zod';

export const createJediSchema = z.object({
  name: z.string().trim().min(1).max(200),
  jediTypeId: z.number().int().refine(value => [1, 2, 3].includes(value))
});

export const searchJediSchema = z.object({
  searchTerm: z.string().trim().max(100).nullable().optional(),
  pageIndex: z.number().int().min(0).max(1_000_000).default(0),
  pageSize: z.number().int().min(1).max(100).default(10)
});
