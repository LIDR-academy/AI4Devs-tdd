import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';

// Mock para multer
jest.mock('multer', () => {
  const multerMock = jest.fn().mockImplementation(() => ({
    single: jest.fn().mockImplementation(() => (req: any, res: any, next: any) => next())
  }));
  
  // Añadimos diskStorage y MulterError para que fileUploadService pueda usarlos
  multerMock.diskStorage = jest.fn().mockImplementation(() => ({}));
  multerMock.MulterError = class MulterError extends Error {
    code: string;
    field?: string;
    
    constructor(code: string) {
      super(code);
      this.name = 'MulterError';
      this.code = code;
    }
  };
  
  return multerMock;
});

// Importamos uploadFile después del mock
import { uploadFile } from '../application/services/fileUploadService';

describe('Tests para servicio de carga de archivos (fileUploadService.ts)', () => {
  // Definimos nuestros mocks
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Crear mocks para los métodos de respuesta
    jsonMock = jest.fn();
    statusMock = jest.fn().mockImplementation(() => ({ json: jsonMock }));
    
    // Configurar objetos req y res
    req = {
      file: undefined
    };
    
    res = {
      status: statusMock,
      json: jsonMock
    };
  });
  
  // Test para carga exitosa de archivo PDF
  test('Debería responder correctamente al cargar un archivo PDF', () => {
    // Arrange
    req.file = {
      path: '/uploads/test.pdf',
      mimetype: 'application/pdf',
      originalname: 'test.pdf',
      fieldname: 'file',
      encoding: '7bit',
      size: 1024,
      destination: '/uploads',
      filename: 'test.pdf',
      buffer: Buffer.from('test'),
      stream: undefined as any
    };
    
    // Act
    uploadFile(req as Request, res as Response);
    
    // Assert
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      filePath: req.file.path,
      fileType: req.file.mimetype
    });
  });
  
  // Test para rechazo de tipo de archivo no permitido
  test('Debería rechazar archivos con formato no permitido', () => {
    // Arrange
    req.file = undefined;
    
    // Act
    uploadFile(req as Request, res as Response);
    
    // Assert
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Invalid file type, only PDF and DOCX are allowed!'
    });
  });
}); 