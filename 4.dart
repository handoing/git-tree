import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:convert';


void reloadApp(arg) {
  print(arg);
  var scores = jsonDecode(arg);
  print(scores['body']['text']);
}

MethodChannel _jsFlutterMainChannel;

void main() {
  Map _jsFlutterMainChannelFunRegMap = {};
//  MethodChannel _jsFlutterMainChannel;
  _jsFlutterMainChannel = MethodChannel("js_flutter.flutter_main_channel");
  _jsFlutterMainChannel.setMethodCallHandler((MethodCall call) async {
    print('-------');
    Function fun = _jsFlutterMainChannelFunRegMap[call.method];
    return fun(call.arguments);
  });

  _jsFlutterMainChannelFunRegMap["reloadApp"] = reloadApp;

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
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    var args = {"jsAppName": 'app_test', "pageName": ''};
    _jsFlutterMainChannel.invokeMethod("callNativeRunJSApp", args);
    setState(() {
      _counter++;
    });
  }

  void _incrementCounter2() {
    var args = {"jsAppName": 'app_test', "pageName": ''};
    _jsFlutterMainChannel.invokeMethod("callNativeRunJSApp2", args);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.display1,
            ),
          ],
        ),
      ),
      floatingActionButton: Column(
        children: <Widget>[
          FloatingActionButton(
            onPressed: _incrementCounter,
            tooltip: 'Increment',
            child: Icon(Icons.add),
          ),
          FloatingActionButton(
            onPressed: _incrementCounter2,
            tooltip: 'Increment',
            child: Icon(Icons.add),
          )
        ],
      ),
    );
  }
}

