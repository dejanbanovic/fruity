export class ListOrdersDTO {
  constructor() {
    this.skip = 0;
    this.take = 100;
    this.fruitIds = '';
    this.customerIds = '';
  }
  skip: number;
  take: number;
  fruitIds: string;
  customerIds: string;
}
