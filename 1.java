package com.example.flutter_app_dynamic;

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

  private V8 runtime;

  private static final String MAIN_FLUTTER_CHANNEL_NAME = "dynamic_main_flutter_channel";
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
  }

  public void setupChannel() {
    jsFlutterAppChannel = new MethodChannel(this.getFlutterView(), MAIN_FLUTTER_CHANNEL_NAME);
    jsFlutterAppChannel.setMethodCallHandler(new MethodChannel.MethodCallHandler() {
      @Override
      public void onMethodCall(MethodCall methodCall, MethodChannel.Result result) {
        if (methodCall.method.equals("getJSON")) {
          result.success(data);
        }
        if (methodCall.method.equals("callJsUpdateJsonTree")) {
          String event = methodCall.argument("event");
          V8Array arg = new V8Array(runtime).push(event);
          runtime.executeVoidFunction("updateEvent", arg);
          arg.close();
          result.success("success");
        }
      }
    });
  }

  public void setupEngine() {
    // 创建 js 运行时
    runtime = V8.createV8Runtime();
    String script = FileUtils.getFromAssets(this, "main.js") + " main();";

    NativeJSFlutterApp NativeJSFlutterApp = new NativeJSFlutterApp();
    V8Object v8Object = new V8Object(runtime);
    runtime.add("NativeJSFlutterApp", v8Object);
    v8Object.registerJavaMethod(NativeJSFlutterApp, "sendJSON",
            "sendJSON", new Class<?>[]{ V8Object.class });
    v8Object.registerJavaMethod(NativeJSFlutterApp, "log",
            "log", new Class<?>[]{ V8Object.class });
    // System.out.println(script);
    V8Object result = runtime.executeObjectScript(script);
    result.close();
    v8Object.close();
    // runtime.release(true);
  }

  private class NativeJSFlutterApp {
    public void sendJSON(V8Object jsApp) {
      System.out.println("[JSON]:" + jsApp.getString("data"));
      data = jsApp.getString("data");
    }
    public void log(V8Object jsApp) {
      System.out.println("[JS_LOG]:" + jsApp.getString("data"));
    }
  }

}
