import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CustomerCreatedEvent } from '../events/customer-created.event';

@Injectable()
export class CustomerCreatedListener {
  @OnEvent('customer.created')
  handleCustomerCreatedEvent(event: CustomerCreatedEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log('Event', event);
  }
}
