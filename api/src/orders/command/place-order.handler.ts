import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
} from '@declanprice/noxa';

import { OrderStream } from './order.stream';
import { PlaceOrderCommand } from '../api/commands/place-order.command';
import { OrderPlacedEvent } from '../api/events/order-placed.event';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler extends HandleCommand {
    constructor(readonly event: EventStore) {
        super();
    }

    async handle(command: CommandMessage<PlaceOrderCommand>) {
        return this.event.startStream(
            OrderStream,
            command.data.orderId,
            new OrderPlacedEvent(command.data.orderId),
        );
    }
}
