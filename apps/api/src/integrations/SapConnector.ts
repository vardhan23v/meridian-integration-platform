import { RawSAPRecord } from '@meridian/shared';
import { logger } from '../utils/logger';

/**
 * Mock SAP Connector simulating node-rfc / SAP ODP integration.
 * Generates realistic payload matching SAP ACDOCA / BKPF structure.
 */
export class SapConnector {
  /**
   * Simulates an SAP RFC call to fetch Delta changes.
   */
  async extractDelta(companyCode: string, fiscalYear: string): Promise<RawSAPRecord[]> {
    logger.info(`[SAP] Initiating RFC call: /SAP/ODP_EXTRACT for ${companyCode}-${fiscalYear}`);
    
    // Simulate SAP RFC network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate 1-3 delta records
    const numRecords = Math.floor(Math.random() * 3) + 1;
    const records: RawSAPRecord[] = [];

    for (let i = 0; i < numRecords; i++) {
      const isDebit = Math.random() > 0.5;
      const amount = (Math.random() * 500000).toFixed(2);
      const docNo = `190000${Math.floor(Math.random() * 9000) + 1000}`;

      records.push({
        BUKRS: companyCode,
        BELNR: docNo,
        GJAHR: fiscalYear,
        BUDAT: new Date().toISOString().slice(0, 10).replace(/-/g, ''), // YYYYMMDD
        WAERS: 'INR',
        DMBTR: amount,
        SHKZG: isDebit ? 'S' : 'H', // S = Debit, H = Credit
        MWSKZ: 'O1', // Standard output tax
        WERKS: `100${Math.floor(Math.random() * 6)}`, // Random plant 1000-1006
        KOSTL: 'C1000',
        HKONT: '400000',
      });
    }

    logger.info(`[SAP] Extracted ${records.length} records successfully.`);
    return records;
  }
}
