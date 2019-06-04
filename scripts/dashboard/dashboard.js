$(() => {
  localStorage.clear();
  const update = async (chartComponent, cache, selectedApp) => {
    const statsRes = selectedApp !== 'all' ? await axios.get(`/stats/application/${selectedApp}`) :
      await axios.get('/stats');
    cache.addRecord(moment().unix(), { applicationId: selectedApp, stats: statsRes.data });
    chartComponent.updateCache(cache.getRecords(selectedApp));
  };

  let selectedApp = 'all';
  const connectionChartElement = $('#connection_chart');
  const connectionCache = new ConnectionCache(20);
  const chartComponent = new ChartComponent(connectionChartElement, connectionCache.getRecords(selectedApp));
  update(chartComponent, connectionCache);

  setInterval(() => update(chartComponent, connectionCache, selectedApp), 5000);
});
