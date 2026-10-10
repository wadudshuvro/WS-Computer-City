import type { FilterDefinition } from '@/lib/filterConfig';

/** Star Tech Keyboard sidebar groups (keyboard category page). */
export const KEYBOARD_SPEC_FILTERS: FilterDefinition[] = [
  {
    key: 'kb_type',
    name: 'Type',
    type: 'checkbox',
    defaultExpanded: true,
    options: [
      { value: 'Standard', label: 'Standard' },
      { value: 'Combo', label: 'Combo' },
      { value: 'Gaming', label: 'Gaming' },
    ],
  },
  {
    key: 'kb_switch',
    name: 'Switch Type',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      'Aluminium',
      'Brown',
      'Black',
      'Orange',
      'Red',
      'Silver',
      'Yellow',
      'Standard',
      'Pink',
    ].map((label) => ({ value: label, label })),
  },
  {
    key: 'kb_interface',
    name: 'Interface',
    type: 'checkbox',
    defaultExpanded: false,
    options: ['Wired', 'Wireless', 'Bluetooth Wireless', 'USB', 'Type C'].map((label) => ({
      value: label,
      label,
    })),
  },
  {
    key: 'kb_feature',
    name: 'Special Feature',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      'Mechanical',
      'RGB',
      'Programmable',
      'Multicolor',
      'Membrane',
      'Bangla Keyboard',
      'None',
      'Backlit',
      'Waterproof',
    ].map((label) => ({ value: label, label })),
  },
];

export const KEYBOARD_TEXT_FILTER_KEYS = KEYBOARD_SPEC_FILTERS.map((filter) => filter.key);
