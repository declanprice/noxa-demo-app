import { ProductStream } from './product.stream';
import { ProductAddedToCatalog } from '../api/events/product-added-to-catalog.event';
import { AddProductToCatalog } from '../api/commands/add-product-to-catalog.command';
import { v4 } from 'uuid';
import {
    CommandHandler,
    CommandMessage,
    EventStore,
    HandleCommand,
} from '@declanprice/noxa';

@CommandHandler(AddProductToCatalog)
export class AddProductToCatalogHandler extends HandleCommand {
    constructor(readonly event: EventStore) {
        super();
    }

    async handle(command: CommandMessage<AddProductToCatalog>) {
        const { data } = command;

        const productId = v4();

        await this.event.startStream(
            ProductStream,
            productId,
            new ProductAddedToCatalog(
                productId,
                data.inventoryId,
                data.name,
                data.description,
                data.price,
                data.category,
                data.photoUrl,
            ),
        );

        return productId;
    }
}
