#Se utilizo github copilot

---

# 🧪 Diseño de Pruebas Unitarias para Inserción de Candidatos

## 📌 Contexto General

Como experto tester de sistemas, se solicita el diseño de pruebas unitarias para el proceso de **inserción de candidatos en base de datos**, utilizando:

- **Prisma** como ORM (simulado con mocks)
- **Jest** como framework de pruebas
- **Simulación completa de recepción y guardado de datos**

Antes de generar cualquier código, se deberán resolver todas las dudas y obtener la aprobación correspondiente.

---

## 📥 Ejemplo de Solicitud (JSON)

**POST** `http://localhost:3010/candidates`

```json
{
  "firstName": "Albert",
  "lastName": "Saelices",
  "email": "albert.saelices@gmail.com",
  "phone": "656874937",
  "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
  "educations": [
    {
      "institution": "UC3M",
      "title": "Computer Science",
      "startDate": "2006-12-31",
      "endDate": "2010-12-26"
    }
  ],
  "workExperiences": [
    {
      "company": "Coca Cola",
      "position": "SWE",
      "description": "",
      "startDate": "2011-01-13",
      "endDate": "2013-01-17"
    }
  ],
  "cv": {
    "filePath": "uploads/1715760936750-cv.pdf",
    "fileType": "application/pdf"
  }
}
```

---

## ✅ Consideraciones para las Pruebas

### 1. **Validaciones de Frontend a tener en cuenta**
- `firstName`, `lastName`, `email`, `phone`, `address` deben ser **obligatorios** y no vacíos.
- `email` debe tener un **formato válido**.
- `cv.filePath` y `cv.fileType` deben estar presentes.
- Las fechas (`startDate`, `endDate`) deben ser válidas y consistentes.
- La experiencia laboral y la educación pueden estar vacías, pero si existen deben tener los campos requeridos.

---

### 2. **Pruebas a Implementar**

#### 🟢 Casos Positivos
- Inserción exitosa de candidato con todos los campos válidos.
- Inserción sin `educations` y/o `workExperiences` (vacíos).

#### 🔴 Casos Negativos
- Campos obligatorios faltantes (por ejemplo, sin `email`).
- Formato de `email` inválido.
- Fecha de finalización anterior a la de inicio.
- Archivo de CV sin `filePath` o `fileType`.
- Envío de campos vacíos (`""`) que deberían contener datos.

#### 🟡 Límites y Bordes
- Longitud máxima de campos como `firstName`, `lastName`, `address`, etc.
- Valores al límite de validez para fechas.
- Tamaño de texto en descripciones (por ejemplo, `description` en `workExperiences`).

---

## 🧪 Simulación de Prisma con Mock

Sí, **las pruebas deben simular Prisma** mediante mocks para no interactuar con una base de datos real. Las pruebas deben verificar:

- Que **los datos sean recibidos correctamente**.
- Que el servicio intente **guardar en base de datos** usando los mocks de Prisma.
- Que **los métodos esperados** de Prisma hayan sido llamados con los datos correctos (`prisma.candidate.create`, `prisma.education.createMany`, etc.).

---

## 🛑 Antes de Generar Código

Necesito confirmar contigo lo siguiente:

1. ¿Qué validaciones exactamente realiza el frontend? (¿Se validan longitudes? ¿Requeridos específicos?)
2. ¿Deseas que se cubran todos los campos de forma estricta en las pruebas o prefieres un enfoque por capas: mínimos requeridos y luego los opcionales?)
3. ¿La inserción en la base de datos ocurre en una transacción con Prisma (`$transaction`)? Esto afecta cómo se mockea.
4. ¿Quieres que las pruebas se dividan por capa? (por ejemplo: controller, service, etc.) o ¿todo desde el handler del endpoint?

Cuando me confirmes estos puntos, paso a generarte el código de pruebas unitarias con Jest y mocks de Prisma.

---