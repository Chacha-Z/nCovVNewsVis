class EventBus {
    constructor() {
      this.events = this.events || new Object(); 
    }
  }
  //首先构造函数需要存储event事件，使用键值对存储
  //然后我们需要发布事件，参数是事件的type和需要传递的参数
  EventBus.prototype.emit = function(type, ...args) { 
      let e; 
      e = this.events[type];  
      // 查看这个type的event有多少个回调函数，如果有多个需要依次调用。
      if (Array.isArray(e)) {  
          for (let i = 0; i < e.length; i++) {   
              e[i].apply(this, args);    
            }  
     } else {
            e[0].apply(this, args);  
           }  
     };
   //然后我们需要写监听函数，参数是事件type和触发时需要执行的回调函数
   EventBus.prototype.addListener = function(type, fun) { 
         const e = this.events[type]; 
  
          if (!e) {   //如果从未注册过监听函数，则将函数放入数组存入对应的键名下
           this.events[type]= [fun];
          } else {  //如果注册过，则直接放入
             e.push(fun);
          }
    };
    const eventBus = new EventBus();
    export default eventBus;