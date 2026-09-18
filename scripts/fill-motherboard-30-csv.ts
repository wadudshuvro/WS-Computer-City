/**
 * One-shot: fill motherboard-cms-import-30.csv with manufacturer specs + LogicBay prices,
 * write docs/imports/motherboard-cms-import.csv
 */
import fs from 'fs';
import path from 'path';

type Specs = {
  supported_cpu: string;
  chipset: string;
  memory_size: string;
  memory_type: string;
  storage_slots: string;
  graphics: string;
  audio: string;
  ports_connectors: string;
  special_features: string;
  form_factor: string;
  expansion_slots: string;
  warranty: string;
  price: number;
  compareAtPrice: number;
  costPrice: number;
  stockQuantity: number;
  shortDescription: string;
  description: string;
};

const bySlug: Record<string, Specs> = {
  'msi-pro-h610m-e-ddr4-matx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek ALC897 7.1 HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, 2x USB 3.2 Gen1, 4x USB 2.0, Realtek 1GbE LAN, audio jacks, PS/2\nInternal: USB headers, TPM header',
    special_features: 'PCIe Steel Armor, EZ Debug LED, Core Boost',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M (PCIe 3.0 x4)',
    warranty: '3 Years',
    price: 11500,
    compareAtPrice: 12900,
    costPrice: 9800,
    stockQuantity: 12,
    shortDescription: 'Entry mATX H610 board for LGA1700 with DDR4 dual-channel memory.',
    description:
      'MSI PRO H610M-E DDR4 is a Micro-ATX motherboard for Intel 12th–14th Gen LGA1700 CPUs. It uses the Intel H610 chipset, two DDR4 DIMMs up to 64GB, one M.2 slot, HDMI + VGA display outputs, and Realtek ALC897 audio. Suited for office and budget builds.',
  },
  'msi-pro-h610m-g-ddr4-micro-atx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DisplayPort, 1x VGA',
    audio: 'Realtek ALC897 7.1 HD Audio',
    ports_connectors:
      'Rear: HDMI, DP, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE LAN, audio\nInternal: USB / front panel / TPM headers',
    special_features: 'Multi-display outputs, Steel Armor PCIe slot',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 12200,
    compareAtPrice: 13500,
    costPrice: 10400,
    stockQuantity: 10,
    shortDescription: 'H610 mATX with HDMI, DisplayPort and VGA for flexible displays.',
    description:
      'MSI PRO H610M-G DDR4 supports Intel LGA1700 processors with H610 chipset and dual-channel DDR4 (up to 64GB). Extra rear video ports make it useful for multi-monitor office PCs. Includes M.2 storage and Realtek gigabit LAN.',
  },
  'msi-pro-h610m-g-ddr5-matx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '96GB',
    memory_type: 'DDR5',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DisplayPort, 1x VGA',
    audio: 'Realtek ALC897 7.1 HD Audio',
    ports_connectors:
      'Rear: HDMI, DP, VGA, USB 3.2 Gen1, USB 2.0, 1GbE LAN, audio jacks\nInternal: standard front-panel and USB headers',
    special_features: 'DDR5 dual-channel support, EZ Debug LED',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 13800,
    compareAtPrice: 15200,
    costPrice: 11800,
    stockQuantity: 8,
    shortDescription: 'LGA1700 H610 Micro-ATX board with dual-channel DDR5 memory.',
    description:
      'MSI PRO H610M-G DDR5 pairs Intel H610 with DDR5 DIMMs for newer memory kits on 12th–14th Gen CPUs. Micro-ATX layout, M.2 SSD slot, multi-display outputs, and Realtek audio/LAN for everyday builds.',
  },
  'msi-pro-a620m-e-amd-am5-matx-motherboard': {
    supported_cpu: 'AMD Ryzen 9000/8000/7000 Series (Socket AM5)',
    chipset: 'AMD A620',
    memory_size: '128GB',
    memory_type: 'DDR5',
    storage_slots: '1x M.2 Gen4 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek ALC897 7.1 HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek RTL8111H 1GbE, audio\nInternal: USB headers, TPM header',
    special_features: 'AMD EXPO, Lightning Gen4 M.2, Steel Armor',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 PCIe 4.0 x4',
    warranty: '3 Years',
    price: 14900,
    compareAtPrice: 16500,
    costPrice: 12800,
    stockQuantity: 10,
    shortDescription: 'Affordable AM5 A620 board with DDR5 and Gen4 M.2.',
    description:
      'MSI PRO A620M-E supports Ryzen 7000/8000/9000 on AM5 with AMD A620 chipset. Two DDR5 DIMMs (up to 128GB per MSI current spec), PCIe 4.0 x16, Gen4 M.2, and Micro-ATX form factor for budget Ryzen systems.',
  },
  'msi-a520m-a-pro-am4-amd-micro-atx-motherboard': {
    supported_cpu: 'AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)',
    chipset: 'AMD A520',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DVI-D, 1x VGA',
    audio: 'Realtek ALC887/897 HD Audio',
    ports_connectors:
      'Rear: HDMI, DVI-D, VGA, USB 3.2 Gen1, USB 2.0, Realtek LAN, audio\nInternal: USB and front-panel headers',
    special_features: 'Core Boost, Audio Boost',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 3.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 9800,
    compareAtPrice: 11000,
    costPrice: 8400,
    stockQuantity: 14,
    shortDescription: 'Value AM4 A520 Micro-ATX motherboard with DDR4.',
    description:
      'MSI A520M-A PRO is an entry AM4 board for Ryzen 3000/5000 class CPUs. AMD A520 chipset, dual-channel DDR4, M.2 slot, and triple display outputs for budget AMD desktops.',
  },
  'msi-b550m-a-pro-ddr4-amd-am4-micro-atx-motherboard': {
    supported_cpu: 'AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)',
    chipset: 'AMD B550',
    memory_size: '128GB',
    memory_type: 'DDR4',
    storage_slots: '2x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DisplayPort',
    audio: 'Realtek ALC897 7.1 HD Audio',
    ports_connectors:
      'Rear: HDMI, DP, USB 3.2 Gen1/Gen2, USB 2.0, Realtek 1GbE, audio\nInternal: USB Type-C header (model dependent), RGB/fan headers',
    special_features: 'PCIe 4.0 ready, dual M.2, Lightning Gen4',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n2x PCIe 3.0 x1\n2x M.2 (1x Gen4 from CPU)',
    warranty: '3 Years',
    price: 14500,
    compareAtPrice: 16200,
    costPrice: 12400,
    stockQuantity: 9,
    shortDescription: 'B550 Micro-ATX with PCIe 4.0 and dual M.2 for AM4 Ryzen.',
    description:
      'MSI B550M-A PRO brings AMD B550 features to a compact board: PCIe 4.0 graphics lane, dual M.2 storage, DDR4 dual-channel memory, and HDMI/DP outputs for productive Ryzen AM4 builds.',
  },
  'asus-prime-a520m-r-am4-micro-atx-motherboard': {
    supported_cpu: 'AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)',
    chipset: 'AMD A520',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek ALC887 HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio, PS/2\nInternal: USB 2.0/3.2 headers, COM, TPM',
    special_features: 'ASUS 5X Protection III, Fan Xpert',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 3.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 9200,
    compareAtPrice: 10500,
    costPrice: 7900,
    stockQuantity: 11,
    shortDescription: 'ASUS PRIME A520M-R entry AM4 board with DDR4.',
    description:
      'ASUS PRIME A520M-R uses AMD A520 for Ryzen AM4 CPUs. Dual DDR4 DIMMs, M.2 NVMe support, HDMI/VGA video, and ASUS reliability features for home and office PCs.',
  },
  'asus-prime-a520m-k-am4-micro-atx-amd-motherboard': {
    supported_cpu: 'AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)',
    chipset: 'AMD A520',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DVI-D, 1x VGA',
    audio: 'Realtek ALC887 HD Audio',
    ports_connectors:
      'Rear: HDMI, DVI-D, VGA, USB 3.2 Gen1, USB 2.0, Realtek LAN, audio, PS/2\nInternal: USB headers, COM, TPM',
    special_features: 'ASUS 5X Protection III, Digi+ VRM',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 3.0 x16\n2x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 9500,
    compareAtPrice: 10800,
    costPrice: 8100,
    stockQuantity: 12,
    shortDescription: 'PRIME A520M-K with triple display outputs for AM4.',
    description:
      'ASUS PRIME A520M-K is a Micro-ATX AMD A520 motherboard supporting Ryzen AM4 processors, dual-channel DDR4, M.2 storage, and HDMI/DVI/VGA for older monitors.',
  },
  'asus-prime-h610m-f-d4-r2-0-ddr4-lga1700-matx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 2x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek ALC897 HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio\nInternal: USB headers, front panel',
    special_features: 'ASUS 5X Protection III, Fan Xpert',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 PCIe 3.0 x4',
    warranty: '3 Years',
    price: 11200,
    compareAtPrice: 12500,
    costPrice: 9600,
    stockQuantity: 10,
    shortDescription: 'ASUS PRIME H610M-F D4 R2.0 for LGA1700 DDR4 builds.',
    description:
      'ASUS PRIME H610M-F D4 R2.0 is a compact H610 motherboard for 12th–14th Gen Intel CPUs with DDR4 memory, M.2 SSD, and HDMI/VGA outputs for everyday LogicBay systems.',
  },
  'asus-prime-h610m-r-d4-ddr4-lga1700-matx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DVI-D, 1x VGA',
    audio: 'Realtek ALC897 HD Audio',
    ports_connectors:
      'Rear: HDMI, DVI-D, VGA, 2x USB 3.2 Gen1, 2x USB 2.0, Realtek 1GbE, 3x audio, PS/2 KB/Mouse\nInternal: USB 3.2/2.0 headers, COM, LPT, TPM',
    special_features: 'ASUS 5X Protection III, Fan Xpert, Digi+ VRM',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M PCIe 3.0 x4',
    warranty: '3 Years',
    price: 11800,
    compareAtPrice: 13200,
    costPrice: 10100,
    stockQuantity: 11,
    shortDescription: 'PRIME H610M-R D4 with triple video and four SATA ports.',
    description:
      'ASUS PRIME H610M-R D4 (official ASUS specs) supports LGA1700 Intel 12th–14th Gen CPUs, dual DDR4 up to 64GB, one M.2, four SATA ports, and HDMI/DVI-D/VGA rear video for versatile office PCs.',
  },
  'asus-prime-h610m-r-ddr5-lga1700-matx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '96GB',
    memory_type: 'DDR5',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DVI-D, 1x VGA',
    audio: 'Realtek ALC897 HD Audio',
    ports_connectors:
      'Rear: HDMI, DVI-D, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio, PS/2\nInternal: USB headers, COM, TPM',
    special_features: 'DDR5 support, ASUS 5X Protection III',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 13500,
    compareAtPrice: 14900,
    costPrice: 11600,
    stockQuantity: 7,
    shortDescription: 'ASUS PRIME H610M-R DDR5 Micro-ATX for LGA1700.',
    description:
      'ASUS PRIME H610M-R DDR5 brings dual-channel DDR5 to the H610 platform for Intel 12th–14th Gen CPUs, with M.2 storage and multi-display rear I/O in a Micro-ATX footprint.',
  },
  'asus-prime-a520m-a-ii-am4-micro-atx-motherboard': {
    supported_cpu: 'AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)',
    chipset: 'AMD A520',
    memory_size: '128GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DVI-D, 1x VGA',
    audio: 'Realtek ALC887 HD Audio',
    ports_connectors:
      'Rear: HDMI, DVI-D, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio\nInternal: Aura RGB header, USB headers',
    special_features: 'ASUS Aura Sync header, 5X Protection III',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 3.0 x16\n2x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 10500,
    compareAtPrice: 11800,
    costPrice: 9000,
    stockQuantity: 9,
    shortDescription: 'PRIME A520M-A II with RGB header and dual-channel DDR4.',
    description:
      'ASUS PRIME A520M-A II is an AM4 A520 Micro-ATX board with dual-channel DDR4, M.2 NVMe, triple display outputs, and an Aura RGB header for custom builds.',
  },
  'gigabyte-a520m-k-v2-am4-micro-atx-motherboard': {
    supported_cpu: 'AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)',
    chipset: 'AMD A520',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DVI-D',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, DVI-D, USB 3.2 Gen1, USB 2.0, Realtek GbE LAN, audio\nInternal: USB headers, front panel',
    special_features: 'Smart Fan 6, Anti-Sulfur Resistors',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe x16\n1x PCIe x1\n1x M.2',
    warranty: '3 Years',
    price: 8900,
    compareAtPrice: 9900,
    costPrice: 7600,
    stockQuantity: 13,
    shortDescription: 'GIGABYTE A520M K V2 value AM4 motherboard.',
    description:
      'GIGABYTE A520M K V2 uses AMD A520 for Ryzen AM4 CPUs with dual DDR4 DIMMs, M.2 NVMe, HDMI/DVI video, Realtek LAN, and Smart Fan 6 cooling controls.',
  },
  'gigabyte-b450m-k-amd-am4-micro-atx-motherboard': {
    supported_cpu: 'AMD Ryzen 5000/3000/2000 Series (AM4, BIOS dependent)',
    chipset: 'AMD B450',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DVI-D',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, DVI-D, USB 3.1/3.0, USB 2.0, Realtek LAN, audio\nInternal: USB headers, RGB header (model dependent)',
    special_features: 'Smart Fan 5, Ultra Durable',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe x16\n1x PCIe x1\n1x M.2',
    warranty: '3 Years',
    price: 9500,
    compareAtPrice: 10800,
    costPrice: 8200,
    stockQuantity: 10,
    shortDescription: 'GIGABYTE B450M K Micro-ATX for AM4 Ryzen upgrades.',
    description:
      'GIGABYTE B450M K is a budget B450 Micro-ATX board for AM4 Ryzen processors with DDR4 dual-channel memory, M.2 storage, and HDMI/DVI display outputs.',
  },
  'gigabyte-h610m-k-ddr4-micro-atx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 PCIe 3.0 x4 + 4x SATA 6Gb/s',
    graphics: '1x HDMI',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, USB 3.2 Gen1, USB 2.0, Realtek GbE LAN, audio\nInternal: USB headers, Smart Fan headers',
    special_features: 'Smart Fan 6, Anti-Sulfur Resistors, NVMe M.2',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe x1\n1x M.2 NVMe',
    warranty: '3 Years',
    price: 10800,
    compareAtPrice: 12000,
    costPrice: 9200,
    stockQuantity: 12,
    shortDescription: 'GIGABYTE H610M K DDR4 with NVMe M.2 and Smart Fan 6.',
    description:
      'Per GIGABYTE specs, H610M K DDR4 supports Intel 12th–14th Gen LGA1700 CPUs, dual-channel DDR4 up to 64GB, PCIe 4.0 x16, Gen3 x4 M.2, Realtek GbE, and Smart Fan 6.',
  },
  'gigabyte-h610m-h-ddr4-micro-atx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio\nInternal: USB / front panel headers',
    special_features: 'Smart Fan 6, Anti-Sulfur design',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe x1\n1x M.2',
    warranty: '3 Years',
    price: 11200,
    compareAtPrice: 12500,
    costPrice: 9500,
    stockQuantity: 11,
    shortDescription: 'H610M H DDR4 with HDMI + VGA for office PCs.',
    description:
      'GIGABYTE H610M H DDR4 is an H610 Micro-ATX board for LGA1700 Intel CPUs with dual DDR4 DIMMs, M.2 NVMe, HDMI and VGA outputs, and Realtek networking/audio.',
  },
  'gigabyte-h610m-k-ddr5-micro-atx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '96GB',
    memory_type: 'DDR5',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio\nInternal: USB headers, Smart Fan headers',
    special_features: 'DDR5 dual-channel, Smart Fan 6',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe x1\n1x M.2',
    warranty: '3 Years',
    price: 12800,
    compareAtPrice: 14200,
    costPrice: 11000,
    stockQuantity: 8,
    shortDescription: 'GIGABYTE H610M K DDR5 Micro-ATX motherboard.',
    description:
      'GIGABYTE H610M K DDR5 supports Intel 12th–14th Gen CPUs with dual-channel DDR5 memory, M.2 storage, PCIe 4.0 graphics slot, and Smart Fan 6 thermal control.',
  },
  'gigabyte-a620m-h-am5-micro-atx-motherboard': {
    supported_cpu: 'AMD Ryzen 9000/8000/7000 Series (AM5)',
    chipset: 'AMD A620',
    memory_size: '128GB',
    memory_type: 'DDR5',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DisplayPort',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, DP, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio\nInternal: USB headers, fan headers',
    special_features: 'AMD EXPO ready, Smart Fan 6',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe x1\n1x M.2',
    warranty: '3 Years',
    price: 14200,
    compareAtPrice: 15800,
    costPrice: 12200,
    stockQuantity: 9,
    shortDescription: 'GIGABYTE A620M H AM5 board with DDR5 and HDMI/DP.',
    description:
      'GIGABYTE A620M H is an entry AM5 motherboard with AMD A620 chipset, dual-channel DDR5, M.2 NVMe, HDMI/DisplayPort outputs, and Micro-ATX sizing for Ryzen 7000-class systems.',
  },
  'asrock-a520m-hvs-amd-am4-micro-atx-motherboard': {
    supported_cpu: 'AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)',
    chipset: 'AMD A520',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek ALC887 HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek LAN, audio, PS/2\nInternal: USB headers, COM',
    special_features: 'ASRock Full Spike Protection',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 3.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 8600,
    compareAtPrice: 9800,
    costPrice: 7400,
    stockQuantity: 12,
    shortDescription: 'ASRock A520M-HVS budget AM4 Micro-ATX board.',
    description:
      'ASRock A520M-HVS pairs AMD A520 with Ryzen AM4 CPUs, dual DDR4 DIMMs, M.2 SSD support, and HDMI/VGA outputs for low-cost desktops.',
  },
  'asrock-h610m-h2-m-2-14th-13th-and-12th-gen-matx-ddr5-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '96GB',
    memory_type: 'DDR5',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek ALC897 HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio\nInternal: USB headers, front panel',
    special_features: 'M.2 slot highlighted, Full Spike Protection',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 13200,
    compareAtPrice: 14600,
    costPrice: 11300,
    stockQuantity: 8,
    shortDescription: 'ASRock H610M-H2/M.2 DDR5 for 12th–14th Gen Intel.',
    description:
      'ASRock H610M-H2/M.2 is an H610 Micro-ATX board with DDR5 memory support for Intel 12th–14th Gen LGA1700 CPUs, dedicated M.2 storage, and HDMI/VGA display outputs.',
  },
  'colorful-battle-ax-h610m-e-wifi-v20-matx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek HD Audio Codec',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2, USB 2.0, 1GbE LAN, Wi-Fi antennas, audio\nInternal: USB headers',
    special_features: 'Wi-Fi (onboard), Battle-AX series cooling design',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe x16\n1x PCIe x1\n1x M.2',
    warranty: '3 Years',
    price: 14500,
    compareAtPrice: 16000,
    costPrice: 12400,
    stockQuantity: 6,
    shortDescription: 'Colorful BATTLE-AX H610M-E WIFI with wireless networking.',
    description:
      'Colorful BATTLE-AX H610M-E WIFI V20 is an H610 Micro-ATX motherboard for LGA1700 Intel CPUs with DDR4 memory, M.2 storage, HDMI/VGA, and onboard Wi-Fi for cable-free office setups.',
  },
  'gigabyte-a520m-ds3h-v2-micro-atx-ddr4-amd-am4-motherboard': {
    supported_cpu: 'AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)',
    chipset: 'AMD A520',
    memory_size: '128GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DVI-D, 1x VGA',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, DVI-D, VGA, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio\nInternal: RGB header, USB headers',
    special_features: 'Ultra Durable, Smart Fan 5, RGB Fusion header',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe x16\n2x PCIe x1\n1x M.2',
    warranty: '3 Years',
    price: 11200,
    compareAtPrice: 12600,
    costPrice: 9600,
    stockQuantity: 9,
    shortDescription: 'A520M DS3H V2 with four DIMM slots and RGB header.',
    description:
      'GIGABYTE A520M DS3H V2 offers AMD A520 on AM4 with up to four DDR4 DIMMs (high capacity), M.2 NVMe, triple display outputs, and Ultra Durable components for mainstream desktops.',
  },
  'gigabyte-b450m-ds3h-v3-amd-am4-micro-atx-motherboard': {
    supported_cpu: 'AMD Ryzen 5000/3000/2000 Series (AM4, BIOS dependent)',
    chipset: 'AMD B450',
    memory_size: '128GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x DVI-D, 1x VGA',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, DVI-D, VGA, USB 3.1 Gen1, USB 2.0, Realtek LAN, audio\nInternal: RGB header, USB headers',
    special_features: 'Ultra Durable, Smart Fan 5, RGB Fusion',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe x16\n1x PCIe x4\n1x PCIe x1\n1x M.2',
    warranty: '3 Years',
    price: 11800,
    compareAtPrice: 13200,
    costPrice: 10100,
    stockQuantity: 8,
    shortDescription: 'B450M DS3H V3 Micro-ATX with four DIMMs for AM4.',
    description:
      'GIGABYTE B450M DS3H V3 is a proven B450 Micro-ATX platform for Ryzen AM4 with dual-channel DDR4 (4 DIMMs), M.2 storage, and multi-display rear I/O.',
  },
  'msi-pro-h610m-s-ddr4-ii-matx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek ALC897 7.1 HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio\nInternal: USB headers, TPM',
    special_features: 'PRO Series stability focus, EZ Debug LED',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 10900,
    compareAtPrice: 12200,
    costPrice: 9300,
    stockQuantity: 10,
    shortDescription: 'MSI PRO H610M-S DDR4 II compact office motherboard.',
    description:
      'MSI PRO H610M-S DDR4 II supports Intel LGA1700 12th–14th Gen CPUs with H610 chipset, dual DDR4 DIMMs up to 64GB, M.2 SSD, and HDMI/VGA outputs for business PCs.',
  },
  'asus-prime-h510m-k-r2-0-10th-and-11th-gen-micro-atx-motherboard': {
    supported_cpu: 'Intel Core 11th/10th Gen, Pentium Gold, Celeron (LGA1200)',
    chipset: 'Intel H510',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek ALC887 HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio, PS/2\nInternal: USB headers, COM, TPM',
    special_features: 'ASUS 5X Protection III, Fan Xpert',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0/3.0 x16\n2x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 10200,
    compareAtPrice: 11500,
    costPrice: 8800,
    stockQuantity: 9,
    shortDescription: 'PRIME H510M-K R2.0 for 10th/11th Gen LGA1200 CPUs.',
    description:
      'ASUS PRIME H510M-K R2.0 is an H510 Micro-ATX board for Intel 10th and 11th Gen LGA1200 processors with DDR4 dual-channel memory, M.2 storage, and HDMI/VGA video.',
  },
  'gigabyte-h610m-h-v3-ddr4-micro-atx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio\nInternal: USB headers, Smart Fan headers',
    special_features: 'Smart Fan 6, V3 revision updates',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe x1\n1x M.2',
    warranty: '3 Years',
    price: 11400,
    compareAtPrice: 12800,
    costPrice: 9700,
    stockQuantity: 10,
    shortDescription: 'GIGABYTE H610M H V3 DDR4 refreshed H610 board.',
    description:
      'GIGABYTE H610M H V3 DDR4 updates the H610M H line for Intel 12th–14th Gen CPUs with dual DDR4 DIMMs, M.2 NVMe, HDMI/VGA, and Smart Fan 6.',
  },
  'gigabyte-h610m-h-ddr5-matx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '96GB',
    memory_type: 'DDR5',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio\nInternal: USB headers, fan headers',
    special_features: 'DDR5 support, Smart Fan 6',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe x1\n1x M.2',
    warranty: '3 Years',
    price: 13000,
    compareAtPrice: 14500,
    costPrice: 11200,
    stockQuantity: 7,
    shortDescription: 'GIGABYTE H610M H DDR5 with HDMI and VGA outputs.',
    description:
      'GIGABYTE H610M H DDR5 supports LGA1700 Intel 12th–14th Gen processors with dual-channel DDR5, M.2 storage, and HDMI/VGA for mixed display setups.',
  },
  'msi-pro-h610m-s-ddr4-m-atx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek ALC897 7.1 HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio\nInternal: USB headers, TPM',
    special_features: 'PRO Series, EZ Debug LED',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 10700,
    compareAtPrice: 12000,
    costPrice: 9100,
    stockQuantity: 11,
    shortDescription: 'MSI PRO H610M-S DDR4 Micro-ATX for LGA1700.',
    description:
      'MSI PRO H610M-S DDR4 is an H610 Micro-ATX motherboard for Intel 12th–14th Gen CPUs with dual DDR4 memory slots, M.2 SSD, HDMI/VGA, and Realtek audio/LAN.',
  },
  'msi-pro-h610m-e-matx-motherboard': {
    supported_cpu: 'Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)',
    chipset: 'Intel H610',
    memory_size: '96GB',
    memory_type: 'DDR5',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek ALC897 7.1 HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio\nInternal: USB headers, TPM',
    special_features: 'DDR5 dual-channel, Steel Armor, EZ Debug LED',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 4.0 x16\n1x PCIe 3.0 x1\n1x M.2 Key-M',
    warranty: '3 Years',
    price: 13600,
    compareAtPrice: 15000,
    costPrice: 11700,
    stockQuantity: 8,
    shortDescription: 'MSI PRO H610M-E (DDR5) Micro-ATX for LGA1700.',
    description:
      'MSI PRO H610M-E (DDR5 SKU) supports Intel LGA1700 12th–14th Gen CPUs with H610 chipset, dual-channel DDR5, M.2 storage, HDMI/VGA, and PRO-series reliability features.',
  },
  'gigabyte-h410m-h-10th-gen-micro-atx-motherboard': {
    supported_cpu: 'Intel Core 10th Gen, Pentium Gold, Celeron (LGA1200)',
    chipset: 'Intel H410',
    memory_size: '64GB',
    memory_type: 'DDR4',
    storage_slots: '1x M.2 + 4x SATA 6Gb/s',
    graphics: '1x HDMI, 1x VGA',
    audio: 'Realtek Audio CODEC HD Audio',
    ports_connectors:
      'Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek LAN, audio\nInternal: USB headers, front panel',
    special_features: 'Ultra Durable, Smart Fan 5',
    form_factor: 'Micro ATX',
    expansion_slots: '1x PCIe 3.0 x16\n1x PCIe 3.0 x1\n1x M.2',
    warranty: '3 Years',
    price: 8200,
    compareAtPrice: 9500,
    costPrice: 7000,
    stockQuantity: 10,
    shortDescription: 'GIGABYTE H410M H for 10th Gen LGA1200 systems.',
    description:
      'GIGABYTE H410M H is an H410 Micro-ATX board for Intel 10th Gen LGA1200 CPUs with dual DDR4 DIMMs, M.2 storage, and HDMI/VGA outputs for legacy upgrades.',
  },
};

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function escapeCsv(value: string): string {
  // Keep CSV single-line so the simple import parser does not split rows
  const flat = value.replace(/\r?\n/g, ' | ').replace(/\s+\|\s+/g, ' | ').trim();
  if (/[",\n\r]/.test(flat)) {
    return `"${flat.replace(/"/g, '""')}"`;
  }
  return flat;
}

function main() {
  const src = path.join(process.cwd(), 'docs/imports/motherboard-cms-import-30.csv');
  const dest = path.join(process.cwd(), 'docs/imports/motherboard-cms-import.csv');
  const lines = fs.readFileSync(src, 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]!);
  const outLines = [headers.map(escapeCsv).join(',')];
  let filled = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]!);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? '';
    });
    const slug = row.slug?.trim();
    const specs = slug ? bySlug[slug] : undefined;
    if (!specs) {
      throw new Error(`Missing fill data for slug: ${slug}`);
    }

    row.stock_decision = 'STOCK';
    row.price = String(specs.price);
    row.compareAtPrice = String(specs.compareAtPrice);
    row.costPrice = String(specs.costPrice);
    row.stockStatus = 'IN_STOCK';
    row.stockQuantity = String(specs.stockQuantity);
    row.lowStockAlert = '5';
    row.isFeatured = 'false';
    row.isActive = 'true';
    row.shortDescription = specs.shortDescription;
    row.description = specs.description;
    row.supported_cpu = specs.supported_cpu;
    row.chipset = specs.chipset;
    row.memory_size = specs.memory_size;
    row.memory_type = specs.memory_type;
    row.storage_slots = specs.storage_slots;
    row.graphics = specs.graphics;
    row.audio = specs.audio;
    row.ports_connectors = specs.ports_connectors;
    row.special_features = specs.special_features;
    row.form_factor = specs.form_factor;
    row.expansion_slots = specs.expansion_slots;
    row.warranty = specs.warranty;
    row.image_url = `/uploads/motherboards/${slug}.jpg`;
    row.metaTitle = `Buy ${row.name} in Bangladesh | LogicBay BD`;
    row.metaDescription = `${row.name} — ${specs.chipset}, ${specs.memory_type}, ${specs.form_factor}. Price ৳${specs.price}. Warranty ${specs.warranty}.`;
    row.metaKeywords = `motherboard, ${row.brand_slug}, ${specs.chipset}, ${specs.memory_type}, LogicBay BD`;

    outLines.push(headers.map((h) => escapeCsv(row[h] ?? '')).join(','));
    filled++;
  }

  fs.writeFileSync(dest, outLines.join('\n') + '\n', 'utf8');
  console.log(`Filled ${filled} rows → ${dest}`);
}

main();
