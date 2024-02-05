import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/user-created.event';
import axios from 'axios';

@Injectable()
export class UserCreatedListener {
  @OnEvent('user.created')
  handleUserCreatedEvent(event: UserCreatedEvent) {
    const smsData = {
      phone: '0935587112',
      text: 'Testing Email/sms for user created',
    };
    const sms = this.sendSms(smsData);

    console.log('sms', sms);
    // handle and process "OrderCreatedEvent" event
    console.log('User Created event', event);
  }

  sendSms = async (smsData) => {
    const sms = await axios.post(
      'https://sms.purposeblacketh.com/api/general/send-sms',
      smsData,
    );

    return sms;
  };
}
