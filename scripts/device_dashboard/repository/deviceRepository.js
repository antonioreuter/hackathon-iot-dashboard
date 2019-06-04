class DeviceRepository {

  async getDevicesByApplication(applicationId = 'all') {
    try {
      const response = applicationId === 'all' ?
        await axios.get('/thingnames') : await axios.get(`/devices?thingGroup=${applicationId}`);
      if (response.data.message) {
        return [];
      }
      return response.data.map(deviceName => ({ deviceName }));
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
