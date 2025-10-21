import { Role } from '../../common/roles.enum';

export class User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  roles: Role[];
}
