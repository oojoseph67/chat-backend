import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { HashingProvider } from 'src/global/providers/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    // injecting mongoose
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly hashingProvider: HashingProvider,
  ) {}

  async create({ user }: { user: CreateUserDto }): Promise<User> {
    const updatedUserInfo = {
      ...user,
      password: await this.hashingProvider.hashPassword({ password: user.password }),
    };

    const newUser = new this.userModel(updatedUserInfo);
    return await newUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find({});
  }

  async findOne({ id }: { id: string }) {
    return await this.userModel.findById(id);
  }

  async update({ id, user }: { id: string; user: UpdateUserDto }) {
    const updatedUserInfo = {
      ...user,
      password: this.hashingProvider.hashPassword({ password: user.password }),
    };

    return await this.userModel.findByIdAndUpdate(id, updatedUserInfo, {
      new: true,
      lean: true,
    });
  }

  async removeUser({ id }: { id: string }): Promise<User> {
    return await this.userModel.findOneAndDelete({ _id: id });
  }
}
