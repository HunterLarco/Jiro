(function(){
  
  window.Jiro = new Object();
  Jiro.Response = Response;
  Jiro.Host = Host;
  
  
  
  
  
  
  
  
  
  function Response(){
    var self = this;
    
    // -------------------- PRIVATE METHODS -------------------- \\
    
    function IsDefined(variable){
      var undefined;
      return variable != undefined && variable != null;
    }
    
    // -------------------- CONSTRUCTOR -------------------- \\
    
    function Constructor(stat, data){
      if(IsDefined(stat))
    		Object.defineProperty(self,"stat",{
          value:stat,
          writable:false,
          enumerable:true,
          configurable:false
        });
      if(typeof data == 'object')
        for(var key in data){
          if(IsDefined(stat))
        		Object.defineProperty(self,key,{
              value:data[key],
              writable:false,
              enumerable:true,
              configurable:false
            });
        }
    }
    Constructor.apply(self, arguments);
  }
  
  Response.CODES = {
    '-1': 'Unknown response code',
     '1': 'Invalid variable type',
     '2': 'Event listener is not defined',
     '3': 'Event listener cannot be removed: The provided method has not been added to the event listener',
     '4': 'Invalid filter parameter'
  }
  
  Response.throw = function ThrowResponse(code){
    if(!Response.CODES[code]) code = -1;
    return new Response('fail', {
      'code': code,
      'message': Response.CODES[code]
    });
  }
  
  Response.reply = function ReplyResponse(data){
    return new Response('ok', data||{});
  }
  
  
  
  
  
  
  
  
  
  
  
  function EventListener(){
    var self = this;
    
    // -------------------- PUBLIC METHODS -------------------- \\
    
    self.add = function AddEventListener(name, funct){
      if(typeof name != 'string' || typeof funct != 'function') return Response.throw(1);
      if(!eventListeners[name]) eventListeners[name] = [];
      eventListeners[name].push(funct);
      return Response.reply();
    }
    
    self.remove = function RemoveEventListener(name, funct){
      if(typeof name != 'string' || typeof funct != 'function') return Response.throw(1);
      if(!eventListeners[name]) return Response.throw(2);
      var index = eventListeners[name].indexOf(funct);
      if(index<0) return Response.throw(3);
      eventListeners[name].splice(index, 1);
      return Response.reply();
    }
    
    self.run = function RunEventListener(name, event){
      if(typeof name != 'string') return Response.throw(1);
      if(!eventListeners[name]) return Response.throw(2);
      for(var i=0,listener; listener=eventListeners[name][i++];){
        listener(event);
      }
      return Response.reply()
    }
    
    // -------------------- PRIVATE DATA -------------------- \\
    
    var eventListeners = {};
  }
  
  
  
  
  
  
  
  
  
  // FIXME: chaining issue with response
  function Query(){
    var self = this;
    
    // -------------------- PUBLIC METHODS -------------------- \\
    
    self.all = function All(){
      return data;
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
          query = query.filter(key, arg1[key]);
          if(query.stat=='fail') return query;
          query = query.query;
        }
        return Response.reply({
          'query': query
        });
      }else if(typeof arg1 == 'string'){
        var tagRegExp = /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(=|>|<|!=|<=|>=)\s*$/,
            match = tagRegExp.exec(arg1);
        if(!match) return Response.throw(4);
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
        return Response.reply({
          'query': new Query(output)
        });
      }
      return Response.throw(1);
    }
    
    // -------------------- PRIVATE DATA -------------------- \\
    
    var data = [];
    
    // -------------------- CONSTRUCTOR -------------------- \\
    
    function Constructor(querydata){
      if(querydata == null || querydata == undefined) querydata = [];
      if(querydata.constructor != Array) return Response.throw(1);
      data = querydata;
    }
    Constructor.apply(self, arguments);
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  function Host(){
    var self = this;
    
    // -------------------- PUBLIC METHODS -------------------- \\
    
    self.connect = function ConnectHost(){
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
        eventListener.run('connecterror', _event);
      }
      request.send({}, OnSuccess, OnError);
      return Response.reply();
    }
    
    self.addEventListener = function(name, funct){
      return eventListener.add(name, funct);
    }
    
    self.removeEventListener = function(name, funct){
      return eventListener.remove(name, funct);
    }
    
		self.__defineGetter__('CONNECTED', function ConnectionGetter(){
		  return connected;
		});
    
    
    
    
    // -------------------- PRIVATE METHODS -------------------- \\
    
    function Device(){
      var self = this;
    
      // -------------------- PUBLIC METHODS -------------------- \\
    
      self.connect = Connect;
    
      self.__defineSetter__('onmessage', function(funct){
        if(typeof funct != 'function') return Response.throw(1);
        onmessagehandlers[self.identifier] = funct;
        return Response.reply();
      })
      self.__defineGetter__('onmessage', function(){
        return onmessagehandlers[self.identifier];
      })
    
      self.__defineGetter__('CONNECTED', function(){
        return connected;
      });
    
      // -------------------- PRIVATE METHODS -------------------- \\
      
      function Connect(pin){
        if(typeof pin != 'string' && !pinmemory) return Response.throw(1);
        var request = new Request('/jirohandle/devices/connect');
        function OnSuccess(event){
          pinmemory = pin;
          InitializeDevice();
          eventListener.run('deviceconnect', {device:self});
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
          eventListener.run('deviceconnecterror', event);
        }
        request.send({
          'pin': !!pinmemory ? pinmemory : pin,
          'identifier': self.identifier,
          'host': identifier
        }, OnSuccess, OnError);
        return Response.reply();
      }
    
      function InitializeDevice(){
        connected = true;
        delete self.connect;
        self.disconnect = Disconnect;
      }
      
      function ResetDevice(){
        connected = false;
        self.connect = Connect;
        delete self.disconnect;
      }
    
      function Disconnect(){
        var request = new Request('/jirohandle/devices/disconnect');
        function OnSuccess(event){
          ResetDevice();
          eventListener.run('devicedisconnect');
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
          eventListener.run('devicedisconnecterror', event);
        }
        request.send({
          'identifier': identifier,
          'device': self.identifier
        }, OnSuccess, OnError);
      }
    
      // -------------------- PRIVATE DATA -------------------- \\
    
      var connected = false, pinmemory;
    
      // -------------------- CONSTRUCTOR -------------------- \\
      function Constructor(handleResponse){
    		Object.defineProperty(self,"identifier",{
          value:handleResponse.identifier,
          writable:false,
          enumerable:true,
          configurable:false
        });
    		Object.defineProperty(self,"name",{
          value:handleResponse.name,
          writable:false,
          enumerable:true,
          configurable:false
        });
    		Object.defineProperty(self,"distance",{
          value:handleResponse.distance,
          writable:false,
          enumerable:true,
          configurable:false
        });
    		Object.defineProperty(self,"model",{
          value:handleResponse.model,
          writable:false,
          enumerable:true,
          configurable:false
        });
      }
      Constructor.apply(self, arguments);
    }
    
    function InitializeHost(){
      // Upon connection, add all pertinant methods to the Host
      connected = true;
  		self.__defineGetter__('devices', function DevicesGetter(){
  		  return devices;
  		});
      delete self.connect;
      self.disconnect = Disconnect;
      self.locateDevices = LocateDevices;
    }
    
    function OnSocketOpen(){
      InitializeHost();
      eventListener.run('connect');
    }
    
    function OnSocketMessage(event){
      var event = JSON.parse(event.data),
          device = event.identifier;
      if(!!onmessagehandlers[device]) onmessagehandlers[device](event.data);
    }
    
    function OnSocketClose(){
      console.warn('The host connection has been distrupted: It will stop working until reconnected.');
      // TODO: write the reconnection version of the host
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
        eventListener.run('disconnect');
      }
      function OnError(){
        eventListener.run('disconnecterror');
      }
      request.send({
        identifier: identifier
      }, OnSuccess, OnError);
    }
    
    function SetDeviceOnMessageListener(identifier, funct){
      // indentifier and funct are garaunteed to be valid
      onmessagehandlers[identifier] = funct;
    }
    
    function LocateDevices(options){
      var request = new Request('/jirohandle/devices/nearby'),
          options = typeof options == 'object' ? options : {},
          radius = typeof options.radius == 'number' ? options.radius : null,
          model = typeof options.model == 'string' ? options.model : null;
      function OnSuccess(event){
        for(var i=0,device; device=event.devices[i++];){
          // checks duplicates
          var contained = false;
          for(var z=0,savedDevice; savedDevice=devices.all()[z++];){
            if(savedDevice.identifier == device.identifier){
              contained = true;
              break;
            }
          }
          if(!contained) devices.all().push(new Device(device, SetDeviceOnMessageListener, identifier));
        }
        eventListener.run('search');
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
        eventListener.run('searcherror', _event);
      }
      request.send({
        radius: radius,
        model: model
      }, OnSuccess, OnError);
    }
    
    
    // -------------------- PRIVATE DATA -------------------- \\
    
    var eventListener = new EventListener(),
        connected = false,
        devices = new Query(),
        identifier,
        socket,
        onmessagehandlers = {};
    
    
    // -------------------- CONSTRUCTOR -------------------- \\
    
    function Constructor(){
      if(++hostcount>1) throw 'Only one host can be instanciated per webpage';
    }
    Constructor.apply(self, arguments);
  }
  
  // used to insure that only one host is created per webpage
  var hostcount = 0;
  
  
})();