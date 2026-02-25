import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

export function resolveBackendPath(...parts: string[]): string {
  return path.resolve(process.cwd(), ...parts);
}

export function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export function readCsvAsRecords(filePath: string): Record<string, string>[] {
  if (!existsSync(filePath)) {
    throw new Error(`Arquivo CSV nao encontrado: ${filePath}`);
  }

  const content = readFileSync(filePath, 'utf8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as Record<string, string>[];
}

export function writeJson(filePath: string, payload: unknown): void {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, JSON.stringify(payload), 'utf8');
}
