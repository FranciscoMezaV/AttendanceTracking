import { AccountId } from 'near-sdk-js/lib/types';
export class attendace_model{
    check: boolean;
    checker: AccountId;
    class_id: string;

    constructor({check, checker, class_id}: attendace_model){
        this.check = check;
        this.checker = checker;
        this.class_id = class_id;
    }
}