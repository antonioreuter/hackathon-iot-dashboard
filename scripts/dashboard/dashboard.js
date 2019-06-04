$(() => {
  localStorage.clear();
  const update = async (chartComponent, cache) => {
    const statsRes = selectedApp ? await axios.get(`/stats/application/${selectedApp}`) :
      await axios.get('/stats');
    console.log(cache);
    cache.addRecord(moment().unix(), statsRes.data);
    chartComponent.updateCache(cache);
    console.log(cache.connectionCache);
  };

  let selectedApp = '';
  const connectionChartElement = $('#connection_chart');
  const connectionCache = new ConnectionCache(200);
  const chartComponent = new ChartComponent(connectionChartElement, connectionCache);
  update(chartComponent, connectionCache);

  setInterval(() => update(chartComponent, connectionCache), 300);
});
