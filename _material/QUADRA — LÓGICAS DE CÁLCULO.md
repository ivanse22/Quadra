QUADRA — LÓGICAS DE CÁLCULO
Normativa colombiana vigente año gravable 2026
Fuente: DIAN Resolución 238/2025 · Decreto 1625/2016 · Decreto 572/2025
Salario mínimo 2026: $1.750.905 | UVT 2026: $52.374

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÓDULO 1 — RETENCIÓN EN LA FUENTE

Cuándo aplica:
La retención se practica cuando el pago individual supera $104.748 (2 UVT).
Por debajo de ese monto, NO se practica retención.

Tarifas según tipo de ingreso:

HONORARIOS Y COMISIONES (Art. 392 E.T.)
Esta es la modalidad más común del freelancer colombiano que factura
por prestación de servicios profesionales o creativos.

  Caso A — Persona natural, pagos anuales acumulados ≤ 3.300 UVT
  ($172.834.200 en 2026):
  → Tarifa: 10% sobre el valor total del pago
  → Sin base mínima: se retiene desde el primer peso

  Caso B — Persona natural, pagos anuales acumulados > 3.300 UVT
  ($172.834.200 en 2026):
  → Tarifa: 11% sobre el valor total del pago
  → El agente retenedor cambia de 10% a 11% cuando supera ese umbral

  Caso C — Persona jurídica (empresa contratante):
  → Tarifa: 11% siempre, sin importar el monto

SERVICIOS GENERALES (cuando el contratante clasifica el pago
como "servicio" en lugar de "honorario"):

  Declarante de renta:      4% sobre el pago
  No declarante de renta:   6% sobre el pago
  Base mínima: $104.748 (2 UVT) — por debajo no hay retención

NOTA PARA LA APP:
El usuario define en su perfil si sus ingresos son por
"honorarios" o "servicios". La lógica cambia según esa elección.
El tipo más común para diseñadores, developers y creativos es HONORARIOS.

Comportamiento acumulado en el año:
La app debe acumular los pagos registrados en el año.
Cuando el acumulado supere $172.834.200 (3.300 UVT),
la tarifa cambia automáticamente de 10% a 11% para todos
los pagos siguientes en ese año gravable.

Cálculo:
  retención = pago_bruto × tarifa_retencion
  Ejemplo: $2.000.000 × 10% = $200.000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÓDULO 2 — SALUD Y PENSIÓN (PILA)

Quién está obligado:
Todo trabajador independiente con ingresos mensuales iguales
o superiores a 1 SMMLV ($1.750.905).

Paso 1 — Calcular el IBC (Ingreso Base de Cotización):
  IBC = 40% del ingreso mensual neto

  Regla de mínimo:
  Si el 40% del ingreso < $1.750.905 → IBC = $1.750.905 (mínimo obligatorio)

  Regla de máximo:
  IBC no puede superar 25 SMMLV = $43.772.625

  Ejemplo con $2.000.000 brutos:
  40% de $2.000.000 = $800.000 → Menor al mínimo
  → IBC aplicado = $1.750.905 (mínimo)

  Ejemplo con $5.000.000 brutos:
  40% de $5.000.000 = $2.000.000 → Mayor al mínimo
  → IBC aplicado = $2.000.000

Paso 2 — Calcular los aportes:
  Salud:   12,5% del IBC
  Pensión: 16,0% del IBC
  Total PILA: 28,5% del IBC

  Ejemplo con IBC mínimo ($1.750.905):
  Salud:   $218.863
  Pensión: $280.145
  Total:   $499.008

  Ejemplo con IBC = $2.000.000:
  Salud:   $250.000
  Pensión: $320.000
  Total:   $570.000

Periodicidad:
  El independiente paga PILA mensualmente.
  La app debe acumular la reserva de cada pago registrado
  y permitir registrar el desembolso real cuando el usuario pague.

