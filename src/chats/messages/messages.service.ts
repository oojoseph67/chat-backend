import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from '../entities/chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserTokenPayload } from 'src/global/providers/generate-token.provider';
import { Message } from './entities/message.entity';
import { GetMessagesDto } from './dto/get-messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<Chat>,

    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async createMessage({
    createMessageDto,
    user,
  }: {
    createMessageDto: CreateMessageDto;
    user: UserTokenPayload;
  }) {
    const { chatId, content } = createMessageDto;
    const userId = user._id;
    // const userId = '678224e7519d5305f983ddd0';

    const message: Message = {
      _id: new Types.ObjectId(),
      chatId,
      userId,
      content,
      createdAt: new Date(),
    };

    // find the chat
    // push the message above to its messages array
    // do this only if the user has access to the chat

    try {
      const chat = await this.chatModel.findById(chatId);
      if (
        chat.chatCreatorId.toString() === userId ||
        chat.userIds.map((id) => id.toString()).includes(userId)
      ) {
        await this.messageModel.create(message);
        chat.messages.push(message);
        await chat.save();
        return message;
      } else {
        throw new HttpException(
          `You dont belong to this chat`,
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error: any) {
      throw new HttpException(
        `Failed to create message: Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
          description: error,
        },
      );
    }
  }

  async getMessages({
    getMessagesDto,
    user,
  }: {
    getMessagesDto: GetMessagesDto;
    user: UserTokenPayload
  }) {
    const userId = user._id;
    // const userId = '678224e7519d5305f983ddd0';
    const { chatId } = getMessagesDto;

    try {
      const chat = await this.chatModel.findById(chatId);

      if (
        chat.chatCreatorId.toString() === userId ||
        chat.userIds.map((id) => id.toString()).includes(userId)
      ) {
        return chat.messages;
      } else {
        throw new HttpException(
          `You dont belong to this chat`,
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error: any) {
      throw new HttpException(
        `Failed to create message: Error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
          description: error,
        },
      );
    }
  }
}
