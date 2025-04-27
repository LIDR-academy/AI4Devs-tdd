# Prompts para Implementación de Tests JCC

```
Como experto en TDD y testing javascript crea los siguientes casos de pruebas unitarias:
```

## 1. Tests de Recepción de Datos del Formulario

### 1.1 Validación de Datos Básicos
```
Implementa tests que verifiquen:
- La validación de campos requeridos (nombre, apellido, email)
- El formato correcto del email
- La validación del número de teléfono
- La validación de la dirección
```

### 1.2 Validación de Educación
```
Implementa tests que verifiquen:
- La validación de campos requeridos en educación (institución, título)
- El formato correcto de las fechas
- La validación de la relación entre fechas de inicio y fin
- El manejo de múltiples registros de educación
```

### 1.3 Validación de Experiencia Laboral
```
Implementa tests que verifiquen:
- La validación de campos requeridos en experiencia laboral (empresa, puesto)
- El formato correcto de las fechas
- La validación de la relación entre fechas de inicio y fin
- El manejo de múltiples registros de experiencia
```

### 1.4 Validación de Archivos
```
Implementa tests que verifiquen:
- La validación del tipo de archivo del CV
- El tamaño máximo permitido del archivo
- El manejo de errores en la subida de archivos
```

## 2. Tests de Guardado en Base de Datos

### 2.1 Guardado de Datos Básicos
```
Implementa tests que verifiquen:
- El guardado correcto de datos básicos del candidato
- El manejo de campos opcionales
- La validación de restricciones de la base de datos
```

### 2.2 Guardado de Educación
```
Implementa tests que verifiquen:
- El guardado correcto de registros de educación
- La relación correcta con el candidato
- El manejo de múltiples registros
- La integridad referencial
```

### 2.3 Guardado de Experiencia Laboral
```
Implementa tests que verifiquen:
- El guardado correcto de registros de experiencia laboral
- La relación correcta con el candidato
- El manejo de múltiples registros
- La integridad referencial
```

### 2.4 Manejo de Errores
```
Implementa tests que verifiquen:
- El manejo de errores de validación
- El manejo de errores de base de datos
- El manejo de errores de archivos
- La consistencia de la base de datos en caso de error
```

## 3. Configuración del Entorno de Pruebas

### 3.1 Configuración de Jest
```
Configura Jest para:
- Usar el entorno de Node.js
- Configurar los mocks necesarios
- Configurar los timeouts apropiados
```

### 3.2 Configuración de Mocks
```
Configura los mocks para:
- Operaciones de archivos
```

## 4. Mejores Prácticas

### 4.1 Estructura de Tests
```
Sigue estas mejores prácticas:
- Usa describe() para agrupar tests relacionados
- Usa it() para casos de prueba individuales
- Usa beforeEach() y afterEach() para configuración y limpieza
- Usa expect() para aserciones claras y descriptivas
```

### 4.2 Cobertura de Tests
```
Asegura una buena cobertura:
- Apunta a una cobertura mínima del 80%
- Cubre casos de éxito y error
- Prueba casos límite
- Prueba casos de uso realistas
```

### 4.3 Mantenibilidad
```
Escribe tests mantenibles:
- Usa nombres descriptivos para tests
- Mantén los tests simples y enfocados
- Evita la duplicación de código
```