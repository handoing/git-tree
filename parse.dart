import 'package:flutter/material.dart';
import 'package:html/parser.dart' as parser;
import 'package:html/dom.dart' as dom;
import 'package:flutter_hooks/flutter_hooks.dart';


void main() {
  runApp(MyApp());
}

EdgeInsetsGeometry parseEdgeInsetsGeometry(String edgeInsetsGeometryString) {
  if (edgeInsetsGeometryString == null ||
      edgeInsetsGeometryString.trim() == '') {
    return null;
  }
  var values = edgeInsetsGeometryString.split(",");
  return EdgeInsets.only(
      left: double.parse(values[0]),
      top: double.parse(values[1]),
      right: double.parse(values[2]),
      bottom: double.parse(values[3]));
}

MainAxisAlignment parseMainAxisAlignment(String mainAxisAlignmentString) {
  MainAxisAlignment mainAxisAlignment = MainAxisAlignment.center;
  switch (mainAxisAlignmentString) {
    case 'spaceAround':
      mainAxisAlignment = MainAxisAlignment.spaceAround;
      break;
    case 'center':
      mainAxisAlignment = MainAxisAlignment.center;
      break;
    case 'end':
      mainAxisAlignment = MainAxisAlignment.end;
      break;
    case 'spaceBetween':
      mainAxisAlignment = MainAxisAlignment.spaceBetween;
      break;
    case 'spaceEvenly':
      mainAxisAlignment = MainAxisAlignment.spaceEvenly;
      break;
    case 'start':
      mainAxisAlignment = MainAxisAlignment.start;
      break;
  }
  return mainAxisAlignment;
}

CrossAxisAlignment parseCrossAxisAlignment(String crossAxisAlignmentString) {
  CrossAxisAlignment crossAxisAlignment = CrossAxisAlignment.center;
  switch (crossAxisAlignmentString) {
    case 'center':
      crossAxisAlignment = CrossAxisAlignment.center;
      break;
    case 'end':
      crossAxisAlignment = CrossAxisAlignment.end;
      break;
    case 'start':
      crossAxisAlignment = CrossAxisAlignment.start;
      break;
  }
  return crossAxisAlignment;
}

IconData parseIcon(String typeString) {
  IconData type = Icons.add;
  switch (typeString) {
    case 'add':
      type = Icons.add;
      break;
    case 'remove':
      type = Icons.remove;
      break;
  }
  return type;
}

class TemplateParser extends StatelessWidget {
  TemplateParser({
    @required this.template,
    this.slots,
    this.events,
  });

  final String template;
  final Map slots;
  final Map events;

  static const _supportedElements = [
    "body",
    "appbar",
    "container",
    "center",
    "column",
    "padding",
    "floatingactionbutton",
    "raisedbutton",
    "text",
    "icon",
    "slot"
  ];

  @override
  Widget build(BuildContext context) {
    return parse(template);
  }

  Widget parse(String template) {
    String _template = template.replaceAll("\n", "");
    dom.Document document = parser.parse(_template);
    return _parseNode(document.body);
  }

  List<Widget> _parseMultiChildNode(List<dom.Node> nodeList) {
    return nodeList.map((node) {
      return _parseNode(node);
    }).toList();
  }


  Widget _parseSingleChildNode(List<dom.Node> nodeList) {
    dom.Element node = nodeList.firstWhere((node) {
      return node is dom.Element;
    });
    return _parseNode(node);
  }

