# Iteraciones en el Desarrollo de Pruebas Unitarias para CandidateService

## Iteración 1: Estructura Inicial de Pruebas

**Prompt Inicial**:
```
basandote en @candidateService.ts debes crear test unitarios en jest para la funcionalidad de insertar candidatos en base de datos, debes definir valores en base a los @validator.ts, puedes mockear la base de datos usando prisma, tienes alguna duda?
```

En la primera iteración, creamos la estructura básica de las pruebas unitarias para el servicio de candidatos. Incluimos:

- Mocks básicos de PrismaClient
- Pruebas para diferentes escenarios:
  - Inserción exitosa
  - Validación de datos inválidos
  - Manejo de email duplicado
  - Inserción con datos mínimos

**Problema Identificado**: Los mocks no implementaban correctamente el método `save()` de los modelos de dominio, lo que causaba que las pruebas fallaran.

## Iteración 2: Implementación Correcta de Mocks

**Prompt de Seguimiento**:
```
El error se genera debido a que estas usando modelos de dominio con un metodo save(), pero no se han configurado correctamente los mocks para simular ese comportamiento en las pruebas.
const savedCandidate = await candidate.save();
este metodo esta devolviendo undefined.
modifica los mocks para que implementen correctamente el metodo save ()
```

En la segunda iteración, mejoramos los mocks para simular correctamente el comportamiento de los modelos de dominio:

1. Implementación completa del método `save()` para cada modelo:
   ```typescript
   jest.mock('../domain/models/Candidate', () => {
       return {
           Candidate: jest.fn().mockImplementation((data) => ({
               ...data,
               education: [],
               workExperience: [],
               resumes: [],
               save: jest.fn().mockImplementation(async () => ({
                   id: 1,
                   ...data
               }))
           }))
       };
   });
   ```

2. Corrección del manejo de errores para el caso de email duplicado:
   ```typescript
   const mockCandidate = {
       ...candidateData,
       education: [],
       workExperience: [],
       resumes: [],
       save: jest.fn().mockRejectedValue({
           code: 'P2002',
           message: 'Unique constraint failed on the fields: (`email`)'
       })
   };
   ```

3. Actualización de las expectativas en las pruebas para verificar las llamadas a los constructores de los modelos.

## Lecciones Aprendidas

1. **Importancia de los Mocks**: Es crucial mockear correctamente todos los métodos que se utilizan en las pruebas, especialmente los métodos asíncronos como `save()`.

2. **Tipado en TypeScript**: Al trabajar con mocks en TypeScript, a veces es necesario usar conversiones de tipo (`as unknown as jest.Mock`) para manejar correctamente los tipos.

3. **Verificación de Comportamiento**: Las pruebas no solo deben verificar el resultado final, sino también el comportamiento correcto de las interacciones entre los diferentes componentes.

## Próximos Pasos Posibles

1. Agregar más casos de prueba para cubrir otros escenarios de error
2. Implementar pruebas para otros métodos del servicio de candidatos
3. Mejorar la cobertura de pruebas para incluir validaciones más específicas
4. Agregar pruebas de integración para verificar la interacción con la base de datos real 