window.addEventListener("DOMContentLoaded", function(){
	
	//This method is mandatory. It will be called by WOA when the API is ready
	this.initWOAscript = function(){ 
		try{

			//Instantiating the app manager
			var mashup = new MashNewsApp();

			//Enabling loading effect
			mashup.enableLoadingLayer();

			//Getting the (decorated) IOs and rendering the UI when retrieved
			mashup.getDiarioRegistradoNews(function(news){
				mashup.loadAsMainNews(news);
			});
			mashup.getFortunaWebNews(function(news){
				mashup.loadAsSidebarNews(news);
			});			

		}catch(err){console.log(err)}
	}
});

function MashNewsApp(){

	this.loadedContentTimes = 0;
}
MashNewsApp.prototype.getDiarioRegistradoNews = function(callback){ 

	var commonUrl = "http://www.diarioregistrado.com/economia";

	//Defining a IO template
	var newsTemplate = WOA.newInformationObjectTemplate({
		name: "Diario Registrado News", tag: "news", url: commonUrl,
		xpath: './/div[@id="frame-content"]/div[1]/div[1]/div[1]/section[1]/article'
	});
	//Add it a TITLE property
	newsTemplate.addProperty({
		name: "Title", tag: "title", url: commonUrl,
		xpath: 'div[1]/div[2]/div[1]/a[1]/h3[1]'
	});
	//Add it a CONTENT property
	newsTemplate.addProperty({
		name: "Content", tag: "content", url: commonUrl,
		xpath: 'div[1]/div[2]/div[1]/a[1]/p[1]' 
	});
	//Add it a THUMBNAIL property
	newsTemplate.addProperty({
		name: "Image", tag: "thumbnail", url: commonUrl,
		xpath: 'div[1]/div[1]/a[1]/div[1]' 
	});
	//Add it a TAG property
	newsTemplate.addProperty({
		name: "Tag", tag: "tag", url: commonUrl,
		xpath: 'div[1]/div[2]/div[1]/div[1]/h4[1]/a[1]' 
	});
	//Apply a decorator & select some messages
	var decoratedTemplate = WOA.newDecorator("NewsDecorator", newsTemplate);
		decoratedTemplate.selectMessage("showRelatedTweets");
		decoratedTemplate.mapMessageParam("keywords", "Tag"); 

	//Retrieving Information Objects based on the templates
	WOA.getInformationObjects(decoratedTemplate, callback);
}
MashNewsApp.prototype.getFortunaWebNews = function(callback){ 

	var commonUrl = "http://fortunaweb.com.ar/category/economia/";

	//Defining a IO template
	var newsTemplate = WOA.newInformationObjectTemplate({
		name: "Fortuna News", tag: "news", url: commonUrl,
		xpath: './/div[@id="contenido-general-seccion"]/article'
	});
	//Add it a title property
	newsTemplate.addProperty({
		name: "Title", tag: "title", url: commonUrl, xpath: 'h3[1]/a[1]' 
	});
	//Add it a content property
	newsTemplate.addProperty({
		name: "Content", tag: "content", url: commonUrl, xpath: 'div[1]/p[1]' 
	});

	//Apply decorator.IOs need to be created in that context
	var decoratedTemplate = WOA.newDecorator("NewsDecorator", newsTemplate);
		decoratedTemplate.selectMessage("showRelatedTweets");
		decoratedTemplate.mapMessageParam("keywords", "Title"); 

	//Retrieving Information Objects based in the templates spec
	WOA.getInformationObjects(decoratedTemplate, callback);
}
MashNewsApp.prototype.loadAsMainNews = function(ios){

	//Getting the parent element to add the news
	var list = document.getElementById('news-list');

	//Traversing the information objects and creating their representation
	for (var i = 0; i < ios.length; i++) {

		list.appendChild(this.createSingleMainNews(ios[i]));
	}
	this.externalContentWasLoaded();
}
MashNewsApp.prototype.createSingleMainNews = function(io){
	//Create the UI elements 

	var newsPanel = document.createElement('div');
		newsPanel.className = "panel panel-default tweet-panel-default";

	var panelBody = document.createElement('div');
		panelBody.className = "panel-body";
		newsPanel.appendChild(panelBody); 
		
	var menu = this.createMenu(io);
		menu.className = "pull-right";
		panelBody.appendChild(menu);

	var panelHeader = document.createElement("h5");
		panelHeader.innerHTML = io.getPropertyByTagName("title").getValue(); // <--
		panelHeader.className = "news-title";
		panelHeader.onclick = function(e){ window.open(io.getUrl(), "_blank"); }
		panelBody.appendChild(panelHeader);

	var panelDivisor = document.createElement("hr");
		panelBody.appendChild(panelDivisor);

	var domElem = document.createElement("dom");
		domElem.innerHTML = io.getPropertyByTagName("thumbnail").getDomElement();

	var prevSrc = domElem.firstChild.getAttribute("data-original-x2");
	if(prevSrc){
		var preview = document.createElement('img');
			preview.className = "thumbnail custom-news-preview";
			preview.src = prevSrc;
		panelBody.appendChild(preview);
	}

	var panelMessage = document.createElement('div');
		panelMessage.innerHTML = io.getPropertyByTagName("content").getValue();
		panelMessage.className = "clearfix";
		panelBody.appendChild(panelMessage);

	var readAt = document.createElement('span');
		readAt.className = "navbar-right navbar-read-at";
		panelBody.appendChild(readAt);

	var agencyName = document.createElement("a");
		agencyName.innerHTML = io.getPropertyByTagName("tag").getValue(); 
		agencyName.className = "navbar-link";
		readAt.appendChild(agencyName);

	var readAtIcon = document.createElement('span');
		readAtIcon.className = "glyphicon glyphicon-tag tag-icon";
		readAt.appendChild(readAtIcon);

	return newsPanel;
}
MashNewsApp.prototype.createMenu = function(io){
	//Creating the DOM elements for the actions' menu

	var controls = document.createElement("div");
	var app = this;
    var cog = document.createElement("button");
        cog.className = "woa-augmenter-icon";
        cog.io = io;
        controls.appendChild(cog);
        cog.onclick = function(evt){
        	if(document.getElementsByClassName("popup-in-situ-message")[0] == undefined){

        		var popup = document.createElement("div");
			    	popup.className = "popup popup-in-situ-message";
			    	popup.style.width = "285px";
			    	popup.style.height = "67px";

				var list = document.createElement('div');
					list.className = "list";

				var messages = cog.io.getSelectedMessages();
				var longerOffsetWidth = 0;
				popup.appendChild(list); //It's inserted here for getting the offset
				this.parentElement.appendChild(popup); //It's inserted here for getting the offset

				for (var i = 0; i < messages.length; i++) {
					var item01 = document.createElement('div');
						item01.className = 'list-item';
						item01.messageId = messages[i].id;
						item01.onclick = function(){
							app.enableLoadingLayer();
							cog.io[this.messageId](function(){
								app.disableLoadingLayer();
							});
							document.getElementsByClassName("popup-in-situ-message")[0].remove();
						}
					var span01 = document.createElement('span');
						span01.innerHTML = messages[i].name;
						item01.appendChild(span01);

					list.appendChild(item01);
					if(span01.offsetWidth > longerOffsetWidth) longerOffsetWidth = span01.offsetWidth;
				};
				
				popup.style.left = (this.left + 15) + 'px';
				popup.style.top = (this.bottom) + 'px';

				if(list.children[0]) popup.style.height = (list.children[0].offsetHeight * list.children.length) + "px";
				popup.style.width = (longerOffsetWidth + 25) + "px";
				
			}else{
       			document.getElementsByClassName("popup-in-situ-message")[0].remove();
			}
			this.popupOpen = !this.popupOpen;
        }
    return controls; 
}
MashNewsApp.prototype.loadAsSidebarNews = function(ios){

	//Getting the parent element to add the news
	var list = document.getElementById('sidebar-list');

	//Traversing the information objects and creating their representation
	for (var i = 0; i < ios.length; i++) {
		list.appendChild(this.createSingleSidebarNews(ios[i]));
	}
	this.externalContentWasLoaded();
}
MashNewsApp.prototype.createSingleSidebarNews = function(io){ 

	var mainPanel = document.createElement('div');
		mainPanel.className = "tweet-panel-default panel panel-default";

	var panelBody = document.createElement('div');
		panelBody.className = "panel-body row";
		mainPanel.appendChild(panelBody);

	var panelIcon = document.createElement('div');
		panelIcon.className = "col-md-2";
		panelBody.appendChild(panelIcon);

	var actionsMenu = this.createMenu(io);
		panelIcon.appendChild(actionsMenu);

	var panelMessage = document.createElement('div');
		panelMessage.className = "col-md-10";
		panelBody.appendChild(panelMessage);

	var title = document.createElement('a');
		title.innerHTML = io.getPropertyByTagName("title").getValue();  // <-- title
		title.className = "fortuna-web-title news-title";
		title.onclick = function(e){ window.open(io.getUrl(), "_blank"); }  
		panelMessage.appendChild(title);

	var message = document.createElement('div');
		message.innerHTML = io.getPropertyByTagName("content").getValue(); // <-- content
		message.className = "clearfix";
		panelMessage.appendChild(message);

	return mainPanel;
}
MashNewsApp.prototype.enableLoadingLayer = function(){

    var loading = document.createElement("div");
        loading.id= "mashnews-full-loading";
        loading.className = "loading";
        loading.onclick = function(){ this.remove(); }
    document.body.appendChild(loading);

    var me = this;
    var checkLoading = function(){

    	if(me.loadedContentTimes >= 2){
    		me.disableLoadingLayer();
    		clearInterval(checkLoading);
    	}
    }
    setInterval(checkLoading, 1000);
}
MashNewsApp.prototype.externalContentWasLoaded = function(){

    this.loadedContentTimes++;
}
MashNewsApp.prototype.disableLoadingLayer = function(){

    var loading = document.getElementById("mashnews-full-loading");
    if(loading) loading.remove();
}