import {
    CommandHandler,
    CommandMessage,
    HandleCommand,
    OutboxStore,
} from '@declanprice/noxa';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';

import { ValidateInventoryCommand } from '../api/commands/validate-inventory.command';
import { InventoryValidationSuccessEvent } from '../api/events/inventory-validation-success.event';
import { InventoryValidationFailedEvent } from '../api/events/inventory-validation-failed.event';

@CommandHandler(ValidateInventoryCommand)
export class ValidateInventoryHandler extends HandleCommand {
    constructor(
        readonly db: DatabaseClient,
        readonly outbox: OutboxStore,
    ) {
        super();
    }

    async handle(command: CommandMessage<ValidateInventoryCommand>) {
        const orderId = command.data.orderId;

        const validateInventory = command.data.inventory;

        let isValid = true;

        for (const { inventoryId, quantity } of validateInventory) {
            const foundInventory = await this.db.inventory.findUniqueOrThrow({
                where: {
                    id: inventoryId,
                },
            });

            if (foundInventory.quantityAvailable - quantity < 0) {
                isValid = false;
            }
        }

        if (isValid) {
            await this.outbox.event(
                new InventoryValidationSuccessEvent(orderId),
            );
        } else {
            await this.outbox.event(
                new InventoryValidationFailedEvent(orderId),
            );
        }
    }
}
