import multer from 'multer';
import { Request, Response } from 'express';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB
    },
    fileFilter: fileFilter
});

export const uploadFile = (req: Request, res: Response) => {
    const uploader = upload.single('file');
    uploader(req, res, function (err) {
        if (err) {
            // Todos los errores de Multer deben devolver estado 500
            return res.status(500).json({ error: err.message || err.code || 'Unexpected error' });
        }

        // Verificar si el archivo fue rechazado por el filtro de archivos
        if (!req.file) {
            return res.status(400).json({ error: 'Invalid file type, only PDF and DOCX are allowed!' });
        }

        // Si todo está bien, proceder a responder con la ruta del archivo y el tipo de archivo
        res.status(200).json({
            filePath: req.file.path,
            fileType: req.file.mimetype
        });
    });
};