import { Projection, ProjectionHandler } from '@declanprice/noxa';
import { ProjectionSession } from '@declanprice/noxa/dist/lib/handlers/projection/projection-session.type';

import { CustomerRegistered } from '../api/events/customer-registered.event';

@Projection({
    batchSize: 100,
})
export class CustomersProjection {
    @ProjectionHandler(CustomerRegistered)
    onRegistered(session: ProjectionSession<CustomerRegistered>) {
        const { event, tx } = session;

        return tx.customers.create({
            data: {
                id: event.data.customerId,
                firstName: event.data.firstName,
                lastName: event.data.lastName,
                email: event.data.email,
            },
        });
    }
}
