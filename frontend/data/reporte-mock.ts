export const REPORTE_MOCK: string = `---
title: "Índice de Capacidad Varada (SCI)"
slug: "indice-capacidad-varada-2026"
version: "1.0.0"
language: "es"
description: "Medición de capacidad energizada y no productiva en centros de datos."
---

# Metadatos del Reporte

**Autor:** Dr. Hernan Cortez  
**Fecha:** Octubre 2026  
**DOI:** physaflow/sci-2026-001  
**Tiempo de lectura:** 8 min  
**Licencia:** CC BY-SA 4.0  

---

# 01 — Resumen

El **Índice de Capacidad Varada (SCI)** mide la capacidad de un centro de datos que está pagada y energizada, pero que no produce trabajo útil.

El estudio identifica un **31,4% de capacidad no productiva** y clasifica sus causas en tres capas principales:

- **Instalaciones (14,8%)**
- **TI (9,7%)**
- **Carga de trabajo (6,9%)**

---

# 02 — Introducción

El PUE (Power Usage Effectiveness) permite conocer la eficiencia energética a nivel de infraestructura eléctrica y climatización, pero no indica si los servidores activos están ejecutando tareas de cómputo reales. 

El **SCI** complementa esta perspectiva midiendo la capacidad que permanece subutilizada en todas las fases operativas.

---

# 03 — Descripción general de la taxonomía

La taxonomía se organiza por la capa física donde se origina el fallo. Cada capa tiene sus propios operadores e instrumentación.

## L1 — Capa de instalaciones
*Energía · Refrigeración · Espacio*

La capa de instalaciones es todo lo que hay entre el medidor de la empresa de servicios públicos y el PDU del rack.

- **F-01 (4,2%) — Deriva del pasillo frío**
  - **Qué se ve:** Racks que reportan temperaturas de entrada conformes mientras el aire de retorno de los CRAH sube 2–4 °C por encima del punto de consigna.
  - **Cuánto cuesta:** CRAH sobredimensionados; ~6–9% de los kW de enfriadores gastados en enfriar aire que nunca llega al servidor.
  - **Por qué ocurre:** Paneles de contención instalados según diseño; adiciones posteriores de racks rompen el plano de presión.

- **F-02 (6,1%) — Sobresuscripción térmica**
  - **Qué se ve:** Racks descalificados por el operador de TI para mantenerse bajo un techo térmico que la instalación no puede sostener.
  - **Cuánto cuesta:** kW contratados disponibles pero inalcanzables.
  - **Por qué ocurre:** Refrigeración diseñada para una densidad media que ya no refleja la carga de trabajo.

- **F-03 (4,5%) — Aprovisionamiento en sombra**
  - **Qué se ve:** Capacidad de interruptor reservada para un despliegue futuro de racks que no ha ocurrido 12+ meses después.
  - **Cuánto cuesta:** Cargos por demanda por capacidad que no genera ingresos.
  - **Por qué ocurre:** Contratos de adquisición que recompensan la capacidad reservada sin liberarla.

## L2 — Capa de TI
*Racks · Nodos · Topología*

La capa de TI es todo lo que hay entre el PDU del rack y el programador de cargas de trabajo.

- **I-01 (3,8%) — Racks comatosos**
  - **Qué se ve:** Racks completamente poblados que consumen energía de base sin ninguna carga despachada durante 30+ días.
  - **Cuánto cuesta:** Amortización de gasto en silicio muerto; ~12% de kW de placa consumidos continuamente.
  - **Por qué ocurre:** La descomisión requiere tickets de gestión de cambios que nadie posee.

- **I-02 (2,9%) — Nodos durmientes**
  - **Qué se ve:** Nodos marcados como disponibles por el orquestador pero excluidos de la programación por fallos de salud.
  - **Cuánto cuesta:** El clúster parece estar al 80% mientras el 20% de los nodos están oscuros.
  - **Por qué ocurre:** El orquestador reporta nodos registrados, no programables.

- **I-03 (3,0%) — Bloqueo de topología**
  - **Qué se ve:** Existe cómputo libre en dos pods, pero la carga debe esperar porque la red no transporta el flujo.
  - **Cuánto cuesta:** La utilización efectiva es menor que la física; la cola de programación crece.
  - **Por qué ocurre:** Topología Clos diseñada para ancho de banda este-oeste de generación anterior.

## L3 — Capa de carga de trabajo
*Programación · Orquestación*

La capa de carga de trabajo es todo lo que hay entre el programador y la aplicación.

- **W-01 (3,1%) — Asignaciones huérfanas**
  - **Qué se ve:** VMs o pods reservados contra una cuota pero produciendo cero tráfico durante semanas.
  - **Cuánto cuesta:** Cuota agotada para nuevos inquilinos mientras los existentes mantienen asignaciones no utilizadas.
  - **Por qué ocurre:** Ningún propietario libera capacidad por temor a necesitarla mañana.

- **W-02 (2,2%) — Inanición por afinidad**
  - **Qué se ve:** La carga no se programa por reglas de afinidad demasiado restrictivas.
  - **Cuánto cuesta:** Aumenta la espera en cola; adquisición aprueba nuevos nodos innecesarios.
  - **Por qué ocurre:** Reglas de afinidad escritas en el despliegue v1 que nunca se revisan.

- **W-03 (1,6%) — Latencia de marea**
  - **Qué se ve:** Capacidad aprovisionada para un pico diario de 30–90 minutos; el resto del día el silicio está inactivo.
  - **Cuánto cuesta:** Capital desplegado contra una curva de marea al precio del pico.
  - **Por qué ocurre:** Adquisición y programación funcionan con relojes y objetivos desconectados.

---

# 04 — Metodología

El SCI combina telemetría en tiempo real de instalaciones, registros del programador de cargas de trabajo y entrevistas directas a operadores.

> **Nota Metodológica:** Los fallos debían ser observables en al menos dos fuentes para formar parte de la taxonomía.

---

# 05 — Figuras

Visualización cuantitativa de los hallazgos principales del índice de capacidad varada.

\`\`\`chart
{
  "chartType": "bar",
  "meta": {
    "title": "Capacidad varada por modo de fallo",
    "description": "Porcentaje de kW energizados asociados a cada modo de fallo."
  },
  "xKey": "name",
  "data": [
    { "name": "Deriva del pasillo frío", "value": 4.2 },
    { "name": "Sobresuscripción térmica", "value": 6.1 },
    { "name": "Aprovisionamiento en sombra", "value": 4.5 },
    { "name": "Racks comatosos", "value": 3.8 },
    { "name": "Nodos durmientes", "value": 2.9 },
    { "name": "Bloqueo de topología", "value": 3.0 },
    { "name": "Asignaciones huérfanas", "value": 3.1 },
    { "name": "Inanición por afinidad", "value": 2.2 },
    { "name": "Latencia de marea", "value": 1.6 }
  ]
}
\`\`\`

\`\`\`chart
{
  "chartType": "pie",
  "meta": {
    "title": "Capacidad varada por capa",
    "description": "Distribución de los principales modos de fallo entre las tres capas del centro de datos."
  },
  "nameKey": "layer",
  "valueKey": "value",
  "data": [
    { "layer": "Instalaciones", "value": 14.8 },
    { "layer": "TI", "value": 9.7 },
    { "layer": "Carga de trabajo", "value": 6.9 }
  ]
}
\`\`\`

\`\`\`chart
{
  "chartType": "line",
  "meta": {
    "title": "Capacidad varada acumulada, 2020–2026",
    "description": "Evolución anual del porcentaje de kW energizados considerados capacidad varada."
  },
  "xKey": "year",
  "data": [
    { "year": "2020", "value": 3 },
    { "year": "2021", "value": 5 },
    { "year": "2022", "value": 9 },
    { "year": "2023", "value": 16 },
    { "year": "2024", "value": 26 },
    { "year": "2025", "value": 31.4 },
    { "year": "2026", "value": 38 }
  ]
}
\`\`\`

---

# 06 — Conclusión

La capacidad varada no es un único problema, sino un conjunto de fallos distribuidos entre instalaciones, TI y carga de trabajo. El SCI propone un lenguaje común para identificar estos problemas y mejorar el aprovechamiento de la capacidad existente.

---

# 07 — Cómo citar

**Fuente:** *PhysaFlow Stranded Capacity Index*  
**Licencia:** CC BY-SA 4.0.`;
