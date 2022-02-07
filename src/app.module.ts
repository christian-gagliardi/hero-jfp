import { Module } from '@nestjs/common';
import { HeroModule } from './hero/hero.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),     
    HeroModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
