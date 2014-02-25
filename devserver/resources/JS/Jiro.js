(function(){

  
  
  var Events = {
    Host: {
      ONCONNECT:         'connect',
      ONDISCONNECT:      'disconnect',
      ONCONNECTERROR:    'connecterror',
      ONDISCONNECTERROR: 'disconnecterror',
      ONLOCATION:        'location',
      ONLOCATIONERROR:   'locationerror'
    },
    Device: {
      ONCONNECT:         'connect',
      ONDISCONNECT:      'disconnect',
      ONCONNECTERROR:    'connecterror',
      ONDISCONNECTERROR: 'disconnecterror'
    }
  };
  
  
  
  
  
  
  
  
  
  function EventListener(){
    var self = this;
    
    // -------------------- PUBLIC METHODS -------------------- \\
    
    self.add = function AddEventListener(name, funct){
      if(typeof name != 'string' || typeof funct != 'function'){
        console.warn('Invalid variable type: Function aborted');
        return;
      }
      if(!eventListeners[name]) eventListeners[name] = [];
      eventListeners[name].push(funct);
    }
    
    self.remove = function RemoveEventListener(name, funct){
      if(typeof name != 'string' || typeof funct != 'function'){
        console.warn('Invalid variable type: Function aborted');
        return;
      }
      if(!eventListeners[name]){
        console.warn('Event listener "'+name+'" is not defined');
        return;
      };
      var index = eventListeners[name].indexOf(funct);
      if(index<0){
        console.warn('Event listener "'+name+'" cannot be removed: The provided method has not been added to the listener');
        return;
      }
      eventListeners[name].splice(index, 1);
    }
    
    self.run = function RunEventListener(name, event){
      if(typeof name != 'string'){
        console.warn('Invalid variable type: Function aborted');
        return;
      };
      if(!eventListeners[name]){
        console.warn('Event listener "'+name+'" is not defined');
        return;
      }
      for(var i=0,listener; listener=eventListeners[name][i++];) listener(event);
    }
    
    // -------------------- PRIVATE DATA -------------------- \\
    
    var eventListeners = {};
  }
  
  
  
  
  
  
  
  
  
  
  
  function Query(){
    var self = this;
    
    // -------------------- PUBLIC METHODS -------------------- \\
    
    self.all = function All(){
      // the .slice() copies the array, pass by value, not reference
      return data.slice();
    }
    
    self.get = function Get(){
      return data[0];
    }
    
    self.fetch = function Fetch(start, amount){
      return data.slice(start, start+amount);
    }
    
    self.count = function Count(){
      return data.length;
    }
    
    // note that if a comparison fails (ie a string is < 1) then it is quietly ignored
    self.filter = function Filter(arg1, arg2){
      if(typeof arg1 == 'object'){
        var query = self;
        for(var key in arg1){
          var querytry = query.filter(key, arg1[key]);
          if(!querytry) continue;
          query = querytry;
        }
        return query;
      }else if(typeof arg1 == 'string'){
        var tagRegExp = /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(=|>|<|!=|<=|>=)\s*$/,
            match = tagRegExp.exec(arg1);
        if(!match){
          console.warn('Invalid Query filter parameter: Skipping filter "'+arg1+'"; Results may be incomplete');
          return;
        };
        var variable = match[1],
            operator = match[2],
            output = [];
        for(var i=0,obj; obj=data[i++];){
          try{
            if(operator=='=')  if(obj[variable] == arg2) output.push(obj);
            if(operator=='!=') if(obj[variable] != arg2) output.push(obj);
            if(operator=='<')  if(obj[variable] < arg2)  output.push(obj);
            if(operator=='>')  if(obj[variable] > arg2)  output.push(obj);
            if(operator=='<=') if(obj[variable] <= arg2) output.push(obj);
            if(operator=='>=') if(obj[variable] >= arg2) output.push(obj);
          }catch(e){}
        }
        return new Query(output);
      }
      console.warn('Invalid variable type: Function aborted');
    }
    
    // -------------------- PRIVATE DATA -------------------- \\
    
    var data = [];
    
    // -------------------- CONSTRUCTOR -------------------- \\
    
    !function Constructor(querydata){
      if(querydata == null || querydata == undefined) querydata = [];
      if(querydata.constructor != Array){
        console.warn('Invalid Query data: Creating an empty query');
        querydata = [];
      };
      data = querydata;
    }.apply(self, arguments);
  }
  
  
  
  
  
  
  
  
  
  var Request = function RequestHandler(url){
    var self = this;
    self.URL = url;
    var timeMemory,
        argumentMemory;
    self.send = function RequestJSSend(data,callback,errorhandler){
      if(arguments.callee.caller!=RequestJSRetry){
        timeMemory = 0;
      };
      argumentMemory = arguments;
      var callback = callback || new Function(),
          errorhandler = errorhandler || new Function(),
          data = data || {};
      var xmlhttp;
      if (window.XMLHttpRequest){xmlhttp=new XMLHttpRequest();}else{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");};
      xmlhttp.onreadystatechange=function(event){
        if (xmlhttp.readyState==4){
          if(xmlhttp.status==200){
            var data = JSON.parse(event.target.response);
            if(data.stat=='ok'){
              callback(data);
            }else{
              errorhandler(new ErrorEvent(data.code,data.message));
            };
          }else{
            errorhandler(new ErrorEvent(-1,'Internal Server Error'));
          };
        };
      };
      xmlhttp.onerror=function(event){
        errorhandler(new ErrorEvent(-2,'Client Request JS Error'));
      };
      xmlhttp.open("POST",url,true);
      xmlhttp.send(JSON.stringify(data));
    };
    var ErrorEvent = function(errorcode,message){
      var event = this;
      this.stat = 'fail';
      this.code = errorcode;
      this.message = message;
      this.retry = function(){
        timeMemory++;
        timeout = Math.pow(2,timeMemory);
        if(timeout>60){timeout=60};
        console.warn('Retrying Request In "'+timeout+'" Seconds');
        setTimeout(RequestJSRetry,timeout*1000);
      };
      this.warn = function(message){
        console.warn(message+'\n    Error Code: '+event.code+'\n    Error Message: "'+event.message+'"');
      };
      this.error = function(message){
        console.error(message+'\n    Error Code: '+event.code+'\n    Error Message: "'+event.message+'"');
      };
    };
    function RequestJSRetry(){
      self.send.apply(self,argumentMemory);
    };
  };
  
  
  
  
  
  
  
  
  
  
  
  function Device(){
    var self = this;
  
    // -------------------- PRIVATE METHODS -------------------- \\
    
    function ClearObject(){
      for(prop in self){
        if(self.hasOwnProperty(prop)){
          delete self[prop];
        }
      }
    }
    
    function ResetState(){
      ClearObject();
      self.addEventListener = AddEventEventListener;
      self.removeEventListener = RemoveEventListener;
      self.connect = Connect;
      self.__defineSetter__('onmessage', OnMessageSetter);
      self.__defineGetter__('onmessage', OnMessageGetter);
      self.__defineGetter__('CONNECTED', ConnectedGetter);
      SetMetadata();
    }
    
    function AddEventEventListener(name, funct){
      eventListener.add(name, funct);
    }
    
    function RemoveEventListener(name, funct){
      eventListener.remove(name, funct);
    }
    
    function ConnectedGetter(){
      return connected;
    }
    
    function OnMessageGetter(){
      return onmessage
    }
    
    function OnMessageSetter(funct){
      if(typeof funct != 'function'){
        console.warn('Invalid variable type');
        return;
      };
      onmessage = funct;
    }
    
    function Connect(pin){
      if(typeof pin != 'string' && !pinmemory){
        console.warn('Invalid variable type: Function aborted');
        return;
      };
      var request = new Request('/jirohandle/devices/connect');
      function OnSuccess(event){
        pinmemory = pin;
        ChangeStateToConnected();
        eventListener.run(Events.Device.ONCONNECT, {device:self});
      }
      function OnError(event){
        var _event = new CustomEvent(
        	"DeviceConnectionErrorEvent",{
        		detail: {
              retry: event.retry,
              message: event.message,
            },
        		bubbles: true,
        		cancelable: true
        });
        eventListener.run(Events.Device.ONCONNECTERROR, event);
      }
      request.send({
        'pin': !!pinmemory ? pinmemory : pin,
        'identifier': self.identifier,
        'host': host.getIdentifier()
      }, OnSuccess, OnError);
    }
  
    function ChangeStateToConnected(){
      ClearObject();
      self.addEventListener = AddEventEventListener;
      self.removeEventListener = RemoveEventListener;
      self.__defineSetter__('onmessage', OnMessageSetter);
      self.__defineGetter__('onmessage', OnMessageGetter);
      self.__defineGetter__('CONNECTED', ConnectedGetter);
      self.disconnect = Disconnect;
      connected = true;
    }
    
    function Disconnect(){
      var request = new Request('/jirohandle/devices/disconnect');
      function OnSuccess(event){
        ResetState();
        eventListener.run(Events.Device.ONDISCONNECT);
      }
      function OnError(event){
        var _event = new CustomEvent(
        	"DeviceDisconnectionErrorEvent",{
        		detail: {
              retry: event.retry,
              message: event.message,
            },
        		bubbles: true,
        		cancelable: true
        });
        eventListener.run(Events.Device.ONDISCONNECTERROR, event);
      }
      request.send({
        'identifier': host.getIdentifier(),
        'device': self.identifier
      }, OnSuccess, OnError);
    }
    
    function SetMetadata(){
  		Object.defineProperty(self,"identifier",{
        value:metadata.identifier,
        writable:false,
        enumerable:true,
        configurable:false
      });
  		Object.defineProperty(self,"name",{
        value:metadata.name,
        writable:false,
        enumerable:true,
        configurable:false
      });
  		Object.defineProperty(self,"distance",{
        value:metadata.distance,
        writable:false,
        enumerable:true,
        configurable:false
      });
  		Object.defineProperty(self,"model",{
        value:metadata.model,
        writable:false,
        enumerable:true,
        configurable:false
      });
    }
  
    // -------------------- PRIVATE DATA -------------------- \\
  
    var connected = false, pinmemory, onmessage, metadata, host,
        eventListener = new EventListener();
  
    // -------------------- CONSTRUCTOR -------------------- \\
    !function Constructor(handleResponse, hostinstance){
      metadata = handleResponse;
      host = hostinstance;
      ResetState();
    }.apply(self, arguments);
  }
  
  
  
  
  
  
  
  
  
  
  
  function Host(){
    var self = this;
    
    // -------------------- PRIVATE METHODS -------------------- \\
    
    function ClearObject(){
      for(prop in self){
        if(self.hasOwnProperty(prop)){
          delete self[prop];
        }
      }
    }
    
    function ResetState(){
      ClearObject();
      self.connect = Connect;
      self.addEventListener = AddEventEventListener;
      self.removeEventListener = RemoveEventListener;
  		self.__defineGetter__('CONNECTED', ConnectionGetter);
    }
    
    function AddEventEventListener(name, funct){
      eventListener.add(name, funct);
    }
    
    function RemoveEventListener(name, funct){
      eventListener.remove(name, funct);
    }
    
    function ConnectionGetter(){
		  return connected;
		}
    
    function DevicesGetter(){
		  return devices;
		}
    
    function Connect(){
      var request = new Request('/jirohandle/login/host');
      function OnSuccess(event){
        identifier = event.identifier;
        socket = event.socket_token;
        StartSocket();
      }
      function OnError(event){
        var _event = new CustomEvent(
        	"HostConnectionErrorEvent",{
        		detail: {
              retry: event.retry,
              message: event.message,
            },
        		bubbles: true,
        		cancelable: true
        });
        eventListener.run(Events.Host.ONCONNECTERROR, _event);
      }
      request.send({}, OnSuccess, OnError);
    }
    
    function ChangeToConnectedState(){
      // Upon connection, add all pertinant methods to the Host
      ClearObject();
      self.addEventListener = AddEventEventListener;
      self.removeEventListener = RemoveEventListener;
  		self.__defineGetter__('CONNECTED', ConnectionGetter);
  		self.__defineGetter__('devices', DevicesGetter);
      self.disconnect = Disconnect;
      self.locateDevices = LocateDevices;
      connected = true;
    }
    
    function OnSocketOpen(){
      ChangeToConnectedState();
      eventListener.run(Events.Host.ONCONNECT);
    }
    
    function OnSocketMessage(event){
      var event = JSON.parse(event.data),
          deviceID = event.identifier,
          device = devices.filter('identifier =', deviceID).get();
      if(!!device) device.onmessage(event.data);
    }
    
    function OnSocketClose(){
      console.error('The host connection has been disconnected');
      ResetState();
    }
    
    function StartSocket(){
      var channel = new goog.appengine.Channel(socket);
      socket = channel.open();
      socket.onopen = OnSocketOpen;
      socket.onmessage = OnSocketMessage;
      socket.onerror = OnSocketClose;
      socket.onclose = OnSocketClose;
    }
    
    function Disconnect(){
      var request = new Request('/jirohandle/login/hostdisconnect');
      function OnSuccess(){
        ResetState();
        eventListener.run(Events.Host.ONDISCONNECT);
      }
      function OnError(){
        eventListener.run(Events.Host.ONDISCONNECTERROR);
      }
      request.send({
        identifier: identifier
      }, OnSuccess, OnError);
    }
    
    function LocateDevices(options){
      var request = new Request('/jirohandle/devices/nearby'),
          options = typeof options == 'object' ? options : {},
          radius = typeof options.radius == 'number' ? options.radius : null,
          model = typeof options.model == 'string' ? options.model : null;
      function OnSuccess(event){
        var newDevices = [];
        for(var i=0,device; device=event.devices[i++];){
          // checks duplicates
          var contained = false;
          for(var z=0,savedDevice; savedDevice=devices.all()[z++];){
            if(savedDevice.identifier == device.identifier){
              contained = true;
              break;
            }
          }
          if(!contained) newDevices.push(new Device(device, PrivateHostMethods));
        }
        devices = new Query(devices.all().concat(newDevices));
        eventListener.run(Events.Host.ONLOCATION, {
          devices: new Query(event.devices),
          params: options
        });
      }
      function OnError(event){
        var _event = new CustomEvent(
        	"DeviceLocationErrorEvent",{
        		detail: {
              retry: event.retry,
              message: event.message,
            },
        		bubbles: true,
        		cancelable: true
        });
        eventListener.run(Events.Host.ONLOCATIONERROR, _event);
      }
      request.send({
        radius: radius,
        model: model
      }, OnSuccess, OnError);
    }
    
    function GetIdentifier(){
      return identifier;
    }
    
    
    // -------------------- PRIVATE DATA -------------------- \\
    
    var eventListener = new EventListener(),
        connected = false,
        devices = new Query(),
        identifier,
        socket,
        PrivateHostMethods = new Object();
    
    
    // -------------------- CONSTRUCTOR -------------------- \\
    
    !function Constructor(){
      if(++hostcount>1) throw 'Only one host can be instanciated per webpage';
      ResetState();
      PrivateHostMethods.getIdentifier = GetIdentifier;
    }.apply(self, arguments);
  }
  
  // used to insure that only one host is created per webpage
  var hostcount = 0;
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  window.Jiro = new Object();
  Jiro.Host = Host;
  Jiro.Events = Events;
  
})();