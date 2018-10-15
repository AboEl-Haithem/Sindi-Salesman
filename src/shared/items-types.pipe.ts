import {Pipe, PipeTransform} from '@angular/core';
@Pipe ({
   name : 'itemType'
})
export class ItemsTypes implements PipeTransform {
   transform(type : string) {
        let id: number;
        switch (type) {
            case 'T':{
                id = 1;
                break; 
            }
            case 'R':{
                id = 2;
                break; 
            }
            case 'D':{
                id = 3;
                break; 
            }
            case 'E':{
                id = 4;
                break; 
            }
            case 'J':{
                id = 5;
                break; 
            }
            case 'M':{
                id = 6;
                break; 
            }
            default:{
                id = 0;
                break; 
            }
        }
        return id;
    }
}