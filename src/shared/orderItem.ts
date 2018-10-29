export interface OrderItem {
    ItemCode?: string;
    ItemType?: number;
    ItemName?: string;
    ItemPrice?: number;
    ItmsGrpCod?: number;

    FabricId?: string;
    FabricName?: string
    FabricPrice?: number;
    FabricTypeID?: number;

    SecondaryFabricId?: string;
    SecondaryFabricName?: string;

    LogoId?: string;
    LogoTypeId?: number;
    LogoName?: string;
    LogoPrice?: number;

    Urgent?: boolean;
    UrgentCost?: number;

    Prova?: boolean;
    ProvaDate?: Date;

    Count?: number;

    HigherPrice?: number;
    piecePrice?: number;
    TotalPrice?: number;

    PromotionID?: number;
    PromotionTypeID?: number;
    promotionSubID?: number;
    PromotionPrice?: number;
    PromotionTotalPrice?: number;
}