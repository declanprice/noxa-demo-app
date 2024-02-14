import { HandleQuery, QueryHandler } from '../../../lib';
import { GetPaymentByIdQuery } from '../api/queries/get-payment-by-id.query';
import { paymentsTable } from '../../schema';

@QueryHandler(GetPaymentByIdQuery)
export class GetPaymentByIdHandler extends HandleQuery {
    async handle(query: GetPaymentByIdQuery) {
        return this.dataStore.get(paymentsTable, query.id);
    }
}
