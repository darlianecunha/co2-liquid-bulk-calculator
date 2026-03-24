// ============================================================
// CalculadoraGranelLiquido — CO₂ Emissions Calculator
// Liquid Bulk Vessels (Tankers)
// Modules: Auxiliary Engine (OPS) · Manoeuvring · Boiler
// Methodology: Fourth IMO GHG Study 2020 + MEPC.282(70) + MEPC.391(81)
// ============================================================

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  calcularEmissoes, calcularTempoHoras, formatarNumero, formatarCO2,
  formatarTempo, getPotenciaMotorAux, getPotenciaManobra, getPotenciaCaldeira,
  getClasse, CARGAS_GRANEL_LIQUIDO, ResultadoCompleto,
  SFC_MA, SFC_CALDEIRA, PRECO_CREDITO_CARBONO_REF,
} from "@/lib/co2-granelliquido";
import { Ship, Clock, Anchor, Leaf, Calculator, AlertCircle } from "lucide-react";

interface FormData {
  nomeNavio: string;
  imo: string;
  dwt: string;
  atracacao: string;
  desatracacao: string;
  manobraHoras: string;
  manobraMinutos: string;
}

export default function CalculadoraGranelLiquido() {
  const [resultado, setResultado] = useState<ResultadoCompleto | null>(null);
  const [carga, setCarga] = useState<string>("");
  const [creditoValor, setCreditoValor] = useState<string>(String(PRECO_CREDITO_CARBONO_REF));

  const { register, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      nomeNavio: "", imo: "", dwt: "",
      atracacao: "", desatracacao: "",
      manobraHoras: "2", manobraMinutos: "0",
    },
  });

  const w = watch();

  useEffect(() => {
    const dwt = parseFloat(w.dwt);
    if (!w.dwt || isNaN(dwt) || dwt <= 0) { setResultado(null); return; }

    let tempoAtracadoH = 0;
    if (w.atracacao && w.desatracacao) {
      const h = calcularTempoHoras(w.atracacao, w.desatracacao);
      if (h > 0) tempoAtracadoH = h;
    }
    const tempoManobraH =
      (parseFloat(w.manobraHoras || "0") || 0) +
      (parseFloat(w.manobraMinutos || "0") || 0) / 60;

    if (tempoAtracadoH === 0 && tempoManobraH === 0) { setResultado(null); return; }

    setResultado(calcularEmissoes(dwt, tempoAtracadoH, tempoManobraH, tempoAtracadoH));
  }, [w.dwt, w.atracacao, w.desatracacao, w.manobraHoras, w.manobraMinutos]);

  const dwt = parseFloat(w.dwt || "0") || 0;
  const tempoAtracadoH = (w.atracacao && w.desatracacao)
    ? Math.max(0, calcularTempoHoras(w.atracacao, w.desatracacao)) : 0;
  const tempoManobraH =
    (parseFloat(w.manobraHoras || "0") || 0) +
    (parseFloat(w.manobraMinutos || "0") || 0) / 60;
  const creditoUnitario = parseFloat(creditoValor.replace(",", ".")) || 0;
  const totalCredito = resultado ? resultado.totalCo2MgoT * creditoUnitario : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="text-center pt-6 pb-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 mb-3">
            <Ship className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Fraunces', serif" }}>
            Emissões CO₂ — Granel Líquido
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Motor Auxiliar (OPS) · Manobra · Caldeira
          </p>
          <div className="flex items-center justify-center gap-3 mt-2 text-xs text-slate-400">
            <span>IMO GHG Study 2020</span>
            <span>·</span>
            <span>MEPC.282(70)</span>
            <span>·</span>
            <span>MEPC.391(81)</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">

          {/* ── Identificação ── */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
              <Anchor className="w-3.5 h-3.5" /> Identificação do Navio
            </legend>
            <div className="space-y-1.5">
              <label htmlFor="nomeNavio" className="text-xs font-medium text-slate-700">Nome do Navio</label>
              <input id="nomeNavio" placeholder="Ex: ATLANTIC LADY"
                className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm uppercase font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...register("nomeNavio")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="imo" className="text-xs font-medium text-slate-700">IMO</label>
                <input id="imo" placeholder="Ex: 9123456"
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  {...register("imo")} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="dwt" className="text-xs font-medium text-slate-700">
                  DWT (t) <span className="text-red-500">*</span>
                </label>
                <input id="dwt" type="number" placeholder="Ex: 105000"
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  {...register("dwt", { required: true, min: 1 })} />
                {errors.dwt && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Informe o DWT
                  </p>
                )}
              </div>
            </div>
            {/* Tipo de carga */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Tipo de Carga</label>
              <select value={carga} onChange={e => setCarga(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                <option value="">Selecionar carga</option>
                {CARGAS_GRANEL_LIQUIDO.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {/* Classe automática */}
            {dwt > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 text-xs">
                <Ship className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-slate-600">Classe:</span>
                <span className="font-semibold text-blue-700">{getClasse(dwt)}</span>
                <span className="text-slate-400 ml-auto">
                  P.Aux: {getPotenciaMotorAux(dwt)} kW ·
                  P.Man: {getPotenciaManobra(dwt)} kW ·
                  P.Cald: {getPotenciaCaldeira(dwt)} kW
                </span>
              </div>
            )}
          </fieldset>

          {/* ── Crédito de Carbono ── */}
          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <Leaf className="w-3.5 h-3.5 text-green-600" /> Crédito de Carbono (referência)
            </legend>
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1.5">
                <label htmlFor="creditoValor" className="text-xs font-medium text-slate-700">Valor (R$/tCO₂)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">R$</span>
                  <input id="creditoValor" type="number" min="0" step="0.01" placeholder={String(PRECO_CREDITO_CARBONO_REF)}
                    className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-300 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    value={creditoValor} onChange={e => setCreditoValor(e.target.value)} />
                </div>
              </div>
              <div className="flex-1 bg-green-50 rounded-lg px-3 py-2 text-xs mt-5 border border-green-100">
                <p className="text-slate-500">Referência de mercado</p>
                <p className="font-mono font-semibold text-green-700">R$ {PRECO_CREDITO_CARBONO_REF.toFixed(2)} / tCO₂</p>
              </div>
            </div>
          </fieldset>

          {/* ── Módulo 1 — Motor Auxiliar ── */}
          <ModuloCard numero={1} titulo="Motor Auxiliar (OPS)" sfc={SFC_MA}
            corBorda="border-blue-200" corHeader="bg-blue-50/60" corNumero="bg-blue-600">
            <p className="text-xs text-slate-500 mb-3">
              Motor auxiliar durante todo o período de atracação no berço.
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="atracacao" className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Atracação
                </label>
                <input id="atracacao" type="datetime-local"
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  {...register("atracacao")} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="desatracacao" className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Desatracação
                </label>
                <input id="desatracacao" type="datetime-local"
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  {...register("desatracacao")} />
              </div>
              {tempoAtracadoH > 0 && (
                <InfoRow label="Tempo atracado" valor={formatarTempo(tempoAtracadoH)} cor="text-blue-600" />
              )}
            </div>
            {resultado && tempoAtracadoH > 0 && (
              <ResultadoModuloCard
                co2={resultado.motorAux.co2MgoT}
                co2e={resultado.motorAux.co2eT}
                energia={resultado.motorAux.energiaKWh}
                combustivel={resultado.motorAux.combustivelMgoT}
                cor="blue"
              />
            )}
          </ModuloCard>

          {/* ── Módulo 2 — Manobra ── */}
          <ModuloCard numero={2} titulo="Manobra" sfc={SFC_MA}
            corBorda="border-amber-200" corHeader="bg-amber-50/60" corNumero="bg-amber-500">
            <p className="text-xs text-slate-500 mb-3">
              Motor auxiliar durante a manobra de entrada/saída do porto.
              Potência específica da fase de manobra (bombas, amarração).
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="manobraHoras" className="text-xs font-medium text-slate-700">Horas</label>
                <input id="manobraHoras" type="number" min="0" placeholder="2"
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  {...register("manobraHoras")} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="manobraMinutos" className="text-xs font-medium text-slate-700">Minutos</label>
                <input id="manobraMinutos" type="number" min="0" max="59" placeholder="0"
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  {...register("manobraMinutos")} />
              </div>
            </div>
            {tempoManobraH > 0 && dwt > 0 && (
              <InfoRow label="P. Motor Aux. Manobra" valor={`${getPotenciaManobra(dwt)} kW`} cor="text-amber-600" />
            )}
            {resultado && tempoManobraH > 0 && (
              <ResultadoModuloCard
                co2={resultado.manobra.co2MgoT}
                co2e={resultado.manobra.co2eT}
                energia={resultado.manobra.energiaKWh}
                combustivel={resultado.manobra.combustivelMgoT}
                cor="amber"
              />
            )}
          </ModuloCard>

          {/* ── Módulo 3 — Caldeira ── */}
          <ModuloCard numero={3} titulo="Caldeira" sfc={SFC_CALDEIRA}
            corBorda="border-orange-200" corHeader="bg-orange-50/60" corNumero="bg-orange-500">
            <p className="text-xs text-slate-500 mb-3">
              Caldeira a óleo — SFC <strong>320 g/kWh</strong>.
              Opera durante todo o período de atracação (aquecimento de carga, limpeza de tanques).
            </p>
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">
              <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
              <p className="text-xs text-orange-800">
                <span className="font-medium">Período automático — </span>
                {tempoAtracadoH > 0
                  ? <span>mesmo tempo de atracação: <strong>{formatarTempo(tempoAtracadoH)}</strong></span>
                  : <span className="italic">informe as datas no Módulo 1</span>}
              </p>
            </div>
            {dwt > 0 && (
              <InfoRow label="Potência Caldeira" valor={`${getPotenciaCaldeira(dwt)} kW`} cor="text-orange-600" />
            )}
            {resultado && tempoAtracadoH > 0 && (
              <ResultadoModuloCard
                co2={resultado.caldeira.co2MgoT}
                co2e={resultado.caldeira.co2eT}
                energia={resultado.caldeira.energiaKWh}
                combustivel={resultado.caldeira.combustivelMgoT}
                cor="orange"
              />
            )}
          </ModuloCard>

          {/* ── Indicadores Totais ── */}
          {resultado && resultado.totalCo2MgoT > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
                  <Calculator className="w-3.5 h-3.5" /> Totais
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Barra de composição */}
              <div className="space-y-1.5">
                <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
                  {resultado.motorAux.co2MgoT > 0 && (
                    <div className="bg-blue-500" style={{ width: `${(resultado.motorAux.co2MgoT / resultado.totalCo2MgoT) * 100}%` }} />
                  )}
                  {resultado.manobra.co2MgoT > 0 && (
                    <div className="bg-amber-500" style={{ width: `${(resultado.manobra.co2MgoT / resultado.totalCo2MgoT) * 100}%` }} />
                  )}
                  {resultado.caldeira.co2MgoT > 0 && (
                    <div className="bg-orange-500" style={{ width: `${(resultado.caldeira.co2MgoT / resultado.totalCo2MgoT) * 100}%` }} />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Motor Aux.</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Manobra</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />Caldeira</span>
                </div>
              </div>

              {/* Indicadores principais */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl border-2 border-blue-200 p-3 space-y-1">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">CO₂ (t)</p>
                  <p className="font-mono font-bold text-xl text-blue-600 leading-none">
                    {formatarNumero(resultado.totalCo2MgoT, 4)}
                  </p>
                  <p className="text-xs text-slate-400">toneladas — MGO</p>
                </div>
                <div className="bg-white rounded-xl border-2 border-indigo-200 p-3 space-y-1">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">CO₂e (t)</p>
                  <p className="font-mono font-bold text-xl text-indigo-600 leading-none">
                    {formatarNumero(resultado.totalCo2eT, 4)}
                  </p>
                  <p className="text-xs text-slate-400">tCO₂eq · GWP100</p>
                </div>
                <div className="bg-white rounded-xl border-2 border-green-200 p-3 space-y-1">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Crédito CO₂</p>
                  <p className="font-mono font-bold text-xl text-green-600 leading-none">
                    R$ {formatarNumero(totalCredito)}
                  </p>
                  <p className="text-xs text-slate-400">× R$ {formatarNumero(creditoUnitario, 2)}/t</p>
                </div>
              </div>

              {/* Detalhamento por módulo */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: "Motor Aux.", co2: resultado.motorAux.co2MgoT, cor: "text-blue-600", dot: "bg-blue-500" },
                  { label: "Manobra",    co2: resultado.manobra.co2MgoT,  cor: "text-amber-600", dot: "bg-amber-500" },
                  { label: "Caldeira",   co2: resultado.caldeira.co2MgoT, cor: "text-orange-600", dot: "bg-orange-500" },
                ].map(m => (
                  <div key={m.label} className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                    <p className="text-slate-500 mb-1 flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${m.dot} inline-block`} />{m.label}
                    </p>
                    <p className={`font-mono font-semibold ${m.cor}`}>{formatarCO2(m.co2)}</p>
                    <p className="text-slate-400 mt-0.5">
                      {resultado.totalCo2MgoT > 0
                        ? (m.co2 / resultado.totalCo2MgoT * 100).toFixed(1)
                        : "0.0"}%
                    </p>
                  </div>
                ))}
              </div>

              {/* Nota CO₂e */}
              <p className="text-xs text-slate-500 bg-indigo-50/60 border border-indigo-100 rounded-lg px-3 py-2">
                <strong>CO₂e</strong> = CO₂ + 28×CH₄ + 265×N₂O — GWP100 IPCC AR5 (MEPC.391(81))
              </p>
            </div>
          )}
        </div>

        {/* ── Metodologia ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Metodologia — IMO GHG Study 2020
          </h2>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              { titulo: "Motor Auxiliar", items: ["SFC = 185 g/kWh", "Energia = P_aux × t", "MGO = E × 185 / 10⁶", "CO₂ = MGO × 3,206"] },
              { titulo: "Manobra",        items: ["SFC = 185 g/kWh", "P_manobra ≠ P_aux", "Tabela IMO por DWT", "CO₂ = MGO × 3,206"] },
              { titulo: "Caldeira",       items: ["SFC = 320 g/kWh", "P_caldeira por DWT", "Energia = P × t_berço", "CO₂ = Comb × 3,206"] },
            ].map(m => (
              <div key={m.titulo} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="font-semibold text-slate-700 mb-2">{m.titulo}</p>
                {m.items.map(i => (
                  <p key={i} className="text-slate-500 font-mono text-xs leading-relaxed">{i}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
            <span>CF MGO/MDO: <strong className="text-slate-700">3,206 tCO₂/t</strong> — MEPC.282(70)</span>
            <span>CF HFO: <strong className="text-slate-700">3,114 tCO₂/t</strong> — MEPC.282(70)</span>
            <span>Fonte potências: <strong className="text-slate-700">Fourth IMO GHG Study 2020</strong></span>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="text-center text-xs text-slate-400 pb-6 space-y-1">
          <p>Calculadora desenvolvida por Clóvis Oliveira, Darliane Cunha e Vitor Santos</p>
          <p>IMO MEPC.282(70) · Fourth IMO GHG Study 2020 · MEPC.391(81)</p>
          <p className="text-slate-300">
            Esta ferramenta cobre exclusivamente navios de granel líquido.
            Para sistemas completos de monitoramento portuário, entre em contato.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Subcomponentes ───────────────────────────────────────────────────────────

function ModuloCard({ numero, titulo, sfc, corBorda, corHeader, corNumero, children }: {
  numero: number; titulo: string; sfc: number;
  corBorda: string; corHeader: string; corNumero: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border-2 ${corBorda} overflow-hidden`}>
      <div className={`flex items-center gap-2 px-4 py-3 ${corHeader} border-b border-inherit`}>
        <div className={`w-6 h-6 rounded-full ${corNumero} flex items-center justify-center flex-shrink-0`}>
          <span className="text-xs font-bold text-white">{numero}</span>
        </div>
        <span className="text-sm font-semibold text-slate-700">{titulo}</span>
        <span className="text-xs text-slate-400 ml-auto">SFC: {sfc} g/kWh</span>
      </div>
      <div className="px-4 py-4 bg-white space-y-3">{children}</div>
    </div>
  );
}

function ResultadoModuloCard({ co2, co2e, energia, combustivel, cor }: {
  co2: number; co2e: number; energia: number; combustivel: number;
  cor: "blue" | "amber" | "orange";
}) {
  const cls = {
    blue:   { bg: "bg-blue-50/70",   text: "text-blue-700",   border: "border-blue-200"   },
    amber:  { bg: "bg-amber-50/70",  text: "text-amber-700",  border: "border-amber-200"  },
    orange: { bg: "bg-orange-50/70", text: "text-orange-700", border: "border-orange-200" },
  }[cor];

  return (
    <div className={`rounded-lg border ${cls.border} ${cls.bg} px-3 py-2.5 mt-2`}>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div>
          <p className="text-slate-500">CO₂ (t)</p>
          <p className={`font-mono font-bold ${cls.text}`}>{formatarCO2(co2)}</p>
        </div>
        <div>
          <p className="text-slate-500">CO₂e (t)</p>
          <p className="font-mono font-semibold text-indigo-600">{formatarCO2(co2e)}</p>
        </div>
        <div>
          <p className="text-slate-500">MGO (t)</p>
          <p className="font-mono font-semibold text-slate-700">{formatarNumero(combustivel, 4)}</p>
        </div>
        <div>
          <p className="text-slate-500">Energia</p>
          <p className="font-mono font-semibold text-slate-700">{formatarNumero(energia, 0)} kWh</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, valor, cor }: { label: string; valor: string; cor: string }) {
  return (
    <div className="flex justify-between items-center text-xs bg-slate-50 rounded px-2.5 py-1.5 mt-1 border border-slate-100">
      <span className="text-slate-500">{label}:</span>
      <span className={`font-mono font-semibold ${cor}`}>{valor}</span>
    </div>
  );
}
