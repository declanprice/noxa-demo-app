import { HandleQuery, QueryHandler, QueryMessage } from '@declanprice/noxa';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';
import { GetInventoryByIdQuery } from '../api/queries/get-inventory-by-id.query';

@QueryHandler(GetInventoryByIdQuery)
export class GetInventoryByIdHandler extends HandleQuery {
    constructor(readonly db: DatabaseClient) {
        super();
    }

    async handle(query: QueryMessage<GetInventoryByIdQuery>) {
        return this.db.inventory.findUniqueOrThrow({
            where: {
                id: query.data.id,
            },
        });
    }
}
