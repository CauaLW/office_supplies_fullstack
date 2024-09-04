export interface RequestInterface {
    id: number;
    applicantName: string;
    itemPrice: number;
    itemDescription: string;
    approved?: boolean;
    observations?: string;

    getFormattedPrice(): string;
}

export class RequestModel implements RequestInterface {
    constructor(
        public id: number,
        public applicantName: string,
        public itemPrice: number,
        public itemDescription: string,
        public approved?: boolean,
        public observations?: string
    ) { }

    static fromObject(object: RequestInterface) {
        return new RequestModel(
            object.id,
            object.applicantName,
            object.itemPrice,
            object.itemDescription,
            object.approved,
            object.observations
        )
    }

    getFormattedPrice(): string {
        const priceInBrl = this.itemPrice / 100
        return `R$${priceInBrl.toFixed(2)}`
    }
}