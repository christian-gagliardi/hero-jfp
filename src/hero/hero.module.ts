import { Module } from '@nestjs/common';
import { grpcClientOptions } from '../grpc-client.options';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';

import { ClientOptions, Transport, ClientsModule } from '@nestjs/microservices';
import { join } from 'path';

console.log('url', process.env.GRPC_CONNECTION_URL_ACCESSORIES)
let options = { url: 'localhost:5501', package: 'accessories', protoPath: join(__dirname, '../../../accessories/src/accessories/accessories.proto')}
console.log(options);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HERO_PACKAGE',
        ...grpcClientOptions,
      },
      {
        name: 'ACCESSORIES_PACKAGE',
        transport: Transport.GRPC,
        options
      }
    ]),
  ],
  controllers: [HeroController],
  providers: [HeroService]
})
export class HeroModule {}