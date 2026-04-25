/**
 * QUADRA — MOTOR FINANCIERO CORE
 * Normativa colombiana vigente año gravable 2026 (DIAN)
 * Basado en Resolución 238/2025, Decreto 1625/2016, Decreto 572/2025
 *
 * Constantes fiscales leídas desde variables de entorno (.env).
 * Actualizar VITE_SMMLV y VITE_UVT cada 1 de enero con los nuevos decretos.
 */

export const CONSTANTES = {
  UVT:                     Number(import.meta.env.VITE_UVT)                     || 52374,
  SMMLV:                   Number(import.meta.env.VITE_SMMLV)                   || 1750905,
  UMBRAL_DECLARANTE_UVT:   Number(import.meta.env.VITE_UMBRAL_DECLARANTE_UVT)   || 1400,
  UMBRAL_RETENCION_11_UVT: Number(import.meta.env.VITE_UMBRAL_RETENCION_11_UVT) || 3300,
  TOPE_IBC_SMMLV:          Number(import.meta.env.VITE_TOPE_IBC_SMMLV)          || 25,
  // Aportes sobre IBC (independientes — Decreto 1601/2024)
  PILA_SALUD:    0.125,   // 12.5%
  PILA_PENSION:  0.160,   // 16%
  PILA_ARL_N1:   0.00522, // 0.522% riesgo nivel I (teletrabajo / oficina)
};

// Alias de compatibilidad con código existente
export const CONSTANTES_2026 = CONSTANTES;

/**
 * Calcula todas las obligaciones y reservas sobre un ingreso específico.
 *
 * La PILA es una obligación MENSUAL, no por pago. Por eso recibe el contexto
 * del mes en curso (ingresosMesActual, pilaReservadaMes) y calcula únicamente
 * el delta que falta reservar en este pago, evitando cobros absurdos en pagos
 * pequeños cuando el mínimo SMMLV ya fue cubierto por pagos previos.
 *
 * @param {number} pagoBruto         - Valor nominal en la moneda acordada
 * @param {string} moneda            - 'COP' | 'USD' | 'EUR'
 * @param {number} tasaCambio        - Factor de conversión a COP
 * @param {object} profile           - Perfil fiscal del usuario
 * @param {object} kpis              - KPIs acumulados del año y mes actual
 */
