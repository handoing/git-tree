class Polygon {
  constructor(options) {
    console.log('polygon')
    this.name = options.name
    this.slots = []
  }
  setHost(name) {
    this.hostName = name
  }
  getHost() {
    return this.hostName
  }
  slot(slots) {
    this.slots = slots
    this.slots.map((polygon) => {
      polygon.setHost(this.name)
    })
  }
  connect() {
    this.slots.map((polygon) => {
      polygon.connect()
    })
    this.connected()
  }
  connected() {}
  getSlot() {}
  setSlot() {}
}

class InfoFlowPolygon extends Polygon {
  constructor(options) {
    super(options)
  }
  connected() {
    console.log(this.name + ' connect')
  }
}

class InfoFlowViewPolygon extends Polygon {
  constructor(options) {
    super(options)
  }
  connected() {
    console.log(this.name + ' connect')
  }
}

class InfoFlowMonitorPolygon extends Polygon {
  constructor(options) {
    super(options)
  }
  connected() {
    console.log(this.name + ' connect')
  }
}

const polygon = new InfoFlowPolygon({
  name: 'InfoFlowPolygon'
});

const viewPolygon = new InfoFlowViewPolygon({
  name: 'InfoFlowViewPolygon'
});
const monitorPolygon = new InfoFlowMonitorPolygon({
  name: 'InfoFlowMonitorPolygon'
});

class TestPolygon extends Polygon {
  constructor(options) {
    super(options)
  }
  connected() {
    console.log(this.name + ' connect')
  }
}

const testPolygon = new TestPolygon({
  name: 'test'
});

polygon.slot([
  viewPolygon,
  monitorPolygon
])

viewPolygon.slot([
  testPolygon
])

polygon.connect();

console.log(viewPolygon.getHost())

// polygon.getSlot();
// polygon.setSlot();
