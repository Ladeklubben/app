package dk.ladeklubben.apps;

import android.os.Bundle;
import android.webkit.WebView;
import android.graphics.Color;
import android.view.WindowManager;

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

        // Make only the top (status bar) edge-to-edge fullscreen, keep navigation bar as is
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }

    @Override
    public void onStart() {
        super.onStart();
        WebView webview = getBridge().getWebView();
        webview.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
    }
}
