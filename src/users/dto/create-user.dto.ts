import { Role } from '../../common/roles.enum';

export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  roles?: Role[];
}
