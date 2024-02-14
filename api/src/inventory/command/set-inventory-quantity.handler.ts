import {
    CommandHandler,
    CommandMessage,
    HandleCommand,
} from '@declanprice/noxa';
import { SetInventoryQuantityCommand } from '../api/commands/set-inventory-quantity.command';
import { DatabaseClient } from '@declanprice/noxa/dist/lib/store/database-client.service';

@CommandHandler(SetInventoryQuantityCommand)
export class SetInventoryQuantityHandler extends HandleCommand {
    constructor(readonly db: DatabaseClient) {
        super();
    }

    async handle(command: CommandMessage<SetInventoryQuantityCommand>) {
        return this.db.inventory.upsert({
            where: {
                id: command.data.inventoryId,
            },
            create: {
                id: command.data.inventoryId,
                quantityAvailable: command.data.quantity,
            },
            update: {
                id: command.data.inventoryId,
                quantityAvailable: command.data.quantity,
            },
        });
    }
}
