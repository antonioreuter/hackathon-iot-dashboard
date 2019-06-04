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

  const updateOverviewBar = (selectedApp) => {
    $('#overview_bar').html(`
      ${generateBreadcrumbs(selectedApp)}
    `);
  };

  const retrieveRecords = async (selectedApp) => {
    const repo = new DeviceRepository();
    return repo.getDevicesByApplication(selectedApp);
  };

  const update = async (dashboard, selectedApp) => {
    updateOverviewBar(selectedApp);
    const records = await retrieveRecords(selectedApp);
    dashboard.update(records);
  };

  let selectedApp = retrieveSelectedApp();
  const records = await retrieveRecords(selectedApp);
  const deviceDashboard = new DeviceDashboard($('#device_dashboard'), records);
  updateOverviewBar(selectedApp);
  await update(deviceDashboard, selectedApp);

  $(window).on('hashchange', async () => {
    selectedApp = retrieveSelectedApp();
    console.log(selectedApp);
    await update(deviceDashboard, selectedApp);
  });
});
