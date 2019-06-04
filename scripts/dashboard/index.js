$(async () => {
  localStorage.clear();

  const retrieveSelectedApp = () => {
    const hash = location.hash ? location.hash.substring(1) : 'all';
    return hash || 'all';
  }

  const generateBreadcrumbs = (selectedApp) => {
    const appName = selectedApp === 'all' ? 'All applications' : selectedApp;
    return `
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">Philips</li>
          <li class="breadcrumb-item">Hackathon</li>
          <li class="breadcrumb-item active" aria-current="page">${appName}</li>
        </ol>
      </nav>
    `;
  };

  const generateConnectionBar = (lastElementCache) => {
    const recordStats = lastElementCache.record.stats.statistics;
    const connectedCount = recordStats.connectedDevices;
    const deviceCount = recordStats.connectedDevices + recordStats.disconnectedDevices;
    return `
      <div><strong>Number of connected devices: ${connectedCount} / ${deviceCount}</strong></div>
    `
  };

  const updateOverviewBar = (selectedApp, lastElementCache) => {
    $('#overview_bar').html(`
      ${generateBreadcrumbs(selectedApp)}
      ${generateConnectionBar(lastElementCache)}
    `);
  }

  const update = async (chartComponent, cache, selectedApp) => {
    const statsRes = selectedApp !== 'all' ? await axios.get(`/stats/application/${selectedApp}`) :
      await axios.get('/stats');
    cache.addRecord(moment().unix(), { applicationId: selectedApp, stats: statsRes.data });
    chartComponent.updateCache(cache.getRecords(selectedApp));
    updateOverviewBar(selectedApp, cache.getLastRecord(selectedApp));
  };

  let selectedApp = retrieveSelectedApp();
  const connectionChartElement = $('#connection_chart');
  const connectionCache = new ConnectionCache(20);
  const chartComponent = new ChartComponent(connectionChartElement, connectionCache.getRecords(selectedApp));
  await update(chartComponent, connectionCache, selectedApp);

  let interval = setInterval(() => update(chartComponent, connectionCache, selectedApp), 5000);


  $(window).on('hashchange', async () => {
    clearInterval(interval);
    selectedApp = retrieveSelectedApp();
    console.log(selectedApp);
    await update(chartComponent, connectionCache, selectedApp);
    interval = setInterval(() => update(chartComponent, connectionCache, selectedApp), 5000);
  });
});
