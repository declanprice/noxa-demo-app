import { HandleQuery, QueryHandler, QueryMessage } from '@declanprice/noxa';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';
import { SearchProductsQuery } from '../api/queries/search-products.query';

@QueryHandler(SearchProductsQuery)
export class SearchProductsHandler extends HandleQuery {
    constructor(readonly db: DatabaseClient) {
        super();
    }

    async handle(query: QueryMessage<SearchProductsQuery>) {
        const { data } = query;

        if (data?.name) {
            return this.db.products.findMany({
                where: {
                    name: data.name,
                },
            });
        }

        return this.db.products.findMany();
    }
}
