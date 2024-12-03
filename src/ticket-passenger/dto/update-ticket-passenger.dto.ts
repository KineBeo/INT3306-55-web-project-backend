import { PartialType } from '@nestjs/swagger';
import { CreateTicketPassengerDto } from './create-ticket-passenger.dto';

export class UpdateTicketPassengerDto extends PartialType(CreateTicketPassengerDto) {}
