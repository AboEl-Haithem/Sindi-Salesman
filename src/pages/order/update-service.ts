import { Injectable } from '@angular/core';
import { OrderItem } from '../../shared/orderItem';
import { CalcPromotion } from '../../shared/promotionsDTO';
import { OrderRequest, ItemsTypes } from '../../shared/orderRequest';
import { GetService } from '../../shared/getServices';

@Injectable()
export class UpdateService {
    constructor(private getService: GetService) { }

    singleItems: OrderItem[] = [];
    singleItemsPrice: number;

    valueArray: any[] = [];
    valuePromotions: CalcPromotion[] = [];

    percentageArray: any[] = [];
    percentagePromotions: CalcPromotion[] = [];
    totalPercentage: number;

    pieceArray: any[] = [];
    piecePromotions: CalcPromotion[] = [];

    fetchItems(items: OrderItem[]) {
        console.log('items', items);
        let tempValue = [];
        let tempValueFiltered = [];
        let tempValueIds = [];

        let tempPiece = [];
        let tempPieceFiltered = [];
        let tempPieceIds = [];

        let tempPercentage = [];
        let tempPercFiltered = [];
        let tempPercentageIds = [];
        items.forEach(item => {
            if (item.PromotionTypeID == null || item.PromotionTypeID == 0) {
                this.singleItems.push(item);
            }
            if (item.PromotionTypeID == 1) {
                tempValue.push(item);
            }
            if (item.PromotionTypeID == 2) {
                tempPercentage.push(item);
            }
            if (item.PromotionTypeID == 3) {
                tempPiece.push(item);
            }
        });
        if (this.singleItems.length > 0) {
            this.singleItemsTotal();
        }
        tempValue.forEach(item => {
            tempValueIds.push(item.PromotionSubId);
        });
        tempPercentage.forEach(item => {
            tempPercentageIds.push(item.PromotionSubId);
        });
        tempPiece.forEach(item => {
            tempPieceIds.push(item.PromotionSubId);
        });

        let filteredValIds = this.remove_duplicated(tempValueIds);
        let filteredPieceIds = this.remove_duplicated(tempPieceIds);
        let filteredPercIds = this.remove_duplicated(tempPercentageIds);
        filteredValIds.forEach(id => {
            tempValueFiltered = [];
            tempValue.forEach(item => {
                if (item.PromotionSubId == id) {
                    tempValueFiltered.push(item);
                }
            });
            this.valueArray.push(tempValueFiltered);
            for (let i = 0; i < this.valueArray.length; i++) {
                this.valuePromotions[i] = { items: [] };
                this.valuePromotions[i].items = this.valueArray[i];
            }
        });
        filteredPieceIds.forEach(id => {
            tempPieceFiltered = [];
            tempPiece.forEach(item => {
                if (item.PromotionSubId == id) {
                    tempPieceFiltered.push(item);
                }
            });
            this.pieceArray.push(tempValueFiltered);
            for (let i = 0; i < this.pieceArray.length; i++) {
                this.piecePromotions[i] = { items: [] };
                this.piecePromotions[i].items = this.pieceArray[i];
            }
        });
        filteredPercIds.forEach(id => {
            tempPercFiltered = [];
            tempPercentage.forEach(item => {
                if (item.PromotionSubId == id) {
                    tempPercFiltered.push(item);
                }
            });
            this.percentageArray.push(tempPercFiltered);
            for (let i = 0; i < this.percentageArray.length; i++) {
                this.percentagePromotions[i] = { items: [] };
                this.percentagePromotions[i].items = this.percentageArray[i];
            }
        });
        for (let i = 0; i < this.valuePromotions.length; i++) {
            this.getService.getPromotionById(this.valuePromotions[i].items[0].PromotionID).subscribe(resp => {
                this.valuePromotions[i].promotion = resp;
            });
            this.valuePromotions[i].totalPrice = this.valuePromotions[i].items[0].PromotionTotalPrice;
        }
        for (let i = 0; i < this.piecePromotions.length; i++) {
            this.getService.getPromotionById(this.piecePromotions[i].items[0].PromotionID).subscribe(resp => {
                this.piecePromotions[i].promotion = resp;
            });
            this.piecePromotions[i].totalPrice = this.piecePromotions[i].items[0].PromotionTotalPrice;
        }
        for (let i = 0; i < this.percentagePromotions.length; i++) { 
            this.getService.getPromotionById(this.percentagePromotions[i].items[0].PromotionID).subscribe(resp => {
                this.percentagePromotions[i].promotion = resp;
            });
            this.percentagePromotions[i].totalPrice = this.percentagePromotions[i].items[0].PromotionTotalPrice;
        }
        return ({
            singleItems: this.singleItems,
            singleItemsPrice: this.singleItemsPrice,

            valuePromotions: this.valuePromotions,
            valueArray: this.valueArray,

            piecePromotions: this.piecePromotions,
            pieceArray: this.pieceArray,

            percentagePromotions: this.percentagePromotions,
            percentageArray: this.percentageArray,
        });
    }
    singleItemsTotal() {
        this.singleItemsPrice = 0;
        this.singleItems.forEach(item => {
            this.singleItemsPrice += item.TotalPrice;
        });
    }
    remove_duplicated(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] == arr[i + 1]) {
                arr.splice(i, 1);
                i--;
            }
        }
        let orderTypes: ItemsTypes[] = [];
        arr.forEach(element => {
            orderTypes.push(element);
        });
        return orderTypes;
    }
}