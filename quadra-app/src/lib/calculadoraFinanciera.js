/**
 * QUADRA — MOTOR FINANCIERO CORE
 * Normativa colombiana vigente año gravable 2026 (DIAN)
 * Basado en Resolución 238/2025, Decreto 1625/2016, Decreto 572/2025
 */

export const CONSTANTES_2026 = {
  UVT: 52374,
  SMMLV: 1750905,
  UMBRAL_DECLARANTE_UVT: 1400, // 73.324.000 COP
  UMBRAL_RETENCION_11_UVT: 3300, // 172.834.200 COP
  TOPE_IBC_SMMLV: 25,
};

/**
 * Calcula todas las obligaciones y reservas sobre un ingreso específico.
 * @param {number} pagoBruto - Valor nominal en la moneda acordada
 * @param {string} moneda - 'COP', 'USD', 'EUR'
 * @param {number} tasaCambio - Si es diferente a COP
 * @param {object} profile - Perfil del usuario (regimen, tipo_ingreso, retencion, pila)
 * @param {object} kpis - Datos acumulados en el año (ytd, retencionesYTD, etc)
 */
export function calcularPago(pagoBruto, moneda, tasaCambio, profile, kpis) {
  // 1. CONVERSIÓN DE MONEDA
  const pago_cop = moneda === 'COP' ? pagoBruto : Math.round(pagoBruto * tasaCambio);
  
  if (pago_cop === 0) {
    return { pago_cop: 0, retencion: 0, pila: 0, reserva: 0, disponible: 0, warnings: [] };
  }

  const acumulado_año = kpis?.ytd || 0;
  const retenciones_año = kpis?.retencionesYTD || 0;
  const mes_actual = new Date().getMonth() + 1; // 1 a 12
  
  // Perfil por defecto seguros
  const regimen = profile?.regimen || 'ordinario';
  const tipo_ingreso = profile?.tipo_ingreso || 'honorarios';
  const cotiza_pila = profile?.pila || 'auto';
  
  let retencion = 0;
  let pila = 0;
  let reserva = 0;
  const warnings = [];

  // ==========================================
  // MÓDULO 1 — RETENCIÓN EN LA FUENTE
  // ==========================================
  if (regimen === 'simple') {
    // SIMPLE no sufre retención en la fuente de forma directa
    retencion = 0;
  } else if (pago_cop >= (2 * CONSTANTES_2026.UVT)) {
    if (tipo_ingreso === 'servicios') {
      const tarifaUsu = parseFloat(profile?.retencion) || 4; // 4% declarante, 6% no declarante
      retencion = Math.round(pago_cop * (tarifaUsu / 100));
    } else {
      // Honorarios
      const umbral_jump = CONSTANTES_2026.UMBRAL_RETENCION_11_UVT * CONSTANTES_2026.UVT;
      if ((acumulado_año + pago_cop) > umbral_jump) {
        retencion = Math.round(pago_cop * 0.11);
        warnings.push({ id: 'RET_11', msg: 'Has superado 3300 UVT. Tu retención ahora es del 11%.' });
      } else {
        const tarifaUsu = parseFloat(profile?.retencion) || 10;
        retencion = Math.round(pago_cop * (tarifaUsu / 100));
      }
    }
  } else {
    warnings.push({ id: 'RET_EXENTA', msg: 'Pago menor a 2 UVT. Exento de retención.' });
  }

  // ==========================================
  // MÓDULO 2 — SALUD Y PENSIÓN (PILA)
  // ==========================================
  if (cotiza_pila !== 'no') {
    let IBC = pago_cop * 0.40;
    
    // Regla de mínimo
    if (IBC < CONSTANTES_2026.SMMLV) {
      IBC = CONSTANTES_2026.SMMLV;
      warnings.push({ id: 'PILA_MIN', msg: 'Se aplicó IBC mínimo (1 SMMLV)' });
    }
    // Regla de máximo
    const techoIBC = CONSTANTES_2026.TOPE_IBC_SMMLV * CONSTANTES_2026.SMMLV;
    if (IBC > techoIBC) IBC = techoIBC;

    const salud = Math.round(IBC * 0.125);
    const pension = Math.round(IBC * 0.160);
    pila = salud + pension;
  } else {
    warnings.push({ id: 'NO_PILA', msg: 'Perfil configurado para NO reservar PILA automáticamente.' });
  }

  // ==========================================
  // MÓDULO 3 y 5 — RESERVA RENTA / SIMPLE
  // ==========================================
  const mesesProyectados = Math.max(mes_actual, 1);
  const proyeccion_anual = ((acumulado_año + pago_cop) / mesesProyectados) * 12;

  if (regimen === 'simple') {
    // Tarifas anticipo bimestral Régimen Simple 2026 (Servicios)
    let tarifaSimple = 0.02;     // Hasta 89M
    if (proyeccion_anual > 994000000) tarifaSimple = 0.037;
    else if (proyeccion_anual > 454000000) tarifaSimple = 0.035;
    else if (proyeccion_anual > 214000000) tarifaSimple = 0.033;
    else if (proyeccion_anual > 89000000) tarifaSimple = 0.028;

    reserva = Math.round(pago_cop * tarifaSimple);
  } else {
    // Régimen Ordinario: Reserva Renta (Tabla progresiva Art 241)
    const umbralTotalIngresos = CONSTANTES_2026.UMBRAL_DECLARANTE_UVT * CONSTANTES_2026.UVT;
    const declararaRenta = proyeccion_anual >= umbralTotalIngresos || profile?.es_declarante;

    if (declararaRenta) {
      // 25% Renta exenta teórica aproximada
      const renta_gravable = proyeccion_anual * 0.75;
      const uvtGravable = renta_gravable / CONSTANTES_2026.UVT;
      
      let impuestoUVT = 0;
      if (uvtGravable > 31000) {
        impuestoUVT = (uvtGravable - 31000) * 0.39 + 10352;
      } else if (uvtGravable > 18970) {
        impuestoUVT = (uvtGravable - 18970) * 0.37 + 5901;
      } else if (uvtGravable > 8670) {
        impuestoUVT = (uvtGravable - 8670) * 0.35 + 2296;
      } else if (uvtGravable > 4100) {
        impuestoUVT = (uvtGravable - 4100) * 0.33 + 788;
      } else if (uvtGravable > 1700) {
        impuestoUVT = (uvtGravable - 1700) * 0.28 + 116;
      } else if (uvtGravable > 1090) {
        impuestoUVT = (uvtGravable - 1090) * 0.19;
      }

      const impuestoEstimado = impuestoUVT * CONSTANTES_2026.UVT;
      
      // Se le resta todo lo que ya le han retenido en el año + esta nueva retención
      const saldoAPagar = Math.max(impuestoEstimado - (retenciones_año + retencion), 0);
      
      // Guardamos la proporción necesaria lineal sobre este pago
      const porcentajeReserva = proyeccion_anual > 0 ? (saldoAPagar / proyeccion_anual) : 0;
      reserva = Math.round(pago_cop * porcentajeReserva);
    } else {
      warnings.push({ id: 'RENTA_BAJA', msg: 'Se estima que no estarás obligado a declarar renta este año.' });
      reserva = 0;
    }
  }

  // ==========================================
  // DISPONIBLE REAL
  // ==========================================
  const disponible = Math.max(pago_cop - retencion - pila - reserva, 0);

  return {
    pago_cop,
    retencion,
    pila,
    reserva,
    disponible,
    proyeccion_anual: Math.round(proyeccion_anual),
    warnings
  };
}
