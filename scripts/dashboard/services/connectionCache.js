const EMPTY_RECORD = { timestamp: 0, record: { stats: { statistics: { connectedDevices: 0, disconnectedDevices: 0 } } } };

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
    console.log(this.connectionCache);
    this.save();
  };

  getRecords(applicationGuid = 'all') {
    return this.connectionCache.filter(d => d.record.applicationId === applicationGuid);
  }

  getLastRecord(applicationGuid = 'all') {
    const records = this.getRecords(applicationGuid);
    if (records.length === 0) {
      return { ...EMPTY_RECORD };
    }
    return records[records.length - 1];
  }

  save() {
    localStorage.setItem('connectionCache', JSON.stringify(this.connectionCache));
  }
}
