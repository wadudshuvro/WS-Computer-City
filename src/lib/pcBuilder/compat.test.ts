import { describe, expect, it } from 'vitest';
import {
  compatibilityFor,
  compatibilityWarnings,
  estimateWatts,
  normalizeSocket,
  parseMemoryTypes,
  socketVariants,
  suggestedPsu,
  type BuilderProduct,
} from '@/lib/pcBuilder/compat';

const part = (over: Partial<BuilderProduct>): BuilderProduct => ({
  id: 'x',
  slug: 'x',
  name: 'Part',
  price: 1000,
  compareAtPrice: null,
  imageUrl: null,
  href: '/x',
  brand: null,
  bullets: [],
  watts: null,
  socket: null,
  memoryTypes: [],
  makers: [],
  slot: 'cpu',
  ...over,
});

describe('sockets and memory', () => {
  it('normalises sockets from CMS text', () => {
    expect(normalizeSocket('LGA 1700')).toBe('LGA1700');
    expect(normalizeSocket('Intel Core 14th/13th/12th Gen (LGA1700)')).toBe('LGA1700');
    expect(normalizeSocket('MSI PRO A620M-E AMD AM5 mATX Motherboard')).toBe('AM5');
    expect(normalizeSocket('Heart rate monitor')).toBeNull();
    expect(normalizeSocket(null)).toBeNull();
  });

  it('searches both spellings of an LGA socket', () => {
    expect(socketVariants('LGA1700')).toEqual(['LGA1700', 'LGA 1700']);
    expect(socketVariants('AM4')).toEqual(['AM4']);
  });

  it('reads DDR generations', () => {
    expect(parseMemoryTypes('DDR4 + DDR5')).toEqual(['DDR4', 'DDR5']);
    expect(parseMemoryTypes('Dual-channel memory architecture')).toEqual([]);
  });
});

describe('power', () => {
  it('uses TDP for CPUs and typical values for other parts', () => {
    expect(estimateWatts({ slot: 'cpu', tdp: '65W' })).toBe(65);
    expect(estimateWatts({ slot: 'cpu' })).toBeNull();
    expect(estimateWatts({ slot: 'ram' })).toBe(5);
    expect(estimateWatts({ slot: 'storage', storageIsHdd: true })).toBe(9);
    expect(estimateWatts({ slot: 'monitor' })).toBeNull();
  });

  it('estimates graphics card draw from the recommended PSU', () => {
    expect(estimateWatts({ slot: 'gpu', recommendedPsu: '750W' })).toBe(340);
    expect(estimateWatts({ slot: 'gpu' })).toBeNull();
  });

  it('suggests a PSU with headroom, rounded to 50 W', () => {
    expect(suggestedPsu(0)).toBe(0);
    expect(suggestedPsu(300)).toBe(450);
    expect(suggestedPsu(91)).toBe(150);
  });
});

describe('compatibility', () => {
  const amdCpu = part({ slot: 'cpu', socket: 'AM4', makers: ['amd'] });
  const am5Board = part({ slot: 'motherboard', socket: 'AM5', memoryTypes: ['DDR5'] });
  const am4Board = part({ slot: 'motherboard', socket: 'AM4', memoryTypes: ['DDR4'] });

  it('limits motherboards to the CPU socket and CPUs to the board socket', () => {
    expect(compatibilityFor('motherboard', { cpu: [amdCpu] }).socket).toBe('AM4');
    expect(compatibilityFor('cpu', { motherboard: [am5Board] }).socket).toBe('AM5');
  });

  it('limits RAM to the motherboard memory type and coolers to the CPU brand', () => {
    expect(compatibilityFor('ram', { motherboard: [am4Board] }).memoryTypes).toEqual(['DDR4']);
    expect(compatibilityFor('cpu-cooler', { cpu: [amdCpu] }).maker).toBe('amd');
  });

  it('adds no requirement before anything is chosen', () => {
    const none = compatibilityFor('motherboard', {});
    expect(none.socket).toBeNull();
    expect(none.memoryTypes).toEqual([]);
  });

  it('warns about mismatched parts and stays quiet for matching ones', () => {
    expect(compatibilityWarnings({ cpu: [amdCpu], motherboard: [am4Board] })).toEqual([]);
    expect(compatibilityWarnings({ cpu: [amdCpu], motherboard: [am5Board] })).toHaveLength(1);
    const ddr4Ram = part({ slot: 'ram', memoryTypes: ['DDR4'], name: 'RAM 8GB' });
    expect(compatibilityWarnings({ motherboard: [am5Board], ram: [ddr4Ram] })).toHaveLength(1);
  });
});
