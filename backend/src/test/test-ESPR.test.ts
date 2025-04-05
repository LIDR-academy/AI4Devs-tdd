import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock de PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn()
}));

describe('Gestión de Candidatos', () => {
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    mockReset(prisma);
  });

  describe('Crear Candidato', () => {
    const candidatoValido = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '1234567890',
      address: null
    };

    test('debería crear un candidato exitosamente', async () => {
      const candidatoEsperado = { id: 1, ...candidatoValido };
      prisma.candidate.create.mockResolvedValue(candidatoEsperado);

      const resultado = await prisma.candidate.create({
        data: candidatoValido
      });

      expect(resultado).toEqual(candidatoEsperado);
      expect(prisma.candidate.create).toHaveBeenCalledWith({
        data: candidatoValido
      });
    });

    test('debería fallar si el email ya existe', async () => {
      prisma.candidate.create.mockRejectedValue(new Error('Unique constraint failed on the fields: (`email`)'));

      await expect(
        prisma.candidate.create({
          data: candidatoValido
        })
      ).rejects.toThrow('Unique constraint failed');
    });

    test('debería manejar campos opcionales correctamente', async () => {
      const candidatoSinTelefono = {
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@example.com',
        phone: null,
        address: null
      };

      const candidatoEsperado = { id: 2, ...candidatoSinTelefono };
      prisma.candidate.create.mockResolvedValue(candidatoEsperado);

      const resultado = await prisma.candidate.create({
        data: candidatoSinTelefono
      });

      expect(resultado).toEqual(candidatoEsperado);
    });
  });

  describe('Actualizar Candidato', () => {
    test('debería actualizar un candidato existente', async () => {
      const actualizacion = {
        phone: '9876543210'
      };

      const candidatoActualizado = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '9876543210',
        address: null
      };

      prisma.candidate.update.mockResolvedValue(candidatoActualizado);

      const resultado = await prisma.candidate.update({
        where: { id: 1 },
        data: actualizacion
      });

      expect(resultado).toEqual(candidatoActualizado);
      expect(prisma.candidate.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: actualizacion
      });
    });

    test('debería fallar al actualizar un candidato inexistente', async () => {
      prisma.candidate.update.mockRejectedValue(new Error('Record to update not found.'));

      await expect(
        prisma.candidate.update({
          where: { id: 999 },
          data: { phone: '9876543210' }
        })
      ).rejects.toThrow('Record to update not found');
    });
  });

  describe('Eliminar Candidato', () => {
    test('debería eliminar un candidato existente', async () => {
      const candidatoEliminado = {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '1234567890',
        address: null
      };

      prisma.candidate.delete.mockResolvedValue(candidatoEliminado);

      const resultado = await prisma.candidate.delete({
        where: { id: 1 }
      });

      expect(resultado).toEqual(candidatoEliminado);
      expect(prisma.candidate.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    test('debería fallar al eliminar un candidato inexistente', async () => {
      prisma.candidate.delete.mockRejectedValue(new Error('Record to delete does not exist.'));

      await expect(
        prisma.candidate.delete({
          where: { id: 999 }
        })
      ).rejects.toThrow('Record to delete does not exist');
    });
  });
});
