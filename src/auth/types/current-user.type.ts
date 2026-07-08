import { User } from 'src/generated/prisma/client';

export type CurrentUserDto = Pick<User, 'id' | 'email'>;
