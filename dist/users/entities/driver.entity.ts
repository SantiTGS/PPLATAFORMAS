import { Role } from '../../common/roles.enum';

export class User {
  id: number;
  email: string;
  name: string;
  phone: string;
  plate: string;
  city: string;
  passwordHash: string;
  roles: Role[];
}
