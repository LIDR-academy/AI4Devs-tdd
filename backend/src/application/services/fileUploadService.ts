import multer from 'multer';
import { Request, Response } from 'express';
import { FileFilterCallback } from 'multer';

const storage = multer.diskStorage({
    destination: function (req: Express.Request, file: Express.Multer.File, cb: Function) {
        cb(null, '../uploads/');
    },
    filename: function (req: Express.Request, file: Express.Multer.File, cb: Function) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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

// Extend the Express Request interface to include the file property
declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;
        }
    }
}

export const uploadFile = (req: Request, res: Response) => {
    const uploader = upload.single('file');
    uploader(req, res, function (err: any) {
        if (err instanceof multer.MulterError) {
            // Manejo de errores específicos de Multer
            return res.status(500).json({ error: err.message });
        } else if (err) {
            // Otros errores posibles
            return res.status(500).json({ error: err.message });
        }

        // Verificar si el archivo fue rechazado por el filtro de archivos
        if (!req.file) {
            return res.status(400).json({ error: 'Invalid file type, only PDF and DOCX are allowed!' });
        }
        // Si todo está bien, proceder a responder con la ruta del archivo y el tipo de archivo
        res.status(200).json({
            filePath: req.file.path,
            fileType: req.file.mimetype  // Aquí se añade el tipo de archivo
        });
    });
};