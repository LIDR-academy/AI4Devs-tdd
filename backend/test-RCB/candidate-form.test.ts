import { Candidate } from '../src/domain/models/Candidate';
import { Education } from '../src/domain/models/Education';
import { WorkExperience } from '../src/domain/models/WorkExperience';
import { Resume } from '../src/domain/models/Resume';

describe('Candidate - Recepción de datos del formulario', () => {
  test('Debe crear un candidato con datos básicos válidos', () => {
    // Arrange
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };

    // Act
    const candidate = new Candidate(candidateData);

    // Assert
    expect(candidate.firstName).toBe('Juan');
    expect(candidate.lastName).toBe('Pérez');
    expect(candidate.email).toBe('juan.perez@example.com');
    expect(candidate.education).toEqual([]);
    expect(candidate.workExperience).toEqual([]);
    expect(candidate.resumes).toEqual([]);
  });

  test('Debe crear un candidato con datos completos', () => {
    // Arrange
    const today = new Date();
    const pastDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    
    const educationData = {
      institution: 'Universidad Complutense',
      title: 'Ingeniería Informática',
      startDate: pastDate,
      endDate: today
    };

    const workExperienceData = {
      company: 'Tech Solutions Inc.',
      position: 'Desarrollador Full Stack',
      description: 'Desarrollo de aplicaciones web',
      startDate: pastDate,
      endDate: today
    };

    const resumeData = {
      filePath: '/uploads/resumes/juan_perez_cv.pdf',
      fileType: 'application/pdf'
    };

    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34 612345678',
      address: 'Calle Principal 123, Madrid',
      education: [educationData],
      workExperience: [workExperienceData],
      resumes: [resumeData]
    };

    // Act
    const candidate = new Candidate(candidateData);

    // Assert
    expect(candidate.firstName).toBe('Juan');
    expect(candidate.lastName).toBe('Pérez');
    expect(candidate.email).toBe('juan.perez@example.com');
    expect(candidate.phone).toBe('+34 612345678');
    expect(candidate.address).toBe('Calle Principal 123, Madrid');
    
    // Verificar que el array education contiene un elemento con los datos correctos
    expect(candidate.education.length).toBe(1);
    expect(candidate.education[0].institution).toBe('Universidad Complutense');
    
    // Verificar que el array workExperience contiene un elemento con los datos correctos
    expect(candidate.workExperience.length).toBe(1);
    expect(candidate.workExperience[0].company).toBe('Tech Solutions Inc.');
    
    // Verificar que el array resumes contiene un elemento con los datos correctos
    expect(candidate.resumes.length).toBe(1);
    expect(candidate.resumes[0].filePath).toBe('/uploads/resumes/juan_perez_cv.pdf');
  });

  test('Debe manejar datos faltantes o undefined correctamente', () => {
    // Arrange
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      // No se incluyen phone ni address
      // No se incluyen education, workExperience ni resumes
    };

    // Act
    const candidate = new Candidate(candidateData);

    // Assert
    expect(candidate.firstName).toBe('Juan');
    expect(candidate.lastName).toBe('Pérez');
    expect(candidate.email).toBe('juan.perez@example.com');
    expect(candidate.phone).toBeUndefined();
    expect(candidate.address).toBeUndefined();
    expect(candidate.education).toEqual([]);
    expect(candidate.workExperience).toEqual([]);
    expect(candidate.resumes).toEqual([]);
  });

  test('Caso borde: Debe manejar datos con caracteres especiales', () => {
    // Arrange
    const candidateData = {
      firstName: 'María-José',
      lastName: "O'Connor García",
      email: 'maria.jose+trabajo@example.com',
      address: 'Calle 123 #45-67, 1º 2ª'
    };

    // Act
    const candidate = new Candidate(candidateData);

    // Assert
    expect(candidate.firstName).toBe('María-José');
    expect(candidate.lastName).toBe("O'Connor García");
    expect(candidate.email).toBe('maria.jose+trabajo@example.com');
    expect(candidate.address).toBe('Calle 123 #45-67, 1º 2ª');
  });
}); 