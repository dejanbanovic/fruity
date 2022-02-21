export class ListCustomersDTO {
  constructor() {
    this.skip = 0;
    this.take = 100;
    this.name = '';
    this.location = '';
  }

  skip?: number;
  take?: number;
  name?: string;
  location?: string;
}
