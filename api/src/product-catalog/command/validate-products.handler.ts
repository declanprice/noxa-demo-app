import { ProductStream } from './product.stream';
import { ValidateProductsCommand } from '../api/commands/validate-products.command';
import { ProductsValidatedEvent } from '../api/events/products-validated.event';
import { ProductsValidationFailedEvent } from '../api/events/products-validation-failed.event';
import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
    OutboxStore,
} from '@declanprice/noxa';

@CommandHandler(ValidateProductsCommand)
export class ValidateProductsHandler extends HandleCommand {
    constructor(
        readonly event: EventStore,
        readonly outbox: OutboxStore,
    ) {
        super();
    }

    async handle(command: CommandMessage<ValidateProductsCommand>) {
        const { data } = command;

        let isValid = true;

        for (const { productId, inventoryId, price } of data.products) {
            const product = await this.event.hydrateStream(
                ProductStream,
                productId,
            );

            if (
                product.inventoryId !== inventoryId ||
                product.price !== price
            ) {
                isValid = false;
            }
        }

        if (isValid) {
            return this.outbox.event(new ProductsValidatedEvent(data.orderId));
        } else {
            return this.outbox.event(
                new ProductsValidationFailedEvent(data.orderId),
            );
        }
    }
}
