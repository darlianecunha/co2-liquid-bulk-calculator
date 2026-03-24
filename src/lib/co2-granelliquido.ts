// ============================================================
// CO₂ Emissions — Liquid Bulk Vessels (Tankers)
// Modules: Auxiliary Engine (OPS) · Manoeuvring · Boiler
// Source: Fourth IMO GHG Study 2020 + MEPC.282(70) + MEPC.391(81)
// SFC Auxiliary Engine: 185 g/kWh | SFC Boiler: 320 g/kWh
// CF CO₂ MGO/MDO: 3.206 tCO₂/t | CF CO₂ HFO: 3.114 tCO₂/t
// ============================================================

// ── Ship Classes (Liquid Bulk / Tankers) ────────────────────────────────────
export type ClasseNavio =
  | "HANDYSIZE"
  | "HANDYMAX"
  | "PANAMAX"
  | "AFRAMAX"
  | "SUEZMAX"
  | "VLCC"
  | "ULCC";

export interface FaixaDWT {
  dwtMin: number;
  dwtMax: number;
  potenciaKW: number;
  classe: ClasseNavio;
}

// ── Tabela PAUX — Auxiliary Engine Power (OPS / Berthed) ───────────────────
// Source: Fourth IMO GHG Study 2020, Table 23
// Auxiliary engine power while berthed (OPS phase)
export const TABELA_PAUX_GL: FaixaDWT[] = [
  { dwtMin: 0,      dwtMax: 4999,   potenciaKW: 250,  classe: "HANDYSIZE" },
  { dwtMin: 5000,   dwtMax: 9999,   potenciaKW: 375,  classe: "HANDYSIZE" },
  { dwtMin: 10000,  dwtMax: 19999,  potenciaKW: 690,  classe: "HANDYSIZE" },
  { dwtMin: 20000,  dwtMax: 35000,  potenciaKW: 720,  classe: "HANDYSIZE" },
  { dwtMin: 35001,  dwtMax: 59999,  potenciaKW: 720,  classe: "HANDYMAX"  },
  { dwtMin: 60000,  dwtMax: 79999,  potenciaKW: 620,  classe: "PANAMAX"   },
  { dwtMin: 80000,  dwtMax: 119999, potenciaKW: 800,  classe: "AFRAMAX"   },
  { dwtMin: 120000, dwtMax: 199999, potenciaKW: 2500, classe: "SUEZMAX"   },
  { dwtMin: 200000, dwtMax: 320000, potenciaKW: 2500, classe: "VLCC"      },
  { dwtMin: 320001, dwtMax: 999999, potenciaKW: 2500, classe: "ULCC"      },
];

// ── Tabela MANOBRA — Auxiliary Engine Power during Manoeuvring ──────────────
// Source: Fourth IMO GHG Study 2020
// Higher auxiliary load during port entry/exit (pumps, mooring equipment)
export const TABELA_MANOBRA_GL: FaixaDWT[] = [
  { dwtMin: 0,      dwtMax: 4999,   potenciaKW: 300,  classe: "HANDYSIZE" },
  { dwtMin: 5000,   dwtMax: 9999,   potenciaKW: 450,  classe: "HANDYSIZE" },
  { dwtMin: 10000,  dwtMax: 19999,  potenciaKW: 690,  classe: "HANDYSIZE" },
  { dwtMin: 20000,  dwtMax: 59999,  potenciaKW: 1000, classe: "HANDYMAX"  },
  { dwtMin: 60000,  dwtMax: 79999,  potenciaKW: 800,  classe: "PANAMAX"   },
  { dwtMin: 80000,  dwtMax: 119999, potenciaKW: 1300, classe: "AFRAMAX"   },
  { dwtMin: 120000, dwtMax: 199999, potenciaKW: 1300, classe: "SUEZMAX"   },
  { dwtMin: 200000, dwtMax: 999999, potenciaKW: 2000, classe: "VLCC"      },
];

// ── Tabela CALDEIRA — Boiler Power ──────────────────────────────────────────
// Source: Fourth IMO GHG Study 2020
// High boiler demand in tankers (cargo heating, tank cleaning)
export const TABELA_CALDEIRA_GL: FaixaDWT[] = [
  { dwtMin: 0,      dwtMax: 4999,   potenciaKW: 500,  classe: "HANDYSIZE" },
  { dwtMin: 5000,   dwtMax: 9999,   potenciaKW: 500,  classe: "HANDYSIZE" },
  { dwtMin: 10000,  dwtMax: 19999,  potenciaKW: 750,  classe: "HANDYSIZE" },
  { dwtMin: 20000,  dwtMax: 59999,  potenciaKW: 1000, classe: "HANDYMAX"  },
  { dwtMin: 60000,  dwtMax: 79999,  potenciaKW: 1500, classe: "PANAMAX"   },
  { dwtMin: 80000,  dwtMax: 119999, potenciaKW: 3000, classe: "AFRAMAX"   },
  { dwtMin: 120000, dwtMax: 199999, potenciaKW: 6500, classe: "SUEZMAX"   },
  { dwtMin: 200000, dwtMax: 999999, potenciaKW: 8000, classe: "VLCC"      },
];

