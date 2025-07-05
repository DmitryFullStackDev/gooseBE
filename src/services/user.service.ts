import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from '../models/user.model'

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async checkUserRole(id: number, role: string): Promise<void> {
    const user = await this.findById(id)
    if (user.role !== role) {
      throw new ForbiddenException(`User does not have role ${role}`)
    }
  }
}
