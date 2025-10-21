import { Role } from '../../common/roles.enum';

export class CreateDriverDto {
  email: string;
  name: string;
  phone: string;
  plate: string;
  city: string;
  password: string;
  roles?: Role[];
}
