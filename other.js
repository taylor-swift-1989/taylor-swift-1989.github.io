
 // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    var num
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          !/^0/.test(value) && !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }















function	getRect (id,vue,useUni,delay){ //ID选择器：#the-id   #可以不要         紧紧支持id
            var  that=vue;//Vue实例才拥有_isVue 属性，在此是避免观测Vue实例对象。
		  	var  id =id;
		
			if(!vue||!vue._isVue){
				console.log("请传入vue 对象")
				//Promise.resolve(false);
				return false;
			}
			var   useUni=useUni||false;
			var   platform="APP-PLUS";

				 //#ifdef APP-PLUS-NVUE || APP-NVUE
				 platform = "APP-NVUE";///**App nvue*/     	//APP-PLUS-NVUE或APP-NVUE	 App nvue 页面
				 //#endif
				 
               if(useUni){
				  platform="APP-PLUS"; 
			   }
			
           //console.log("getRect id",id)
           //console.log("getRect this",JSON.stringify(that))
			if(platform=="APP-PLUS"){////nvue不支持 uni.createSelectorQuery,
			
			         return new Promise(resolve => {
			           setTimeout(() => {     
							var selector=id.indexOf("#")!=-1?id:("#"+id);
							   //console.log("selector ",selector)
							var query = uni.createSelectorQuery().in(that);
								query.select(selector).boundingClientRect(res => {
									          res.methodType='uni';
											   resolve(res)
											//console.log("uni getRect 1得到布局位置信息" , res);
											//res={"id":"as2ss","dataset":{"ref":"as2ss"},"left":12,"right":312,"top":286,"bottom":336,"width":300,"height":50}
											
								 }).exec();
						}, delay||100);
					})
			
			}else{
			
				////#ifdef APP-NVUE
					const dom = weex.requireModule('dom');
					var id2=id.replace("#",'')
					//console.log("id2 ",id2)
					return new Promise(resolve => {
					  setTimeout(() => {     
						         var talkcontent=that.$refs[id2]
								 var result = dom.getComponentRect(talkcontent, res => {
									       res.size.methodType='weex';
										   resolve(res.size)
									     // console.log("weex getRect 2得到布局位置信息" , res);
									 //res.size= {"right":300,"left":0,"width":300,"bottom":71,"top":21,"height":50}
									
									
								 })
						 }, delay||100);
					})
					//// #endif
			}

	}

//<view id="as2ss" ref="as2ss" style="width: 300px; height: 50px; background-color:#666;"> 布局盒子</view>

//async	test_getRect(){
// 	var   size=await  getRect("#as2ss",this,"weex");
// 	console.log("getRect 结果--",size)
// },


//vue2 nextTick------------------------------------------------------------------
// 定义一个队列
const queue = []；

 function queueJob(job){
    // 不存在队列中，则放入 
     if(!queue.includes(job)){
         queue.push(job)
     }
     
     // 放入微队列中执行
    nextTick2(() => {
         let jobFn
         // 取出队列中的第一个effect进行执行
         while(jobFn = queue.shift()){
            jobFn && jobFn()
         }
    })
}

 function nextTick2(fn){
  return fn ? Promise.reslove.then(fn) : Promise.reslove()
}



