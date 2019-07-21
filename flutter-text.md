#### 1.环境
Flutter 1.7.8
Dart 2.4.0

#### 2.Text组件
Text允许文字以单一样式来展示，会根据布局的约束来判断是多行展示还是单行展示。

```dart
Text(
    String data, 
    { 
        Key key, 
        TextStyle style, // TextStyle可设置文字颜色、大小、间隙等
        StrutStyle strutStyle, // 支柱样式
        TextAlign textAlign, // 文本对齐方式
        TextDirection textDirection, // 文本排列方向
        Locale locale, // 设置特定字体语言环境
        bool softWrap, // 文字超出容器大小是否换行
        TextOverflow overflow, // 文本溢出的处理方式
        double textScaleFactor, // 每个逻辑像素的字体像素数
        int maxLines, // 文字最大行数
        String semanticsLabel, // 语义标签
        TextWidthBasis textWidthBasis 
    }
)

// 使用
Widget text = Text('Hello World!',
    style: TextStyle(
        color: Colors.black,
        fontSize: 16,
    ),
    textAlign: TextAlign.center,
    overflow: TextOverflow.ellipsis
);
```

#### 3.Text.rich和TextSpan

如果我们需要多样式的文字展示应该怎么办呢？我们可以指定text.rich, 使用TextSpan设置文字不同样式。

这里要注意的是TextSpan并不是一个Widget，TextSpan只能依赖于特定文本组件使用。
并且我们可以通过继承结构看出Text继承自Widget，而TextSpan则直接继承自DiagnosticableTree。

```dart
const Text.rich(
  TextSpan(
    text: 'Hello',
    children: <TextSpan>[
      TextSpan(text: ' beautiful ', style: TextStyle(fontStyle: FontStyle.italic)),
      TextSpan(text: 'world', style: TextStyle(fontWeight: FontWeight.bold)),
    ],
  ),
)
```

#### 4.RichText

Text和Text.rich其实就是对RichText更上一层的封装。

```dart
Widget text = RichText(
    text: TextSpan(
    text: 'Hello ',
    style: TextStyle(
        color: Colors.black,
        fontSize: 16
    ),
    children: <TextSpan>[
        TextSpan(text: 'bold', style: TextStyle(fontWeight: FontWeight.bold)),
        TextSpan(text: ' world!'),
    ],
);
```

#### 5.DefaultTextStyle

我们可以通过DefaultTextStyle组件来设置文本默认样式，DefaultTextStyle目的是为其子元素设置统一样式，使用如下：

```dart
DefaultTextStyle(
    style: TextStyle(
        fontSize: 16,
        color: Colors.black,
    ),
    child: Container(
    child: Column(
        children: <Widget>[
            Text(
                'hello 1',
            ),
            Text(
                'hello 2',
            ),
        ],
    ),
));
```

注意：文本样式默认是会被继承，如果我们不想继承父级样式，可以通过设置TextStyle的inherit为false即可，如下：

```dart
Widget text = DefaultTextStyle(
    style: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: Colors.black,
    ),
    child: Container(
        child: Column(
        children: <Widget>[
            Text(
                'hello flutter',
            ),
            Text(
                'hello flutter',
                style: TextStyle(
                    inherit: false,
                    color: Colors.red
                ),
            ),
        ],
        ),
    )
);
```
