/**
 * Mock data source for the PhysaFlow assistant chat.
 *
 * Contains the Stranded Capacity Index study in Markdown, including the
 * quantitative data behind every chart (FACILITY / IT / WORKLOAD layers,
 * PUE context, failure-mode medians and the 2020-2026 accumulated series)
 * as plain JSON blocks so the AI can reason over the exact numbers.
 */
export const REPORTE_MOCK: string = `# El Índice de Capacidad Varada (SCI)

**Subtítulo:** Una taxonomía nominal de infraestructura pagada, energizada y no productiva en las tres capas físicas del centro de datos moderno: instalaciones, TI y carga de trabajo.

**Autor:** Dr. Hernan Cortez
**Fecha de publicación:** Octubre 2026
**DOI:** physaflow/sci-2025-001
**Tiempo de lectura:** ~22 minutos
**Licencia:** CC BY-SA 4.0

---

## Métricas de Impacto Global

\`\`\`json
{
  "globalMedian": "31,4%",
  "lossFacilities": "14,8%",
  "lossIT": "9,7%",
  "lossWorkload": "6,9%",
  "keyFinding": "El 31,4% de la capacidad energizada pagada en instalaciones hiperescala no produce ningún cómputo útil en una hora determinada.",
  "sampleSites": 41,
  "sampleGigawatts": "4,2 GW de carga IT energizada",
  "dataCollectionMonths": 18,
  "operatorInterviews": 63
}
\`\`\`

**Hallazgo clave:** El 31,4% de la capacidad energizada pagada en instalaciones hiperescala no produce ningún cómputo útil en una hora determinada.

---

## Contexto PUE (referencia del estudio)

\`\`\`json
{
  "pueDefinition": "PUE = Energía total de la instalación / Energía entregada a los equipos de TI. Mide cuánta de la energía comprada llegó a los servidores.",
  "pueLimitation": "El PUE no captura si los servidores hicieron algo útil. Un sitio con PUE excelente puede tener la mayor parte de su capacidad TI varada.",
  "referencePueValues": {
    "hiperescalaEficiente": "1,10 - 1,25",
    "colocacionPromedio": "1,30 - 1,50",
    "instalacionesLegadas": "> 1,50"
  },
  "sciRelationToPue": "El Índice de Capacidad Varada (SCI) complementa al PUE: el PUE describe la eficiencia del viaje de la energía hacia la TI; el SCI describe cuánta de esa energía TI produce cómputo útil."
}
\`\`\`

---

## Taxonomía: Tres Capas, Nueve Fallos con Nombre

La taxonomía se organiza por la capa física donde se origina el fallo. Cada capa tiene sus propios operadores, su propia instrumentación y su propio lenguaje. Un fallo en una capa suele manifestarse como un síntoma en la capa superior.

### Capa 1 — Facilities (Instalaciones: Energía · Refrigeración · Espacio)

Todo lo que hay entre el medidor de la empresa de servicios públicos y el PDU del rack. Sus operadores miden el éxito en tiempo de actividad, PUE y cumplimiento térmico — ninguno captura si los kilovatios están haciendo un trabajo útil.

#### F-01: Deriva del pasillo frío — mediana 4,2%
- **Qué se ve:** Racks que reportan temperaturas de entrada conformes mientras el aire de retorno de los CRAH sube 2–4 °C por encima del punto de consigna en un lado de la sala.
- **Cuánto cuesta:** CRAH sobredimensionados para compensar; ~6–9% de los kW de enfriadores gastados en enfriar aire que nunca llega a una entrada de servidor.
- **Por qué ocurre:** Paneles de contención instalados según el diseño construido; adiciones posteriores de racks rompen el plano de presión. La deriva es invisible para el BMS hasta que se activa un punto caliente.

#### F-02: Sobresuscripción térmica — mediana 6,1%
- **Qué se ve:** Racks descalificados por el operador de TI para mantenerse bajo un techo térmico que la instalación fue contratada para entregar pero no puede sostener.
- **Cuánto cuesta:** kW contratados disponibles pero inalcanzables. El operador reporta "no hay energía disponible" mientras el medidor de la empresa muestra margen.
- **Por qué ocurre:** Instalación vendida con kW IT de placa; refrigeración diseñada para una densidad media de racks que ya no refleja la carga de trabajo desplegada.

#### F-03: Aprovisionamiento en sombra — mediana 4,5%
- **Qué se ve:** Capacidad de interruptor energizada reservada para un despliegue futuro de racks que no ha ocurrido 12+ meses después de la puesta en servicio.
- **Cuánto cuesta:** Cargos por demanda por capacidad que no genera ingresos; coste de oportunidad de los PDUs, UPS y refrigeración mantenidos en reserva.
- **Por qué ocurre:** Los contratos de adquisición recompensan la capacidad reservada; no existe un mecanismo para liberar interruptores energizados pero no utilizados.

### Capa 2 — IT (Infraestructura: Racks · Nodos · Topología)

Todo lo que hay entre el PDU del rack y el programador de cargas de trabajo. Sus operadores miden el éxito en tiempo de actividad de los nodos y disponibilidad de la red — ninguno captura si el silicio está haciendo un trabajo útil.

#### I-01: Racks comatosos — mediana 3,8%
- **Qué se ve:** Racks completamente poblados que consumen energía de base (PSUs en reposo, BMCs, ventiladores) sin ninguna carga de trabajo despachada durante 30+ días consecutivos.
- **Cuánto cuesta:** Amortización del gasto de capital en silicio muerto; ~12% de los kW de placa consumidos continuamente sin salida.
- **Por qué ocurre:** La descomisión requiere tickets de gestión de cambios que nadie posee. Racks permanecen "en servicio" porque nadie está incentivado a sacarlos.

#### I-02: Nodos durmientes — mediana 2,9%
- **Qué se ve:** Nodos marcados como "disponibles" por el orquestador pero excluidos de la programación — fallan en las comprobaciones de salud, están mal etiquetados o en un segmento de red aislado.
- **Cuánto cuesta:** El clúster parece estar al 80% de utilización mientras el 20% de los nodos están oscuros. La expansión de capacidad se aprueba contra un denominador falso.
- **Por qué ocurre:** El orquestador reporta nodos "registrados", no nodos "programables". La diferencia es invisible para los planificadores de capacidad.

#### I-03: Bloqueo de topología — mediana 3,0%
- **Qué se ve:** Existe cómputo libre en dos pods, pero una carga de trabajo que podría caber en cualquiera de ellos debe esperar — porque la topología de red entre ellos no puede transportar el flujo.
- **Cuánto cuesta:** La utilización efectiva es menor que la utilización física. La cola de programación crece mientras la capacidad permanece inactiva detrás de una red troncal sobresuscrita.
- **Por qué ocurre:** Topología Clos diseñada para el ancho de banda este-oeste de una generación anterior. Los flujos de entrenamiento de IA expusieron la suposición de que no todos los racks hablan con todos los racks al mismo tiempo.

### Capa 3 — Workload (Carga de trabajo: Programación · Orquestación)

Todo lo que hay entre el programador y la aplicación. Sus operadores de software miden el éxito en profundidad de la cola y cumplimiento de SLA — ninguno captura si la capacidad reservada está haciendo un trabajo útil.

#### W-01: Asignaciones huérfanas — mediana 3,1%
- **Qué se ve:** VMs, pods o slots de contenedores reservados contra una cuota pero produciendo cero peticiones, cero tráfico, cero salida de registros durante semanas.
- **Cuánto cuesta:** Cuota agotada para nuevos inquilinos mientras los existentes mantienen asignaciones no utilizadas. Expansión de capacidad impulsada por cuota, no por demanda.
- **Por qué ocurre:** Ningún propietario quiere ser quien libere capacidad que podría necesitar mañana. Las asignaciones huérfanas son una opción, no un error — hasta que se acumulan.

#### W-02: Inanición por afinidad — mediana 2,2%
- **Qué se ve:** La carga de trabajo no puede programarse a pesar de la capacidad libre — las reglas de afinidad (tipo de GPU, NUMA, localidad, nivel de licencia) restringen demasiado el gráfico de colocación.
- **Cuánto cuesta:** La espera en cola aumenta; los usuarios perciben una escasez de capacidad. La adquisición aprueba nuevos nodos que no habrían sido necesarios con restricciones relajadas.
- **Por qué ocurre:** Las reglas de afinidad son escritas por ingenieros en el momento del despliegue y nunca se revisitan. La restricción que era correcta en la v1 sobrevive hasta la v4.

#### W-03: Latencia de marea — mediana 1,6%
- **Qué se ve:** Capacidad aprovisionada para un pico diario o semanal que dura 30–90 minutos. Las otras 22 horas, el silicio está caliente, inactivo y facturado al pico.
- **Cuánto cuesta:** Capital desplegado contra una curva de marea; no puede liberarse de vuelta a la capa de instalaciones entre mareas. La forma más cara de capacidad varada por kilovatio.
- **Por qué ocurre:** La adquisición y la programación de cargas de trabajo funcionan con relojes diferentes. La instalación no puede reducir la potencia entre mareas; el programador no puede predecir la próxima marea.

---

## Datos de los Gráficos

### Figura 2 — Capacidad varada por modo de fallo con nombre (% de kW energizados)

\`\`\`json
[
  { "name": "Deriva del pasillo frío", "value": 4.2, "layer": "L1 - Instalaciones" },
  { "name": "Sobresuscripción térmica", "value": 6.1, "layer": "L1 - Instalaciones" },
  { "name": "Aprovisionamiento en sombra", "value": 4.5, "layer": "L1 - Instalaciones" },
  { "name": "Racks comatosos", "value": 3.8, "layer": "L2 - TI" },
  { "name": "Nodos durmientes", "value": 2.9, "layer": "L2 - TI" },
  { "name": "Bloqueo de topología", "value": 3.0, "layer": "L2 - TI" },
  { "name": "Asignaciones huérfanas", "value": 3.1, "layer": "L3 - Carga de trabajo" },
  { "name": "Inanición por afinidad", "value": 2.2, "layer": "L3 - Carga de trabajo" },
  { "name": "Latencia de marea", "value": 1.6, "layer": "L3 - Carga de trabajo" }
]
\`\`\`

### Figura 3 — Capacidad varada acumulada, 2020–2026 (% de kW energizados)

\`\`\`json
[
  { "year": "2020", "value": 3.0 },
  { "year": "2021", "value": 5.0 },
  { "year": "2022", "value": 9.0 },
  { "year": "2023", "value": 16.0 },
  { "year": "2024", "value": 26.0 },
  { "year": "2025", "value": 31.4 },
  { "year": "2026", "value": 38.0 }
]
\`\`\`

---

## 01 — Resumen

### El impuesto oculto del cómputo moderno.

Un centro de datos es una pila de tres contratos negociados: energía con la empresa de servicios públicos, racks con el operador de TI y programación con el propietario de la carga de trabajo. Cada capa se aprovisiona para el pico máximo de la capa superior, y cada capa mide la utilización en función de su propio denominador. El resultado es una sobrecarga compuesta que nunca se ha nombrado, medido o valorado como un fenómeno único.

Este informe presenta el **Índice de Capacidad Varada (SCI)**, una taxonomía de nueve modos de fallo con nombre distribuidos en tres capas físicas. La taxonomía pretende ser un vocabulario común para los operadores de instalaciones, arquitectos de TI y programadores de cargas de trabajo — las tres comunidades cuyos incentivos actualmente no están alineados.

---

## 02 — Introducción

### Por qué existe este informe.

Durante la última década, la conversación sobre la eficiencia de los centros de datos ha estado dominada por una única métrica: PUE. El PUE te dice cuánta de la energía que compraste llegó realmente a los servidores. No te dice si esos servidores hicieron algo útil. A medida que aumenta la densidad, que los clústeres de GPU reemplazan a las granjas de CPU y que los plazos de aprovisionamiento se alargan hasta años, la pregunta más interesante se ha movido un nivel más arriba: *de la capacidad que pagamos y energizamos, ¿cuánta está produciendo realmente trabajo?*

La respuesta, extraída de entrevistas con operadores y datos de instalaciones medidos recopilados para este informe, es incómoda. En los 41 sitios hiperescala y de colocación muestreados, el sitio mediano reporta **31,4% de la capacidad energizada como no productiva** en cualquier hora dada — pagada, encendida, consumiendo energía de base y sin producir ningún cómputo útil.

> "No tenemos un problema de energía. Tenemos un problema de coordinación disfrazado de problema de energía."
> — Director de Infraestructura, hiperescalador de nivel 1 (anonimizado)

La tesis de este informe es que la capacidad varada no es un problema con una única solución. Es una familia de nueve modos de fallo distintos, cada uno con su propia firma, su propio coste y su propia causa raíz — distribuidos en las tres capas físicas de la instalación. Hasta que la industria tenga un nombre común para cada uno de ellos, los operadores seguirán describiendo fenómenos diferentes con la misma palabra, y el capital seguirá desplegándose contra la capa equivocada.

---

## 04 — Metodología

### Cómo se construyó el índice.

El Índice de Capacidad Varada sintetiza tres fuentes de evidencia: telemetría de instalaciones medida, datos de exportación del programador y entrevistas estructuradas a operadores. Cada modo de fallo en la taxonomía debe ser observable en al menos dos de las tres fuentes para ser retenido.

1. **Ingesta de telemetría:** kW por PDU, temperatura de entrada por rack y energía BMC por nodo con resolución de 5 minutos en 41 sitios durante 18 meses. Se muestrearon 4,2 GW de carga IT energizada.
2. **Exportación del programador:** Instantáneas del estado del orquestador (Kubernetes, Slurm, propietario) con resolución de 1 minuto. Captura nodos registrados vs. programables, profundidad de cola y conjunto de reglas de afinidad.
3. **Entrevistas a operadores:** 63 entrevistas estructuradas entre propietarios de instalaciones, TI y cargas de trabajo. Cada modo de fallo nombrado en la taxonomía fue validado contra el lenguaje de trabajo utilizado por los operadores.
4. **Nombramiento y revisión por pares:** Cada modo de fallo nombrado fue revisado por al menos tres operadores de diferentes organizaciones. Los nombres se retuvieron solo cuando al menos dos tercios estuvieron de acuerdo en que el término coincidía con su vocabulario de trabajo
**Limitaciones.** La muestra se inclina hacia operadores hiperescala y de colocación grandes; los sitios periféricos y empresariales están subrepresentados. La cifra principal del 31,4% es una mediana de la muestra, no una estimación poblacional — los intervalos de confianza se reportan por modo de fallo en el conjunto de datos descargable.

---

## 06 — Cómo citar

Este informe se publica bajo CC BY-SA 4.0. Se requiere atribución para cualquier uso derivado, incluida la redistribución de figuras. Fuente obligatoria: "Source: PhysaFlow Stranded Capacity Index".`;
