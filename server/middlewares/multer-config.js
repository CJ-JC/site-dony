import multer from "multer";
import path from "path";

// Configuration de stockage dynamique
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isImage = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
        let uploadDir;

        if (isImage) {
            // Déterminer le dossier de destination en fonction de la route
            if (req.originalUrl.includes("/instructor")) {
                uploadDir = "public/uploads/instructors";
            } else if (req.originalUrl.includes("/masterclass")) {
                uploadDir = "public/uploads/masterclass";
            } else {
                uploadDir = "public/uploads/images";
            }
        } else {
            uploadDir = "public/uploads/attachments";
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Vérification du type de fichier
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const allowedAttachmentTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];

    if (allowedImageTypes.includes(file.mimetype) || allowedAttachmentTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Type de fichier invalide. Seules les images et certains fichiers sont autorisés."), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
