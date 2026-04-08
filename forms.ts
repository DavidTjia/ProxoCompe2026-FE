import { z } from "zod";

export const reportSchema = z
  .object({
    photo: z.string().min(1, "Photo is required"),
    description: z.string().min(5, "Description too short"),
    latitude: z.number(),
    longitude: z.number(),
    district: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
  })
  .refine((data) => !(data.latitude === 0 && data.longitude === 0), {
    message: "Location is required",
    path: ["latitude"],
  });

export type ReportForm = z.infer<typeof reportSchema>;
