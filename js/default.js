function chin(elem){
	this.element = elem;
	return this;
}
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};
chin.head = document.querySelector("head");
chin.require = function(urls, callback){
	var end = urls.length;
	var start = 0;
	var self = {
		ok: function(e){
			start++;
			if(start >= end && callback){
				callback();
			}
		}
	};
	for(var i = 0; i < end; i++){
		var existing = document.querySelector("script[src='" + urls[i] + "']");
		if(existing !== null){
			self.ok(null);
			continue;
		}
		var script = document.createElement("script");
		script.src = urls[i];
		script.addEventListener("load", function(e){self.ok(e);}, true);
		chin.head.appendChild(script);
	}
	return this;
};
chin.notification_center = (function(){
	var observers = [];
	var self = {
		publish: function(notification, publisher, info){
			var ubounds = observers.length;
			var i = 0;
			for(i; i<ubounds; i++){
				if(!observers[i]) continue;
				if(observers[i].notification != notification) continue;
				if(observers[i].publisher != null && observers[i].publisher != publisher) continue;
				try{
					observers[i].observer[notification].apply(observers[i].observer, [publisher, info]);
				}catch(e){
					console.log([e, observers[i]]);
				}
			}
		}
		, subscribe: function(notification, observer, publisher){
			observers.push({"notification": notification, "observer":observer, "publisher":publisher});
		}
		, unsubscribe: function(notification, observer, publisher){
			var i = 0;
			var ubounds = observers.length;
			for(i; i<ubounds; i++){
				if(observers[i].observer == observer && observers[i].notification == notification){
					observers.splice(i, 1);
					break;
				}
			}
		}
	}
	return self;
})();
chin.should_log = false;
chin.log = function(message){
	if(chin.should_log) console.log(message);
}
chin.root_url = function(){
	var scripts = document.getElementsByTagName("script");
	var root_url = "";
	scripts = Array.prototype.slice.call(scripts); 
	var script = scripts.pop();
	while(script !== null){
		if(script.src !== undefined){
			if(script.src.indexOf("default.js") !== -1){
				var parts = script.src.split("/");
				parts.pop();
				parts.pop();
				root_url = parts.join("/") + "/";
				break;
			}			
		}
		script = scripts.shift();
	}
	return root_url;	
};
chin.show_hud = function(){
	var div = document.getElementById("sixd_hud");
	if(div != null){
		var parent = div.parentNode;
		parent.removeChild(div);
	}
	div = document.createElement("div");
	
	div.id = "sixd_hud";
	var site_title = document.querySelector("title");
	var meta = document.querySelector("meta[name=description]");
	var site_description = site_title

	if(site_title){
		site_title = site_title.innerHTML.trim();
	}else{
		site_title = "";
	}
	
	if(meta){
		site_description = meta.getAttribute("content");
	}else{
		site_description = site_title;
	}
	var iframe = document.createElement("iframe");
	var close_button = document.createElement("button");
	var url = document.createElement("input");
	var title = document.createElement("input");
	var excerpt = document.createElement("textarea");
	var container = document.createElement("div");
	var label = document.createElement("label");
	title.name = "title";
	title.setAttribute("value", site_title);
	excerpt.name = "excerpt";
	excerpt.innerHTML = site_description.trim();
	url.name = "body";
	url.setAttribute("value", window.location.href);
	var close_button_style = {"border-radius":"50px", background: "white", color: "black"};
	for(p in style){
		close_button.style[p] = style[p];
	}
	var style = {"z-index":100000, position: "fixed", top: "1em", right: "1em", "border-radius": "5px", background: "rgba(0,0,0,.8)", color: "white",padding: "10px", "box-shadow":"rgba(0,0,0,.5) 0 0 50px"};
	close_button.innerHTML = "x";
	close_button.onclick = function(e){
		div.style.display = "none";
		var parent = div.parentNode;
		parent.removeChild(div);
	};
	
	for(p in style){
		div.style[p] = style[p];
	}
	
	var iframe_style = {border: "none", display: "block", width: "100%", height: "367px"};
	for(p in iframe_style){
		iframe.style[p] = iframe_style[p];
	}
	iframe.src = chin.root_url() + "hud?bookmark=" + encodeURIComponent(JSON.stringify({title: site_title, excerpt: site_description, body: url.getAttribute("value")}));
	div.appendChild(close_button);
	div.appendChild(iframe);
	document.body.appendChild(div);
};

