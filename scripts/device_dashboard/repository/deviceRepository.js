class DeviceRepository {
  async getDevicesByApplication(applicationId = 'all') {
    try {
      const response = applicationId === 'all' ?
        await axios.get('/thingnames') : await axios.get(`/devices?thingGroup=${applicationId}`);
      if (response.data.message) {
        return [];
      }
      const connectionStatusReq = response.data.map(async (deviceName) => {
        const stats = await axios.get(`/stats/thing/${deviceName}`).data || {};
        return {
          deviceName,
          isConnected: stats.isConnected
        }
      });
      return Promise.all(connectionStatusReq);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
