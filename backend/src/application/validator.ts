const NAME_REGEX = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(6|7|9)\d{8}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

//Length validations according to the database schema

const validateName = (name: string) => {
  if (!name || name.length < 2 || name.length > 100 || !NAME_REGEX.test(name)) {
    throw new Error('Invalid name');
  }
};

const validateEmail = (email: string) => {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new Error('Invalid email');
  }
};

const validatePhone = (phone: string) => {
  if (!phone || !PHONE_REGEX.test(phone)) {
    throw new Error('Invalid phone number');
  }
};

const validateDate = (date: string) => {
  if (!date || !DATE_REGEX.test(date)) {
    throw new Error('Invalid date');
  }
};

const validateAddress = (address: string) => {
    if (!address || address.length < 1 || address.length > 100) { 
        throw new Error('Invalid address'); 
    }
 };

const validateEducation = (education: any) => {
    if (!education.institution || education.institution.length < 2 || education.institution.length > 100) {
    throw new Error('Invalid institution');
  }

  if (!education.title || education.title.length > 100) {
    throw new Error('Invalid title');
  }

  try {
    validateDate(education.startDate);
  } catch (error) {
    throw new Error('Invalid start date');
  }
  try {
    validateDate(education.endDate);
  } catch (error) {
    throw new Error('Invalid end date');
  }

   if (education.startDate === education.endDate) {
    throw new Error('Start date and end date cannot be the same');
  }

  if (new Date(education.startDate) > new Date(education.endDate)) {
    throw new Error('Start date must be before end date');
  }
};

const validateExperience = (experience: any) => {
  if (!experience.company || experience.company.length > 100) {
    throw new Error('Invalid company');
  }

  if (!experience.position || experience.position.length > 100) {
    throw new Error('Invalid position');
  }

  if (experience.description && experience.description.length > 200) {
    throw new Error('Invalid description');
  }

  try {
    validateDate(experience.startDate);
  } catch (error) {
    throw new Error('Invalid start date');
  }
  try {
    validateDate(experience.endDate);
  } catch (error) {
    throw new Error('Invalid end date');
  }

   if (experience.startDate === experience.endDate) {
    throw new Error('Start date and end date cannot be the same');
  }

  if (new Date(experience.startDate) > new Date(experience.endDate)) {
    throw new Error('Start date must be before end date');
  }



};

const validateCV = (cv: any) => {
    if (typeof cv !== 'object' ||
        !cv.filePath ||
        typeof cv.filePath !== 'string' ||
        !cv.fileType ||
        typeof cv.fileType !== 'string'
        ) {
        throw new Error('Invalid CV data');
    }
    // Additional validation for filePath to ensure it is a valid path
    if (!/^[\w,\s-]+\.[A-Za-z]{3}$/.test(cv.filePath)) {
        throw new Error('Invalid file path format');
    }
    // Additional validation for fileType to ensure it is a valid file type
    if (!['pdf', 'doc', 'docx'].includes(cv.fileType.toLowerCase())) {
        throw new Error('Unsupported file type');
    }
};

const validateCandidateData = (data: any) => {
  if (data.id) {
    // If id is provided, we are editing an existing candidate, so fields are not mandatory
    return;
  }

  validateName(data.firstName);
  validateName(data.lastName);
  validateEmail(data.email);
  validatePhone(data.phone);
  validateAddress(data.address);

  if (data.educations) {
    for (const education of data.educations) {
      validateEducation(education);
    }
  }

  if (data.workExperiences) {
    for (const experience of data.workExperiences) {
      validateExperience(experience);
    }
  }

  if (data.cv && Object.keys(data.cv).length > 0) {
    validateCV(data.cv);
  }
};

export {
  validateName,
  validateEmail,
  validatePhone,
  validateDate,
  validateAddress,
  validateEducation,
  validateExperience,
  validateCV,
  validateCandidateData,
};
