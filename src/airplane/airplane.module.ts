import { Module } from '@nestjs/common';
import { AirplaneService } from './airplane.service';
import { AirplaneController } from './airplane.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airplane } from './entities/airplane.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Airplane]), UserModule],
  controllers: [AirplaneController],
  providers: [AirplaneService],
  exports: [AirplaneService],
})
export class AirplaneModule {}
