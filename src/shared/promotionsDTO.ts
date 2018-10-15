import { OrderItem } from './orderItem';
export interface PromotionsDTO {
    PromotionID?: number;
    PromotionTypeNameEn?: string;
    PromotionTypeNameAr?: string;
    PromotionStartDate?: Date;
    PromotionEndDate?: Date;
    PromotionIsActive?: boolean;
    PromotionTypeID?: number;
    PromotionMaxItemNumber?: number;
    PromotionFixedPrice?: number;
    PromotionTotalPrice?: number;
    PromotionInvoiceDiscount?: number;
    PromotionItemNumber?: number;
    PromotionFreeItemNumber?: number;
    PromotionItemsToPaid?: number;
    Description?: string;
}
export interface CalcPromotion {
    promotion?: PromotionsDTO,
    items?: OrderItem[],
    totalPrice?: number

}