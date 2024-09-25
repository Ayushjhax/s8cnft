import { readFileSync, writeFileSync } from 'fs'; 
import { parse } from 'csv-parse';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

type CsvRow = { [key: string]: string };

export async function readCsv(filePath: string): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CsvRow[] = [];
    readFileSync(filePath, 'utf8') 
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row: CsvRow) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

export function getRpcUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? process.env.SOLANA_MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com'
    : process.env.SOLANA_DEVNET_RPC_URL || 'https://api.devnet.solana.com';
}

export function getPayerKeypair(): any {
  const keyData = readFileSync('key.json', 'utf8');
  const secretKey = new Uint8Array(JSON.parse(keyData));
  return {
    publicKey: secretKey.slice(32),
    secretKey: secretKey,
  };
}

export async function readFileContents(filePath: string): Promise<string> {
  try {
    return await readFileSync(filePath, 'utf8'); 
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

export async function saveToFile(filePath: string, content: string): Promise<void> {
  try {
    writeFileSync(filePath, content);
    console.log(`Successfully saved to ${filePath}`);
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    throw error;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getExplorerUrl(signature: string): string {
  const cluster = process.env.NODE_ENV !== 'production' ? '?cluster=devnet' : '';
  return `https://explorer.solana.com/tx/${signature}${cluster}`;
}

export function addrToLink(address: string, cluster: string = ''): string {
  return `https://explorer.solana.com/address/${address}${cluster}`;
}
