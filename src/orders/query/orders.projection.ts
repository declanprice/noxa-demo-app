import { Projection, ProjectionHandler } from '@declanprice/noxa';
import { ProjectionSession } from '@declanprice/noxa/dist/lib/handlers/projection/projection-session.type';

import { OrderRequestedEvent } from '../api/events/order-requested.event';
import { OrderStatus } from '../api/commands/order-status.enum';
import { OrderPlacedEvent } from '../api/events/order-placed.event';
import { OrderCanceledEvent } from '../api/events/order-canceled.event';
import { OrderCompleteEvent } from '../api/events/order-complete.event';

@Projection({
    batchSize: 100,
})
export class OrdersProjection {
    @ProjectionHandler(OrderRequestedEvent)
    onRequested(session: ProjectionSession<OrderRequestedEvent>) {
        const { event, tx } = session;

        return tx.orders.create({
            data: {
                id: event.data.orderId,
                customerId: event.data.customerId,
                paymentId: event.data.paymentId,
                lineItems: event.data.lineItems,
                status: OrderStatus.REQUESTED,
            },
        });
    }

    @ProjectionHandler(OrderPlacedEvent)
    onPlaced(session: ProjectionSession<OrderRequestedEvent>) {
        const { event, tx } = session;

        return tx.orders.update({
            where: {
                id: event.data.orderId,
            },
            data: {
                status: OrderStatus.PLACED,
            },
        });
    }

    @ProjectionHandler(OrderCanceledEvent)
    onCanceled(session: ProjectionSession<OrderRequestedEvent>) {
        const { event, tx } = session;

        return tx.orders.update({
            where: {
                id: event.data.orderId,
            },
            data: {
                status: OrderStatus.CANCELLED,
            },
        });
    }

    @ProjectionHandler(OrderCompleteEvent)
    onComplete(session: ProjectionSession<OrderRequestedEvent>) {
        const { event, tx } = session;

        return tx.orders.update({
            where: {
                id: event.data.orderId,
            },
            data: {
                status: OrderStatus.COMPLETE,
            },
        });
    }
}