Nota sobre el "ingreso neto":
  El decreto establece que el IBC se calcula sobre los ingresos
  "netos" (después de costos y gastos de la actividad).
  Para simplificar, Quadra toma el ingreso bruto del pago
  como base del 40%, con una nota aclaratoria al usuario.
  Si el usuario quiere ajustar costos, puede modificar
  el ingreso neto manualmente en la configuración.

Cálculo:
  IBC = MAX(pago_bruto × 0.40, 1.750905)
  IBC = MIN(IBC, 43.772.625)
  salud = IBC × 0.125
  pension = IBC × 0.16
  total_pila = salud + pension

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÓDULO 3 — RESERVA PARA DECLARACIÓN DE RENTA

Para qué sirve:
Quadra aparta una porción de cada pago para cubrir el impuesto
de renta que el usuario deberá pagar en la declaración.
Esto no es una obligación de retención — es una reserva
de planificación financiera. El nombre correcto para el usuario
es "Reserva de renta", no "anticipo de impuesto".

Quiénes deben declarar renta (año gravable 2026):
  Ingresos brutos ≥ $73.324.000 en el año (1.400 UVT)
  O patrimonio bruto > $235.683.000

Si el usuario no supera ese umbral, la app debe informarlo
y hacer la reserva opcional.

Cálculo del impuesto estimado (tabla Art. 241 E.T. — UVT 2026 $52.374):
  La tabla es progresiva y se aplica sobre la renta gravable del año.
  La renta gravable aproximada = ingresos brutos − retenciones − deducciones

  Rangos (en pesos con UVT 2026 = $52.374):
  $0              a $57.107.660   → 0% (renta exenta ≤ 1.090 UVT)
  $57.107.660     a $89.035.800   → 19% sobre el exceso de 1.090 UVT
  $89.035.800     a $214.733.400  → 28% sobre exceso de 1.700 UVT + 116 UVT
  $214.733.400    a $454.382.580  → 33% sobre exceso de 4.100 UVT + 788 UVT
  $454.382.580    a $994.106.580  → 35% sobre exceso de 8.670 UVT + 2.296 UVT
  $994.106.580    a $1.623.594.000→ 37% sobre exceso de 18.970 UVT + 5.901 UVT
  $1.623.594.000+ → En adelante   → 39% sobre exceso de 31.000 UVT + 10.352 UVT

Estrategia de cálculo en la app (simplificado pero correcto):
  1. Proyectar el ingreso anual: promedio de pagos del año × meses restantes
  2. Estimar renta gravable: ingreso_anual × 0.75
     (el 25% es renta exenta aproximada — Art. 206 E.T. hasta 240 UVT)
  3. Aplicar la tabla progresiva sobre la renta gravable estimada
  4. Restar las retenciones ya practicadas en el año
  5. El resultado es el impuesto estimado a pagar en la declaración
  6. Ese valor dividido entre los meses restantes del año
     = cuota mensual a reservar

Reserva por pago (cálculo simplificado para mostrar por pago):
  porcentaje_reserva = impuesto_anual_estimado / ingreso_anual_proyectado
  reserva_este_pago = pago_bruto × porcentaje_reserva

  El porcentaje varía según el nivel de ingresos del usuario.
  Rangos orientativos para mostrar al usuario:
  Ingresos anuales < $57M   → 0% (no hay impuesto estimado)
  $57M – $89M               → ~3–5% reserva sugerida
  $89M – $215M              → ~5–10% reserva sugerida
  $215M+                    → >10% reserva sugerida

Nota importante:
  Este es un estimado — la declaración real depende de deducciones,
  otras rentas y gastos del usuario. La app siempre debe mostrar
  una advertencia: "Esto es un estimado. Consulta a un contador
  para tu declaración definitiva."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÓDULO 4 — CÁLCULO INTEGRADO (EL NÚCLEO DE QUADRA)

Este es el cálculo que ocurre cuando el usuario registra un pago.
Todos los módulos anteriores se ejecutan en secuencia.

