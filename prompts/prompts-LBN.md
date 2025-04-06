# Prompts para LBN (Logic Business Networking)

Este documento contiene los prompts utilizados para el desarrollo y pruebas de la funcionalidad LBN.

## Registro de Prompts

### Prompt #1
**Fecha y Hora:** 2025-04-06 18:16
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
Los tests se van a crear en un fichero tests-LBN.test.ts en la carpeta backend/src/tests
```

### Prompt #2
**Fecha y Hora:** 2025-04-06 18:17
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
Crear un fichero prompts-LBN.md en la carpeta prompts (en la raíz del proyecto; creala si no existe).
```

### Prompt #3
**Fecha y Hora:** 2025-04-06 18:18
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
Guarda cada prompt que escriba en el fichero de prompts y numéralos para saber el orden de cada uno, la fecha y hora en la que se ha realizado y el LLM utilizado.
Guarda los prompts anteriores y este también para empezar
```

### Prompt #4
**Fecha y Hora:** 2025-04-06 18:23
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
Eres un experto en realización de test con Jest.
Utiliza buenas prácticas en la escritura de test.
Analiza el código e indícame los test más importantes que habría que crear para dar cobertura a este proyecto.
No escribas nada. Solo indícame que test serían los ideales y yo te diré cuales implementar.
Tenemos que dar cobertura al guardado en base de datos y a la recpeción de datos desde los formularios.
Utiliza mocks para no alterar la base de datos.
Busca los casos límite para tener una buena cobertura.
Recuerda ir guardando los prompts en el fichero indicado.
```

### Prompt #5
**Fecha y Hora:** 2025-04-06 18:29
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
Crear el primer grupo de test "Tests de validación (validator.ts)"
Indícame como ejecutar los test y cual tendría que ser la salida esperada.
Recuerda actualizar el fichero de prompts
```

### Prompt #6
**Fecha y Hora:** 2025-04-06 18:34
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
Si, vamos a implementar ahora los test "Tests de servicios (candidateService.ts)".
Sigue actualizando el fichero de prompts.
```

### Prompt #7
**Fecha y Hora:** 2025-04-06 18:40
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
Este es el resultado de ejecutar npm test; aparecen los errores que añado.
Solucionalos.
```

### Prompt #8
**Fecha y Hora:** 2025-04-06 18:45
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
For the code present, we get this error:
```
Argument of type '(data: CandidateData) => void' is not assignable to parameter of type 'UnknownFunction'.
  Types of parameters 'data' and 'args' are incompatible.
    Type 'unknown' is not assignable to type 'CandidateData'.
```
How can I resolve this? If you propose a fix, please make it concise.
```

### Prompt #9
**Fecha y Hora:** 2025-04-06 18:48
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
For the code present, we get this error:
```
Argument of type '{ id: number; firstName: string; lastName: string; }' is not assignable to parameter of type 'never'.
```
How can I resolve this? If you propose a fix, please make it concise.
```

### Prompt #10
**Fecha y Hora:** 2025-04-06 18:52
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
Vamos a continuar ahora con los test "Tests para servicio de carga de archivos (fileUploadService.ts)"
```

### Prompt #11
**Fecha y Hora:** 2025-04-06 19:00
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
Vamos a continuar ahora con los test "Tests para controladores (candidateController.ts)".
Recuerda seguir aplicando buenas prácticas y seguir añadiendo los prompts al fichero de prompts
```

### Prompt #12
**Fecha y Hora:** 2025-04-06 19:15
**LLM:** Claude 3.7 Sonnet
**Prompt:**
```
Vamos ahora a por los test "Tests para modelos (Candidate.ts, Education.ts, etc.)".
Añade todos los necesarios para tener la mayor cobertura posible.
Recuerda seguir añadiendo los prompts al fichero de prompts.
Si creas un nuevo fichero para estos tests, debe contener dentro del nombre las iniciales LBN, igual que el primer fichero de test que creaste, que se llamaba tests-LBN.test.ts
```

---

## Notas adicionales
- Los prompts deben ser específicos y claros
- Incluir ejemplos concretos cuando sea posible
- Especificar los resultados esperados 