// ── Emission Factors — IMO MEPC.282(70) / MEPC.391(81) ─────────────────────
export const CF_MGO = 3.206;       // tCO₂/t fuel (MGO/MDO)
export const CF_HFO = 3.114;       // tCO₂/t fuel (HFO)
export const SFC_MA = 185;         // g/kWh — Auxiliary Engine
export const SFC_CALDEIRA = 320;   // g/kWh — Boiler

// CO₂e factors — MEPC.391(81), GWP100 IPCC AR5
export const CF_CH4_MGO = 0.00005; // tCH₄/t fuel
export const CF_N2O_MGO = 0.00018; // tN₂O/t fuel
export const GWP_CH4 = 28;         // GWP100 IPCC AR5
export const GWP_N2O = 265;        // GWP100 IPCC AR5

// Reference carbon credit price (market reference — not a financial quote)
export const PRECO_CREDITO_CARBONO_REF = 35.84; // R$/tCO₂

// Cargo types for liquid bulk
export const CARGAS_GRANEL_LIQUIDO = [
  "DIESEL",
  "GASOLINA",
  "ÁLCOOL",
  "ÓLEOS VEGETAIS",
  "SODA CÁUSTICA",
  "NAFTA",
  "QUEROSENE",
  "ÓLEO COMBUSTÍVEL",
  "PETRÓLEO BRUTO",
  "OUTROS",
];

// ── Power lookup functions ───────────────────────────────────────────────────
function getPotencia(tabela: FaixaDWT[], dwt: number): number {
  const entrada = tabela.find(p => dwt >= p.dwtMin && dwt <= p.dwtMax);
  return entrada?.potenciaKW ?? 250;
}

export function getPotenciaMotorAux(dwt: number): number {
  return getPotencia(TABELA_PAUX_GL, dwt);
}

export function getPotenciaManobra(dwt: number): number {
  return getPotencia(TABELA_MANOBRA_GL, dwt);
}

export function getPotenciaCaldeira(dwt: number): number {
  return getPotencia(TABELA_CALDEIRA_GL, dwt);
}

export function getClasse(dwt: number): ClasseNavio {
  const entrada = TABELA_PAUX_GL.find(p => dwt >= p.dwtMin && dwt <= p.dwtMax);
  return entrada?.classe ?? "HANDYSIZE";
}

// ── Result interfaces ────────────────────────────────────────────────────────
export interface ResultadoModulo {
  potenciaKW: number;
  sfcGkWh: number;
  tempoHoras: number;
  energiaKWh: number;
  combustivelMgoT: number;
  co2MgoT: number;
  co2eT: number; // CO₂e = CO₂ + 28×CH₄ + 265×N₂O (MEPC.391(81))
}

export interface ResultadoCompleto {
  motorAux: ResultadoModulo;
  manobra: ResultadoModulo;
  caldeira: ResultadoModulo;
  totalCo2MgoT: number;
  totalCo2eT: number;
  classe: ClasseNavio;
}

// ── Calculation functions ────────────────────────────────────────────────────
function calcularModulo(
  potenciaKW: number,
  sfcGkWh: number,
  tempoHoras: number,
): ResultadoModulo {
  const energiaKWh = potenciaKW * tempoHoras;
  const combustivelMgoT = (energiaKWh * sfcGkWh) / 1_000_000;
  const co2MgoT = combustivelMgoT * CF_MGO;

  // CO₂e — MEPC.391(81), GWP100 IPCC AR5
  const ch4T = combustivelMgoT * CF_CH4_MGO;
  const n2oT = combustivelMgoT * CF_N2O_MGO;
  const co2eT = co2MgoT + GWP_CH4 * ch4T + GWP_N2O * n2oT;

  return { potenciaKW, sfcGkWh, tempoHoras, energiaKWh, combustivelMgoT, co2MgoT, co2eT };
}

export function calcularEmissoes(
  dwt: number,
  tempoAtracadoH: number,  // Auxiliary Engine — hours berthed
  tempoManobraH: number,   // Manoeuvring — hours
  tempoCaldeiraH: number,  // Boiler — hours (typically same as berthed time)
): ResultadoCompleto {
  const motorAux = calcularModulo(getPotenciaMotorAux(dwt), SFC_MA, tempoAtracadoH);
  const manobra  = calcularModulo(getPotenciaManobra(dwt),  SFC_MA, tempoManobraH);
  const caldeira = calcularModulo(getPotenciaCaldeira(dwt), SFC_CALDEIRA, tempoCaldeiraH);

  return {
    motorAux,
    manobra,
    caldeira,
    totalCo2MgoT: motorAux.co2MgoT + manobra.co2MgoT + caldeira.co2MgoT,
    totalCo2eT:   motorAux.co2eT   + manobra.co2eT   + caldeira.co2eT,
    classe: getClasse(dwt),
  };
}

// ── Formatting utilities ─────────────────────────────────────────────────────
export function formatarNumero(valor: number, casas = 2): string {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

export function formatarCO2(valorT: number): string {
  if (valorT >= 1000) return `${formatarNumero(valorT / 1000, 3)} kt`;
  return `${formatarNumero(valorT, 4)} t`;
}

export function calcularTempoHoras(dataInicio: string, dataFim: string): number {
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  return (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);
}

export function formatarTempo(horas: number): string {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  const dias = Math.floor(h / 24);
  const hr = h % 24;
  if (dias > 0) return `${dias}d ${hr}h ${m}min`;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
