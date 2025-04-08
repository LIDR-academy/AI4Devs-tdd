const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Clase que representa un candidato en el dominio
 */
class Candidate {
  /**
   * Constructor de la clase Candidate
   * @param {Object} data - Datos del candidato
   */
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address || '';
    this.education = [];
    this.workExperience = [];
    this.resumes = [];
  }
  
  /**
   * Guarda el candidato en la base de datos
   * @returns {Promise<Object>} - Objeto con los datos del candidato guardado
   */
  async save() {
    try {
      // Crear el candidato en la base de datos
      const savedCandidate = await prisma.candidate.create({
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
          address: this.address
        }
      });
      
      return savedCandidate;
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
  
  /**
   * Actualiza los datos del candidato en la base de datos
   * @param {number} id - ID del candidato a actualizar
   * @returns {Promise<Object>} - Objeto con los datos del candidato actualizado
   */
  async update(id) {
    try {
      // Actualizar el candidato en la base de datos
      const updatedCandidate = await prisma.candidate.update({
        where: { id },
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
          address: this.address
        }
      });
      
      return updatedCandidate;
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
  
  /**
   * Busca un candidato por su ID
   * @param {number} id - ID del candidato a buscar
   * @returns {Promise<Object|null>} - Objeto con los datos del candidato o null si no existe
   */
  static async findById(id) {
    try {
      // Buscar el candidato en la base de datos
      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          education: true,
          workExperience: true,
          resumes: true
        }
      });
      
      return candidate;
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
}

module.exports = {
  Candidate
}; 