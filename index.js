var self = require('sdk/self');

var {components, Cu, Cc, Ci} = require("chrome");

Cu.import("resource:///modules/CustomizableUI.jsm");

var certlister = require('./certlister');
certlister.init();

var data = require("sdk/self").data;

// Construct a panel, loading its content from the "text-entry.html"
// file in the "data" directory, and loading the "get-text.js" script
// into it.
var text_entry = require("sdk/panel").Panel({
  contentURL: data.url("text-entry.html"),
  contentScriptFile: data.url("get-text.js")
});

// When the panel is displayed it generated an event called
// "show": we will listen for that event and when it happens,
// send our own "show" event to the panel's script, so the
// script can prepare the panel for display.
text_entry.on("show", function() {
  dump(JSON.stringify(certlister.listCerts()));
  // text_entry.port.emit("show");
  text_entry.port.emit("data", {"hashes": certlister.listCerts()});
});

// Listen for messages called "text-entered" coming from
// the content script. The message payload is the text the user
// entered.
// In this implementation we'll just log the text to the console.
text_entry.port.on("text-entered", function (text) {
  console.log(text);
  text_entry.hide();
});

CustomizableUI.createWidget(
      { id : "panel-button",
        defaultArea : CustomizableUI.AREA_NAVBAR,
        label : "ListCerts Button",
        tooltiptext : "List certs!",
        onCommand : function(aEvent) {
          text_entry.show();
        }
      });
