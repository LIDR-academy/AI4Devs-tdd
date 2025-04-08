# Diagrama del Proceso TDD en el Proyecto

Este diagrama ilustra el flujo de trabajo del Desarrollo Dirigido por Pruebas (TDD) aplicado en nuestro proyecto.

Los diagramas incluidos muestran:
- El ciclo Red-Green-Refactor del TDD
- La estructura jerárquica de las pruebas implementadas
- La arquitectura del sistema de pruebas
- El flujo de los tests de inserción de candidatos
-Un mapa mental de los beneficios del TDD

## Ciclo TDD Aplicado

```mermaid
graph TD
    A[Escribir Test] -->|"Fase 1: RED"| B[Test Falla]
    B -->|"Fase 2: GREEN"| C[Implementar Código Mínimo]
    C --> D[Test Pasa]
    D -->|"Fase 3: REFACTOR"| E[Refactorizar Código]
    E --> A

    style A fill:#f9d5e5,stroke:#333,stroke-width:2px
    style B fill:#f47174,stroke:#333,stroke-width:2px
    style C fill:#d1eecc,stroke:#333,stroke-width:2px
    style D fill:#76c893,stroke:#333,stroke-width:2px
    style E fill:#acd8aa,stroke:#333,stroke-width:2px
```

## Estructura de Nuestros Tests

```mermaid
graph TB
    subgraph "Pruebas Unitarias"
        A1[Funciones Básicas] --> B1[suma.test.js]
        A1 --> B2[resta.test.js]
        A1 --> B3[prueba.test.js]
    end
    
    subgraph "Tests de Inserción de Candidatos"
        A2[Tests de Validación] --> C1[Validación Datos Básicos]
        A2 --> C2[Validación de Email]
        A2 --> C3[Validación de Educación]
        
        A3[Tests de Persistencia] --> D1[Inserción Básica]
        A3 --> D2[Inserción con Educación]
        A3 --> D3[Manejo de Errores]
    end
    
    subgraph "Técnicas de Mocking"
        M1[Mocking de Prisma] --> M2[PrismaClient Mock]
        M1 --> M3[Métodos Mockeados]
    end
    
    style A1 fill:#ffafcc,stroke:#333,stroke-width:2px
    style A2 fill:#a2d2ff,stroke:#333,stroke-width:2px
    style A3 fill:#bde0fe,stroke:#333,stroke-width:2px
    style M1 fill:#cdb4db,stroke:#333,stroke-width:2px
```

## Arquitectura del Sistema de Pruebas

```mermaid
flowchart TD
    A[Frontend Tests] --> B[Backend Tests]
    B --> C{Tipos de Tests}
    C --> D[Unitarios]
    C --> E[Validación]
    C --> F[Base de Datos]
    
    D --> G[suma/resta]
    E --> H[Candidate Validator]
    F --> I[Prisma Mock]
    
    style A fill:#f9c74f,stroke:#333,stroke-width:2px
    style B fill:#f8961e,stroke:#333,stroke-width:2px
    style C fill:#f3722c,stroke:#333,stroke-width:2px
    style D fill:#f94144,stroke:#333,stroke-width:2px
    style E fill:#577590,stroke:#333,stroke-width:2px
    style F fill:#43aa8b,stroke:#333,stroke-width:2px
```

## Flujo de Tests de Inserción de Candidatos

```mermaid
sequenceDiagram
    participant C as Cliente
    participant V as Validador
    participant S as Servicio
    participant D as BD (Mock Prisma)
    
    C->>V: Envía datos candidato
    V->>V: Valida datos
    alt Datos Inválidos
        V-->>C: Retorna errores
    else Datos Válidos
        V->>S: Procesa candidato
        S->>D: Verifica duplicados (email)
        alt Email Duplicado
            D-->>S: Error duplicado
            S-->>C: Error candidato existente
        else Email Único
            S->>D: Guarda candidato
            D-->>S: Candidato guardado
            S-->>C: Éxito
        end
    end
    
    Note over V,D: Este flujo se prueba<br/>con distintos casos en<br/>tests-ACBG.test.js
```

## Adaptación TDD a Nuestro Proyecto

```mermaid
graph LR
    A[Creación Pruebas<br/>Iniciales] --> B[Solución<br/>Problemas Configuración]
    B --> C[Implementación<br/>Tests Candidatos]
    C --> D[Refactorización<br/>y Mejoras]
    D --> E[Organización<br/>Documentación]
    
    style A fill:#ffadad,stroke:#333,stroke-width:2px
    style B fill:#ffd6a5,stroke:#333,stroke-width:2px
    style C fill:#fdffb6,stroke:#333,stroke-width:2px
    style D fill:#caffbf,stroke:#333,stroke-width:2px
    style E fill:#9bf6ff,stroke:#333,stroke-width:2px
```

## Beneficios TDD en Nuestro Proyecto

```mermaid
mindmap
  root((TDD))
    Calidad
      Menos errores
      Mejor diseño
      Documentación viva
    Confianza
      Cambios seguros
      Refactorización
    Productividad
      Feedback rápido
      Foco en requerimientos
    Mantenibilidad
      Detección temprana problemas
      Código más limpio
``` 