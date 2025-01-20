import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './entities/chat.entity';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<Chat>,
  ) {}

  async create({ chat, userId }: { chat: CreateChatDto; userId: string }) {
    const updatedChat = {
      ...chat,
      userIds: chat.userIds || [],
      chatCreatorId: new Types.ObjectId(userId),
    };

    const createChat = new this.chatModel(updatedChat);

    createChat.save();

    return createChat;
  }

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find({}).exec();
  }

  async findOne(id: string): Promise<Chat> {
    return this.chatModel.findById(id).exec();
  }

  async findUserChat(id) {}

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
