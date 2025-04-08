const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Clase que representa la educación de un candidato en el dominio
 */
class Education {
  /**
   * Constructor de la clase Education
   * @param {Object} data - Datos de educación
   */
  constructor(data) {
    this.institution = data.institution;
    this.title = data.title;
    this.startDate = data.startDate;
    this.endDate = data.endDate || null;
    this.description = data.description || '';
    this.candidateId = data.candidateId;
  }
  
  /**
   * Guarda la educación en la base de datos
   * @returns {Promise<Object>} - Objeto con los datos de educación guardados
   */
  async save() {
    try {
      // Crear la educación en la base de datos
      const savedEducation = await prisma.education.create({
        data: {
          institution: this.institution,
          title: this.title,
          startDate: new Date(this.startDate),
          endDate: this.endDate ? new Date(this.endDate) : null,
          description: this.description,
          candidateId: this.candidateId
        }
      });
      
      return savedEducation;
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
  
  /**
   * Actualiza los datos de educación en la base de datos
   * @param {number} id - ID de la educación a actualizar
   * @returns {Promise<Object>} - Objeto con los datos de educación actualizados
   */
  async update(id) {
    try {
      // Actualizar la educación en la base de datos
      const updatedEducation = await prisma.education.update({
        where: { id },
        data: {
          institution: this.institution,
          title: this.title,
          startDate: new Date(this.startDate),
          endDate: this.endDate ? new Date(this.endDate) : null,
          description: this.description
        }
      });
      
      return updatedEducation;
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
  
  /**
   * Elimina una educación de la base de datos
   * @param {number} id - ID de la educación a eliminar
   * @returns {Promise<void>}
   */
  static async delete(id) {
    try {
      await prisma.education.delete({
        where: { id }
      });
    } catch (error) {
      // Relanzar el error para que sea manejado en el servicio
      throw error;
    }
  }
}

module.exports = {
  Education
}; 