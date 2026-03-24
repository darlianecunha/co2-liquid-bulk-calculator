# CO₂ Emissions Calculator — Liquid Bulk Vessels

> Port stay emissions: Auxiliary Engine (OPS) · Manoeuvring · Boiler

[![Live](https://img.shields.io/badge/Live-co2--liquid--bulk--calculator.vercel.app-brightgreen)](https://co2-liquid-bulk-calculator.vercel.app)
[![Methodology](https://img.shields.io/badge/Methodology-IMO%20GHG%20Study%202020-blue)](https://www.imo.org)
[![Standard](https://img.shields.io/badge/Standard-MEPC.282(70)-green)](https://www.imo.org)

---

## About

This repository provides a **CO₂ emissions calculator for liquid bulk vessels (tankers) during port operations**, covering the three emission modules during port stay:

- **Auxiliary Engine (OPS)** — emissions during the full berthing period
- **Manoeuvring** — emissions during port entry and exit
- **Boiler** — emissions from the oil-fired boiler during the berthing period

> **Note:** This tool covers liquid bulk vessels only. The complete methodology for multiple vessel types, the unit-based emissions registry system, and the port monitoring integration are part of a proprietary solution. See [Contact](#contact) for enquiries.

---

## Methodology

Calculations follow the **Fourth IMO GHG Study 2020** and regulation **MEPC.282(70)**.

### General formula

```
Energy (kWh)   = Power (kW) × Time (h)
Fuel (t)       = Energy × SFC / 1,000,000
CO₂ (t)        = Fuel × Emission Factor
```

### Parameters by module

| Module | Power (kW) | SFC (g/kWh) | CO₂ Factor (tCO₂/t) |
|---|---|---|---|
| Auxiliary Engine (OPS) | IMO table by DWT | 185 | 3.206 (MGO/MDO) |
| Manoeuvring | IMO table by DWT | 185 | 3.206 (MGO/MDO) |
| Boiler | IMO table by DWT | 320 | 3.206 (MGO/MDO) |

### Power by vessel class (Liquid Bulk)

**Auxiliary Engine — at berth:**

| Class | DWT | Power (kW) |
|---|---|---|
| HANDYSIZE | up to 4,999 | 250 |
| HANDYSIZE | 5,000 – 9,999 | 375 |
| HANDYSIZE | 10,000 – 19,999 | 690 |
| HANDYSIZE | 20,000 – 35,000 | 720 |
| HANDYMAX | 35,001 – 59,999 | 720 |
| PANAMAX | 60,000 – 79,999 | 620 |
| AFRAMAX | 80,000 – 119,999 | 800 |
| SUEZMAX | 120,000 – 199,999 | 2,500 |
| VLCC | 200,000 – 320,000 | 2,500 |
| ULCC | > 320,000 | 2,500 |

> Source: Fourth IMO GHG Study 2020, Table 23 — Auxiliary engine load factors and power.

### CO₂ equivalent (CO₂e)

Calculated in accordance with **MEPC.391(81)**, GWP100 IPCC AR5:

```
CO₂e = CO₂ + (28 × CH₄) + (265 × N₂O)
```

For MGO: `CH₄ = 0.00005 tCH₄/t fuel` · `N₂O = 0.00018 tN₂O/t fuel`

---

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/co2-liquid-bulk-calculator.git
cd co2-liquid-bulk-calculator

# Install dependencies
npm install

# Start in development mode
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## How to Use

1. Enter the vessel's **DWT** (Deadweight Tonnage)
2. Select the **berthing and unberthing dates/times**
3. Enter the **manoeuvring hours** (port entry and exit)
4. The calculator automatically returns:
   - CO₂ per module (Auxiliary Engine, Manoeuvring, Boiler)
   - Total CO₂ in tonnes
   - CO₂ equivalent (tCO₂eq) per MEPC.391(81)
   - Estimated carbon credit value (R$/tCO₂)

---

## Limitations

- This calculator is designed for **liquid bulk vessels (tankers)**, using the power tables specific to this vessel category.
- Power values are **representative averages by DWT range**, as per the IMO GHG Study 2020. Actual values may vary by vessel.
- The carbon credit factor is a market reference value and does not constitute a financial quotation.
- This tool **does not replace** a certified emissions inventory or a GHG report for regulatory purposes.

---

## Normative References

- IMO (2020). *Fourth IMO GHG Study 2020 — Full Report and Annexes*. International Maritime Organization, London.
- IMO (2016). *MEPC.282(70) — 2016 Guidelines on the method of calculation of the attained EEDI for new ships*. Annex 5: Conversion factors.
- IMO (2023). *MEPC.391(81) — 2023 IMO Strategy on Reduction of GHG Emissions from Ships*.
- IPCC (2014). *Fifth Assessment Report (AR5) — GWP100 values for CH₄ and N₂O*.

---

## About

The platform was developed by **Darliane Cunha**. The emissions calculation methodology was developed by **Clóvis Oliveira, Darliane Cunha and Vitor Santos**.

This public module is part of a broader system for **unit-based emissions registration per vessel call**, which includes per-vessel tracking, integration with port operational data, and report generation for CSRD, GRI, and IMO regulatory compliance.

---

## Contact

For enquiries regarding the complete methodology, implementation in port systems, or emissions reports for regulatory purposes:

📧 **darlianerc@gmail.com**

> The complete emissions registration and monitoring system is available through specialist consultancy.

