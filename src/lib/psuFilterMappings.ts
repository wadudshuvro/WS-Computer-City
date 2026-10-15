import { PSU_SPEC_FILTER_KEYS } from '@/lib/psuSpecDefinitions';

export { PSU_SPEC_FILTER_KEYS };

function norm(value: string): string {
  return value.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
}

export function mapWattageFilterToPatterns(value: string): string[] {
  return [value];
}

export function wattageDbValueMatches(filterValue: string, dbValue: string): boolean {
  return norm(dbValue).includes(norm(filterValue));
}

export function efficiencyDbValueMatches(filterValue: string, dbValue: string): boolean {
  return norm(dbValue) === norm(filterValue);
}

export function modularDbValueMatches(filterValue: string, dbValue: string): boolean {
  return norm(dbValue) === norm(filterValue);
}
