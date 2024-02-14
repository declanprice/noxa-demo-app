import { OrderStream } from './order.stream';
import { CompleteOrderCommand } from '../api/commands/complete-order.command';
import { OrderCompleteEvent } from '../api/events/order-complete.event';
import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
} from '@declanprice/noxa';

@CommandHandler(CompleteOrderCommand)
export class PlaceOrderHandler extends HandleCommand {
    constructor(readonly event: EventStore) {
        super();
    }

    async handle(command: CommandMessage<CompleteOrderCommand>) {
        return this.event.startStream(
            OrderStream,
            command.data.orderId,
            new OrderCompleteEvent(command.data.orderId),
        );
    }
}
