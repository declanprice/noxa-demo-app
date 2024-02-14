import { BadRequestException } from '@nestjs/common';

import { ProductStream } from './product.stream';
import { RemoveProductFromCatalog } from '../api/commands/remove-product-from-catalog.command';
import { ProductRemovedFromCatalog } from '../api/events/product-removed-from-catalog.event';
import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
} from '@declanprice/noxa';

@CommandHandler(RemoveProductFromCatalog)
export class RemoveProductFromCatalogHandler extends HandleCommand {
    constructor(readonly event: EventStore) {
        super();
    }

    async handle(command: CommandMessage<RemoveProductFromCatalog>) {
        const { data } = command;

        const product = await this.event.hydrateStream(ProductStream, data.id);

        if (product.removed) {
            throw new BadRequestException('product-shop is already removed');
        }

        return this.event.appendEvent(
            ProductStream,
            data.id,
            new ProductRemovedFromCatalog(data.id),
        );
    }
}
