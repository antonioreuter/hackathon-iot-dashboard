class ConnectionCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.connectionCache = localStorage.getItem('connectionCache') ?
      JSON.parse(localStorage.getItem('connectionCache')) : [];
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

  getRecords(applicationGuid = 'all') {
    return this.connectionCache.filter(d => d.record.applicationId === applicationGuid);
  }

  save() {
    localStorage.setItem('connectionCache', JSON.stringify(this.connectionCache));
  }
}
