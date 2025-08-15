import createHttpError from "http-errors";
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const post = async (req, res, next) => {
    const { name, description } = req.body;

    if(!name) {
        return next(createHttpError(400, 'name is required'));
    }

    //Jumping directly to uploading files

    const files = req.files;

    if(!files["postImgs"] || files['postImgs'].length == 0) {
        return next(createHttpError(400,"upload an image to post"));
    }

    // const mimeParts = files["propertyImgs"][i].mimetype.split("/");
    // const coverImageMimeType = mimeParts[mimeParts.length - 1];
    // const fileName = files["propertyImgs"][i].filename;
    // const filePath = path.resolve(__dirname,"../../public/data/uploads",fileName);

    // try {
    //         const uploadResult = await cloudinary.uploader.upload(filePath, {
    //         filename_override: fileName,
    //         folder: "propertyImages",
    //         format: coverImageMimeType,
    //         });
    
    
    //         await fs.promises.unlink(filePath);
    
    //     } catch (err) {
    //             return next(createHttpError(400, "error in uploading files to cloud"));
    //     }
}

export { post }