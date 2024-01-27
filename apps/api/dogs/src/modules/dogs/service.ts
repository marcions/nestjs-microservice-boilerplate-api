/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { CreateDogDto, ExceptionObjectDto, UpdateDogDto } from '@/core/dto';
import { PrismaService } from '@/prisma';

@Injectable()
export class DogsService {
  constructor(private prisma: PrismaService) {}

  getOnlyDogs(param: any) {
    return this.prisma.dogs.findUnique({ where: param });
  }

  async getDogs() {
    return this.prisma.dogs
      .findMany({
        where: {}
      })
      .then((result) => {
        return { data: { statusCode: HttpStatus.OK, result: result } };
      })
      .catch((error) => {
        throw new RpcException(
          ExceptionObjectDto.generate(HttpStatus.BAD_REQUEST, error.meta ? error.meta : error.message)
        );
      });
  }

  async createdDogs(dogs: CreateDogDto): Promise<any> {
    return this.prisma.dogs
      .create({
        data: dogs
      })
      .then((result) => {
        Logger.log('Dogs successfully created', 'CreateDogs');

        return { data: { statusCode: HttpStatus.CREATED, message: 'Usuário criado com sucesso!', data: result } };
      })
      .catch((error) => {
        throw new RpcException(
          ExceptionObjectDto.generate(HttpStatus.BAD_REQUEST, error.meta ? error.meta : error.message)
        );
      });
  }

  async updateDogs(id: number, updateData: UpdateDogDto): Promise<any> {
    return this.prisma.dogs
      .update({
        where: { id: id },
        data: updateData
      })
      .then((result) => {
        Logger.log('Dogs successfully updated', 'UpdateDogs');

        return { data: { statusCode: HttpStatus.OK, message: 'Usuário atualizado com sucesso!', data: result } };
      })
      .catch((error) => {
        throw new RpcException(
          ExceptionObjectDto.generate(HttpStatus.BAD_REQUEST, error.meta ? error.meta : error.message)
        );
      });
  }

  async deleteDogs(id: number): Promise<any> {
    return this.prisma.dogs
      .delete({ where: { id: id } })
      .then(async () => {
        Logger.log('Dogs successfully deleted', 'DeleteDogs');

        return { data: { statusCode: HttpStatus.OK, message: 'Usuário excluído com sucesso.' } };
      })
      .catch((error) => {
        throw new RpcException(
          ExceptionObjectDto.generate(HttpStatus.BAD_REQUEST, error.meta ? error.meta : error.message)
        );
      });
  }
}
