import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import * as slugify from 'slugify';

// Allow only images
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new BadRequestException('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = slugify.default(file.originalname.split('.')[0]);
  const fileExtName = extname(file.originalname);
  const randomName = Date.now().toString();
  callback(null, `${name}${randomName}${fileExtName}`);
};
