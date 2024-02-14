import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
    OutboxStore,
} from '@declanprice/noxa';
import {
    DatabaseClient,
    DatabaseTransactionClient,
} from '@declanprice/noxa/dist/lib/store/database-client.service';

import { PaymentStream } from './payment.stream';
import { CapturePaymentCommand } from '../api/commands/capture-payment.command';
import { PaymentCapturedEvent } from '../api/events/payment-captured.event';

@CommandHandler(CapturePaymentCommand)
export class CapturePaymentHandler extends HandleCommand {
    constructor(
        readonly db: DatabaseClient,
        readonly event: EventStore,
        readonly outbox: OutboxStore,
    ) {
        super();
    }

    async handle(command: CommandMessage<CapturePaymentCommand>) {
        const { data } = command;

        const payment = await this.event.hydrateStream(
            PaymentStream,
            data.paymentId,
        );

        if (payment.captured) {
            return console.log(
                `payment with id ${payment.paymentId} has already been captured`,
            );
        }

        const capturedEvent = new PaymentCapturedEvent(
            data.paymentId,
            payment.orderId,
            payment.amount,
        );

        await this.db.$transaction(async (tx) => {
            await this.event.startStream(
                PaymentStream,
                data.paymentId,
                capturedEvent,
                { tx },
            );

            await this.outbox.event(capturedEvent, { tx });
        });
    }
}