function nextTick (cb, ctx) {
    var _resolve;
      // 放入回调函数，等待DOM重新渲染完毕后执行
    callbacks.push(function () {
      if (cb) {
        try {
          // 修改执行上下文，指向当前页面实例
          // 所以在我们没有使用箭头函数的前提下，this指向仍然正确
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
    }
	// 原型链上，挂载此方法
	// Vue.prototype.$nextTick = function (fn) {
	//       //参数1：回调函数，参数二：页面实例执行上下文
	//       return nextTick(fn, this)
	//     };
	
	
	//timerFunc()
	//Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，
	//如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

    //宏任务耗费的时间是大于微任务的，所以在浏览器支持的情况下，优先使用微任务。
	//如果浏览器不支持微任务，使用宏任务；但是，各种宏任务之间也有效率的不同，需要根据浏览器的支持情况，使用不同的宏任务。
	
	//
	const callbacks = []   // 回调队列
	let pending = false    // 异步锁
	
	// 执行队列中的每一个回调
	function flushCallbacks () {
	  pending = false     // 重置异步锁
	  // 防止出现nextTick中包含nextTick时出现问题，在执行回调函数队列前，提前复制备份并清空回调函数队列
	  const copies = callbacks.slice(0)
	  callbacks.length = 0
	  // 执行回调函数队列
	  for (let i = 0; i < copies.length; i++) {
	    copies[i]()
	  }
	}


  let timerFunc;
  /* 优先检测微任务(micro task) */
  // 检测浏览器是否原生支持 Promise
  if (typeof Promise !== 'undefined') {
    const p = Promise.resolve()
    timerFunc = () => {
      p.then(flushCallbacks)
    }
    isUsingMicroTask = true
  } 
  // 以上都不支持的情况下，使用setTimeout
  else {
    timerFunc = () => {
      setTimeout(flushCallbacks, 0)
    }
  }



//vue3 nextTick-------------------------------------------------------------------------
const resolvedPromise =  Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
    const p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
// ————————————————
// 版权声明：本文为CSDN博主「haruhiSzmy」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/qq_42316310/article/details/125389053

//------------------------------------------------------------------------------



//https://github.com/umicro/uView/blob/master/uview-ui/libs/function/trim.js

//trim.js
function trim(str,pos ) {
			var pos= pos||'botn'
			 if (pos == "botn") {//两侧
			  return str.replace(/(^\s*)|(\s*$)/g,"");
			 } 
			 if (pos == "left") {
				return str.replace(/^\s*/, '');
			 } 
			 if (pos == 'right') {
				return str.replace(/(\s*$)/g, "");
			 } 
			//全部
			return str.replace(/\s+/g, "");
			
}

function typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]'  : 'boolean',
        '[object Number]'   : 'number',
        '[object String]'   : 'string',
        '[object Function]' : 'function',
        '[object Array]'    : 'array',
        '[object Date]'     : 'date',
        '[object RegExp]'   : 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null',
        '[object Object]'   : 'object'
    };
    return map[toString.call(obj)];
}


// firstUpperCase
function firstUpperCase(str) {
    return str.toString()[0].toUpperCase() + str.toString().slice(1);
}

function random(min, max) {
	if (min >= 0 && max > 0 && max >= min) {
		let gab = max - min + 1;
		return Math.floor(Math.random() * gab + min);
	} else {
		return 0;
	}
}

 function unique(arr,prop){
	     if(!arr||!arr.length){
			 return [];
		 }
	
	     if(!prop){
			   return [...new Set(arr)];
		    }
	
         var result = [];
         var obj = {};
         for (var i =0; i<arr.length; i++){
          if (!obj[arr[i][prop]]){
            result.push(arr[i]);
            obj[arr[i][prop]] = true;
          }
         }
    return result;
}


 function myExtend() {
        var length = arguments.length;
        var target = arguments[0] || {};
        if (typeof target!="object" && typeof target != "function") {
            target = {};
        }
        if (length == 1) {
            target = this;
            i--;
        }
		var hasOwn=Object.prototype.hasOwnProperty;
        for (var i = 1; i < length; i++) {
            var source = arguments[i];
            for (var key in source) {
                // 使用for in会遍历数组所有的可枚举属性，包括原型。
                if (hasOwn.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }
	
	
	function getRandomArray(arr,num){
		    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
		    var temp_array = new Array();
		    for (var index in arr) {
		        temp_array.push(arr[index]);
		    }
			// console.log("1 getRandomArray arr",arr)
		    //取出的数值项,保存在此数组
		    var return_array = new Array();
		    for (var i = 0; i<num; i++) {
		        //判断如果数组还有可以取出的元素,以防下标越界
		        if (temp_array.length>0) {
		            //在数组中产生一个随机索引
		            var arrIndex = Math.floor(Math.random()*temp_array.length);
		            //将此随机索引的对应的数组元素值复制出来
		            return_array[i] = temp_array[arrIndex];
		            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
		            temp_array.splice(arrIndex, 1);
		        } else {
		            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
		            break;
		        }
		    }
			// console.log("getRandomArray",return_array)
		    return return_array;
}



//debounce
function debounce(func, wait, immediate) {
 var wait=wait||800;
 var timeout;

    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
         // console.log('混入的钩子函数2');
        if (callNow) func.apply(context, args);
    };
  }
  
  //throttle
  function throttle(fn, wait) {

	  var wait=wait||800;
     // console.log(fn, wait)
    // 上一次执行 fn 的时间
    var previous = 0
    // 将 throttle 处理结果当作函数返回
    return function() {
     // console.log(2)
     var   args = arguments;
      // 获取当前时间，转换成时间戳，单位毫秒
      let now = +new Date()
      // 将当前时间和上一次执行函数的时间进行对比
      // 大于等待时间就把 previous 设置为当前时间并执行函数 fn
      if (now - previous > wait) {
        previous = now;
        //console.log(55,wait)
        fn.apply(this, args)
      }
    }
  }
  
  function rafThrottle(fn) {
    var locked = false;
    return function() {
	    var args = arguments;	
      if (locked) return;
      locked = true;
      window.requestAnimationFrame(_ => {
        fn.apply(this, args);
        locked = false;
      });
    };
  }
  
  
  
  //格式化时间
  function formatTime(timestamp, nos,bindf) {
  	if (!timestamp) {
  		return
  	}
	var nos=nos||1;
	var bindf=bindf||'-';
  	var date = new Date(timestamp)
  	var strLen = timestamp.toString().length
  	// 判断时间戳是否不足13位，不足时低位补0，即乘以10的所差位数次方
  	if (strLen < 13) {
  		var sub = 13 - strLen
  		sub = Math.pow(10, sub) // 计算10的n次方
  		date = new Date(timestamp * sub)
  	}
  	var y = date.getFullYear()
  	var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  	var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  	var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  	var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  	var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  	if (nos === 1) {       //2022-08-12 12:10:22
  		return y + bindf + M + bindf + d + ' ' + h + ':' + m + ':' + s
  	} else if (nos === 2) { //2022-08-12 
  		return y + bindf + M + bindf + d
  	} else if (nos === 3) {//08-12 
  		return M + bindf + d
  	} else if (nos === 4) {//12:10:22
  		return h + ':' + m + ':' + s
  	} else if (nos === 5) {//2022-08-12 12:10
  		return y + bindf + M + bindf + d + ' ' + h + ':' + m
  	} else if (nos === 6) {//08-12 12:10:22
  		return M + bindf + d + ' ' + h + ':' + m + ':' + s
  	} else if (nos === 7) {//08-12 12:10
  		return M + bindf + d + ' ' + h + ':' + m
  	} else if (nos === 8) {//2022-08
  		return y + bindf + M
  	} else if (nos === 9) {//08月12日12:10
  		return M + '月' + d + '日' + h + ':' + m
  	} else if (nos === 10) {
  		if (date.toDateString() === new Date().toDateString()) { //今天12:10
  			return '今天' + ' ' + h + ':' + m
  		} else {                                               //08月12日 12:10:22
  			return M + '月' + d + '日' + ' ' + h + ':' + m
  		}
  	}
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
 function mySystem() {
        
 		var system=uni.getSystemInfoSync();
 		var statusBarHeight = system.statusBarHeight //状态栏高度
 		var navigatorHeight=44;
 		var isAndroid=false;
 		
 		if(system.system.toLowerCase().indexOf("ios")!=-1) {
 		     navigatorHeight=44
 			 isAndroid=false;
 		 }else {
 			isAndroid=true;
 		    navigatorHeight=48
 		 }
 								
 		var totalHeight=navigatorHeight+statusBarHeight
 		
 	
 		//https://uniapp.dcloud.net.cn/tutorial/platform.html#preprocessor
 		var   platform="";
 			 //#ifdef APP-PLUS
 			  platform = "APP-PLUS";///**App*/
 			  //#endif
 			  
 			  //#ifdef APP-PLUS-NVUE || APP-NVUE
 			  platform = "APP-PLUS-NVUE";///**App nvue*/     	//APP-PLUS-NVUE或APP-NVUE	 App nvue 页面
 			  //#endif
 			 
 			  //#ifdef MP-WEIXIN
 			  platform = "MP-WEIXIN";///**微信小程序*/
 			  //#endif
 			  
 			  
 		var navInfo={
 			system:system,
 			statusBarHeight:statusBarHeight,
 			navigatorHeight:navigatorHeight,
 			totalHeight:totalHeight,
 			isAndroid:isAndroid,
 			platform:platform,
 			windowHeight:system.windowHeight,
 			windowWidth:system.windowWidth,
 			safeAreaBottom:system.safeAreaInsets.bottom||0,
 			safeAreaInsetBottom:system.safeAreaInsets.bottom||0,
 			
 		 }	
 		// localStorage&&localStorage.setItem("isAndroid", this.isAndroid)
 		// localStorage&&localStorage.setItem("totalHeight", this.totalHeight)
 		// localStorage&&localStorage.setItem("platform", platform)
 		//console.log("mySystem ",navInfo,"platform",platform)
 		return 	navInfo;				
 	
 }
 
 


  
  
  /**
   * 判断是否为空
   */
  function isEmpty(value) {
  	switch (typeof value) {
  		case 'undefined':
  			return true;
  		case 'string':
  			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
  			break;
  		case 'boolean':
  			if (!value) return true;
  			break;
  		case 'number':
  			if (0 === value || isNaN(value)) return true;
  			break;
  		case 'object':
  			if (null === value || value.length === 0) return true;
  			for (var i in value) {
  				return false;
  			}
  			return true;
  	}
  	return false;
  }  
 
 

 
  function isEmptyJSON(obj) {
     return  !Object.getOwnPropertyNames(obj).length &&  !Object.getOwnPropertySymbols(obj).length||JSON.stringify(obj) ===  '{}' ;
   }
  

  
  function isHtmlElement(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
  }
  
 
 /**
  * 是否json字符串
  */
 function  isJSONStr(value) {
 	if (typeof value == 'string') {
 		try {
 			var obj = JSON.parse(value);
 			if (typeof obj == 'object' && obj) {
 				return true;
 			} else {
 				return false;
 			}
 		} catch (e) {
 			return false;
 		}
 	}
 	return false;
 }
 
 //https://github.com/lodash/lodash
 function isJSONObj(obj){
  return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
 }
 
 /**
  * 是否数组
  */
 function isArray(value) {
 	if (typeof Array.isArray === "function") {
 		return Array.isArray(value);
 	} else {
 		return Object.prototype.toString.call(value) === "[object Array]";
 	}
 }
 
 /**
  * 是否对象
  */
 function isObject(value) {
 	return Object.prototype.toString.call(value) === '[object Object]';
 }
 

function isFunction(obj){
	// console.log(isFunction(alert)); true
	// console.log(isFunction(console.log));  true
	// console.log(isFunction('GeeksgorGeeks'));  false
	
	//https://github.com/jashkenas/underscore/blob/master/modules/isFunction.js
	//https://github.com/jashkenas/underscore/tree/master/modules
	//https://github.com/ElemeFE/element/blob/dev/src/utils/types.js
	
	var isFun = (obj) => {
	  return obj && Object.prototype.toString.call(obj) === '[object Function]';
	};

	// Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
	// v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
	var nodelist =document&&document.childNodes;
	if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
	  isFun = function(obj) {
	    return typeof obj == 'function' || false;
	  };
	} 
	
	return  isFun(obj);
}

function isNumber(obj) {  
    return obj === +obj  
}  

function isBoolean(obj) {  
    return obj === !!obj  
}  



 
  
 // -------正则 start------------------------------------------------------------------------------------- 
  // https://github.com/validatorjs/validator.js
  var validator={
	  /**
	   * 验证电子邮箱格式
	   */
	   email(value) {
	  	return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(value);
	  },
	  
	  /**
	   * 验证手机格式
	   */
	   mobile(value) {
	  	return /^1[3-9]\d{9}$/.test(value)
	  },
	  
	  /**
	   * 验证URL格式
	   */
	   url(value) {
	  	return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/.test(value)
	  },
	  
	  /**
	   * 验证日期格式
	   */
	   date(value) {
	  	return !/Invalid|NaN/.test(new Date(value).toString())
	  },
 
	  /**
	   * 验证十进制数字
	   */
	   number(value) {
	  	return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
	  },
	  
	  /**
	   * 验证整数
	   */
	   digits(value) {
	  	return /^\d+$/.test(value)
	  },
	  
	  /**
	   * 验证身份证号码
	   */
	   idCard(value) {
	  	return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
	  },
	  

	  
	  /**
	   * 金额,只允许2位小数
	   */
	   amount(value) {
	  	//金额，只允许保留两位小数
	  	return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value);
	  },
	  
	  /**
	   * 中文
	   */
	   chinese(value) {
	  	var reg = /^[\u4e00-\u9fa5]+$/gi;
	  	return reg.test(value);
	  },
	  
	  /**
	   * 只能输入字母
	   */
	   letter(value) {
	  	return /^[a-zA-Z]*$/.test(value);
	  },
	  
	  /**
	   * 只能是字母或者数字
	   */
	   enOrNum(value) {
	  	//英文或者数字
	  	var reg = /^[0-9a-zA-Z]*$/g;
	  	return reg.test(value);
	  },
	  

	  /**
	   * 验证一个值范围[min, max]
	   */
	   range(value, param) {
	  	return value >= param[0] && value <= param[1]
	  },
	  
	  /**
	   * 验证一个长度范围[min, max]
	   */
	   rangeLength(value, param) {
	  	return value.length >= param[0] && value.length <= param[1]
	  },
	  
	  /**
	   * 是否固定电话
	   */
	   landline(value) {
	  	var reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
	  	return reg.test(value);
	  },
 
  }  
 

 // -------正则 end------------------------------------------------------------------------------------- 
   
  //https://github.com/view-design/ViewUIPlus/blob/master/src/utils/assist.js 
// download file
export async function downloadFile(url, name = 'unnamed') {
    if (!isClient) return Promise.reject();
    try {
        const res = await fetch(url);
        const blob = await res.blob();

        if (!blob) return Promise.reject();

        const localUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', localUrl);
        a.setAttribute('download', name);
        a.click();
        URL.revokeObjectURL(localUrl);
        return Promise.resolve();
    } catch(e) {
        return Promise.reject(e);
    }
}