Variables de entrada (el usuario las define en su perfil):
  - tipo_ingreso: "honorarios" | "servicios"
  - es_declarante: booleano (si acumula > 1.400 UVT al año)
  - pago_bruto: número en COP
  - moneda_pago: "COP" | "USD" | "EUR" | otra
  - tasa_cambio: número (si moneda ≠ COP)
  - acumulado_año: suma de pagos anteriores en el año
  - ingreso_neto_ajustado: opcional (para el IBC, si el usuario
    quiere restar costos)

Variables de configuración del perfil:
  - porcentaje_retencion: 10% | 11% | 3.5% | 4% | 6%
    (el usuario confirma en el onboarding el que le aplican)
  - cotiza_pila: "auto" | "manual" | "no"
  - regimen: "ordinario" | "simple"

Paso a paso del cálculo:

  1. CONVERSIÓN DE MONEDA (si aplica)
     pago_cop = pago_bruto × tasa_cambio
     (si moneda = COP → pago_cop = pago_bruto)

  2. RETENCIÓN EN LA FUENTE
     Si pago_cop < $104.748 → retencion = 0
     Si pago_cop ≥ $104.748:
       Verificar si acumulado_año + pago_cop > $172.834.200
       Si sí → tarifa = 11%
       Si no → tarifa = porcentaje_retencion del perfil
     retencion = pago_cop × tarifa

  3. PILA (si cotiza_pila ≠ "no")
     IBC = MAX(pago_cop × 0.40, 1.750.905)
     IBC = MIN(IBC, 43.772.625)
     salud = IBC × 0.125
     pension = IBC × 0.16
     total_pila = salud + pension

  4. RESERVA DE RENTA
     proyeccion_anual = (acumulado_año + pago_cop) /
                        (mes_actual / 12)
     renta_gravable_estimada = proyeccion_anual × 0.75
     impuesto_estimado = aplicar_tabla_241(renta_gravable_estimada)
     impuesto_ya_retenido = suma_retenciones_año
     saldo_impuesto = MAX(impuesto_estimado − impuesto_ya_retenido, 0)
     porcentaje_reserva = saldo_impuesto / proyeccion_anual
     reserva_renta = pago_cop × porcentaje_reserva

  5. DISPONIBLE REAL
     disponible = pago_cop − retencion − total_pila − reserva_renta

  6. ACTUALIZAR ACUMULADOS
     acumulado_año += pago_cop
     retenciones_año += retencion
     reserva_acumulada += reserva_renta
     pila_reservada += total_pila

Resultado a mostrar al usuario:
  Pago bruto recibido:        $2.000.000
  − Retención en la fuente:   −$200.000   (10%)
  − Salud y pensión:          −$499.008   (IBC mínimo)
  − Reserva de renta:         −$0         (ingresos bajo umbral)
  ─────────────────────────────────────
  Lo que realmente es tuyo:   $1.300.992

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÓDULO 5 — RÉGIMEN SIMPLE (caso alternativo)

Si el usuario tributa en Régimen Simple (SIMPLE):

  La retención en la fuente NO aplica — el SIMPLE la reemplaza.
  En cambio, el usuario paga una tarifa unificada de anticipo bimestral.

  Tarifas SIMPLE para tiendas y prestadores de servicios (2026):
  Ingresos hasta $89M anuales (1.700 UVT):       2.0%
  $89M a $214M (1.700 a 4.100 UVT):              2.8%
  $214M a $454M (4.100 a 8.670 UVT):             3.3%
  $454M a $994M (8.670 a 18.970 UVT):            3.5%
  $994M en adelante:                              3.7%

  En la app, si el usuario indica "Régimen Simple":
  → No se muestra ni calcula retención en la fuente
  → Se muestra el anticipo SIMPLE estimado en su lugar
  → PILA sigue aplicando igual
  → La reserva de renta se reemplaza por el anticipo bimestral SIMPLE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÓDULO 6 — ESTADOS Y CASOS ESPECIALES