export function calcularPago(pagoBruto, moneda, tasaCambio, profile, kpis) {
  // ── 1. CONVERSIÓN DE MONEDA ─────────────────────────────────────────────────
  const pago_cop = moneda === 'COP' ? pagoBruto : Math.round(pagoBruto * tasaCambio);

  if (pago_cop === 0) {
    return {
      pago_cop: 0, retencion: 0, pila: 0, reserva: 0, disponible: 0, warnings: [],
      pilaDetalle: null, retencionDetalle: null,
    };
  }

  const acumulado_año  = kpis?.ytd              || 0;
  const retenciones_año = kpis?.retencionesYTD  || 0;
  const mes_actual     = new Date().getMonth() + 1; // 1-12

  // Contexto mensual para PILA acumulativa
  const ingresosMesActual  = kpis?.ingresosMesActual  || 0;
  const pilaReservadaMes   = kpis?.pilaReservadaMes   || 0;

  const regimen      = profile?.regimen      || 'ordinario';
  const tipo_ingreso = profile?.tipo_ingreso || 'honorarios';
  const cotiza_pila  = profile?.pila         || 'auto';
  const is_exempt    = profile?.is_pila_exempt || false;

  let retencion = 0;
  let pila      = 0;
  let reserva   = 0;
  const warnings = [];
  /** Aportes mensuales sobre IBC; lo reservado en *este* pago es el delta. */
  let pilaDetalle = null;

  // ── 2. RETENCIÓN EN LA FUENTE ───────────────────────────────────────────────
  if (regimen === 'simple') {
    retencion = 0; // Régimen Simple no sufre retención directa
  } else if (pago_cop >= (2 * CONSTANTES.UVT)) {
    if (tipo_ingreso === 'servicios') {
      const tarifa = parseFloat(profile?.retencion) || 4; // 4% declarante, 6% no declarante
      retencion = Math.round(pago_cop * (tarifa / 100));
    } else {
      // Honorarios: salta a 11% al cruzar 3300 UVT acumulados en el año
      const umbral_11 = CONSTANTES.UMBRAL_RETENCION_11_UVT * CONSTANTES.UVT;
      if ((acumulado_año + pago_cop) > umbral_11) {
        retencion = Math.round(pago_cop * 0.11);
        warnings.push({ id: 'RET_11', msg: 'Has superado 3.300 UVT acumulados. Tu retención ahora es del 11%.' });
      } else {
        const tarifa = parseFloat(profile?.retencion) || 10;
        retencion = Math.round(pago_cop * (tarifa / 100));
      }
    }
  } else {
    warnings.push({ id: 'RET_EXENTA', msg: 'Pago menor a 2 UVT — exento de retención en la fuente.' });
  }

  // ── 3. SALUD, PENSIÓN Y ARL (PILA) — LÓGICA MENSUAL ACUMULATIVA ────────────
  //
  // La obligación PILA se calcula sobre el IBC del MES COMPLETO (40% del total
  // de ingresos mensuales). En este pago sólo se reserva el delta que aún falta
  // por cubrir, evitando el problema de "primer pago del mes paga todo el mínimo".
  if (cotiza_pila !== 'no' && !is_exempt) {
    const ingresosTotalesMes = ingresosMesActual + pago_cop;
    let ibcMensual = ingresosTotalesMes * 0.40;

    // Piso legal: IBC nunca inferior a 1 SMMLV
    if (ibcMensual < CONSTANTES.SMMLV) {
      ibcMensual = CONSTANTES.SMMLV;
      warnings.push({ id: 'PILA_MIN', msg: 'IBC mínimo aplicado (1 SMMLV). Tus ingresos del mes aún no cubren el mínimo de cotización.' });
    }

    // Techo: IBC no puede superar 25 SMMLV
    const techoIBC = CONSTANTES.TOPE_IBC_SMMLV * CONSTANTES.SMMLV;
    if (ibcMensual > techoIBC) ibcMensual = techoIBC;

    // Aportes sobre IBC mensual total
    const salud   = Math.round(ibcMensual * CONSTANTES.PILA_SALUD);
    const pension = Math.round(ibcMensual * CONSTANTES.PILA_PENSION);
    const arl     = Math.round(ibcMensual * CONSTANTES.PILA_ARL_N1);
    const pilaObligacionMensual = salud + pension + arl; // ~29.022%

    // Solo reservar el delta que falta (lo ya reservado en pagos anteriores del mes no se vuelve a cobrar)
    pila = Math.max(pilaObligacionMensual - pilaReservadaMes, 0);

    pilaDetalle = {
      ibc: ibcMensual,
      salud,
      pension,
      arl,
      obligacionMensual: pilaObligacionMensual,
      yaReservadoMes: pilaReservadaMes,
      reservadoEstePago: pila,
    }

    if (pila > pago_cop * 0.5) {
      warnings.push({
        id: 'PILA_ALTA',
        msg: 'Tu seguridad social del mes supera el 50% de este pago. El disponible se ajusta al mínimo.',
      });
    }
  } else {
    if (is_exempt) {
      warnings.push({ id: 'PILA_EXENTA', msg: 'Perfil marcado como exento de PILA (pensionado o doble cotización).' });
    } else {
      warnings.push({ id: 'NO_PILA', msg: 'Perfil configurado para no reservar PILA automáticamente.' });
    }
  }

  // ── 4. RESERVA RENTA (RÉGIMEN ORDINARIO / SIMPLE) ──────────────────────────
  const mesesProyectados  = Math.max(mes_actual, 1);
  const proyeccion_anual  = ((acumulado_año + pago_cop) / mesesProyectados) * 12;

  if (regimen === 'simple') {
    // Anticipos bimestrales Régimen Simple 2026 (actividades de servicios)
    let tarifaSimple = 0.020; // hasta 89M
    if (proyeccion_anual > 994000000)      tarifaSimple = 0.037;
    else if (proyeccion_anual > 454000000) tarifaSimple = 0.035;
    else if (proyeccion_anual > 214000000) tarifaSimple = 0.033;
    else if (proyeccion_anual > 89000000)  tarifaSimple = 0.028;

    reserva = Math.round(pago_cop * tarifaSimple);
  } else {
    // Régimen Ordinario: tabla progresiva Art. 241 ET
    const umbralDeclarante = CONSTANTES.UMBRAL_DECLARANTE_UVT * CONSTANTES.UVT;
    const debeDeclarar     = proyeccion_anual >= umbralDeclarante || profile?.es_declarante;

    if (debeDeclarar) {
      // 25% renta exenta aproximada; base gravable = 75% del ingreso proyectado
      const renta_gravable = proyeccion_anual * 0.75;
      const uvtGravable    = renta_gravable / CONSTANTES.UVT;

      let impuestoUVT = 0;
      if (uvtGravable > 31000)      impuestoUVT = (uvtGravable - 31000) * 0.39 + 10352;
      else if (uvtGravable > 18970) impuestoUVT = (uvtGravable - 18970) * 0.37 + 5901;
      else if (uvtGravable > 8670)  impuestoUVT = (uvtGravable - 8670)  * 0.35 + 2296;
      else if (uvtGravable > 4100)  impuestoUVT = (uvtGravable - 4100)  * 0.33 + 788;
      else if (uvtGravable > 1700)  impuestoUVT = (uvtGravable - 1700)  * 0.28 + 116;
      else if (uvtGravable > 1090)  impuestoUVT = (uvtGravable - 1090)  * 0.19;

      const impuestoEstimado = impuestoUVT * CONSTANTES.UVT;
      const saldoAPagar      = Math.max(impuestoEstimado - (retenciones_año + retencion), 0);
      const porcentajeReserva = proyeccion_anual > 0 ? (saldoAPagar / proyeccion_anual) : 0;

      reserva = Math.round(pago_cop * porcentajeReserva);
    } else {
      warnings.push({ id: 'RENTA_BAJA', msg: 'Se estima que no estarás obligado a declarar renta este año.' });
      reserva = 0;
    }
  }

  // ── 5. DISPONIBLE REAL ──────────────────────────────────────────────────────
  // Truncado a 0 si las deducciones superan el pago (edge case pagos pequeños).
  const disponible = Math.max(pago_cop - retencion - pila - reserva, 0);

  const retencionDetalle = retencion > 0
    ? { tasaSobreBrutoPct: Math.round((retencion / pago_cop) * 1000) / 10 }
    : null

  return {
    pago_cop,
    retencion,
    pila,
    reserva,
    disponible,
    proyeccion_anual: Math.round(proyeccion_anual),
    warnings,
    pilaDetalle,
    retencionDetalle,
  };
}
