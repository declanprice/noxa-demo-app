import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { ProductCatalogModule } from './product-catalog/product-catalog.module';
import { InventoryModule } from './inventory/inventory.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { ShipmentModule } from './shipping/shipment.module';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { NoxaModule, RabbitmqBus } from '@declanprice/noxa';
@Module({
    imports: [
        AuthModule.forRoot({
            connectionURI: 'http://localhost:3567',
            appInfo: {
                appName: 'Shop',
                apiDomain: 'http://localhost:3000',
                websiteDomain: 'http://localhost:4200',
                apiBasePath: '/auth',
                websiteBasePath: '/auth',
            },
        }),
        GraphqlModule,
        NoxaModule.forRoot({
            serviceName: 'Shop',
            bus: new RabbitmqBus({
                connectionUrl: 'amqp://localhost:5672',
            }),
            asyncDaemon: {
                enabled: true,
            },
        }),
        // CustomersModule,
        // InventoryModule,
        // PaymentsModule,
        // OrdersModule,
        // ShipmentModule,
        // ProductCatalogModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
