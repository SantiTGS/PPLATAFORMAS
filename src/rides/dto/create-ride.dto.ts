import { IsString, IsNumber, Min, MinLength, IsOptional, IsInt } from 'class-validator';

export class CreateRideDto {
  @IsString()
  @MinLength(3, { message: 'El origen debe tener al menos 3 caracteres' })
  origin: string;

  @IsString()
  @MinLength(3, { message: 'El destino debe tener al menos 3 caracteres' })
  destination: string;

  @IsNumber()
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  price: number;

  @IsInt()
  @Min(1, { message: 'Debe haber al menos 1 cupo disponible' })
  @IsOptional()
  seats?: number;

  @IsString()
  @IsOptional()
  description?: string;
}