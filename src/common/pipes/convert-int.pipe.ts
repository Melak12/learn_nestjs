import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ConvertIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const val  = parseInt(value, 10);
    if(isNaN(val)) {
      throw new BadRequestException(
        `Validation failed. "${value}" is not an integer.`
      );
    }
    return val; //transformed value
  }
}
