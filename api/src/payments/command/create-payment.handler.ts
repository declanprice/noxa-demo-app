import { PaymentStream } from './payment.stream';
import { PaymentCapturedEvent } from '../api/events/payment-captured.event';
import { CreatePaymentCommand } from '../api/commands/create-payment.command';
import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
} from '@declanprice/noxa';

@CommandHandler(CreatePaymentCommand)
export class CapturePaymentHandler extends HandleCommand {
    constructor(readonly event: EventStore) {
        super();
    }

    async handle(command: CommandMessage<CreatePaymentCommand>) {
        const { data } = command;
        await this.event.startStream(
            PaymentStream,
            data.paymentId,
            new PaymentCapturedEvent(data.paymentId, data.orderId, data.amount),
        );
    }
}
