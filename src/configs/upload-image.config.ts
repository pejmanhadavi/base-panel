import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/image-upload.util';

export default (fileName: string, maxSize: number = 1 * 1000 * 1000) =>
  FileInterceptor(fileName, {
    storage: diskStorage({
      destination: `./uploads/${fileName}s`,
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
    limits: {
      fieldSize: maxSize,
    },
  });
