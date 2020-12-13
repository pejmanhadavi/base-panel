import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ObjectIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
