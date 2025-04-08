const { PrismaClient } = require('@prisma/client');
const { Candidate } = require('../../domain/models/Candidate');
const { Education } = require('../../domain/models/Education');
const { WorkExperience } = require('../../domain/models/WorkExperience');
const { Resume } = require('../../domain/models/Resume');
const { validateCandidateData } = require('../validator');

// Instancia de Prisma para comunicación con la base de datos
const prisma = new PrismaClient();

/**
 * Añade un nuevo candidato a la base de datos con toda su información relacionada
 * @param {Object} candidateData - Datos del candidato a añadir
 * @returns {Promise<Object>} - Objeto con los datos del candidato añadido
 * @throws {Error} - Si hay algún error durante el proceso
 */
async function addCandidate(candidateData) {
  try {
    // Validar los datos antes de procesar
    validateCandidateData(candidateData);
    
    // Comprobar si ya existe un candidato con el mismo email
    const existingCandidate = await prisma.candidate.findUnique({
      where: {
        email: candidateData.email
      }
    });
    
    if (existingCandidate) {
      throw new Error('Candidate with this email already exists');
    }
    
    // En los tests, vamos a usar directamente Prisma
    const savedCandidate = await prisma.candidate.create({
      data: {
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
        phone: candidateData.phone,
        address: candidateData.address || ''
      }
    });
    
    // Procesar educación (si existe)
    if (candidateData.educations && candidateData.educations.length > 0) {
      for (const educationData of candidateData.educations) {
        // Crear directamente en la base de datos
        await prisma.education.create({
          data: {
            institution: educationData.institution,
            title: educationData.title,
            startDate: new Date(educationData.startDate),
            endDate: educationData.endDate ? new Date(educationData.endDate) : null,
            description: educationData.description || '',
            candidateId: savedCandidate.id
          }
        });
      }
    }
    
    // Procesar experiencia laboral (si existe)
    if (candidateData.workExperiences && candidateData.workExperiences.length > 0) {
      for (const experienceData of candidateData.workExperiences) {
        // Crear directamente en la base de datos
        await prisma.workExperience.create({
          data: {
            company: experienceData.company,
            position: experienceData.position,
            startDate: new Date(experienceData.startDate),
            endDate: experienceData.endDate ? new Date(experienceData.endDate) : null,
            description: experienceData.description || '',
            candidateId: savedCandidate.id
          }
        });
      }
    }
    
    // Procesar CV (si existe)
    if (candidateData.resumes && candidateData.resumes.length > 0) {
      for (const resumeData of candidateData.resumes) {
        // Crear directamente en la base de datos
        await prisma.resume.create({
          data: {
            filePath: resumeData.filePath,
            fileType: resumeData.fileType,
            originalName: resumeData.originalName || '',
            uploadDate: new Date(),
            candidateId: savedCandidate.id
          }
        });
      }
    }
    
    // Retornar el candidato con todos sus datos añadidos
    return savedCandidate;
    
  } catch (error) {
    // Manejar errores específicos
    if (error.code === 'P2002') {
      throw new Error('Candidate with this email already exists');
    }
    
    // Relanzar cualquier otro error
    throw error;
  } finally {
    // Cerrar la conexión con la base de datos
    await prisma.$disconnect();
  }
}

module.exports = {
  addCandidate
}; 