import { IsNumber, Min, Max } from 'class-validator';

export class BookRideDto {
  @IsNumber()
  @Min(1, { message: 'Debes reservar al menos 1 cupo' })
  @Max(10, { message: 'No puedes reservar más de 10 cupos' })
  seats: number;
}