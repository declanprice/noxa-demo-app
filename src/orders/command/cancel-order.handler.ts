import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
    OutboxStore,
} from '@declanprice/noxa';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';
import { OrderStream } from './order.stream';
import { CancelOrderCommand } from '../api/commands/cancel-order.command';
import { OrderCanceledEvent } from '../api/events/order-canceled.event';

@CommandHandler(CancelOrderCommand)
export class PlaceOrderHandler extends HandleCommand {
    constructor(
        readonly db: DatabaseClient,
        readonly event: EventStore,
        readonly outbox: OutboxStore,
    ) {
        super();
    }

    async handle(command: CommandMessage<CancelOrderCommand>) {
        const cancelEvent = new OrderCanceledEvent(command.data.orderId);

        await this.db.$transaction(async (tx) => {
            await this.event.startStream(
                OrderStream,
                command.data.orderId,
                cancelEvent,
                { tx },
            );

            await this.outbox.event(cancelEvent, { tx });
        });
    }
}
