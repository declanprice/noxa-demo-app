import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
} from '@declanprice/noxa';
import { BadRequestException } from '@nestjs/common';
import { ShipmentStream } from './shipment.stream';
import { DeliverShipmentCommand } from '../api/commands/deliver-shipment.command';
import { ShippingStatus } from '../api/commands/shipping-status.enum';
import { ShipmentDeliveredEvent } from '../api/events/shipment-delivered.event';

@CommandHandler(DeliverShipmentCommand)
export class DeliverShipmentHandler extends HandleCommand {
    constructor(readonly event: EventStore) {
        super();
    }

    async handle(command: CommandMessage<DeliverShipmentCommand>) {
        const { data } = command;

        const shipment = await this.event.hydrateStream(
            ShipmentStream,
            data.shipmentId,
        );

        if (shipment.status !== ShippingStatus.DISPATCHED) {
            throw new BadRequestException(
                'order needs to be dispatched before it can be marked as delivered',
            );
        }

        await this.event.appendEvent(
            ShipmentStream,
            data.shipmentId,
            new ShipmentDeliveredEvent(data.shipmentId, data.orderId),
        );
    }
}
