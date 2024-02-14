import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
} from '@declanprice/noxa';

import { OrderStream } from './order.stream';
import { OrderRequestedEvent } from '../api/events/order-requested.event';
import { RequestOrderCommand } from '../api/commands/request-order.command';

@CommandHandler(RequestOrderCommand)
export class RequestOrderHandler extends HandleCommand {
    constructor(readonly event: EventStore) {
        super();
    }

    async handle(command: CommandMessage<RequestOrderCommand>) {
        const { data } = command;

        return this.event.startStream(
            OrderStream,
            data.orderId,
            new OrderRequestedEvent(
                data.orderId,
                data.customerId,
                data.paymentId,
                data.lineItems,
            ),
        );
    }
}
