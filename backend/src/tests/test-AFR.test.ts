import { jest, describe, beforeEach, test, expect } from '@jest/globals';

// Interfaz para los datos del candidato
interface Candidato {
  nombre: string;
  email: string;
  telefono: string;
}

// Interfaz para el mock guardar
interface MockGuardar {
  (candidato: Candidato): Promise<Candidato & { id: number }>;
  mockResolvedValue: (value: Candidato & { id: number }) => void;
  mockRejectedValue: (error: Error) => void;
}

// Mock del repositorio/servicio de base de datos
interface CandidatoRepository {
  guardar: MockGuardar;
}

const mockCandidatoRepository = {
  guardar: jest.fn()
};

// Función principal que vamos a probar
const insertarCandidato = async (datos: Candidato) => {
  // Validación de campos obligatorios
  const camposObligatorios: (keyof Candidato)[] = ['nombre', 'email', 'telefono'];
  const camposFaltantes = camposObligatorios.filter(campo => !datos[campo]);
  
  if (camposFaltantes.length > 0) {
    throw new Error(`Campos obligatorios faltantes: ${camposFaltantes.join(', ')}`);
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(datos.email)) {
    throw new Error('Formato de email inválido');
  }

  // Validación de formato de teléfono
  if (!/^\d{10}$/.test(datos.telefono)) {
    throw new Error('El teléfono debe tener 10 dígitos');
  }

  // Guardado en base de datos
  try {
    return await mockCandidatoRepository.guardar(datos);
  } catch (error) {
    throw new Error('Error al guardar en la base de datos');
  }
};

describe('Recepción de datos del formulario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debería aceptar datos válidos', async () => {
    const datosValidos: Candidato = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '1234567890'
    };

    await expect(insertarCandidato(datosValidos)).resolves.not.toThrow();
  });

  test('debería rechazar datos con campos faltantes', async () => {
    const datosIncompletos = {
      nombre: 'Juan Pérez',
      // email faltante
      telefono: '1234567890'
    } as Candidato;

    await expect(insertarCandidato(datosIncompletos))
      .rejects
      .toThrow('Campos obligatorios faltantes: email');
  });

  test('debería rechazar email inválido', async () => {
    const datosEmailInvalido: Candidato = {
      nombre: 'Juan Pérez',
      email: 'emailinvalido',
      telefono: '1234567890'
    };

    await expect(insertarCandidato(datosEmailInvalido))
      .rejects
      .toThrow('Formato de email inválido');
  });

  test('debería rechazar teléfono inválido', async () => {
    const datosTelefonoInvalido: Candidato = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '12345' // Menos de 10 dígitos
    };

    await expect(insertarCandidato(datosTelefonoInvalido))
      .rejects
      .toThrow('El teléfono debe tener 10 dígitos');
  });
});

describe('Guardado en base de datos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debería guardar correctamente en la base de datos', async () => {
    const datosValidos: Candidato = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '1234567890'
    };

    const resultadoEsperado = { id: 1, ...datosValidos };
    // @ts-ignore
    mockCandidatoRepository.guardar.mockResolvedValue(resultadoEsperado);

    const resultado = await insertarCandidato(datosValidos);

    expect(mockCandidatoRepository.guardar).toHaveBeenCalledWith(datosValidos);
    expect(resultado).toEqual(resultadoEsperado);
  });

  test('debería manejar errores de base de datos', async () => {
    const datosValidos: Candidato = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '1234567890'
    };

    // @ts-ignore
    mockCandidatoRepository.guardar.mockRejectedValue(new Error('Error de conexión'));

    await expect(insertarCandidato(datosValidos))
      .rejects
      .toThrow('Error al guardar en la base de datos');
  });

  test('no debería intentar guardar datos inválidos', async () => {
    const datosInvalidos: Candidato = {
      nombre: 'Juan Pérez',
      email: 'emailinvalido',
      telefono: '12345'
    };

    await expect(insertarCandidato(datosInvalidos))
      .rejects
      .toThrow();

    expect(mockCandidatoRepository.guardar).not.toHaveBeenCalled();
  });
}); 