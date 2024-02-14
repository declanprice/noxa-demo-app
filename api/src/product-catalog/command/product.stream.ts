import { ProductAddedToCatalog } from '../api/events/product-added-to-catalog.event';
import { ProductRemovedFromCatalog } from '../api/events/product-removed-from-catalog.event';
import { Stream, StreamHandler } from '@declanprice/noxa';

@Stream()
export class ProductStream {
    productId: string;
    inventoryId: string;
    description: string;
    category: string;
    price: number;
    photoUrl: string | null;
    removed: boolean;

    @StreamHandler(ProductAddedToCatalog)
    onRegistered(event: ProductAddedToCatalog) {
        this.productId = event.productId;
        this.inventoryId = event.inventoryId;
        this.description = event.description;
        this.category = event.category;
        this.price = event.price;
        this.photoUrl = event.photoUrl;
        this.removed = false;
    }

    @StreamHandler(ProductRemovedFromCatalog)
    onRemoved(event: ProductAddedToCatalog) {
        this.removed = true;
    }
}
