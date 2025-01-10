import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { UserTokenPayload } from 'src/global/providers/generate-token.provider';

// const getCurrentUserByContext = (context: ExecutionContext): User => {
//   return context.switchToHttp().getRequest().user as User;
// };

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user as UserTokenPayload;
    } else if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req.user as UserTokenPayload;
    }
  },
);
