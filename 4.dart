import 'dart:convert';
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class FlutterEvent {
  static void fire(event) async {
    // flutter -> js
    await FlutterDynamic.jsFlutterMainChannel.invokeMethod('callJsUpdateJsonTree', {
      "event": event
    });

    String resultJson = await FlutterDynamic.jsFlutterMainChannel.invokeMethod('getJSON');
    var node = jsonDecode(resultJson);
    streamController.add(node);

  }
}

StreamController streamController = StreamController();

class StateWidgetParser {

  bool forWidget(String widgetName) {
    return "StateWidget" == widgetName;
  }

  Widget parse(Map node) {
    Widget child = node['child'] == null ? null : DynamicWidgetBuilder.buildWidget(node['child']);
    return child;
  }
}

class ScaffoldWidgetParser {

  bool forWidget(String widgetName) {
    return "Scaffold" == widgetName;
  }

  Widget parse(Map node) {
    Widget appBar = node['appBar'] == null ? null : DynamicWidgetBuilder.buildWidget(node['appBar']);
    Widget body = node['body'] == null ? null : DynamicWidgetBuilder.buildWidget(node['body']);

    return Scaffold(
        appBar: appBar,
        body: body
    );
  }
}

class AppBarWidgetParser {

  bool forWidget(String widgetName) {
    return "AppBar" == widgetName;
  }

  Widget parse(Map node) {
    Widget title = node['title'] == null ? null : DynamicWidgetBuilder.buildWidget(node['title']);

    return AppBar(
      title: title,
    );
  }
}

class TextWidgetParser {

  bool forWidget(String widgetName) {
    return "Text" == widgetName;
  }

  Widget parse(Map node) {
    return Text(node['text']);
  }
}

class ColumnWidgetParser {

  bool forWidget(String widgetName) {
    return "Column" == widgetName;
  }

  Widget parse(Map node) {
    List<Widget> children = node['children'] == null ? null : DynamicWidgetBuilder.buildListWidget(node['children']);
    return Column(
      children: children,
    );
  }
}

class GestureDetectorWidgetParser {

  bool forWidget(String widgetName) {
    return "GestureDetector" == widgetName;
  }

  Widget parse(Map node) {
    Widget child = node['child'] == null ? null : DynamicWidgetBuilder.buildWidget(node['child']);
    return GestureDetector(
      onTap: () {
        FlutterEvent.fire(node['onTap']);
      },
      child: child,
    );
  }
}

class DynamicWidgetBuilder {
  static final _parsers = {
    'StateWidget': StateWidgetParser(),
    'Scaffold': ScaffoldWidgetParser(),
    'AppBar': AppBarWidgetParser(),
    'Text': TextWidgetParser(),
    'Column': ColumnWidgetParser(),
    'GestureDetector': GestureDetectorWidgetParser(),
  };

  static Widget buildWidget(node) {
    String widgetName = node['widgetName'];
    dynamic parser = _parsers[widgetName];

    if (_parsers[widgetName] != null) {
      return parser.parse(node);
    }

    return null;
  }

  static List<Widget> buildListWidget(List children) {
    List<Widget> list = [];

    children.forEach((node) {
      list.add(buildWidget(node));
    });

    return list;
  }
}

class FlutterDynamic {

  static FlutterDynamic _instance;

  static MethodChannel jsFlutterMainChannel = MethodChannel("dynamic_main_flutter_channel");

  static setup() {
    if (_instance == null) {
      _instance = FlutterDynamic();
    }

    jsFlutterMainChannel.setMethodCallHandler((MethodCall call) async {
      print(call.method);
      print(call.arguments);
    });

    return _instance;
  }

  static Widget build() {
    return FlutterWidget();
  }

}

class FlutterWidget extends StatefulWidget {
  FlutterWidget({Key key}) : super(key: key);

  @override
  _FlutterWidgetState createState() => _FlutterWidgetState();
}

class _FlutterWidgetState extends State<FlutterWidget> {
  final StreamController _streamController = streamController;
  Future initJSON;

  @override
  void initState() {
    super.initState();
    initJSON = FlutterDynamic.jsFlutterMainChannel.invokeMethod('getJSON');
  }

  @override
  void dispose(){
    _streamController.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: initJSON,
      builder: (BuildContext context, AsyncSnapshot snapshot) {
        switch (snapshot.connectionState) {
          case ConnectionState.none:
            return Text('ConnectionState.none');
          case ConnectionState.active:
            return Text('ConnectionState.active');
          case ConnectionState.waiting:
            return Text('Loading...');
          case ConnectionState.done:
            if (snapshot.hasError) return Text('Error: ${snapshot.error}');
            var node = jsonDecode(snapshot.data);
            return StreamBuilder(
                stream: _streamController.stream,
                initialData: node,
                builder: (BuildContext context, AsyncSnapshot snapshot){
                  return DynamicWidgetBuilder.buildWidget(snapshot.data);
                }
            );
          default:
            return null;
        }
      }
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_app_dynamic/lib.dart';

void main() {
  FlutterDynamic.setup();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: FlutterDynamic.build(),
    );
  }
}
