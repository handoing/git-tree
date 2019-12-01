var data = 1;

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

function main(pageName) {

    let app = new Scaffold({
        appBar: new AppBar({
            title: new Text("JSFlutter UI Demo")
        }),
        body: new Text(data)
    });

    runApp(app);

}

function runApp(widget) {
    var jsonTree = JSON.stringify(widget);
    MXNativeJSFlutterApp.sendJSON({data: jsonTree});
}

function update(arg) {
    data = data + 2;
    let app = new Scaffold({
        appBar: new AppBar({
            title: new Text("JSFlutter UI Demo")
        }),
        body: new Text(data)
    });
    runApp(app);
    return 1;
}

main()
