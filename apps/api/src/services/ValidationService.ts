import { z } from 'zod';
import { RawSAPRecord } from '@meridian/shared';
import { ValidationException } from '../exceptions';

export const RawSAPRecordSchema = z.object({
  BUKRS: z.string().length(4),
  BELNR: z.string().min(1).max(10),
  GJAHR: z.string().length(4),
  BUDAT: z.string().length(8),
  WAERS: z.string().length(3),
  DMBTR: z.string(),
  SHKZG: z.enum(['S', 'H']),
  HKONT: z.string().optional(),
  KOSTL: z.string().optional(),
  WERKS: z.string().optional(),
  MWSKZ: z.string().optional(),
});

export class ValidationService {
  /**
   * Validates raw records against schema and core business rules.
   * Throws ValidationException if validation fails.
   */
  public validateRawRecord(record: any): RawSAPRecord {
    const parsed = RawSAPRecordSchema.safeParse(record);

    if (!parsed.success) {
      throw new ValidationException('Raw record schema validation failed', parsed.error.format());
    }

    // Additional Cross-Field validations
    if (parsed.data.SHKZG === 'S' && parseFloat(parsed.data.DMBTR) < 0) {
      throw new ValidationException('Debit amount (S) cannot be negative');
    }

    return parsed.data as RawSAPRecord;
  }
}
