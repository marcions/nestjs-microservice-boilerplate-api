/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateDogsDto, ExceptionObjectDto, UpdateDogsDto } from 'core/dto';
import { PrismaService } from 'prisma';

@Injectable()
export class DogsService {
  constructor(private prisma: PrismaService) {}

  async createdDogs(data: CreateDogsDto[]): Promise<any> {
    return this.prisma.dogs
      .createMany({
        data: data
      })
      .then((result) => {
        Logger.log('Dogss successfully created', 'CreateDogs');

        return { data: { statusCode: HttpStatus.CREATED, message: 'Dogss criados com sucesso!', data: result } };
      })
      .catch((error) => {
        throw new RpcException(
          ExceptionObjectDto.generate(HttpStatus.BAD_REQUEST, error.meta ? error.meta : error.message)
        );
      });
  }

  async updateDogs(id: number, updateData: UpdateDogsDto): Promise<any> {
    return this.prisma.dogs
      .update({
        where: { id: id },
        data: updateData
      })
      .then((result) => {
        Logger.log('Dogs successfully updated', 'UpdateDogs');

        return { data: { statusCode: HttpStatus.OK, message: 'Dogs atualizado com sucesso!', data: result } };
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

        return { data: { statusCode: HttpStatus.OK, message: 'Dogs excluído com sucesso.' } };
      })
      .catch((error) => {
        throw new RpcException(
          ExceptionObjectDto.generate(HttpStatus.BAD_REQUEST, error.meta ? error.meta : error.message)
        );
      });
  }
}
