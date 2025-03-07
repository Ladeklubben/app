package dk.ladeklubben.apps;

import android.os.Bundle;
import android.webkit.WebView;
import android.graphics.Color;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set navigation bar color
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setNavigationBarColor(Color.parseColor("#182b34")); 
            getWindow().setStatusBarColor(Color.parseColor("#182b34"));
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        WebView webview = getBridge().getWebView();
        webview.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
    }
}
