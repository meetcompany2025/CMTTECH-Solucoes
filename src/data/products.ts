export const categories = [
  { id: "all", name: "Todos" },
  { id: "network", name: "Equipamentos de Rede" },
  { id: "cctv", name: "Vídeo Vigilância" },
  { id: "electric", name: "Material Elétrico" },
  { id: "solar", name: "Sistemas Solares" },
  { id: "automation", name: "Automação" },
];

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  brand: string;
  inStock: boolean;
  description?: string;
  specs?: { label: string; value: string }[];
  gallery?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Switch Cisco 24 Portas PoE+",
    category: "network",
    price: 450000,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
    brand: "Cisco",
    inStock: true,
    description: "Switch de rede gerenciável de alto desempenho com 24 portas PoE+ para alimentação de dispositivos como câmaras IP, access points e telefones VoIP. Ideal para ambientes corporativos e data centers.",
    specs: [
      { label: "Portas", value: "24x Gigabit Ethernet PoE+" },
      { label: "Potência PoE", value: "370W Total" },
      { label: "Capacidade", value: "48 Gbps" },
      { label: "Gerenciamento", value: "Web, CLI, SNMP" },
      { label: "Montagem", value: "Rack 19\"" },
      { label: "Garantia", value: "3 Anos" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
      "https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?w=800",
    ],
  },
  {
    id: 2,
    name: "Cabo Fibra Óptica Monomodo 1km",
    category: "network",
    price: 85000,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    brand: "Furukawa",
    inStock: true,
    description: "Cabo de fibra óptica monomodo de alta qualidade para transmissões de longa distância. Perfeito para backbone de redes corporativas e telecomunicações.",
    specs: [
      { label: "Tipo", value: "Monomodo OS2" },
      { label: "Comprimento", value: "1000 metros" },
      { label: "Fibras", value: "6 fibras" },
      { label: "Atenuação", value: "0.35 dB/km" },
      { label: "Uso", value: "Interno/Externo" },
      { label: "Certificação", value: "ANSI/TIA-568" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    ],
  },
  {
    id: 3,
    name: "Câmara IP 4MP Exterior",
    category: "cctv",
    price: 125000,
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=400",
    brand: "Hikvision",
    inStock: true,
    description: "Câmara de vigilância IP de alta resolução 4MP com visão noturna infravermelha e proteção contra intempéries. Ideal para monitoramento de áreas externas.",
    specs: [
      { label: "Resolução", value: "4 Megapixels (2560x1440)" },
      { label: "Visão Noturna", value: "Até 30 metros" },
      { label: "Proteção", value: "IP67 à prova d'água" },
      { label: "Compressão", value: "H.265+ / H.264+" },
      { label: "Alimentação", value: "PoE / 12V DC" },
      { label: "Armazenamento", value: "Slot microSD 256GB" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1557862921-37829c790f19?w=800",
      "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=800",
    ],
  },
  {
    id: 4,
    name: "DVR 16 Canais 4K",
    category: "cctv",
    price: 280000,
    image: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=400",
    brand: "Dahua",
    inStock: true,
    description: "Gravador digital de vídeo com suporte para 16 câmaras e resolução 4K Ultra HD. Sistema robusto para vigilância empresarial de grande escala.",
    specs: [
      { label: "Canais", value: "16 Canais" },
      { label: "Resolução", value: "4K Ultra HD" },
      { label: "Armazenamento", value: "4x SATA até 40TB" },
      { label: "Saídas Vídeo", value: "HDMI + VGA" },
      { label: "Rede", value: "Gigabit Ethernet" },
      { label: "Acesso Remoto", value: "App iOS/Android" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=800",
      "https://images.unsplash.com/photo-1557862921-37829c790f19?w=800",
    ],
  },
  {
    id: 5,
    name: "Quadro Elétrico Industrial",
    category: "electric",
    price: 320000,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    brand: "Schneider",
    inStock: true,
    description: "Quadro elétrico de distribuição industrial com proteção completa para instalações de média e alta potência. Construção robusta em aço galvanizado.",
    specs: [
      { label: "Material", value: "Aço galvanizado IP65" },
      { label: "Tensão", value: "400V trifásico" },
      { label: "Corrente", value: "Até 400A" },
      { label: "Módulos", value: "72 DIN" },
      { label: "Proteção", value: "Sobretensão e curto-circuito" },
      { label: "Norma", value: "IEC 61439" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800",
    ],
  },
  {
    id: 6,
    name: "Disjuntor Tripolar 100A",
    category: "electric",
    price: 45000,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400",
    brand: "ABB",
    inStock: true,
    description: "Disjuntor termomagnético tripolar para proteção de circuitos industriais. Alta capacidade de ruptura e curva de disparo configurável.",
    specs: [
      { label: "Corrente Nominal", value: "100A" },
      { label: "Polos", value: "3P (Tripolar)" },
      { label: "Tensão", value: "400V AC" },
      { label: "Poder de Corte", value: "25kA" },
      { label: "Curva", value: "C (Uso Geral)" },
      { label: "Montagem", value: "DIN Rail 35mm" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
    ],
  },
  {
    id: 7,
    name: "Painel Solar 450W",
    category: "solar",
    price: 95000,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
    brand: "JA Solar",
    inStock: true,
    description: "Painel solar fotovoltaico monocristalino de alta eficiência para sistemas residenciais e comerciais. Tecnologia half-cell para melhor desempenho.",
    specs: [
      { label: "Potência", value: "450W" },
      { label: "Eficiência", value: "21.3%" },
      { label: "Tipo", value: "Monocristalino Half-Cell" },
      { label: "Tensão", value: "41.5V Vmp" },
      { label: "Dimensões", value: "2094 x 1038 x 35mm" },
      { label: "Garantia", value: "25 Anos" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
    ],
  },
  {
    id: 8,
    name: "Inversor Solar 5kW",
    category: "solar",
    price: 380000,
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400",
    brand: "Growatt",
    inStock: true,
    description: "Inversor solar híbrido com capacidade de 5kW para sistemas on-grid e off-grid. Monitoramento via WiFi e compatível com baterias de lítio.",
    specs: [
      { label: "Potência", value: "5kW" },
      { label: "Tipo", value: "Híbrido (On/Off Grid)" },
      { label: "Eficiência", value: "97.6%" },
      { label: "MPPT", value: "2 Trackers" },
      { label: "Monitoramento", value: "WiFi Integrado" },
      { label: "Garantia", value: "10 Anos" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      "https://images.unsplash.com/photo-1619641805634-98e8521f84ba?w=800",
    ],
  },
  {
    id: 9,
    name: "PLC Siemens S7-1200",
    category: "automation",
    price: 520000,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400",
    brand: "Siemens",
    inStock: true,
    description: "Controlador lógico programável compacto para automação industrial. Interface de programação intuitiva e módulos de expansão flexíveis.",
    specs: [
      { label: "CPU", value: "1214C DC/DC/DC" },
      { label: "Memória", value: "100KB Programa" },
      { label: "Entradas", value: "14 DI + 2 AI" },
      { label: "Saídas", value: "10 DO" },
      { label: "Comunicação", value: "Profinet / Ethernet" },
      { label: "Programação", value: "TIA Portal" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
    ],
  },
  {
    id: 10,
    name: "Rack 42U para Servidor",
    category: "network",
    price: 180000,
    image: "https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?w=400",
    brand: "APC",
    inStock: true,
    description: "Rack de 42 unidades para servidores e equipamentos de rede. Estrutura reforçada com ventilação adequada e gestão de cabos integrada.",
    specs: [
      { label: "Altura", value: "42U (2000mm)" },
      { label: "Largura", value: "600mm" },
      { label: "Profundidade", value: "1070mm" },
      { label: "Capacidade", value: "1500kg" },
      { label: "Material", value: "Aço com pintura eletrostática" },
      { label: "Acessórios", value: "Réguas PDU opcionais" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?w=800",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    ],
  },
  {
    id: 11,
    name: "Access Point UniFi AC Pro",
    category: "network",
    price: 145000,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400",
    brand: "Ubiquiti",
    inStock: true,
    description: "Access point wireless empresarial dual-band de alto desempenho. Ideal para ambientes com alta densidade de utilizadores.",
    specs: [
      { label: "Velocidade", value: "1750 Mbps (AC)" },
      { label: "Frequências", value: "2.4GHz + 5GHz" },
      { label: "Utilizadores", value: "Até 250 simultâneos" },
      { label: "Alimentação", value: "PoE 802.3af" },
      { label: "Alcance", value: "122m interior" },
      { label: "Gestão", value: "UniFi Controller" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    ],
  },
  {
    id: 12,
    name: "Bateria Solar 200Ah",
    category: "solar",
    price: 210000,
    image: "https://images.unsplash.com/photo-1619641805634-98e8521f84ba?w=400",
    brand: "Victron",
    inStock: true,
    description: "Bateria de ciclo profundo para sistemas solares off-grid. Tecnologia de lítio LiFePO4 com longa vida útil e alta eficiência.",
    specs: [
      { label: "Capacidade", value: "200Ah" },
      { label: "Tensão", value: "12.8V (LiFePO4)" },
      { label: "Ciclos", value: "3500+ ciclos" },
      { label: "Eficiência", value: "98%" },
      { label: "BMS", value: "Integrado" },
      { label: "Garantia", value: "5 Anos" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1619641805634-98e8521f84ba?w=800",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    ],
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
}
