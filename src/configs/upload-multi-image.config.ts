import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/image-upload.util';

export default (fileName: string, maxSize: number = 2 * 1000 * 1000) =>
  FilesInterceptor('files', 8, {
    storage: diskStorage({
      destination: `./uploads/${fileName}s`,
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
    limits: {
      fieldSize: maxSize,
    },
  });
