import { z } from "zod";

export const diagnosisSchema = z.object({
  crop_name: z.string().min(2),
  disease_name: z.string().min(2),
  confidence: z.number().min(0).max(1),
  explanation: z.string().min(10),
  recommended_fertilizer: z.object({
    type: z.enum(["NPK", "organic", "micronutrient", "mixed"]),
    product_example: z.string(),
    dosage_per_area: z.string(),
    application_method: z.string(),
    frequency: z.string(),
  }),
  additional_care: z.array(z.string()).default([]),
  urgency: z.enum(["low", "medium", "high"]),
  alternatives_organic: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  references: z.array(z.string()).optional(),
});

export type Diagnosis = z.infer<typeof diagnosisSchema>;

