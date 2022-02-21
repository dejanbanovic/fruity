export class ListFruitsDTO {
  constructor() {
    this.skip = 0;
    this.take = 100;
    this.name = '';
    this.stockGreaterThen = 0;
    this.stockSmallerThen = 9999999999999;
  }
  skip: number;
  take: number;
  name?: string;
  stockGreaterThen?: number;
  stockSmallerThen?: number;
}
