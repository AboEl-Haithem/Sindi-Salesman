export interface BranchSettings {
    BranchId?: string;
    BranchName?: string;
    Id?: string;
    NumOfDeliveryDays?: number;
    NumOfurgentDeliveryDays?: number;
    UrgentDeliveryFees?: number;
    LogoPrice?: number;
    NumOfBrovaDays?: number;
}

export interface Branches {
    BranchCode?: number;
    BranchName?: string;
}