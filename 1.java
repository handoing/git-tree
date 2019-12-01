package com.example.flutterapp;

import android.os.Bundle;

import com.eclipsesource.v8.JavaVoidCallback;
import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Array;
import com.eclipsesource.v8.V8Object;

import java.io.Console;
import java.util.ArrayList;
import java.util.HashMap;

import io.flutter.app.FlutterActivity;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugins.GeneratedPluginRegistrant;

public class MainActivity extends FlutterActivity {

  private boolean isFlutterEngineIsDidRender;
  private ArrayList<MethodCall> callFlutterQueue;

  private String jsAppName = "";

  private V8 runtime;

  //Flutter通道
  private static final String FLUTTER_METHED_CHANNEL_NAME = "js_flutter.flutter_main_channel";
  MethodChannel jsFlutterAppChannel;

  String data;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setup();
    GeneratedPluginRegistrant.registerWith(this);
  }

  public void setup() {
    setupChannel();
    setupEngine();
//    mMXJSFlutterEngine = MXJSFlutterEngine.getInstance(this);
  }

  public void setupChannel() {
    jsFlutterAppChannel = new MethodChannel(this.getFlutterView(), FLUTTER_METHED_CHANNEL_NAME);
    jsFlutterAppChannel.setMethodCallHandler(new MethodChannel.MethodCallHandler() {
      @Override
      public void onMethodCall(MethodCall methodCall, MethodChannel.Result result) {
        if (methodCall.method.equals("callNativeRunJSApp")) {
          String jsAppName = methodCall.<String>argument("jsAppName");
          String pageName = methodCall.<String>argument("pageName");
          callNativeRunJSApp(jsAppName, pageName);
          result.success("success");
        }
        if (methodCall.method.equals("callNativeRunJSApp2")) {
          V8Array arg = new V8Array(runtime).push(0);
          int r = runtime.executeIntegerFunction("update", arg);
          arg.close();
          result.success("success");
        }
      }
    });
  }

  public void setupEngine() {
    runtime = V8.createV8Runtime(); // 创建 js 运行时
    String script = FileUtils.getFromAssets(this, "main.js");

    class MXNativeJSFlutterApp {

      //js --> native
      public void sendJSON(V8Object jsApp) {
        System.out.println("[JSON]:" + jsApp.getString("data"));
        data = jsApp.getString("data");
      }
    }

    MXNativeJSFlutterApp MXNativeJSFlutterApp = new MXNativeJSFlutterApp();
    V8Object v8Object = new V8Object(runtime);
    runtime.add("MXNativeJSFlutterApp",v8Object);
    v8Object.registerJavaMethod(MXNativeJSFlutterApp, "sendJSON",
            "sendJSON", new Class<?>[]{V8Object.class});

//    runtime.registerJavaMethod(callback, "sendJSON");

    V8Object result = runtime.executeObjectScript(script);
    result.close();
    v8Object.close();
//    runtime.release(true);
  }

  private void callNativeRunJSApp(String jsAppName, String pageName) {
    jsFlutterAppChannel.invokeMethod("reloadApp", data);
//    mMXJSFlutterEngine.runApp(jsAppName, pageName);
//    V8Array arg = new V8Array(runtime).push(12).push(21);
//    int r = runtime.executeIntegerFunction("add", arg); // 调用函数
//    jsFlutterAppChannel.invokeMethod("reloadApp", r);
//    arg.close();
//    runtime.release(true);
  }
}
