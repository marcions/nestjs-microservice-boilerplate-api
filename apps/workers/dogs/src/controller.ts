/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateDogsDto, UpdateDogsDto } from 'core/dto';
import { DogsPattern } from 'libs/utils/enum';

import { DogsService } from './service';

@Controller()
export class DogsController {
  constructor(private dogsService: DogsService) {}

  @MessagePattern(DogsPattern.POST_DOGS)
  async createdDogs(@Payload() data: CreateDogsDto[], @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.dogsService.createdDogs(data);

      channel.ack(message);

      return result;
    } catch (error) {
      channel.ack(message);

      throw error;
    }
  }

  @MessagePattern(DogsPattern.UPDATE_DOGS)
  async updateDogs(@Payload() data: { id: number; body: UpdateDogsDto }, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      const result = await this.dogsService.updateDogs(data.id, data.body);

      channel.ack(message);

      return result;
    } catch (error) {
      channel.ack(message);

      throw error;
    }
  }

  @MessagePattern(DogsPattern.REMOVE_DOGS)
  async deleteDogs(@Payload() id: number, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.dogsService.deleteDogs(id);

      channel.ack(message);

      return result;
    } catch (error) {
      channel.ack(message);

      throw error;
    }
  }
}
