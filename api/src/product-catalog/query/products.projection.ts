import { Projection, ProjectionHandler } from '@declanprice/noxa';
import { ProjectionSession } from '@declanprice/noxa/dist/lib/handlers/projection/projection-session.type';
import { ProductAddedToCatalog } from '../api/events/product-added-to-catalog.event';
import { ProductRemovedFromCatalog } from '../api/events/product-removed-from-catalog.event';

@Projection({
    batchSize: 100,
})
export class ProductsProjection {
    @ProjectionHandler(ProductAddedToCatalog)
    onRegistered(session: ProjectionSession<ProductAddedToCatalog>) {
        const { event, tx } = session;

        return tx.products.create({
            data: {
                id: event.data.productId,
                inventoryId: event.data.inventoryId,
                name: event.data.name,
                description: event.data.name,
                category: event.data.category,
                price: event.data.price,
                photoUrl: event.data.photoUrl,
                removed: false,
            },
        });
    }

    @ProjectionHandler(ProductRemovedFromCatalog)
    onRemoved(session: ProjectionSession<ProductRemovedFromCatalog>) {
        const { event, tx } = session;

        return tx.products.update({
            where: {
                id: event.data.id,
            },
            data: {
                removed: false,
            },
        });
    }
}
