import { PaymentStream } from './payment.stream';
import { RefundPaymentCommand } from '../api/commands/refund-payment.command';
import { PaymentRefundedEvent } from '../api/events/payment-refunded.event';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';
import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
} from '@declanprice/noxa';

@CommandHandler(RefundPaymentCommand)
export class CapturePaymentHandler extends HandleCommand {
    constructor(readonly event: EventStore) {
        super();
    }

    async handle(command: CommandMessage<RefundPaymentCommand>) {
        const { data } = command;
        await this.event.startStream(
            PaymentStream,
            data.paymentId,
            new PaymentRefundedEvent(data.paymentId),
        );
    }
}
