import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

// Mock the dependencies
jest.mock('../application/validator');
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

describe('Candidate Data Validation', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate correct candidate data', async () => {
    // Arrange
    const validCandidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '612345678',
      address: '123 Main St'
    };
    
    // Mock the validation function to not throw errors for valid data
    (validateCandidateData as jest.Mock).mockImplementation(() => undefined);
    
    // Mock the Candidate constructor and save method
    (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
      id: 1,
      firstName: validCandidateData.firstName,
      lastName: validCandidateData.lastName,
      email: validCandidateData.email,
      phone: validCandidateData.phone,
      address: validCandidateData.address,
      education: [],
      workExperience: [],
      resumes: [],
      save: jest.fn().mockResolvedValue({ id: 1, ...validCandidateData })
    } as unknown as Candidate));

    // Act
    const result = await addCandidate(validCandidateData);

    // Assert
    expect(validateCandidateData).toHaveBeenCalledWith(validCandidateData);
    expect(Candidate).toHaveBeenCalledWith(validCandidateData);
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('firstName', 'John');
    expect(result).toHaveProperty('lastName', 'Doe');
    expect(result).toHaveProperty('email', 'john.doe@example.com');
  });

  it('should reject candidate with invalid first name', async () => {
    // Arrange
    const invalidCandidateData = {
      firstName: '123', // Invalid: contains numbers
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '612345678'
    };
    
    // Mock validation to throw error for invalid data
    (validateCandidateData as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid name');
    });

    // Act & Assert
    await expect(addCandidate(invalidCandidateData)).rejects.toThrow('Invalid name');
    expect(validateCandidateData).toHaveBeenCalledWith(invalidCandidateData);
  });

  it('should reject candidate with invalid email', async () => {
    // Arrange
    const invalidCandidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email', // Invalid email format
      phone: '612345678'
    };
    
    // Mock validation to throw error for invalid email
    (validateCandidateData as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid email');
    });

    // Act & Assert
    await expect(addCandidate(invalidCandidateData)).rejects.toThrow('Invalid email');
    expect(validateCandidateData).toHaveBeenCalledWith(invalidCandidateData);
  });

  it('should reject candidate with invalid phone number', async () => {
    // Arrange
    const invalidCandidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '12345' // Invalid: too short
    };
    
    // Mock validation to throw error for invalid phone
    (validateCandidateData as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid phone');
    });

    // Act & Assert
    await expect(addCandidate(invalidCandidateData)).rejects.toThrow('Invalid phone');
    expect(validateCandidateData).toHaveBeenCalledWith(invalidCandidateData);
  });
});

