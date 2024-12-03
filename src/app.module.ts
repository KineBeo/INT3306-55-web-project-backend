import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TicketModule } from './ticket/ticket.module';
import { TicketPassengerModule } from './ticket-passenger/ticket-passenger.module';
import { FlightModule } from './flight/flight.module';
import { AirplaneModule } from './airplane/airplane.module';
import { AirportModule } from './airport/airport.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ConfigModule.forRoot(), 
    DatabaseModule, 
    UserModule, 
    AuthModule, TicketModule, TicketPassengerModule, FlightModule, AirplaneModule, AirportModule, ArticleModule],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
