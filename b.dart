import 'package:flutter/material.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

void main() => runApp(MyApp());

enum CounterEvent { increment, decrement }

class CounterBloc extends Bloc<CounterEvent, int> {
  final int _count = 0;

  @override
  int get initialState => _count;

  @override
  void onTransition(Transition<CounterEvent, int> transition) {
    super.onTransition(transition);
  }

  @override
  Stream<int> mapEventToState(CounterEvent event) async* {
    switch (event) {
      case CounterEvent.decrement:
        yield state - 1;
        break;
      case CounterEvent.increment:
        yield state + 1;
        break;
    }
  }

  @override
  void close() {
    super.close();
  }

}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: BlocProvider(
        builder: (context) => CounterBloc(),
        child: MyHomePage(),
      )
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    print('MyHomePage build');
    return Scaffold(
      appBar: AppBar(title: Text('demo')),
      body: Center(child: CounterLabel()),
      floatingActionButton: IncrementCounterButton(),
    );
  }
}

class IncrementCounterButton extends StatelessWidget {
  const IncrementCounterButton({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    print('IncrementCounterButton build');

    CounterBloc counterBloc = BlocProvider.of<CounterBloc>(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      mainAxisAlignment: MainAxisAlignment.end,
      children: <Widget>[
        Padding(
          padding: EdgeInsets.symmetric(vertical: 5.0),
          child: FloatingActionButton(
            child: Icon(Icons.add),
            onPressed: () {
              counterBloc.add(CounterEvent.increment);
            },
          ),
        ),
        Padding(
          padding: EdgeInsets.symmetric(vertical: 5.0),
          child: FloatingActionButton(
            child: Icon(Icons.remove),
            onPressed: () {
              counterBloc.add(CounterEvent.decrement);
            },
          ),
        ),
      ],
    );
  }
}

class CounterLabel extends StatelessWidget {
  const CounterLabel({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    print('CounterLabel build');

    return BlocBuilder<CounterBloc, int>(
      builder: (context, state) {

        return Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            TextDemo(),
            Text('${state}'),
          ],
        );
      },
    );

  }
}

class TextDemo extends StatelessWidget {
  const TextDemo({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    print('TextDemo build');
    return Text('You have pushed the button this many times:');
  }
}
