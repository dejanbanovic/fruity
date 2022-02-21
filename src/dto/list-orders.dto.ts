export class ListOrdersDTO {
  constructor() {
    this.skip = 0;
    this.take = 100;
    this.fruitId = [];
    this.customerId = [];
  }
  skip: number;
  take: number;
  fruitId: number[];
  customerId: number[];
}
