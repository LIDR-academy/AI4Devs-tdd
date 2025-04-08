import { Request, Response } from 'express';
import { uploadFile } from '../services/fileUploadService';
import multer from 'multer';

// Mock multer
jest.mock('multer', () => {
  class MulterError extends Error {
    constructor(code: string) {
      super(code);
      this.name = 'MulterError';
      this.code = code;
    }
    code: string;
  }

  const mockMulter = jest.fn().mockImplementation(() => {
    return {
      single: jest.fn().mockImplementation(() => {
        return (req: Request, res: Response, next: Function) => {
          if (req.file && req.file.size > 10 * 1024 * 1024) {
            next(new MulterError('LIMIT_FILE_SIZE'));
            return;
          }
          if (req.file && !['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(req.file.mimetype)) {
            next(new MulterError('INVALID_FILE_TYPE'));
            return;
          }
          next();
        };
      })
    };
  }) as unknown as typeof multer;

  Object.defineProperty(mockMulter, 'diskStorage', {
    value: jest.fn().mockImplementation(() => ({
      destination: jest.fn(),
      filename: jest.fn()
    }))
  });

  Object.defineProperty(mockMulter, 'MulterError', {
    value: MulterError
  });

  return mockMulter;
});

describe('File Upload Service', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockFile: Express.Multer.File;

  beforeEach(() => {
    mockFile = {
      fieldname: 'file',
      originalname: 'test.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: 1024,
      destination: '/uploads',
      filename: 'test.pdf',
      path: '/uploads/test.pdf',
      buffer: Buffer.from('test')
    } as Express.Multer.File;

    mockRequest = {
      file: mockFile
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should successfully upload a PDF file', () => {
    uploadFile(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      filePath: '/uploads/test.pdf',
      fileType: 'application/pdf'
    });
  });

  it('should successfully upload a DOCX file', () => {
    mockFile.mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    uploadFile(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      filePath: '/uploads/test.pdf',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
  });

  it('should reject files larger than 10MB', () => {
    mockFile.size = 11 * 1024 * 1024;
    uploadFile(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'LIMIT_FILE_SIZE' });
  });

  it('should reject unsupported file types', () => {
    mockFile.mimetype = 'image/jpeg';
    uploadFile(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'INVALID_FILE_TYPE' });
  });

  it('should handle upload errors gracefully', () => {
    mockRequest.file = undefined;
    uploadFile(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid file type, only PDF and DOCX are allowed!' });
  });
}); 