Pago en USD o EUR:
  - El usuario registra el monto en la moneda extranjera
  - La app solicita la tasa de cambio del día (manual o via API)
  - Todo el cálculo se hace en COP
  - Se muestra en pantalla: "USD 500 × $4.000 = $2.000.000 COP"

Pago menor a $104.748 (2 UVT):
  - No hay retención
  - PILA sí aplica si el IBC mínimo obliga
  - Reserva de renta sigue acumulando
  - Mostrar aviso: "Este pago no genera retención en la fuente"

Primer pago del año (acumulado = 0):
  - Tarifa de retención: 10% (honorarios) hasta que
    acumulado supere $172.834.200
  - Reserva de renta: calcular desde el primer pago

Usuario que no cotiza PILA ("todavía no"):
  - Se omite el módulo 2
  - Se muestra un aviso en la pantalla de resultado:
    "No estás cotizando salud y pensión. Recuerda que es
    obligatorio si ganas más de $1.750.905 al mes."

Usuario que ya pagó PILA del mes:
  - El usuario puede marcar PILA como "ya pagada" para ese mes
  - La app no duplica la reserva
  - En el disponible real se muestra: "PILA del mes ya pagada ✓"

Cambio de tarifa mid-year (10% → 11%):
  - La app detecta cuando acumulado_año + pago_actual
    supera $172.834.200
  - Notifica al usuario: "Este pago supera el umbral de
    3.300 UVT. La retención cambia a 11% a partir de ahora."
  - Aplica 11% a ese pago y a todos los siguientes del año

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÓDULO 7 — DATOS QUE LA APP DEBE PERSISTIR

Por usuario:
  - regimen: "ordinario" | "simple"
  - tipo_ingreso: "honorarios" | "servicios"
  - porcentaje_retencion_perfil: número
  - cotiza_pila: "auto" | "manual" | "no"

Por año gravable:
  - acumulado_ingresos_año: COP
  - acumulado_retenciones_año: COP
  - reserva_renta_acumulada: COP
  - pila_reservada_acumulada: COP
  - pila_pagada_acumulada: COP
  - tarifa_retencion_activa: 10% | 11%

Por pago registrado:
  - fecha
  - pago_bruto_cop
  - moneda_original + tasa_cambio
  - cliente
  - retencion_aplicada
  - pila_reservada
  - reserva_renta_aplicada
  - disponible_real

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADVERTENCIAS LEGALES PARA MOSTRAR EN LA APP

1. En el resultado de cada cálculo:
   "Este cálculo es un estimado basado en la información
   de tu perfil. Para tu declaración de renta definitiva,
   consulta a un contador público certificado."

2. En la sección de reserva de renta:
   "La reserva de renta es una herramienta de planificación.
   No reemplaza el pago real de impuestos ante la DIAN."

3. En la sección de PILA:
   "Recuerda que el pago de salud y pensión es tu
   responsabilidad como trabajador independiente.
   Quadra reserva, pero el pago lo haces tú directamente
   en tu operador de planilla (SOI, Aportes en Línea, etc.)"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUENTES NORMATIVAS

- UVT 2026: $52.374 — DIAN Resolución 000238 del 15 dic 2025
- SMMLV 2026: $1.750.905 — Decreto 2613 de 2024
- Retención honorarios: Art. 392 E.T. + Art. 1.2.4.3.1 Decreto 1625/2016
- Retención servicios: Decreto 572 del 28 may 2025 (redujo base de 4 a 2 UVT)
- PILA independientes: Decreto 780 de 2016 (IBC = 40% ingreso, mínimo 1 SMMLV)
- Tarifas PILA: Salud 12.5% + Pensión 16% (Art. 204 Ley 100/1993 modificado)
- Tabla de renta: Art. 241 E.T. (vigente sin modificación en 2026)
- Obligados a declarar: Art. 592 E.T. — umbral 1.400 UVT = $73.324.000