import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
} from '@declanprice/noxa';
import { ShipmentStream } from './shipment.stream';
import { DispatchShipmentCommand } from '../api/commands/dispatch-shipment.command';
import { ShipmentDispatchedEvent } from '../api/events/shipment-dispatched.event';

@CommandHandler(DispatchShipmentCommand)
export class DispatchShipmentHandler extends HandleCommand {
    constructor(readonly event: EventStore) {
        super();
    }

    async handle(command: CommandMessage<DispatchShipmentCommand>) {
        const { data } = command;

        return this.event.startStream(
            ShipmentStream,
            data.shipmentId,
            new ShipmentDispatchedEvent(
                data.shipmentId,
                data.orderId,
                data.addressLine1,
                data.addressLine2,
                data.city,
                data.postcode,
            ),
        );
    }
}
