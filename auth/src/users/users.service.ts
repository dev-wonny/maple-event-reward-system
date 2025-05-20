import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findOne({ userId: id }).lean().exec();
  }

  async findByUserId(userId: string): Promise<User | null> {
    return this.userModel.findOne({ userId }).lean().exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ userId: id }, updateUserDto, { new: true })
      .lean()
      .exec();
  }

  async incrementLoginCount(userId: string): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ userId }, { $inc: { loginCount: 1 } }, { new: true })
      .lean()
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findOneAndDelete({ userId: id }).lean().exec();
  }
}
