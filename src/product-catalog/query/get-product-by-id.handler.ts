import { GetProductById } from '../api/queries/get-product-by-id.query';
import { HandleQuery, QueryHandler, QueryMessage } from '@declanprice/noxa';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';

@QueryHandler(GetProductById)
export class GetProductByIdHandler extends HandleQuery {
    constructor(readonly db: DatabaseClient) {
        super();
    }

    async handle(query: QueryMessage<GetProductById>) {
        return this.db.products.findUniqueOrThrow({
            where: {
                id: query.data.id,
            },
        });
    }
}
