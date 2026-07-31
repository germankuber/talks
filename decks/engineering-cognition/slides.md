---
marp: true
theme: kuber
paginate: true
size: 16:9
footer: 'Engineering Cognition'
---

<!-- _class: lead -->
<!-- _paginate: false -->
<!-- _footer: '' -->

# Engineering Cognition

## Diseñando Sistemas Agénticos Confiables

<div class="byline">

**Germán Küber**
@germankuber

</div>

---

<!-- _class: divider -->
<!-- _paginate: false -->

## 01

# El Problema

---

# Cada semana construimos:

- Más agentes
- Más prompts
- Más herramientas
- Más contexto

---

<!-- _class: section -->

# Pero de alguna manera...

---

<!-- _class: section -->

# El sistema empeora.

---

# Le echamos la culpa a lo que no es.

- "Necesitamos un mejor prompt."
- "Necesitamos GPT-6."
- "Necesitamos Claude."
- "Necesitamos un mejor RAG."

---

<!-- _class: split -->

# Dos Mundos

<div class="cols">
<div>

### Software Tradicional

```
Requerimientos
      ↓
   Funciones
      ↓
    Objetos
      ↓
     Tests
```

**Esto es ingeniería.**

</div>
<div>

### Sistemas Agénticos

```
   Prompt
      ↓
    LLM
      ↓
   Magia
      ↓
     🤞
```

**Esto no es ingeniería.**

</div>
</div>

---

# El Problema Oculto

- Todo agente tiene una **carga cognitiva**
- Más decisiones que tomar
- **Peor desempeño**

---

# Imaginá un solo ingeniero que:

- Diseñe la arquitectura
- Revise la base de datos
- Escriba la API
- Piense en escalabilidad
- Genere la documentación

---

<!-- _class: section -->

# Todo al mismo tiempo.

---

<!-- _class: section -->

# ¿Esperarías buenos resultados?

---

# Los agentes de IA no son distintos.

- El problema **no** es la inteligencia

---

<!-- _class: section -->

# Demasiadas decisiones.

---

<!-- _class: divider -->
<!-- _paginate: false -->

## 02

# El Principio

---

<!-- _class: section -->

# Nuevo Principio

> Reducir la carga cognitiva de cada decisión.

---

<!-- _class: section -->

# No modeles agentes.

## Modelá decisiones.

---

<!-- _class: section -->

# Agente de Datos

## Detectar entidades afectadas

---

<!-- _class: section -->

# Agente de Arquitectura

## Identificar servicios impactados

---

<!-- _class: section -->

# Agente de Documentación

## Representar decisiones validadas

---

<!-- _class: section -->

# Es la decisión.

---

# Las decisiones producen artefactos

- `Artefacto != Inteligencia`
- Son la **evidencia observable** de una decisión

---

# Lo que significa...

No evaluamos artefactos.

**Evaluamos decisiones.**

---

<!-- _class: divider -->
<!-- _paginate: false -->

## 03

# TDD para Agentes

---

<!-- _class: split -->

# TDD para Sistemas Agénticos

<div class="cols">
<div>

### Tradicional

```
Escribir Test
      ↓
Escribir Código
```

</div>
<div>

### Agéntico

```
Definir Decisión
       ↓
  Definir Eval
       ↓
Implementar Agente
```

</div>
</div>

---

# Los evals pasan a ser...

**La especificación.**

No el prompt.

---

# Podés reemplazar:

- `GPT` → `Claude` → `Gemini`
- → **Código Determinista**

---

<!-- _class: section -->

# Sin cambiar tu arquitectura.

---

<!-- _class: divider -->
<!-- _paginate: false -->

## 04

# La Arquitectura

---

# Knowledge First

```
    Fuentes
       ↓
  Conocimiento
       ↓
   Recuperación
```

---

# Conocimiento Compartido

- Cada especialista lee **el mismo conocimiento**
- No el mismo *documento*

---

# Playbooks de Dominio

- Cada dominio sabe cómo investigar
- No inventa preguntas
- **Ejecuta experiencia**

---

# Tres Capas

```
Decisiones
    ↓
Evidencia
    ↓
Representación
```

---

<!-- _class: section -->

# Nunca las mezcles.

---

# Reconciliación

- No muevas evidencia
- **Mové decisiones**
- Traé la evidencia sólo cuando haga falta

---

# Escritura

- El escritor **nunca debería volver a pensar**
- Sólo representa decisiones ya validadas

---

# Arquitectura Final

```
   Conocimiento
        ↓
  Motores de Decisión
        ↓
   Grafo de Decisiones
        ↓
    Representación
```

---

<!-- _class: divider -->
<!-- _paginate: false -->

## 05

# Cierre

---

<!-- _class: section -->

# Engineering Cognition

- **Arquitectura** > Prompt
- **Contexto** > Tokens
- **Decisiones** > Agentes

---

<!-- _class: section -->

# Décadas alrededor de funciones y objetos.

---

<!-- _class: section -->

# Ahora...

---

<!-- _class: impact -->
<!-- _footer: '' -->
<!-- _paginate: false -->

# Decisiones

---

<!-- _class: lead -->
<!-- _footer: '' -->

# Gracias

## ¿Preguntas?
