import { Module } from '@nestjs/common';
import { SetInventoryQuantityHandler } from './command/set-inventory-quantity.handler';
import { GetInventoryByIdHandler } from './query/get-inventory-by-id.handler';
import { FindInventoryByIdsHandler } from './query/find-inventory-by-ids.handler';

@Module({
    imports: [
        SetInventoryQuantityHandler,
        GetInventoryByIdHandler,
        FindInventoryByIdsHandler,
    ],
    controllers: [],
    providers: [],
})
export class InventoryModule {}
