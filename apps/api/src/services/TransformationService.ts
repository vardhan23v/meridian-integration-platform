import { RawSAPRecord, CanonicalFinancialRecord, generateCorrelationId } from '@meridian/shared';
import { ZERO_DECIMAL_CURRENCIES, FINANCIAL_PRECISION } from '../constants';
import { BusinessRuleException } from '../exceptions';

export class TransformationService {
  /**
   * Transforms a raw SAP record into the Canonical Financial Record format.
   * Enforces business rules and formatting constraints.
   */
  public transform(raw: RawSAPRecord): CanonicalFinancialRecord {
    if (!raw.DMBTR || parseFloat(raw.DMBTR) === 0) {
      throw new BusinessRuleException('BR-FIN-03', 'Zero value document rejected');
    }

    const localAmount = this.formatCurrency(parseFloat(raw.DMBTR), raw.WAERS);
    const signMultiplier = raw.SHKZG === 'H' ? -1 : 1;
    const finalAmount = localAmount * signMultiplier;

    const { cgst, sgst, igst } = this.calculateTaxes(finalAmount, raw.MWSKZ);

    return {
      transactionId: `${raw.BUKRS}-${raw.BELNR}-${raw.GJAHR}`,
      companyCode: raw.BUKRS,
      fiscalYear: parseInt(raw.GJAHR, 10),
      postingDate: this.parseSAPDate(raw.BUDAT),
      localAmount: finalAmount,
      currency: raw.WAERS,
glAccount: raw.HKONT ?? '',
      costCenter: raw.KOSTL ?? '',
      plantId: raw.WERKS ?? '',
      taxCode: raw.MWSKZ,
      cgstAmount: cgst,
      sgstAmount: sgst,
      igstAmount: igst,
      dbCrIndicator: raw.SHKZG === 'S' ? 'DEBIT' : 'CREDIT',
      correlationId: generateCorrelationId(),
      mappingVersion: 'v1.0.0',
      transformedAt: new Date().toISOString(),
    };
  }

  private parseSAPDate(sapDate: string): string {
    if (!sapDate || sapDate.length !== 8) return new Date().toISOString();
    return `${sapDate.substring(0, 4)}-${sapDate.substring(4, 6)}-${sapDate.substring(6, 8)}T00:00:00Z`;
  }

  private formatCurrency(amount: number, currencyCode: string): number {
    if ((ZERO_DECIMAL_CURRENCIES as readonly string[]).includes(currencyCode)) {
      return Math.round(amount * 100); // Revert SAP internal decimal shift
    }
    return Number(amount.toFixed(FINANCIAL_PRECISION));
  }

  private calculateTaxes(amount: number, taxCode?: string) {
    if (!taxCode || taxCode === 'O0') return { cgst: 0, sgst: 0, igst: 0 };
    
    // Naive 18% GST split for demonstration
    if (taxCode === 'O1') {
      const taxBase = amount * 0.18;
      return { cgst: taxBase / 2, sgst: taxBase / 2, igst: 0 };
    }
    if (taxCode === 'O2') {
      return { cgst: 0, sgst: 0, igst: amount * 0.18 };
    }

    return { cgst: 0, sgst: 0, igst: 0 };
  }
}
