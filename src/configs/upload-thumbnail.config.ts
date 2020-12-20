import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/image-upload.util';

const maxSize = 1 * 1000 * 1000;

export default FileInterceptor('thumbnail', {
  storage: diskStorage({
    destination: './uploads/thumbnails',
    filename: editFileName,
  }),
  fileFilter: imageFileFilter,
  limits: {
    fieldSize: maxSize,
  },
});
