import { HandleQuery, QueryHandler, QueryMessage } from '@declanprice/noxa';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';
import { FindInventoryByIdsQuery } from '../api/queries/find-inventory-by-ids.query';

@QueryHandler(FindInventoryByIdsQuery)
export class FindInventoryByIdsHandler extends HandleQuery {
    constructor(readonly db: DatabaseClient) {
        super();
    }

    async handle(query: QueryMessage<FindInventoryByIdsQuery>) {
        return this.db.inventory.findMany({
            where: {
                id: {
                    in: query.data.ids,
                },
            },
        });
    }
}
