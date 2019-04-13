# About the project #
Web Objects Ambient is a tool supporting a novel approach for enabling users to abstract and structure existing Web contents, favoring the creation of a diverse range of Web Personal experiences. 

You can see some demo videos in https://www.youtube.com/playlist?list=PLHuNJBFXxaLCXzK_0pTkANEZ9RXsUsCSO

For further details, please visit https://sites.google.com/site/webobjectambient/

There is a xpi file in the SOURCE folder that you can install by drag-and-drop into your Firefox browser, but you need to have the xpinstall.signatures.required preference as false (about:config). It may be an unstable version, so, in case of errors with the chrome definition of your browser (e.g. some context menus may disappear), please restart it.

## This repo contains: ##
* SOURCE: contains the source code of the project. Files in src/lib/ is high privileged code. Files in src/data/ is low level code. This is how extensions built with the FFX SDK use to be organized. E.g. Low privileged code is the one that is loaded in the sidebar, or in the DOM of the current Web page. High privileged code is the one in the lib folder, and can use the SDK API (you can r/w files, retrieve external content, etc.). The main file is SOURCE/lib/main.js
* SAMPLE-APP: contains the mashnew example Web site for importing with the WOA platform. It should use the API (not fully implemented yet)

## Getting started ##
For running the project, you should have installed:

* NPM [https://www.npmjs.com/](Link URL) It could be necessary to install also: nodejs-legacy
* JPM [https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/SDK/Tools/jpm](Link URL) 
* Firefox addon autoinstaller [https://addons.mozilla.org/es/firefox/addon/autoinstaller/](Link URL)

If you are not using Firefox Developer Edition, you should enter     about:config and turn the following entry value to false:

```
#!javascript

xpinstall.signatures.required  
```
It that option does not work for you, try loading unsigned addons temporarily through about:debugging: https://developer.mozilla.org/en-US/docs/Tools/about:debugging 

Then, from the src/ dir, open a terminal and watchpost:

```
#!javascript

jpm watchpost --post-url http://localhost:8888/
```

Or force changes to be zipped again and post just once (this is better):

```
#!javascript

jpm xpi; jpm post --post-url http://localhost:8888/
```

For **debugging** the extension, you can use the Firefox Browser Toolbox: https://developer.mozilla.org/en-US/docs/Tools/Browser_Toolbox

You can **access the database** at the extension's dedicated folder, placed in the 'jetpack' folder inside the Firefox user profile one. E.g. /home/your_username/.mozilla/firefox/1xflzexk.default/jetpack/woa@lifia.info.unlp.edu.ar

## Pending tasks list ##
https://trello.com/b/H4bsjr4r/woa