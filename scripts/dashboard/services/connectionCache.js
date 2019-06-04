class ConnectionCache {
  constructor(maxSize = 50) {
    this.maxSize = 50;
    this.connectionCache = localStorage.getItem('connectionCache') ?
      JSON.parse(localStorage.getItem('connectionCache')) : [];
  }

  addRecord(timestamp, record) {
    if (this.connectionCache.length > this.maxSize) {
      this.connectionCache.shift(this.connectionCache.length - this.maxSize);
    }
    console.log(this.connectionCache);
    this.connectionCache.push({
      timestamp, record
    });
    this.save();
  };

  getRecords() {
    return this.connectionCache;
  }

  save() {
    localStorage.setItem('connectionCache', JSON.stringify(this.connectionCache));
  }
}
