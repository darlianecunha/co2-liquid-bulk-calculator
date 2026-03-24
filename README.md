# CO₂ Emissions Calculator — Liquid Bulk Vessels

> **Calculadora de Emissões CO₂ — Navios de Granel Líquido**
> Port stay emissions: Auxiliary Engine (OPS) · Manoeuvring · Boiler

[![Methodology](https://img.shields.io/badge/Methodology-IMO%20GHG%20Study%202020-blue)](https://www.imo.org)
[![Standard](https://img.shields.io/badge/Standard-MEPC.282(70)-green)](https://www.imo.org)
[![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey)](LICENSE)

---

## Sobre este projeto / About

Este repositório disponibiliza uma **calculadora de emissões de CO₂ para navios de granel líquido durante operações portuárias**. O cálculo cobre os três módulos de emissão durante a estadia no porto:

- **Motor Auxiliar (OPS)** — emissões durante o período de atracação no berço
- **Manobra** — emissões durante a entrada e saída do porto
- **Caldeira** — emissões da caldeira a óleo durante a estadia

This repository provides a **CO₂ emissions calculator for liquid bulk vessels during port operations**, covering the three emission modules during port stay.

> **Nota:** Esta ferramenta cobre exclusivamente navios de granel líquido (tanqueiros). A metodologia completa para múltiplos tipos de navio, o sistema de registro unitário de emissões por escala e a integração com sistemas de monitoramento portuário são parte de uma solução proprietária. Para consultas, veja a seção [Contato](#contato).

---

## Metodologia / Methodology

O cálculo segue as diretrizes do **Fourth IMO GHG Study 2020** e do regulamento **MEPC.282(70)**.

### Fórmula geral

```
Energia (kWh)    = Potência (kW) × Tempo (h)
Combustível (t)  = Energia × SFC / 1.000.000
CO₂ (t)          = Combustível × Fator de Emissão
```

### Parâmetros por módulo

| Módulo | Potência (kW) | SFC (g/kWh) | Fator CO₂ (tCO₂/t) |
|---|---|---|---|
| Motor Auxiliar (OPS) | Tabela IMO por DWT | 185 | 3,206 (MGO/MDO) |
| Manobra | Tabela IMO por DWT | 185 | 3,206 (MGO/MDO) |
| Caldeira | Tabela IMO por DWT | 320 | 3,206 (MGO/MDO) |

### Potência por classe (Granel Líquido)

**Motor Auxiliar — atracado no berço:**

| Classe | DWT | Potência (kW) |
|---|---|---|
| HANDYSIZE | até 4.999 | 250 |
| HANDYSIZE | 5.000 – 9.999 | 375 |
| HANDYSIZE | 10.000 – 19.999 | 690 |
| HANDYSIZE | 20.000 – 35.000 | 720 |
| HANDYMAX | 35.001 – 59.999 | 720 |
| PANAMAX | 60.000 – 79.999 | 620 |
| AFRAMAX | 80.000 – 119.999 | 800 |
| SUEZMAX | 120.000 – 199.999 | 2.500 |
| VLCC | 200.000 – 320.000 | 2.500 |
| ULCC | > 320.000 | 2.500 |

> Fonte: Fourth IMO GHG Study 2020, Table 23 — Auxiliary engine load factors and power.

### CO₂ equivalente (CO₂e)

Calculado conforme **MEPC.391(81)**, GWP100 IPCC AR5:

```
CO₂e = CO₂ + (28 × CH₄) + (265 × N₂O)
```

Para MGO: `CH₄ = 0,00005 tCH₄/t combustível` · `N₂O = 0,00018 tN₂O/t combustível`

---

## Tecnologias / Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)

---

## Instalação / Installation

```bash
# Clonar o repositório
git clone https://github.com/SEU-USUARIO/co2-liquid-bulk-calculator.git
cd co2-liquid-bulk-calculator

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

Acesse em `http://localhost:5173`

---

## Como usar / How to use

1. Informe o **DWT** (Deadweight Tonnage) do navio
2. Selecione as **datas de atracação e desatracação**
3. Informe as **horas de manobra** (entrada + saída do porto)
4. A calculadora retorna automaticamente:
   - CO₂ por módulo (Motor Auxiliar, Manobra, Caldeira)
   - CO₂ total em toneladas
   - CO₂ equivalente (tCO₂eq) conforme MEPC.391(81)
   - Valor de crédito de carbono estimado (R$/tCO₂)

---

## Limitações / Limitations

- Esta calculadora foi desenvolvida para **navios de granel líquido** (tanqueiros), utilizando as tabelas de potência específicas para esta categoria.
- Os valores de potência são **médias representativas por faixa de DWT**, conforme o IMO GHG Study 2020. Valores reais podem variar por navio.
- O fator de crédito de carbono é um valor de referência de mercado e não constitui cotação financeira.
- Esta ferramenta **não substitui** um inventário de emissões certificado nem relatório GHG para fins regulatórios.

---

## Referências normativas / References

- IMO (2020). *Fourth IMO GHG Study 2020 — Full Report and Annexes*. International Maritime Organization, London.
- IMO (2016). *MEPC.282(70) — 2016 Guidelines on the method of calculation of the attained EEDI for new ships*. Annex 5: Conversion factors.
- IMO (2023). *MEPC.391(81) — 2023 IMO Strategy on Reduction of GHG Emissions from Ships*.
- IPCC (2014). *Fifth Assessment Report (AR5) — GWP100 values for CH₄ and N₂O*.

---

## Sobre os autores / About

Desenvolvido por **Clóvis Oliveira, Darliane Cunha e Vitor Santos** como parte de uma plataforma de monitoramento de emissões portuárias.

Este módulo público faz parte de um sistema mais amplo de **registro unitário de emissões por escala**, que inclui rastreamento por navio, integração com dados operacionais portuários e geração de relatórios para conformidade com CSRD, GRI e regulamentos IMO.

---

## Contato / Contact

Para consultas sobre a metodologia completa, implementação em sistemas portuários, ou relatórios de emissões para fins regulatórios:

📧 **darlianerc@gmail.com**

> O sistema completo de registro e monitoramento de emissões está disponível mediante consultoria especializada.

---

## Licença / License

Este projeto está licenciado sob **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)**.

Você pode usar e compartilhar este código para fins **educacionais e de pesquisa**, com atribuição aos autores.
**Uso comercial** e criação de **obras derivadas** requerem autorização expressa.

[Ver licença completa](https://creativecommons.org/licenses/by-nc-nd/4.0/)
