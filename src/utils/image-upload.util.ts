import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

// Allow only images
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new BadRequestException('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Date.now().toString();
  callback(null, `${name}${randomName}${fileExtName}`);
};

// Array(4)
//     .fill(null)
//     .map(() => Math.round(Math.random() * 10).toString(10))
//     .join('')
