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

---

## Notas adicionales
- Los prompts deben ser específicos y claros
- Incluir ejemplos concretos cuando sea posible
- Especificar los resultados esperados 