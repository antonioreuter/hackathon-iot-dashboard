class DeviceRepository {
  async getDevicesByApplication(applicationId = 'all') {
    try {
      const response = applicationId === 'all' ?
        await axios.get('/thingnames') : await axios.get(`/devices?thingGroup=${applicationId}`);
      if (response.data.message) {
        return [];
      }
      const connectionStatusReq = response.data.map(async (deviceName) => {
        const connectionStats = await axios.get(`/stats/thing/${deviceName}`);
        const stats = connectionStats.data || { isConnected: false };
        console.log(stats);
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
