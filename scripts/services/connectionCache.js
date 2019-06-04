class ConnectionCache {
  constructor(maxSize = 50) {
    this.maxSize = 50;
    this.connectionCache = JSON.parse(localStorage.getItem('connectionCache'));
  }

  addRecord(timestamp, record) {
    if (this.connectionCache.length > this.maxSize) {
      this.connectionCache.shift(this.connectionCache.length - this.maxSize);
    }
    this.connectionCache.push({
      timestamp, record
    });
    this.save();
  };

  save() {
    localStorage.setItem('connectionCache', JSON.stringify(connectionCache));
  }
}
