import { Module } from '@nestjs/common';
import { DispatchShipmentHandler } from './command/dispatch-shipment.handler';
import { GetShipmentByIdHandler } from './query/get-shipment-by-id.handler';
import { ShipmentProjection } from './query/shipment.projection';
import { DeliverShipmentCommand } from './api/commands/deliver-shipment.command';

@Module({
    imports: [
        DispatchShipmentHandler,
        DeliverShipmentCommand,
        GetShipmentByIdHandler,
        ShipmentProjection,
    ],
    controllers: [],
    providers: [],
})
export class ShipmentModule {}
