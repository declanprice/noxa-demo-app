import { CommandHandler, DatabaseSession, HandleCommand } from '../../../lib';
import { ProductStream } from './product.stream';
import { ProductAddedToCatalog } from '../api/events/product-added-to-catalog.event';
import { AddProductToCatalog } from '../api/commands/add-product-to-catalog.command';
import { v4 } from 'uuid';

@CommandHandler(AddProductToCatalog)
export class AddProductToCatalogHandler extends HandleCommand {
    async handle(command: AddProductToCatalog, session: DatabaseSession) {
        const productId = v4();

        await session.eventStore.startStream(
            ProductStream,
            productId,
            new ProductAddedToCatalog(
                productId,
                command.inventoryId,
                command.name,
                command.description,
                command.price,
                command.category,
                command.photoUrl,
            ),
        );

        return productId;
    }
}
