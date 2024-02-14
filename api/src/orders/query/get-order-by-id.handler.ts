import { GetOrderByIdQuery } from '../api/queries/get-order-by-id.query';
import { HandleQuery, QueryHandler, QueryMessage } from '@declanprice/noxa';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdHandler extends HandleQuery {
    constructor(readonly db: DatabaseClient) {
        super();
    }

    async handle(query: QueryMessage<GetOrderByIdQuery>) {
        return this.db.orders.findUniqueOrThrow({
            where: {
                id: query.data.id,
            },
        });
    }
}
