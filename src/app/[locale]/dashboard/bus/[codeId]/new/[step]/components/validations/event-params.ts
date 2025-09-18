import { z } from "zod";

// Schema for validating event creation URL parameters
export const eventParamsSchema = z.object({
  type: z
    .string()
    .nullable()
    .refine((val) => val !== null && val.length > 0, "Event type is required")
    .refine((val) => val === null || val.length <= 30, "Event type must be 30 characters or less"),
  subType: z
    .string()
    .nullable()
    .refine((val) => val !== null && val.length > 0, "Event subtype is required")
    .refine((val) => val === null || val.length <= 30, "Event subtype must be 30 characters or less"),
  customSubType: z.string().nullable().optional(),
  isForMinors: z
    .string()
    .nullable()
    .refine((val) => val === "yes" || val === "no", "isForMinors must be 'yes' or 'no'"),
  isPublic: z
    .string()
    .nullable()
    .refine((val) => val === "true" || val === "false", "isPublic must be 'true' or 'false'"),
  spaceType: z
    .string()
    .nullable()
    .refine((val) => val !== null && val.length > 0, "Space type is required")
    .refine((val) => val === null || val.length <= 30, "Space type must be 30 characters or less"),
  accessType: z
    .string()
    .nullable()
    .refine((val) => val !== null && val.length > 0, "Access type is required")
    .refine((val) => val === null || val.length <= 30, "Access type must be 30 characters or less"),
  languages: z
    .string()
    .nullable()
    .refine((val) => val !== null && val.length > 0, "Languages parameter is required")
    .refine((val) => {
      if (!val) return false;
      const languageCodes = val.split(/%2C|,/);
      return languageCodes.length > 0;
    }, "At least one language must be selected"),
});

// Schema for validating language codes against available languages
export const createLanguageValidationSchema = (availableLanguages: { code: string }[]) => {
  const validLanguageCodes = availableLanguages.map((lang) => lang.code);

  return z.object({
    languages: z
      .string()
      .nullable()
      .refine(
        (value: string | null) => {
          if (!value) return false;
          const languageCodes = value.split(/%2C|,/);
          const invalidLanguages = languageCodes.filter((code: string) => !validLanguageCodes.includes(code));
          return invalidLanguages.length === 0;
        },
        {
          message: "Invalid language codes provided",
        }
      ),
  });
};

// Combined validation schema
export const createEventParamsValidationSchema = (availableLanguages: { code: string }[]) => {
  return eventParamsSchema.merge(createLanguageValidationSchema(availableLanguages));
};

// Type for validated parameters
export type ValidatedEventParams = z.infer<typeof eventParamsSchema>;

// Validation result type
export interface ValidationResult {
  success: boolean;
  data?: ValidatedEventParams;
  errors?: {
    missingParams: string[];
    validationErrors: string[];
  };
}

// Main validation function
export function validateEventParams(
  params: Record<string, string | null>,
  availableLanguages: { code: string }[]
): ValidationResult {
  try {
    // Validate with Zod schema (this will handle both missing and invalid values)
    const schema = createEventParamsValidationSchema(availableLanguages);
    const validatedData = schema.parse(params);

    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Separate missing params from validation errors
      const missingParams: string[] = [];
      const validationErrors: string[] = [];

      error.issues.forEach((issue: z.ZodIssue) => {
        if (issue.code === "invalid_type" && (issue as any).received === "null") {
          missingParams.push(issue.path.join("."));
        } else {
          validationErrors.push(issue.message);
        }
      });

      return {
        success: false,
        errors: {
          missingParams,
          validationErrors,
        },
      };
    }

    return {
      success: false,
      errors: {
        missingParams: [],
        validationErrors: ["An unexpected validation error occurred"],
      },
    };
  }
}
