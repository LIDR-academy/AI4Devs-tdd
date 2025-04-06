const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Clase que representa la experiencia laboral de un candidato en el dominio
 */
class WorkExperience {
  /**
   * Constructor de la clase WorkExperience
   * @param {Object} data - Datos de experiencia laboral
   */
  constructor(data) {
    this.company = data.company;
    this.position = data.position;
    this.startDate = data.startDate;
    this.endDate = data.endDate || null;
    this.description = data.description || '';
    this.candidateId = data.candidateId;
  }
  
  /**
   * Guarda la experiencia laboral en la base de datos
   * @returns {Promise<Object>} - Objeto con los datos de experiencia laboral guardados
   */
  async save() {
    try {
      // Crear la experiencia laboral en la base de datos
      const savedWorkExperience = await prisma.workExperience.create({
        data: {
          company: this.company,
          position: this.position,
          startDate: new Date(this.startDate),
          endDate: this.endDate ? new Date(this.endDate) : null,
          description: this.description,
          candidateId: this.candidateId
        }
      });
      
      return savedWorkExperience;
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
  
  /**
   * Actualiza los datos de experiencia laboral en la base de datos
   * @param {number} id - ID de la experiencia laboral a actualizar
   * @returns {Promise<Object>} - Objeto con los datos de experiencia laboral actualizados
   */
  async update(id) {
    try {
      // Actualizar la experiencia laboral en la base de datos
      const updatedWorkExperience = await prisma.workExperience.update({
        where: { id },
        data: {
          company: this.company,
          position: this.position,
          startDate: new Date(this.startDate),
          endDate: this.endDate ? new Date(this.endDate) : null,
          description: this.description
        }
      });
      
      return updatedWorkExperience;
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
  
  /**
   * Elimina una experiencia laboral de la base de datos
   * @param {number} id - ID de la experiencia laboral a eliminar
   * @returns {Promise<void>}
   */
  static async delete(id) {
    try {
      await prisma.workExperience.delete({
        where: { id }
      });
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
}

module.exports = {
  WorkExperience
}; 