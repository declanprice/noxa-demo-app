import { Projection, ProjectionHandler } from '@declanprice/noxa';
import { ProjectionSession } from '@declanprice/noxa/dist/lib/handlers/projection/projection-session.type';

import { ShipmentDispatchedEvent } from '../api/events/shipment-dispatched.event';
import { ShippingStatus } from '../api/commands/shipping-status.enum';
import { ShipmentDeliveredEvent } from '../api/events/shipment-delivered.event';

@Projection()
export class ShipmentProjection {
    @ProjectionHandler(ShipmentDispatchedEvent)
    onDispatched(session: ProjectionSession<ShipmentDispatchedEvent>) {
        const { event, tx } = session;

        return tx.shipments.create({
            data: {
                id: event.data.shipmentId,
                orderId: event.data.orderId,
                addressLine1: event.data.addressLine1,
                addressLine2: event.data.addressLine2,
                postcode: event.data.postcode,
                city: event.data.city,
                status: ShippingStatus.DISPATCHED,
            },
        });
    }

    @ProjectionHandler(ShipmentDeliveredEvent)
    onDelivered(session: ProjectionSession<ShipmentDeliveredEvent>) {
        const { event, tx } = session;

        return tx.shipments.update({
            where: {
                id: event.data.shipmentId,
            },
            data: {
                status: ShippingStatus.DELIVERED,
            },
        });
    }
}
