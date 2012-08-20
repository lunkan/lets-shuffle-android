package com.deasign.letsshuffle;

import java.util.List;

/*import com.example.my.first.app.Comment;
import com.example.my.first.app.CommentsDataSource;
import com.example.my.first.app.DisplayMessageActivity;
import com.example.my.first.app.R;*/

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.EditText;

public class MainActivity extends Activity {

	//public final static String EXTRA_MESSAGE = "com.example.myfirstapp.MESSAGE";
	
	//private CommentsDataSource datasource;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        /*datasource = new CommentsDataSource(this);
        datasource.open();

        List<Comment> values = datasource.getAllComments();*/
        
        WebView webView = (WebView)findViewById(R.id.web_panel);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebChromeClient(new WebChromeClient());
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_main, menu);
        return true;
    }
    
    /** Called when the user clicks the Send button */
    /*public void sendMessage(View view) {
    	
    	EditText editText = (EditText) findViewById(R.id.edit_message);
    	String message = editText.getText().toString();
    	
    	Comment newComment = datasource.createComment(message);
    	List<Comment> comments = datasource.getAllComments();
    	
    	String output = "";
    	for(Comment comment : comments)
    		output += ", " + comment.getComment();
    	
        // Do something in response to button
    	
    	Intent intent = new Intent(this, DisplayMessageActivity.class);
    	//EditText editText = (EditText) findViewById(R.id.edit_message);
    	//String message = editText.getText().toString();
    	intent.putExtra(EXTRA_MESSAGE, output);
    	startActivity(intent);
    }*/
    
    @Override
    protected void onResume() {
      //datasource.open();
      super.onResume();
    }

    @Override
    protected void onPause() {
      //datasource.close();
      super.onPause();
    }
}
