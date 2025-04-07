# Prompt para Claude 3.7 utilizando el modo thinking, agent y anexando como contexto el README.md de la raíz

Como experto en prompts enginnering, buenas y optimas practicas de prompting, adicionalmente como experto en TDD, Jest y testing construye un prompt utilizando las siguientes instrucciones "Tu misión será crear una suite de tests unitarios en Jest para la funcionalidad de insertar candidatos en base de datos." y devuelve el resultado en el archivo @prompts-SRG.md 

# Prompt para Claude 3.7 utilizando el modo agent

## Contexto
Estás trabajando en un sistema de seguimiento de talento que utiliza Express como backend, Prisma como ORM y TypeScript como lenguaje de programación. Necesitas crear una suite completa de tests unitarios para la funcionalidad de inserción de candidatos en la base de datos.

## Objetivo
Tu misión es crear una suite de tests unitarios en Jest que verifique exhaustivamente la funcionalidad de insertar candidatos en la base de datos. Debes asegurar que todas las rutas posibles (éxito, fallo, casos límite) estén cubiertas adecuadamente.

## Estructura del Sistema
El sistema sigue una arquitectura en capas:
- `domain`: Contiene las entidades y reglas de negocio
- `application`: Contiene casos de uso y servicios
- `infrastructure`: Contiene implementaciones de repositorios y acceso a datos
- `presentation`: Contiene controladores y manejo de peticiones HTTP

## Requerimientos Específicos
1. **Crear tests para la capa de servicio/caso de uso** que maneja la inserción de candidatos
2. **Crear tests para la capa de repositorio** que interactúa con Prisma
3. **Crear tests para el controlador** que recibe la petición HTTP
4. Implementar **mocks adecuados** para aislar cada componente durante las pruebas
5. Verificar todos los **casos de validación** según el modelo de candidato
6. Asegurar que los tests siguen los **principios de TDD**

## Modelo de Candidato
```typescript
interface Candidate {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  cv?: CV;
}

interface Education {
  institution: string;
  title: string;
  startDate: string;
  endDate: string;
}

interface WorkExperience {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface CV {
  filePath: string;
  fileType: string;
}
```

## Casos de Prueba Requeridos
1. **Inserción exitosa** de un candidato con todos los campos válidos
2. **Validación de campos obligatorios** (firstName, lastName, email, etc.)
3. **Validación de formato** para campos como email y phone
4. **Manejo de duplicados** (candidatos con mismo email)
5. **Manejo de errores de base de datos**
6. **Validación de arrays vacíos** para educations y workExperiences
7. **Verificación de persistencia correcta** de relaciones (educations, workExperiences, cv)

## Enfoque TDD Esperado
1. Escribir primero los tests que definan el comportamiento esperado
2. Ejecutar los tests y verificar que fallan (dado que no hay implementación)
3. Implementar la funcionalidad mínima para que los tests pasen
4. Refactorizar manteniendo los tests en verde
5. Repetir para cada caso de prueba

## Librería y Configuración
- Utilizar Jest como framework de testing
- Configurar Jest para TypeScript utilizando ts-jest
- Utilizar jest.mock() para simular dependencias
- Implementar mocks personalizados para Prisma

## Estructura de Archivos Esperada
```
backend/
  src/
    test/
        test-SRG.spec.ts
```

## Ejemplo de Test para Referencia
```typescript
import { CandidateService } from '../../application/services/candidate-service';
import { CandidateRepository } from '../../infrastructure/repositories/candidate-repository';

// Mock del repositorio
jest.mock('../../infrastructure/repositories/candidate-repository');

describe('CandidateService', () => {
  let candidateService: CandidateService;
  let candidateRepository: jest.Mocked<CandidateRepository>;
  
  beforeEach(() => {
    // Configurar mocks y servicio antes de cada test
    candidateRepository = new CandidateRepository() as jest.Mocked<CandidateRepository>;
    candidateService = new CandidateService(candidateRepository);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('debería crear un candidato correctamente cuando todos los datos son válidos', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Albert',
      lastName: 'Saelices',
      email: 'albert.saelices@gmail.com',
      phone: '656874937',
      address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
      educations: [
        {
          institution: 'UC3M',
          title: 'Computer Science',
          startDate: '2006-12-31',
          endDate: '2010-12-26'
        }
      ],
      workExperiences: [
        {
          company: 'Coca Cola',
          position: 'SWE',
          description: '',
          startDate: '2011-01-13',
          endDate: '2013-01-17'
        }
      ],
      cv: {
        filePath: 'uploads/1715760936750-cv.pdf',
        fileType: 'application/pdf'
      }
    };
    
    const createdCandidate = { id: '123', ...candidateData };
    candidateRepository.createCandidate.mockResolvedValue(createdCandidate);
    
    // Act
    const result = await candidateService.createCandidate(candidateData);
    
    // Assert
    expect(candidateRepository.createCandidate).toHaveBeenCalledWith(candidateData);
    expect(result).toEqual(createdCandidate);
  });
  
  // Más tests aquí...
});
```

## Entregable
Una suite completa de tests unitarios que cumpla con todos los requisitos anteriores, siguiendo las mejores prácticas de TDD y testing unitario.
