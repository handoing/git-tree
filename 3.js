class Scaffold {
    constructor(options) {
        this.widgetName = "Scaffold";
        this.appBar = options.appBar;
        this.body = options.body;
    }
}

class AppBar {
    constructor(options) {
        this.widgetName = "AppBar";
        this.title = options.title;
    }
}

class Text {
    constructor(str) {
        this.widgetName = "Text";
        this.text = str;
    }
}

class Column {
    constructor(options) {
        this.widgetName = "Column";
        this.children = options.children;
    }
}

class GestureDetector {
    constructor(options) {
        this.widgetName = "GestureDetector";
        this.child = options.child;
        this.onTap = EventHandle.bindEvent(options.onTap);
    }
}

class StateWidget {
  constructor() {
    this.widgetName = "StateWidget";
  }

  setState(fun) {
    fun.call(this);
    buildOwner.updateWidget();
  }
}

var EventHandle = (function() {
  var id = 0;
  var idMap = {};
  var prefix = 'event_';

  return {
    bindEvent: function(fun) {
      var eventKey = `${prefix}${++id}`;
      idMap[eventKey] = fun;
      return eventKey;
    },
    getEventMap: function() {
      return idMap;
    },
    fireEvent: function(event) {
      idMap[event] && idMap[event]();
    }
  }
})()

function updateEvent(event) {
//  NativeJSFlutterApp.log({data: event});
  EventHandle.fireEvent(event);
}

var buildOwner = (function() {
  var currentWidget = {};

  var toJSON = function() {
    var jsonTree = JSON.stringify(currentWidget);
    // js -> flutter 更新jsonTree
    NativeJSFlutterApp.sendJSON({data: jsonTree});
  }

  return {
    initWidget: function(widget) {
      currentWidget = widget;
      deepTraversal(currentWidget);
      toJSON();
    },
    getCurrentWidget: function() {
      return currentWidget;
    },
    updateWidget: function() {
      deepTraversal(currentWidget);
      toJSON();
    }
  }
})()

var supperTraversalKeys = [
  'child',
  'appBar',
  'body',
];

function deepTraversal(node){
    let nodes = [];

    if (node.widgetName == 'StateWidget'){
        node.child = node.build();
    }

    nodes.push[node];

    if (node.children) {
      let childrens = node.children;
      for(let i = 0; i < childrens.length; i++) {
        deepTraversal(childrens[i]);
      }
    }

    supperTraversalKeys.forEach(function(key) {
      if (key in node) {
        deepTraversal(node[key]);
      }
    })

    return nodes;
}

function runApp(widget) {
  buildOwner.initWidget(widget);
}

// -----------[code]-------------

class CustomlessWidget extends StateWidget {

    build() {
      return new Text('CustomWidget')
    }
}

class CustomfulWidget extends StateWidget {
    constructor() {
      super();
    }

    build() {
      return new Text('CustomWidget')
    }
}

class RootWidget extends StateWidget {
    constructor() {
      super();
      this.state = {
        count: 0
      };
    }

    increment() {
      this.setState(function() {
        this.state.count++;
      });
    }

    decrement() {
      this.setState(function() {
        this.state.count--;
      });
    }

    double() {
      this.setState(function() {
        this.state.count = this.state.count * 2;
      });
    }

    build() {
      let app = new Scaffold({
        appBar: new AppBar({
            title: new Text("Flutter Demo")
        }),
        body: new Column({
          children: [
            new GestureDetector({
              onTap: this.increment.bind(this),
              child: new Text('increment')
            }),
            new Text(`${this.state.count}`),
            new GestureDetector({
              onTap: this.decrement.bind(this),
              child: new Text('decrement')
            }),
            new GestureDetector({
              onTap: this.double.bind(this),
              child: new Text('double')
            })
          ]
        })
      });

      return app;
    }
}

function main() {
  runApp(new RootWidget());
}
