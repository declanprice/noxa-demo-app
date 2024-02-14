import { Projection, ProjectionHandler } from '@declanprice/noxa';
import { ProjectionSession } from '@declanprice/noxa/dist/lib/handlers/projection/projection-session.type';

import { PaymentCapturedEvent } from '../api/events/payment-captured.event';
import { PaymentRefundedEvent } from '../api/events/payment-refunded.event';

@Projection({
    batchSize: 100,
})
export class PaymentsProjection {
    @ProjectionHandler(PaymentCapturedEvent)
    onRegistered(session: ProjectionSession<PaymentCapturedEvent>) {
        const { event, tx } = session;

        return tx.payments.create({
            data: {
                id: event.data.paymentId,
                amount: event.data.amount,
                orderId: event.data.orderId,
                refunded: false,
            },
        });
    }

    @ProjectionHandler(PaymentRefundedEvent)
    onRefunded(session: ProjectionSession<PaymentCapturedEvent>) {
        const { event, tx } = session;

        return tx.payments.update({
            where: {
                id: event.data.paymentId,
            },
            data: {
                refunded: true,
            },
        });
    }
}
