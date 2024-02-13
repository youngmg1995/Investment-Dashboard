class Portfolio {
  data: any[];

  constructor(data: any[]) {
    this.data = data;
  }

  appendData(new_data: any[]) {
    this.data = this.data.concat(new_data);
  }
}

export default Portfolio;