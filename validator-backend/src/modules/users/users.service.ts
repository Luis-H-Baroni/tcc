import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './users.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return this.usersRepository.save(user)
  }

  async update(user: User): Promise<User> {
    return this.usersRepository.save(user)
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id })
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username })
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id)
  }
}
