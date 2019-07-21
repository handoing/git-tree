import 'package:flutter/material.dart';
import 'package:flutter_page_transition/flutter_page_transition.dart';
import 'package:get_it/get_it.dart';

void main() {
  runApp(App());
}

class NavigateService {
  final GlobalKey<NavigatorState> key = GlobalKey(debugLabel: 'navigate_key');

  NavigatorState get navigator => key.currentState;

  get pushNamed => navigator.pushNamed;
  get push => navigator.push;
}

class HomePage extends StatefulWidget {
  HomePage({Key key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {

  String _text = 'Home';

  void _push() {
    FlutterPageRouter.pushNamed('page');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.yellow,
      appBar: AppBar(
        backgroundColor: Colors.red,
        title: Text(_text),
      ),
      body: Center(
        child: Text(_text),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _push,
        child: Icon(Icons.add),
      ),
    );
  }
}

class FlutterPageRouter {
  List<Map <String, dynamic>> routes;
  GlobalKey navKey;
  Function globalBeforeRouteUpdateHandle;
  Map route;

  static GetIt getIt = GetIt();

  FlutterPageRouter({routes}) {
    this.routes = routes;
    init();
  }

  void init() {
    getIt.registerSingleton(NavigateService());
    navKey = getIt<NavigateService>().key;

    transitionEffect.createCustomEffect(
        handle: (Curve curve, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
          return new SlideTransition(
            position: new Tween<Offset>(
              begin: const Offset(1.0, 0.0),
              end: const Offset(0.0, 0.0),
            ).animate(CurvedAnimation(parent: animation, curve: curve)),
            child: child,
          );
        }
    );
  }

  Widget matchWidget (String name) {
    Widget currentWidget;
    routes.forEach((config) {
      if (name == config['name']) {
        currentWidget = config['component']({'id': 1});
        route = config;
      }
    });

    if (currentWidget == null) {
      routes.forEach((config) {
        if (config['isDefault'] == true) {
          currentWidget = config['component']({'id': 2});
          route = config;
        }
      });
    }
    return globalBeforeRouteUpdateHandle(name, {'id': 3}, currentWidget);
  }

  PageRouteBuilder generator (RouteSettings routeSettings) {
    return new PageRouteBuilder<dynamic>(
        settings: routeSettings,
        pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
          return matchWidget(routeSettings.name);
        },
        transitionDuration: const Duration(milliseconds: 300),
        transitionsBuilder: (BuildContext context, Animation<double> animation,
            Animation<double> secondaryAnimation, Widget child) {
          PageTransitionType type = route == null ? PageTransitionType.slideInRight : route['transitionType'];
          if (type == PageTransitionType.custom) {
            return route['transitionTypeHandle'](Curves.linear, animation, secondaryAnimation, child);
          }
          return effectMap[type](Curves.linear, animation, secondaryAnimation, child);
        }
    );
  }

  void globalBeforeRouteUpdate (handle) {
    globalBeforeRouteUpdateHandle = handle;
  }

  static pushNamed (String name) {
    getIt<NavigateService>().pushNamed(name);
  }

  static push (String name) {
    getIt<NavigateService>().push(name);
  }

  static pop () {

  }

  static replace () {

  }

}

FlutterPageRouter routerInit () {
  FlutterPageRouter router = FlutterPageRouter(
      routes: [
        {
          'isDefault': true,
          'path': '/user',
          'name': 'user',
          'transitionType': PageTransitionType.slideInRight,
          'component': (params) {
            return HomePage();
          }
        },
        {
          'path': '/page',
          'name': 'page',
          'transitionType': PageTransitionType.custom,
          'transitionTypeHandle': (Curve curve, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
            return new SlideTransition(
              position: new Tween<Offset>(
                begin: const Offset(1.0, 0.0),
                end: const Offset(0.0, 0.0),
              ).animate(CurvedAnimation(parent: animation, curve: curve)),
              child: child,
            );
          },
          'component': (params) {
            return HomePage();
          }
        }
      ]
  );

  router.globalBeforeRouteUpdate((path, params, child) {
    return Container(
      child: child,
    );
  });

  return router;
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {

    FlutterPageRouter router = routerInit();

    return MaterialApp(
      title: 'Flutter',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      navigatorKey: router.navKey,
      onGenerateRoute: router.generator,
    );
  }
}
