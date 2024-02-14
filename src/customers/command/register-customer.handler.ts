import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
} from '@declanprice/noxa';

import { RegisterCustomer } from '../api/commands/register-customer.command';
import { CustomerStream } from './customer.stream';
import { CustomerRegistered } from '../api/events/customer-registered.event';

@CommandHandler(RegisterCustomer)
export class RegisterCustomerHandler extends HandleCommand {
    constructor(readonly event: EventStore) {
        super();
    }

    async handle(command: CommandMessage<RegisterCustomer>) {
        const { data } = command;

        await this.event.startStream(
            CustomerStream,
            data.customerId,
            new CustomerRegistered(
                data.customerId,
                data.firstName,
                data.lastName,
                data.email,
            ),
        );
    }
}
