class ChartComponent {
  constructor(container, cache) {
    this.container = container;
    this.cache = cache;
    this.init();
    $(window).on('resize', this.setCanvasSize.bind(this));
    this.setCanvasSize();
  }

  setCanvasSize() {
    this.ctx.width = this.container.innerWidth();
    this.ctx.height = this.container.innerHeight();
    this.canvas.height(this.container.innerHeight());
  }

  updateCache(cache) {

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