chin.prototype.bind = function(fn, context){
	return function() {
		var args = new Array();
		if(window.event){
			var e = window.event;
			e.target = window.event.srcElement;
			args.push(e);
		}
		if(arguments && arguments.length > 0){
			var i = arguments.length;
			while(arg = arguments[--i]){
				args.push(arg);
			}
		}
		return fn.apply(context ? context : this, args);
	}
}
chin.get_element = function(id){
	return id.nodeName ? id : document.getElementById(id);
}
chin.is_hidden = function(elem){
	return elem.style.display === 'none';
}
chin.show = function(id){
	var elem = chin.get_element(id);
	elem.style.display = 'block';
}
chin.hide = function(id){
	var elem = chin.get_element(id);
	elem.style.display = 'none';
}
chin.toggle = function(id){
	var elem = chin.get_element(id);
	if(chin.is_hidden(elem)){
		chin.show(elem);
	}else{
		chin.hide(elem);
	}
}
chin.extend = function(dest, src){
	for(prop in src){
		dest[prop] = src[prop];
	}
	return dest;
};

chin.observe = function(elem, name, fn){
	if (elem.addEventListener){
		elem.addEventListener(name, fn, false);
	}else{
		elem.attachEvent('on' + name, fn);
	}
	return fn;
};
chin.stop_observing = function(elem, name, fn){
	if(elem.removeEventListener){
		elem.removeEventListener(name, fn, false);
	}else{
		elem.detachEvent('on' + name, fn);
	}	
}

chin.stop = function(e){
	if(e.preventDefault){
		e.preventDefault();
		e.stopPropagation();
	}else{
		e.cancelBubble = true;
	}	
	e.returnValue = false;
}
chin.view = function(){
	return this;
};
chin.controller = function(){	
	return this;
};

chin.console = {};
chin.console.log = function(message){
	if(console){
		console.log(message);
	}
	var c = document.getElementById("console");
	if(c){
		c.innerHTML += "<p>" + message + "</p>";
	}
};

chin.console.clicked = function(e){
	chin.stop(e);
	var c = document.getElementById("console");
	c.className = c.className === "opened" ? "closed" : "opened";
	e.target.className = c.className;
};
(function(){
	var interval = setInterval(function(){
		if(document.getElementById("console_tab")){
			chin.observe(document.getElementById("console_tab"), "click" , chin.console.clicked);
			clearInterval(interval);
		}
	}, 50);
})();

chin.dom = function(tag){
	var elem = tag;
	if(typeof(tag) === "string"){
		elem = document.createElement(tag);
	}
	var self = {};
	self.__defineGetter__("elem", function(){
		return elem;
	});
	self.__defineSetter__("elem", function(v){
		elem = v;
	});
	self.show = function(){
		this.elem.style.display = "block";
		return this;
	};
	self.hide = function(){
		this.elem.style.display = "none";
		return this;
	};
	self.html = function(v){
		this.elem.innerHTML = v;
		return this;
	};
	self.css = function(obj){
		for(key in obj){
			this.elem.style[key] = obj[key];
		}
		return this;
	};
	self.set = function(obj, value){
		if(typeof(obj) === "string"){
			this.elem.setAttribute(obj, value);
		}else{
			for(key in obj){
				this.elem.setAttribute(key, obj[key]);
			}
		}
		return this;
	};
	self.append = function(elem){
		this.elem.appendChild(elem.elem ? elem.elem : elem);
		return this;
	};
	self.remove = function(elem){
		this.elem.removeChild(elem);
	};
	return self;
};
chin.parse_headers = function(request){
	var lines = request.getAllResponseHeaders().split("\r\n");
	var obj = {};
	for(key in lines){
		var kv = lines[key].match(/([a-zA-Z]+)\:{1,1}\s{0,1}(.*)/);
		if(kv === null) continue;
		obj[kv[1]] = kv[2];
	}
	return obj;
};
chin.device = (function(){
	var self = {};
	self.CANTOUCH = ("createTouch" in document);
	self.MOUSEDOWN = self.CANTOUCH ? "touchstart" : "mousedown";
	self.MOUSEMOVE = self.CANTOUCH ? "touchmove" : "mousemove";
	self.MOUSEUP = self.CANTOUCH ? "touchend" : "mouseup";
	self.CLICK = "click";
	self.DOUBLECLICK = "dblclick";
	self.KEYUP = "keyup";
	self.SEARCH = "search";
	self.INPUT = "input";
	self.BLUR = "blur";
	self.UNLOAD = "unload";
	self.CHANGE = "change";
	self.SCROLL = "scroll";
	self.FOCUS = "focus";
	self.SUBMIT = "submit";
	return self;
})();
