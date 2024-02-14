import { OrderRequestedEvent } from '../api/events/order-requested.event';
import { ValidateProductsCommand } from '../../product-catalog/api/commands/validate-products.command';
import { ValidateInventoryCommand } from '../../inventory/api/commands/validate-inventory.command';
import { ProductsValidatedEvent } from '../../product-catalog/api/events/products-validated.event';
import { OrderLineItem } from '../api/commands/order-line-item.type';
import { InventoryValidationFailedEvent } from '../../inventory/api/events/inventory-validation-failed.event';
import { PaymentCapturedEvent } from '../../payments/api/events/payment-captured.event';
import { ShipmentDeliveredEvent } from '../../shipping/api/events/shipment-delivered.event';
import { OrderCompleteEvent } from '../api/events/order-complete.event';
import { ProductsValidationFailedEvent } from '../../product-catalog/api/events/products-validation-failed.event';
import { OrderCanceledEvent } from '../api/events/order-canceled.event';
import { CompleteOrderCommand } from '../api/commands/complete-order.command';
import { CapturePaymentCommand } from '../../payments/api/commands/capture-payment.command';
import { RefundPaymentCommand } from '../../payments/api/commands/refund-payment.command';
import { CancelOrderCommand } from '../api/commands/cancel-order.command';
import { InventoryValidationSuccessEvent } from '../../inventory/api/events/inventory-validation-success.event';
import { PlaceOrderCommand } from '../api/commands/place-order.command';

import {
    OutboxStore,
    Process,
    ProcessHandler,
    RabbitmqEventConsumerType,
} from '@declanprice/noxa';
import { ProcessSession } from '@declanprice/noxa/dist/lib/handlers/process/process.session';

type OrderProcessData = {
    orderId: string;
    paymentId: string;
    customerId: string;
    lineItems: OrderLineItem[];
    paymentCaptured: boolean;
};

@Process({
    consumerType: RabbitmqEventConsumerType.SINGLE_ACTIVE_CONSUMER,
    defaultAssociationKey: 'orderId',
})
export class OrderProcess {
    constructor(readonly outbox: OutboxStore) {}

    @ProcessHandler(OrderRequestedEvent, { start: true })
    async onOrderPlaced(
        session: ProcessSession<OrderRequestedEvent, OrderProcessData>,
    ) {
        const { event, data, tx } = session;

        data.orderId = event.data.orderId;
        data.customerId = event.data.customerId;
        data.paymentId = event.data.paymentId;
        data.lineItems = event.data.lineItems;
        data.paymentCaptured = false;

        await this.outbox.command(
            new ValidateProductsCommand(
                event.data.orderId,
                event.data.lineItems.map((i) => ({
                    productId: i.productId,
                    inventoryId: i.inventoryId,
                    price: i.price,
                })),
            ),
            { tx },
        );
    }

    @ProcessHandler(ProductsValidatedEvent)
    async onProductsValidated(
        session: ProcessSession<ProductsValidatedEvent, OrderProcessData>,
    ) {
        const { event, data, tx } = session;

        await this.outbox.command(
            new ValidateInventoryCommand(
                event.data.orderId,
                session.data.lineItems.map((i) => ({
                    inventoryId: i.inventoryId,
                    quantity: i.quantity,
                })),
            ),
            {
                tx,
            },
        );
    }

    @ProcessHandler(InventoryValidationSuccessEvent)
    async onInventoryReserved(
        session: ProcessSession<
            InventoryValidationSuccessEvent,
            OrderProcessData
        >,
    ) {
        const { event, tx } = session;

        await this.outbox.command(
            new CapturePaymentCommand(event.data.orderId),
            {
                tx,
            },
        );
    }

    @ProcessHandler(PaymentCapturedEvent)
    async onPaymentCaptured(
        session: ProcessSession<PaymentCapturedEvent, OrderProcessData>,
    ) {
        const { event, data, tx } = session;

        data.paymentCaptured = true;

        await this.outbox.command(new PlaceOrderCommand(event.data.orderId), {
            tx,
        });
    }

    @ProcessHandler(ShipmentDeliveredEvent)
    async onShipmentDelivered(
        session: ProcessSession<ShipmentDeliveredEvent, OrderProcessData>,
    ) {
        const { event, tx } = session;

        await this.outbox.command(
            new CompleteOrderCommand(event.data.orderId),
            {
                tx,
            },
        );
    }

    @ProcessHandler(OrderCompleteEvent)
    async onComplete(
        session: ProcessSession<ShipmentDeliveredEvent, OrderProcessData>,
    ) {
        session.end();
    }

    /**
     *  Compensation Handlers
     */
    @ProcessHandler([
        ProductsValidationFailedEvent,
        InventoryValidationFailedEvent,
    ])
    async onFail(
        session: ProcessSession<
            ProductsValidationFailedEvent | InventoryValidationFailedEvent,
            OrderProcessData
        >,
    ) {
        const { event, tx } = session;

        await this.outbox.command(new CancelOrderCommand(event.data.orderId), {
            tx,
        });
    }

    @ProcessHandler(OrderCanceledEvent)
    async onCancel(
        session: ProcessSession<OrderCanceledEvent, OrderProcessData>,
    ) {
        const { tx } = session;

        if (session.data.paymentCaptured) {
            await this.outbox.command(
                new RefundPaymentCommand(session.data.paymentId),
                { tx },
            );
        }

        session.end();
    }
}
