import { UserDTO } from './userDTO';
import { CustomerDTO } from './customerDTO';
import { OrderItem } from './orderItem';

interface DataRow {
    CustomerID?: string;
    BranchID?: string;
    SalesManID?: string;
    Park?: boolean;
    Edittable?: boolean;
    ReceivingBranch?: number;
    ReceivingNotes?: string;
    Canceled?: boolean;
    OrderDeliveryDate?: Date;
    UrgentDeliveryDate?: Date;
}
export interface ItemsTypes {
    TypeId?: number;
}
export interface OrderRequest {
    operation?: string,
    Datarow?: DataRow,
    ListDataRow2?: OrderItem[],
    Order_Type?: ItemsTypes[]
}