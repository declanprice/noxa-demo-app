import { HandleQuery, QueryHandler, QueryMessage } from '@declanprice/noxa';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';
import { GetPaymentByIdQuery } from '../api/queries/get-payment-by-id.query';

@QueryHandler(GetPaymentByIdQuery)
export class GetPaymentByIdHandler extends HandleQuery {
    constructor(readonly db: DatabaseClient) {
        super();
    }

    async handle(query: QueryMessage<GetPaymentByIdQuery>) {
        return this.db.payments.findUniqueOrThrow({
            where: {
                id: query.data.id,
            },
        });
    }
}