describe('Candidate Data Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully save a candidate with basic information', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '612345678'
    };
    
    const savedCandidate = { id: 1, ...candidateData };
    
    // Mock validation
    (validateCandidateData as jest.Mock).mockImplementation(() => undefined);
    
    // Mock Candidate class and save method
    const mockSave = jest.fn().mockResolvedValue(savedCandidate);
    (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
      id: undefined,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      education: [],
      workExperience: [],
      resumes: [],
      save: mockSave
    } as unknown as Candidate));

    // Act
    const result = await addCandidate(candidateData);

    // Assert
    expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
    expect(Candidate).toHaveBeenCalledWith(candidateData);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(savedCandidate);
  });

  it('should save a candidate with education information', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '612345678',
      educations: [
        {
          institution: 'University of Example',
          title: 'Computer Science',
          startDate: '2018-09-01',
          endDate: '2022-06-30'
        }
      ]
    };
    
    const savedCandidate = { id: 1, ...candidateData };
    
    // Mock validation
    (validateCandidateData as jest.Mock).mockImplementation(() => undefined);
    
    // Mock Candidate class and save method
    const mockSave = jest.fn().mockResolvedValue(savedCandidate);
    (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
      id: undefined,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      education: [],
      workExperience: [],
      resumes: [],
      save: mockSave
    } as unknown as Candidate));
    
    // Mock Education class
    (Education as jest.MockedClass<typeof Education>).mockImplementation(() => ({
      institution: candidateData.educations[0].institution,
      title: candidateData.educations[0].title,
      startDate: new Date(candidateData.educations[0].startDate),
      endDate: new Date(candidateData.educations[0].endDate),
      candidateId: undefined,
      save: jest.fn().mockResolvedValue({ id: 1, ...candidateData.educations[0], candidateId: 1 })
    } as unknown as Education));

    // Act
    const result = await addCandidate(candidateData);

    // Assert
    expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
    expect(Candidate).toHaveBeenCalledWith(candidateData);
    expect(Education).toHaveBeenCalledWith(candidateData.educations[0]);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(savedCandidate);
  });

  it('should save a candidate with work experience information', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '612345678',
      workExperiences: [
        {
          company: 'Example Corp',
          position: 'Software Developer',
          description: 'Developed web applications',
          startDate: '2022-07-01',
          endDate: null
        }
      ]
    };
    
    const savedCandidate = { id: 1, ...candidateData };
    
    // Mock validation
    (validateCandidateData as jest.Mock).mockImplementation(() => undefined);
    
    // Mock Candidate class and save method
    const mockSave = jest.fn().mockResolvedValue(savedCandidate);
    (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
      id: undefined,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      education: [],
      workExperience: [],
      resumes: [],
      save: mockSave
    } as unknown as Candidate));
    
    // Mock WorkExperience class
    (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => ({
      company: candidateData.workExperiences[0].company,
      position: candidateData.workExperiences[0].position,
      description: candidateData.workExperiences[0].description,
      startDate: new Date(candidateData.workExperiences[0].startDate),
      endDate: null,
      candidateId: undefined,
      save: jest.fn().mockResolvedValue({ id: 1, ...candidateData.workExperiences[0], candidateId: 1 })
    } as unknown as WorkExperience));

    // Act
    const result = await addCandidate(candidateData);

    // Assert
    expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
    expect(Candidate).toHaveBeenCalledWith(candidateData);
    expect(WorkExperience).toHaveBeenCalledWith(candidateData.workExperiences[0]);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(savedCandidate);
  });

  it('should save a candidate with resume information', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '612345678',
      cv: {
        filePath: '/uploads/resume.pdf',
        fileType: 'application/pdf'
      }
    };
    
    const savedCandidate = { id: 1, ...candidateData };
    
    // Mock validation
    (validateCandidateData as jest.Mock).mockImplementation(() => undefined);
    
    // Mock Candidate class and save method
    const mockSave = jest.fn().mockResolvedValue(savedCandidate);
    (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
      id: undefined,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      education: [],
      workExperience: [],
      resumes: [],
      save: mockSave
    } as unknown as Candidate));
    
    // Mock Resume class
    (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => ({
      id: undefined,
      filePath: candidateData.cv.filePath,
      fileType: candidateData.cv.fileType,
      uploadDate: new Date(),
      candidateId: undefined,
      save: jest.fn().mockResolvedValue({ id: 1, ...candidateData.cv, candidateId: 1, uploadDate: new Date() })
    } as unknown as Resume));

    // Act
    const result = await addCandidate(candidateData);

    // Assert
    expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
    expect(Candidate).toHaveBeenCalledWith(candidateData);
    expect(Resume).toHaveBeenCalledWith(candidateData.cv);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(savedCandidate);
  });

  it('should handle database errors when saving a candidate', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '612345678'
    };
    
    // Mock validation
    (validateCandidateData as jest.Mock).mockImplementation(() => undefined);
    
    // Mock Candidate class with save method that throws an error
    const dbError = new Error('Database connection error');
    (dbError as any).code = 'P2002'; // Unique constraint error
    
    const mockSave = jest.fn().mockRejectedValue(dbError);
    (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
      id: undefined,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      education: [],
      workExperience: [],
      resumes: [],
      save: mockSave
    } as unknown as Candidate));

    // Act & Assert
    await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
    expect(Candidate).toHaveBeenCalledWith(candidateData);
    expect(mockSave).toHaveBeenCalled();
  });

  it('should handle general database errors', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '612345678'
    };
    
    // Mock validation
    (validateCandidateData as jest.Mock).mockImplementation(() => undefined);
    
    // Mock Candidate class with save method that throws a general error
    const generalError = new Error('General database error');
    
    const mockSave = jest.fn().mockRejectedValue(generalError);
    (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
      id: undefined,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      education: [],
      workExperience: [],
      resumes: [],
      save: mockSave
    } as unknown as Candidate));

    // Act & Assert
    await expect(addCandidate(candidateData)).rejects.toThrow('General database error');
    expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
    expect(Candidate).toHaveBeenCalledWith(candidateData);
    expect(mockSave).toHaveBeenCalled();
  });
});