class ChartComponent {
  constructor(container, cache) {
    this.container = container;
    this.cache = cache;
    this.init();
    $(window).on('resize', this.setCanvasSize.bind(this));
    this.setCanvasSize();
    this.createChart();
  }

  setCanvasSize() {
    this.ctx.width = this.container.innerWidth();
    this.ctx.height = this.container.innerHeight();
    this.canvas.height(this.container.innerHeight());
  }

  cacheToDataset() {
    const records = [...this.cache];
    const data = records.map(record => record.record.stats.statistics.connectedDevices);
    const labels = records.map(record => record.timestamp);
    return {
      data,
      labels
    };
  }

  retrieveChartConfig() {
    const options = {
      responsive: true,
      title: {
        display: true,
        text: 'Connections'
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Timestamp'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Number of connected devices'
          }
        }]
      }
    };
    const dataset = this.cacheToDataset();
    const config = {
      type: 'line',
      data: { labels: dataset.labels, datasets: [{ label: 'Timestamp', data: dataset.data }] },
      options
    };

    return config;
  }

  createChart() {
    this.chart = new Chart(this.ctx, this.retrieveChartConfig());
  }

  updateChart() {
    const dataset = this.cacheToDataset();
    this.chart.data.datasets[0].data = this.cacheToDataset().data;
    this.chart.data.labels = dataset.labels;
    this.chart.update();
  }

  updateCache(cache) {
    this.cache = cache;
    this.updateChart();
  }

  init() {
    this.component = $('<div>').css({
      padding: '20px 0'
    });
    this.canvas = $('<canvas>');
    this.ctx = this.canvas[0].getContext('2d');
    this.component.append(this.canvas);
    this.container.append(this.component);
  }
}
