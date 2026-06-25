import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    const user = this.repository.create(dto);
    return this.repository.save(user);
  }

  findOneByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }
}
