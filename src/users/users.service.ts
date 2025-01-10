import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const { email, name, password } = user;

    const existingUser = await this.userModel.findOne({ email: email });

    if (existingUser) {
      throw new HttpException(
        `User with email: ${email} already exists`,
        HttpStatus.CONFLICT,
        {
          cause: `Duplicate user with email: ${email}`,
          description: 'User already exists',
        },
      );
    }

    const hashedPassword = await this.hashingProvider.hashPassword({
      password,
    });

    const updatedUserInfo = {
      ...user,
      password: hashedPassword,
    };

    let newUser: User;

    try {
      newUser = new this.userModel(updatedUserInfo);
      await newUser.save();
    } catch (error: any) {
      throw new HttpException(
        `Error while creating user: ${error.message}`,
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
          description: error,
        },
      );
    }

    return newUser;
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find({});
    } catch (error: any) {
      throw new HttpException(
        `Error fetching all user: ${error.message}`,
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
          description: error,
        },
      );
    }
  }

  async findOne({ id }: { id: string }): Promise<User> {
    let user: User;

    try {
      user = await this.userModel.findById(id);
    } catch (error: any) {
      throw new HttpException(
        `Error finding user: ${error.message}`,
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
          description: error,
        },
      );
    }

    if (!user) {
      throw new HttpException(
        `User with id: ${id} was not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async update({ id, user }: { id: string; user: UpdateUserDto }) {
    let existingUser: User;

    try {
      existingUser = await this.userModel.findById(id);
    } catch (error: any) {
      throw new HttpException(
        `Error while deleting user with id: ${id}`,
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
          description: error,
        },
      );
    }

    if (existingUser) {
      throw new HttpException(
        `User with id: ${id} does not exist`,
        HttpStatus.CONFLICT,
        {
          cause: 'Invalid user id',
          description: 'User does not exist',
        },
      );
    }

    let hashedPassword;

    try {
      hashedPassword = await this.hashingProvider.hashPassword({
        password: user.password,
      });
    } catch (error: any) {
      throw new HttpException(
        `Error while hashing password: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error.message,
          description: error,
        },
      );
    }

    try {
      const updatedUserInfo = {
        ...user,
        password: hashedPassword,
      };

      return await this.userModel.findByIdAndUpdate(id, updatedUserInfo, {
        new: true,
        lean: true,
      });
    } catch (error: any) {
      throw new HttpException(
        `Error updating user information: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error.message,
          description: error,
        },
      );
    }
  }

  async removeUser({ id }: { id: string }) {
    const existingUser = await this.userModel.findById(id);

    if (existingUser) {
      throw new HttpException(
        `User with id: ${id} does not exist`,
        HttpStatus.CONFLICT,
        {
          cause: 'Invalid user id',
          description: 'User does not exist',
        },
      );
    }

    try {
      await this.userModel.findByIdAndDelete(id);
    } catch (error: any) {
      throw new HttpException(
        `Error while deleting user with id: ${id}`,
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
          description: error,
        },
      );
    }
    return { message: 'User deleted successfully' };
  }

  async findUserByEmail({ email }: { email: string }): Promise<User> {
    let user: User;

    try {
      user = await this.userModel.findOne({ email });
    } catch (error: any) {
      throw new HttpException(
        `Error fetching user by email: ${email}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error.message,
          description: error,
        },
      );
    }

    if (!user) {
      throw new HttpException(
        `User with email: ${email} does not exist`,
        HttpStatus.NOT_FOUND,
        {
          cause: 'User not found',
          description: 'User does not exist',
        },
      );
    }

    return user;
  }

  async verifyUser({ email, password }: { email: string; password: string }) {
    const user = await this.findUserByEmail({ email });

    let isPasswordCorrect = false;

    try {
      isPasswordCorrect = await this.hashingProvider.comparePasswords({
        password,
        hashedPassword: user.password,
      });

    } catch (error: any) {
      throw new HttpException(
        `Error while verifying password for user with email: ${email}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error.message,
          description: error,
        },
      );
    }

    if (!isPasswordCorrect) {
      throw new HttpException(
        `Invalid credentials for user with email: ${email}`,
        HttpStatus.UNAUTHORIZED,
        {
          cause: 'Invalid credentials',
          description: 'Invalid credentials',
        },
      );
    }

    return user;
  }
}
