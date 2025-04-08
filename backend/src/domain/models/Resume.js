const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Clase que representa el CV de un candidato en el dominio
 */
class Resume {
  /**
   * Constructor de la clase Resume
   * @param {Object} data - Datos del CV
   */
  constructor(data) {
    this.filePath = data.filePath;
    this.fileType = data.fileType;
    this.uploadDate = new Date();
    this.candidateId = data.candidateId;
  }
  
  /**
   * Guarda el CV en la base de datos
   * @returns {Promise<Object>} - Objeto con los datos del CV guardado
   */
  async save() {
    try {
      // Crear el CV en la base de datos
      const savedResume = await prisma.resume.create({
        data: {
          filePath: this.filePath,
          fileType: this.fileType,
          uploadDate: this.uploadDate,
          candidateId: this.candidateId
        }
      });
      
      return savedResume;
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
  
  /**
   * Actualiza los datos del CV en la base de datos
   * @param {number} id - ID del CV a actualizar
   * @returns {Promise<Object>} - Objeto con los datos del CV actualizado
   */
  async update(id) {
    try {
      // Actualizar el CV en la base de datos
      const updatedResume = await prisma.resume.update({
        where: { id },
        data: {
          filePath: this.filePath,
          fileType: this.fileType,
          uploadDate: this.uploadDate
        }
      });
      
      return updatedResume;
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
  
  /**
   * Elimina un CV de la base de datos
   * @param {number} id - ID del CV a eliminar
   * @returns {Promise<void>}
   */
  static async delete(id) {
    try {
      await prisma.resume.delete({
        where: { id }
      });
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
  
  /**
   * Busca todos los CVs de un candidato
   * @param {number} candidateId - ID del candidato
   * @returns {Promise<Array>} - Array con todos los CVs del candidato
   */
  static async findByCandidateId(candidateId) {
    try {
      const resumes = await prisma.resume.findMany({
        where: { candidateId }
      });
      
      return resumes;
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
}

module.exports = {
  Resume
}; 