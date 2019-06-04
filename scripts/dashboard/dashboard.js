$(() => {
  localStorage.clear();

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

  const updateOverviewBar = (overviewBar, selectedApp, lastElementCache) => {
    overviewBar.html(`
      ${generateBreadcrumbs(selectedApp)}
      ${generateConnectionBar(lastElementCache)}
    `);
  }

  const update = async (chartComponent, cache, selectedApp) => {
    const statsRes = selectedApp !== 'all' ? await axios.get(`/stats/application/${selectedApp}`) :
      await axios.get('/stats');
    cache.addRecord(moment().unix(), { applicationId: selectedApp, stats: statsRes.data });
    chartComponent.updateCache(cache.getRecords(selectedApp));
    updateOverviewBar($('#overview_bar'), selectedApp, cache.getLastRecord(selectedApp));
  };

  let selectedApp = location.hash ? location.hash.substring(1) : 'all';
  const connectionChartElement = $('#connection_chart');
  const connectionCache = new ConnectionCache(20);
  const chartComponent = new ChartComponent(connectionChartElement, connectionCache.getRecords(selectedApp));
  update(chartComponent, connectionCache, selectedApp);

  let interval = setInterval(() => update(chartComponent, connectionCache, selectedApp), 5000);


  $(window).on('hashchange', () => {
    clearInterval(interval);
    selectedApp = location.hash ? location.hash.substring(1) : 'all';
    console.log(selectedApp);
    update(chartComponent, connectionCache, selectedApp);
    interval = setInterval(() => update(chartComponent, connectionCache, selectedApp), 5000);
  });
});
