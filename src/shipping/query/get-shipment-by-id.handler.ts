import { HandleQuery, QueryHandler, QueryMessage } from '@declanprice/noxa';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';
import { GetShipmentByIdQuery } from '../api/queries/get-shipment-by-id.query';

@QueryHandler(GetShipmentByIdQuery)
export class GetShipmentByIdHandler extends HandleQuery {
    constructor(readonly db: DatabaseClient) {
        super();
    }

    async handle(query: QueryMessage<GetShipmentByIdQuery>) {
        return this.db.shipments.findUniqueOrThrow({
            where: {
                id: query.data.id,
            },
        });
    }
}