  Widget _parseNode(dom.Node node) {
    if (node is dom.Element) {
      if (!_supportedElements.contains(node.localName)) {
        return Container();
      }

      if (node.attributes.containsKey('onclick')) {
        return GestureDetector(
          child: _parseSingleChildNode(node.nodes),
          onTap: () {
            events[node.attributes['onclick']]();
          },
        );
      }

      switch (node.localName) {
        case "body":
          return _parseSingleChildNode(node.nodes);
          break;
        case "appbar":
          return AppBar(
            title: _parseSingleChildNode(node.nodes),
          );
          break;
        case "container":
          return Container(
            child: _parseSingleChildNode(node.nodes),
          );
          break;
        case "center":
          return Center(
            child: _parseSingleChildNode(node.nodes),
          );
        case "column":
          MainAxisAlignment mainAxisAlignment = parseMainAxisAlignment(node.attributes['alignment']);
          CrossAxisAlignment crossAxisAlignment = parseCrossAxisAlignment(node.attributes['crossalignment']);
          return Column(
            mainAxisAlignment: mainAxisAlignment,
            crossAxisAlignment: crossAxisAlignment,
            children: _parseMultiChildNode(node.nodes),
          );
          break;
        case "padding":
          EdgeInsetsGeometry padding = parseEdgeInsetsGeometry(node.attributes['padding']);
          return Padding(
            padding: padding,
            child: _parseSingleChildNode(node.nodes),
          );
          break;
        case "floatingactionbutton":
          String tooltip = node.attributes['tooltip'];
          return FloatingActionButton(
            onPressed: () {
              if (node.attributes.containsKey('onpressed')) {
                events[node.attributes['onpressed']]();
              }
            },
            tooltip: tooltip,
            child: _parseSingleChildNode(node.nodes),
          );
          break;
        case "raisedbutton":
          return RaisedButton(
            onPressed: () {},
            child: _parseSingleChildNode(node.nodes),
          );
          break;
        case "text":
          return _parseSingleChildNode(node.nodes);
          break;
        case "icon":
          return Icon(parseIcon(node.attributes['type']));
          break;
        case "slot":
          return slots[node.attributes['name']];
          break;
        default:
          return Container();
          break;
      }
    } else if (node is dom.Text) {
      if (node.text.trim() != '') {
        return Text(node.text);
      }
      return Container();
    }
    return Container();
  }
}

class Cell extends StatelessWidget implements PreferredSizeWidget {
  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);

  Cell({
    Key key,
    @required this.template,
    this.slots,
    this.events,
  }) : super(key: key);

  final String template;
  final Map slots;
  final Map events;

  @override
  Widget build(BuildContext context) {
    return TemplateParser(
      template: template,
      slots: slots,
      events: events
    );
  }
}

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      title: 'Flutter Cell Demo',
      home: Example(),
    );
  }
}

class DoubleWidget extends StatelessWidget {
  final int count;
  DoubleWidget({Key key, this.count}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text('${count * 2}');
  }
}

class Example extends HookWidget {

  @override
  Widget build(BuildContext context) {
    final counter = useState(0);

    Map events = {
      'increment': () {
        counter.value++;
      },
      'decrement': () {
        counter.value--;
      },
    };

    Map slots = {
      'double': DoubleWidget(count: counter.value,)
    };

    return Scaffold(
      appBar: Cell(
        template: '''
          <AppBar>
            <Text>Flutter Cell Demo</Text>
          </AppBar>
        ''',
      ),
      body: Cell(
        template: '''
          <Center>
            <Column alignment="center">
              <Text>You have pushed the button this many times:</Text>
              <Text>${counter.value}</Text>
              <Slot name="double"></Slot>
            </Column>
          </Center>
        ''',
        slots: slots
      ),
      floatingActionButton: Cell(
        template: '''
          <Column alignment="end" crossAlignment="end">
            <Padding padding="0, 5, 0, 5">
              <FloatingActionButton tooltip="Increment" onPressed="increment">
                <Icon type="add"></Icon>
              </FloatingActionButton>
            </Padding>
            <Padding padding="0, 5, 0, 5">
              <FloatingActionButton tooltip="Decrement" onPressed="decrement">
                <Icon type="remove"></Icon>
              </FloatingActionButton>
            </Padding>
          </Column>
        ''',
        events: events
      )
    );
  }
}
