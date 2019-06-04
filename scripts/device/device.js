$(() => {
  const loadDevice = async (deviceId) => {
    deviceId = "airpurifier01";
    const response = await axios.get(`/devices/${deviceId}`);
    const device = response.data;

    console.log(`Device: ${JSON.stringify(device)}`);
    $('#thing_content').empty()
    $('#thing_content').append(`
    <dl class="row">
      <dt class="col-sm-3">Client Id</dt>
      <dt class="col-sm-9">${device.clientId}</dt>

      <dt class="col-sm-3">Name</dt>
      <dt class="col-sm-9">${device.name}</dt>

      <dt class="col-sm-3">Type</dt>
      <dt class="col-sm-9">${device.thingTypeName}</dt>

      <dt class="col-sm-3">Version</dt>
      <dt class="col-sm-9">${device.version}</dt>
    </dl>
    `);
  }

  loadDevice();
});
