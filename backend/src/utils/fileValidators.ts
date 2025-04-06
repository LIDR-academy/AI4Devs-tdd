const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateFileType = (fileType: string): boolean => {
  return ALLOWED_FILE_TYPES.includes(fileType);
};

export const validateFileSize = (fileSize: number): boolean => {
  return fileSize <= MAX_FILE_SIZE;
}; 