const axios = require('axios');
const { uploadCV, sendCandidateData } = require('../candidateService');

// Mock de axios para simular las peticiones HTTP
jest.mock('axios');

describe('Pruebas del servicio de candidatos', () => {
  // Limpiar los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadCV', () => {
    it('debería subir un archivo CV correctamente', async () => {
      // Preparar el mock de la respuesta
      const mockResponse = { data: { filePath: 'uploads/cv.pdf', fileType: 'application/pdf' } };
      axios.post.mockResolvedValue(mockResponse);

      // Crear un archivo mock
      const mockFile = new File(['contenido del archivo'], 'cv.pdf', { type: 'application/pdf' });

      // Llamar a la función
      const result = await uploadCV(mockFile);

      // Verificar que axios.post se llamó con los parámetros correctos
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3010/upload',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Verificar el resultado
      expect(result).toEqual(mockResponse.data);
    });

    it('debería manejar errores durante la subida del CV', async () => {
      // Preparar el mock para simular un error
      const errorMessage = 'Error al subir el archivo';
      axios.post.mockRejectedValue({ response: { data: errorMessage } });

      // Crear un archivo mock
      const mockFile = new File(['contenido del archivo'], 'cv.pdf', { type: 'application/pdf' });

      // Verificar que la función lanza un error
      await expect(uploadCV(mockFile)).rejects.toThrow('Error al subir el archivo');
    });
  });

  describe('sendCandidateData', () => {
    it('debería enviar datos del candidato correctamente', async () => {
      // Preparar el mock de la respuesta
      const mockResponse = { data: { id: 1, name: 'Juan Pérez' } };
      axios.post.mockResolvedValue(mockResponse);

      // Datos mock del candidato
      const candidateData = { name: 'Juan Pérez', email: 'juan@example.com' };

      // Llamar a la función
      const result = await sendCandidateData(candidateData);

      // Verificar que axios.post se llamó con los parámetros correctos
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3010/candidates',
        candidateData
      );

      // Verificar el resultado
      expect(result).toEqual(mockResponse.data);
    });

    it('debería manejar errores al enviar datos del candidato', async () => {
      // Preparar el mock para simular un error
      const errorMessage = 'Error al enviar datos del candidato';
      axios.post.mockRejectedValue({ response: { data: errorMessage } });

      // Datos mock del candidato
      const candidateData = { name: 'Juan Pérez', email: 'juan@example.com' };

      // Verificar que la función lanza un error
      await expect(sendCandidateData(candidateData)).rejects.toThrow('Error al enviar datos del candidato');
    });
  });
}); 