import { HandleQuery, QueryHandler, QueryMessage } from '@declanprice/noxa';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';
import { GetCustomerById } from '../api/queries/get-customer-by-id.query';

@QueryHandler(GetCustomerById)
export class GetCustomerByIdHandler extends HandleQuery {
    constructor(readonly db: DatabaseClient) {
        super();
    }

    async handle(query: QueryMessage<GetCustomerById>) {
        return this.db.customers.findUnique({
            where: {
                id: query.data.customerId,
            },
        });
    }
}
