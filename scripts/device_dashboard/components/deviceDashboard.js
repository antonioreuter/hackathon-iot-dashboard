const splitIntoChunks = (array, chunkSize = 3) => {
  const result = [];
  for (let i = 0, j = array.length; i < j; i += chunkSize) {
    const temparray = array.slice(i, i + chunkSize);
    result.push(temparray);
  }
  return result;
}

class DeviceDashboard {
  constructor(container, records = []) {
    this.container = container;
    this.init(records);
  }

  generateDeviceComponent(record) {
    const alertClass = record.isConnected ? 'alert-success' : 'alert-danger';
    const alertMessage = record.isConnected ? 'Connected' : 'Disconnected';
    const component = $('<div>').addClass('col-sm-4')
      .html(`
        <div class="card mb-4 box-shadow">
          <div class="card-body">
              <p class="card-text">${record.deviceName}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-outline-secondary">View</button>
                </div>
                <div class="alert ${alertClass}" role="alert">
                  ${alertMessage}
                </div>
              </div>
            </div>
          </div>
      `);
    return component;
  }

  generateRows(records) {
    this.container.empty();

    const recordChunks = splitIntoChunks(records, 4);

    const rows = recordChunks.map(recordChunk => {
      const row = $('<div>').addClass('row');
      const components = recordChunk.map(record => this.generateDeviceComponent(record));
      row.append(components);
      return row;
    });

    this.container.append(rows);
  }

  init(records = []) {
    this.generateRows(records);
  }

  update(records) {
    this.generateRows(records);
  }
}
