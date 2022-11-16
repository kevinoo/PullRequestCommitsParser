/**
 * KUtils
 * @version:	1.22.0
 * @author:	Kevin Lucich
*/

(function(window){

	var KUtils = null,
		KUtilsHelps = null,
		check_patterns = {
			'text': {
				'all': 				"^(.)__OF_B__$",	//	__RANGE__
				'alphanumeric':		"^[a-zA-Z0-9 ]+$",
				'no_space': 		"^[\\S]+$",
				'codicefiscale':	"^[a-z]{6}[0-9]{2}[a-z][0-9]{2}[a-z][0-9]{3}[a-z]$",
				'piva':				"^[0-9]{11}$"
			},
			'number': {
				'all':		"^(([-+]?[0-9]+)|([-+]?([0-9]__OF_B__\\.[0-9]__OF_A__)))$",
				'int':		"^[-+]?[0-9]+$",
				'float':	"^[-+]?([0-9]__OF_B__\\.[0-9]__OF_A__)$"
			},
			'ip':{
				'all':		"^([1][0-9][0-9]|2[0-4][0-9]|25[0-5])\.([1][0-9][0-9]|2[0-4][0-9]|25[0-5])\.([1][0-9][0-9]|2[0-4][0-9]|25[0-5])\.([1][0-9][0-9]|2[0-4][0-9]|25[0-5])$"
			},
			'email':{
				'all':		"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,6}$"
			},
			'username':{
				'all':		"^([a-zA-Z0-9_-]__OF_B__)$"
			},
			'password':{
				'all':		"^([a-zA-Z0-9_-]__OF_B__)$"
			},
			'phone':{
				'all':		"^([0-9-()+ ]__OF_B__)$"
			},
			'date':{
				'all':		"^(((0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]([0-9]{4}))|((0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]([0-9]{4}))|(([0-9]{4})[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01]))|(([0-9]{4})[- /.](0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])))$",
				'Y-m-d':	"^(([0-9]{4})[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01]))$",
				'Y-d-m':	"^(([0-9]{4})[- /.](0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012]))$",
				'm-d-Y':	"^((0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]([0-9]{4}))$",
				'd-m-Y':	"^((0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]([0-9]{4}))$"
			},
			'space':{
				'all':				"[ \t\r\n]",
				'onlyspaces':		" ",
				'onlytabs':			"\t",
				'onlybreakline':	"[\n\r]"
			},
			'url':{
				'all':		"^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$",
				'onlywww':	"^w{3}([0-9]+)?\.([a-zA-Z0-9]([a-zA-Z0-9\-]{0,65}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}"
			},
			'creditcard':{
				'all':				"^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$",
				'visa':				"^4[0-9]{12}(?:[0-9]{3})?$",
				'mastercard':		"^5[1-5][0-9]{14}$",
				'americaexpress':	"^3[47][0-9]{13}$",
				'dinersclub':		"^3(?:0[0-5]|[68][0-9])[0-9]{11}$",
				'discover':			"^6(?:011|5[0-9]{2})[0-9]{12}$",
				'jcb':				"^(?:2131|1800|35\d{3})\d{11}$",
				'expdate':			"^(0[1-9]|1[012])\/([12][0-9])$"
			},
			'image':{
				'all':		"([^\s]+(?=\.(jpeg|jpg|gif|png|tiff))\.\2)$",
				'jpeg':		"([^\s]+(?=\.(jpeg))\.\2)$",
				'jpg':		"([^\s]+(?=\.(jpg))\.\2)$",
				'gif':		"([^\s]+(?=\.(gif))\.\2)$",
				'png':		"([^\s]+(?=\.(png))\.\2)$",
				'tiff':		"([^\s]+(?=\.(tiff))\.\2)$"
			},
			'color':{
				'all':		"^(rgb\((\d+),\s*(\d+),\s*(\d+)\))|(#?([a-f0-9]{6}|[a-f0-9]{3}))$",
				'rgb':		"^rgb\((\d+),\s*(\d+),\s*(\d+)\)$",
				'hex':		"^#?([a-fA-Z0-9]{6}|[a-fA-Z0-9]{3})$"
			},
			'html':{
				'all':		"(\<(/?[^\>]+)\>)"
			}
		};

	/*******************************************************************/
	/*******************************************************************/
	/*******************************************************************/
	/*******************************************************************/

	//	Functions used into KUtils :)

	KUtilsHelps = {
		'isWindow': function a( obj ){
			return obj != null && obj === obj.window;
		},

		'isPlainObject': function( obj ){
			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if ( typeof obj !== 'object' || obj.nodeType || KUtilsHelps.isWindow(obj) ) {
				return false;
			}

			// Support: Firefox <20
			// The try/catch suppresses exceptions thrown when attempting to access
			// the "constructor" property of certain host objects, ie. |window.location|
			// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
			try {
				if( obj.constructor && !core_hasOwn.call(obj.constructor.prototype,'isPrototypeOf') ){
					return false;
				}
			}catch( e ){
				return false;
			}

			// If the function hasn't returned already, we're confident that
			// |obj| is a plain object, created by {} or constructed with new Object
			return true;
		}
	};

	/*******************************************************************/
	/*******************************************************************/
	/*******************************************************************/
	/*******************************************************************/

	KUtils = {

		'plugins_version': {
			'KUtils': '1.21.0'
		},

		/**
		 KUtils.version
		 Ritorna una mappa con le versioni delle plugin
		 */
		'version': function( plugins ){

			if( typeof plugins !== 'undefined' ){
				for( p in plugins ){
					KUtils.plugins_version[ p ] = plugins[p];
				}
				return;
			}

			console.dir( KUtils.plugins_version );
		},

		/**
		 $.check( params|typeCheck, value, [, subtype] );
		 $( __ELEMENT__ ).check( params|typeCheck, [, subtype] );	Check the value of __ELEMENT__ with the "typeCheck"

		 @version	1.2
		 @author		Kevin Lucich

		 @param		params		{Object|string}	The type of will be the value or List of params
		 @param		_subtype	{string}		A specified type (default: 'all') // it meas "all" of typeCheck
		 @param		_value		{string|Number}	The value to check

		 @return	{Boolean}	Return True if the value is valid
		 */
		'check': function( params, _value, _subtype ){

			var methods = {
				'check': {
					'init': function( params, _value, _subtype ){

						// Posso passare i parametri come oggetto o tre valori separati (type,value,subtype)
						if( (typeof params !== 'undefined') && (typeof params != 'object') ){
							params = {
								'type': params,
								'subtype': (typeof _subtype === 'undefined') ? 'all' : _subtype,
								'value': _value
							};
						}

						var paramsDefault = {
							'type': 'text',
							'subtype': 'all',
							'value': false,
							'rules': {
								'range': '',		// {'from': 0, 'to': 1},
								'of': '+',
								'replace': false
							}
						};

						return KUtils.extend( true, {}, paramsDefault, params );
					},

					'_do': function(params){

						var check_param_of_range = function(p,nameParam){
							if( !(/^([*]{1})$|^([0-9]+)$|^([0-9]+,[0-9]+)$/).test(p) ){
								console_action('PRM_IGN','$.check',nameParam);
								return false;
							}
							return true;
						};

						var _regex = check_patterns[ params.type ][ params.subtype ];
						var __OF_A__ = '+';
						var __OF_B__ = params.rules.of;

						if( params.rules.range != '' ){

							__OF_B__ = params.rules.range;

							if( params.subtype == 'float' ){	// Formato: 1,2;8,9	=> range
								if( /^[0-9]+,[0-9]+;[0-9]+,[0-9]+$/.test( params.rules.range ) ){
									var r_split = (params.rules.range).split(';');
									__OF_A__ = (check_param_of_range(r_split[0],'params.rules.range')) ? r_split[0] : '';
									__OF_B__ = (check_param_of_range(r_split[1],'params.rules.range')) ? r_split[1] : '+';
								}
							}else{
								// Formato: [num] => viene trasformato in 0,[num] così da diventare un range
								if( /^[0-9]+$/.test( __OF_B__ ) ){
									__OF_B__ = '0,'+ __OF_B__;
								}else{
									// Formato: 1,9	=> range
									__OF_B__ = (check_param_of_range( __OF_B__,'params.rules.range' )) ?  __OF_B__ : '+';
								}
							}
						}	// End PRR


						if( __OF_B__ != '+' && !check_param_of_range( __OF_B__, 'params.rules.of' ) ){
							__OF_B__ = '+';
						}

						if( (__OF_A__ != '+')&&(__OF_A__ != '*') )
							__OF_A__ = '{'+ __OF_A__ +'}';
						if( (__OF_B__ != '+')&&(__OF_B__ != '*') )
							__OF_B__ = '{'+ __OF_B__ +'}';

						_regex = _regex.replace(/__OF_A__/, __OF_A__ ).replace(/__OF_B__/, __OF_B__ );

						var regex = new RegExp( _regex );

						return regex.test( params.value );
					}
				}
			};

			params = (methods.check['init']).apply( undefined, arguments );
			return (methods.check['_do']).apply( undefined, [params] );
		},

		'stripslashes': function( str ){
			// +	original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// +	improved by: Ates Goral (http://magnetiq.com)
			// +	fixed by: Mick@el
			// +	improved by: marrtins
			// +	bugfixed by: Onno Marsman
			// +	improved by: rezna
			// +	input by: Rick Waldron
			// +	reimplemented by: Brett Zamir (http://brett-zamir.me)
			// +	input by: Brant Messenger (http://www.brantmessenger.com/)
			// +	bugfixed by: Brett Zamir (http://brett-zamir.me)
			// *		example 1: stripslashes('Kevin\'s code');
			// *		returns 1: "Kevin's code"
			// *		example 2: stripslashes('Kevin\\\'s code');
			// *		returns 2: "Kevin\'s code"
			return (str + '').replace(/\\(.?)/g, function (s, n1) {
				switch (n1) {
					case '\\':
						return '\\';
					case '0':
						return '\u0000';
					case '':
						return '';
					default:
						return n1;
				}
			});
		},

		/**
		 * Return length of Object
		 * @author 	Kevin Lucich <lucichkevin@gmail.com>
		 * @param	obj	{Object}	The Object to count
		 * @return	{int}	The lenght of Object
		 */
		'objSize': function( obj ){
			if( obj == null || (obj.constructor != Object && obj.constructor != Array) ){
				return 0;
			}
			return Object.keys(obj).length;
		},

		/**
		 * Return a copy of Object
		 * @author 	Kevin Lucich <lucichkevin@gmail.com>
		 * @param	obj	{Object}	The Object to count
		 * @return	{Object}	A copy of Object
		 */
		'objClone': function( obj ) {
			if( null == obj || obj.constructor != Object ){
				return obj;
			}
			var copy = obj.constructor();
			for( var attr in obj ){
				if( attr in obj ){
					copy[attr] = obj[attr];
				}
			}
			return copy;
		},

		'objJoin': function( obj, glue, separator ){

			obj = (typeof obj !== 'undefined') ? obj : {};
			glue = (typeof glue !== 'undefined') ? glue : '=';
			separator = (typeof separator !== 'undefined') ? separator : ',';

			var pieces = [];
			for( var i in obj ){
				if ( obj.hasOwnProperty( i ) ){
					pieces.push( i + glue + obj[i] );
				}
			}

			return pieces.join( separator );
		},

		'obj2Array': function( obj ){
			var array = [];
			for( var k in obj ){
				array.push( obj[k] );
			}
			return array;
		},

		'objKeys': function( obj ){

			var keys = [];

			if( (typeof obj === 'undefined') || (obj == null) ){
				return keys;
			}

			switch( obj.constructor ){
				case Object:
					//	If exists "Object.keys" (native method) use it, otherwise use case "Array" !
					if( typeof Object.keys !== 'undefined' ){
						return Object.keys(obj);
					}
				case Array:
					for( i in obj ){
						if( obj.hasOwnProperty(i) )
							keys.push(i);
					}
					return keys;
				default:
					return keys;
			}
		},

		'objFlip': function( obj ){
			var key=null, tmp = {};
			for( key in obj ){
				if ( obj.hasOwnProperty( key ) ){
					tmp[ obj[key] ] = key;
				}
			}
			return tmp;
		},

		'objIntersectKey': function(){
			var argv = [].slice.call(arguments);

			var result = argv[0];

			var len = argv.length;
			for( var i=1; i<len; i++ ){
				var array = argv[i];
				for( var key in result ){
					if( typeof array[key] === 'undefined' ){
						delete( result[key] );
					}
				}
			}

			return result;
		},

		'objKeyAllowed': function( obj, allowed ){
			obj = obj || {};
			allowed = allowed || [];
			return KUtils.objIntersectKey( obj, KUtils.objFlip(allowed) );
		},

		'trim': function( str ){
			if( str == null || typeof str === 'undefined' || str.constructor !== String ){
				return str;
			}
			if( typeof String.prototype.trim !== 'undefined' ){
				return str.trim();
			}
			if( typeof String.trim !== 'undefined' ){
				return String.trim(str);
			}
			return str.replace(/^\s+|\s+$/g,'');	//	Colpa di IE :'(
		},

		/**
		 Return boolean if the el is in array
		 @param	needle		{mixed}		The searched value.
		 @param	haystack	{array}		The array
		 @return	{Boolean}
		 */
		'inArray': function( needle, haystack ){

			if( typeof needle === 'undefined' || haystack.constructor !== Array ){
				return false;
			}

			var i = 0;
			var len = null;

			if( needle.constructor === Array ){
				len = needle.length;
				for( i=0; i<len; i++ ){
					if( !KUtils.inArray( needle[i], haystack ) ){
						return false;
					}
				}
				return true;
			}

			if( typeof [].indexOf !== 'undefined' ){
				return (haystack.indexOf(needle)!=-1);
			}else{
				len = haystack.length;
				for( i=0; i<len; i++ ){
					if( haystack[i] == needle ){
						return true;
					}
				}
				return false;
			}
		},

		/**
		 *	$.MD5( str );	 Return string cripted with MD5 method
		 *	A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
		 *	@author		Paul Johnston, Greg Holt
		 *	@updated	Kevin Lucich <lucichkevin@gmail.com>
		 *	@param		str	{String|Object}	The string (or object/array) to cript with MD5 method
		 *	@return	{string}	String cripted with MD5 method
		 */
		'MD5': function( str ){

			//	In this case "str" is an Object or Array
			if( (str != null) && (str.constructor == Array || str.constructor == Object) ){
				var __describe_object = function( obj, str ){
					if( !obj ){
						return str;
					}
					for( i in obj ){
						if( obj.hasOwnProperty(i) == false ){
							continue;
						}
						var md5 = (obj[i] != null) && ((obj[i]).constructor == Array || (obj[i]).constructor == Object) ? __describe_object(obj[i],str) : i +':'+ obj[i];
						str = KUtils.MD5( str +'_'+ md5 );
					}
					return str;
				};
				str = __describe_object(str,'');
			}

			// Convert a 32-bit number to a hex string with ls-byte first
			var hex_chr = "0123456789abcdef";
			function rhex(num){
				str = "";
				for(var j=0; j <= 3; j++)
					str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((num >> (j * 8)) & 0x0F);
				return str;
			}

			// Convert a string to a sequence of 16-word blocks, stored as an array. Append padding bits and the length, as described in the MD5 standard.
			function str2blks_MD5(str){
				var nblk = ((str.length + 8) >> 6) + 1;
				var blks = new Array(nblk * 16);
				for(i=0; i < nblk * 16; i++) blks[i] = 0;
				for(i=0; i < str.length; i++)
					blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
				blks[i >> 2] |= 0x80 << ((i % 4) * 8);
				blks[nblk * 16 - 2] = str.length * 8;
				return blks;
			}

			// Add integers, wrapping at 2^32. This uses 16-bit operations internally to work around bugs in some JS interpreters.
			function add(x, y){
				var lsw = (x & 0xFFFF) + (y & 0xFFFF);
				var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
				return (msw << 16) | (lsw & 0xFFFF);
			}

			// Bitwise rotate a 32-bit number to the left
			function rol(num, cnt){ return (num << cnt) | (num >>> (32 - cnt)); }
			// These functions implement the basic operation for each round of the algorithm.
			function cmn(q, a, b, x, s, t){ return add(rol(add(add(a, q), add(x, t)), s), b); }
			function ff(a, b, c, d, x, s, t){ return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
			function gg(a, b, c, d, x, s, t){ return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
			function hh(a, b, c, d, x, s, t){ return cmn(b ^ c ^ d, a, b, x, s, t); }
			function ii(a, b, c, d, x, s, t){ return cmn(c ^ (b | (~d)), a, b, x, s, t); }

			// Take a string and return the hex representation of its MD5.
			var x = str2blks_MD5(str);
			var a =	1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d =	271733878;
			var xlen = x.length;
			for(var i=0; i < xlen; i += 16){
				olda = a;
				oldb = b;
				oldc = c;
				oldd = d;

				a = ff(a, b, c, d, x[i], 7 , -680876936);
				d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
				c = ff(c, d, a, b, x[i+ 2], 17,	606105819);
				b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
				a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
				d = ff(d, a, b, c, x[i+ 5], 12,	1200080426);
				c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
				b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
				a = ff(a, b, c, d, x[i+ 8], 7 ,	1770035416);
				d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
				c = ff(c, d, a, b, x[i+10], 17, -42063);
				b = ff(b, c, d, a, x[i+11], 22, -1990404162);
				a = ff(a, b, c, d, x[i+12], 7 ,	1804603682);
				d = ff(d, a, b, c, x[i+13], 12, -40341101);
				c = ff(c, d, a, b, x[i+14], 17, -1502002290);
				b = ff(b, c, d, a, x[i+15], 22,	1236535329);

				a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
				d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
				c = gg(c, d, a, b, x[i+11], 14,	643717713);
				b = gg(b, c, d, a, x[i], 20, -373897302);
				a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
				d = gg(d, a, b, c, x[i+10], 9 ,	38016083);
				c = gg(c, d, a, b, x[i+15], 14, -660478335);
				b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
				a = gg(a, b, c, d, x[i+ 9], 5 ,	568446438);
				d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
				c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
				b = gg(b, c, d, a, x[i+ 8], 20,	1163531501);
				a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
				d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
				c = gg(c, d, a, b, x[i+ 7], 14,	1735328473);
				b = gg(b, c, d, a, x[i+12], 20, -1926607734);

				a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
				d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
				c = hh(c, d, a, b, x[i+11], 16,	1839030562);
				b = hh(b, c, d, a, x[i+14], 23, -35309556);
				a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
				d = hh(d, a, b, c, x[i+ 4], 11,	1272893353);
				c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
				b = hh(b, c, d, a, x[i+10], 23, -1094730640);
				a = hh(a, b, c, d, x[i+13], 4 ,	681279174);
				d = hh(d, a, b, c, x[i], 11, -358537222);
				c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
				b = hh(b, c, d, a, x[i+ 6], 23,	76029189);
				a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
				d = hh(d, a, b, c, x[i+12], 11, -421815835);
				c = hh(c, d, a, b, x[i+15], 16,	530742520);
				b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

				a = ii(a, b, c, d, x[i], 6 , -198630844);
				d = ii(d, a, b, c, x[i+ 7], 10,	1126891415);
				c = ii(c, d, a, b, x[i+14], 15, -1416354905);
				b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
				a = ii(a, b, c, d, x[i+12], 6 ,	1700485571);
				d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
				c = ii(c, d, a, b, x[i+10], 15, -1051523);
				b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
				a = ii(a, b, c, d, x[i+ 8], 6 ,	1873313359);
				d = ii(d, a, b, c, x[i+15], 10, -30611744);
				c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
				b = ii(b, c, d, a, x[i+13], 21,	1309151649);
				a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
				d = ii(d, a, b, c, x[i+11], 10, -1120210379);
				c = ii(c, d, a, b, x[i+ 2], 15,	718787259);
				b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

				a = add(a, olda);
				b = add(b, oldb);
				c = add(c, oldc);
				d = add(d, oldd);
			}

			return (rhex(a) + rhex(b) + rhex(c) + rhex(d));
		},

		/**
		 .hash( str );	 Return hash of string

		 @version	1.0
		 @author		Kevin Lucich

		 @param		{string}	str		The string to conver in hash

		 @return	{Number}	The hash
		 */
		'hash': function( str ){

			if( !str || str.constructor != String ){
				return 0;
			}

			var hash = 0, i, c,
					len = str.length;
			if( len == 0 ){
				return hash;
			}
			for( i=0; i < len; i++ ){
				c = str.charCodeAt(i);
				hash = ((hash<<5)-hash)+c;
				hash = hash & hash; // Convert to 32bit integer
			}

			return hash;
		},

		/**
		 * Return if a variable is empty (null, 0, empty string, false)
		 * @version	1.0
		 * @param		variable	{mixed}		The variable to check
		 * @return	{Boolean}
		 */
		'empty': function( variable ){

			if( variable == null ){
				return true;
			}

			switch( variable.constructor ){
				case Number:
					return (isNaN(variable)) || (variable === 0);
				case String:
					return (variable.length === 0 || variable==='0');
				case Array:
				case Object:
					return (KUtils.objSize(variable) === 0);
				case Boolean:
					return (variable === false);
				default:
					return false;
			}
		},

		/**
		 * .rgbToHex()
		 * @version	1.0
		 * @author		Kevin Lucich
		 *
		 * @desc
		 * 	$.rgbToHex( r, g, b );
		 * 	Converter a RGB color to HEX
		 * 	
		 * @param	{string}	r	Code for red color
		 * @param	{string}	g	Code for green color
		 * @param	{string}	b	Code for blue color
		 * @return	{string}	HEX color	(es. #00FF00 )
		 */
		'rgbToHex': function( r, g, b ){
			var componentToHex = function (c){
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			};
			return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
		},

		/**
		 * .hexToRgb()
		 * @version	1.1
		 * @author		Kevin Lucich
		 *
		 * @desc
		 * 	$.hexToRgb( hex [, return_string] );
		 * 	Converter a HEX color to RBG
		 *
		 * @param		{string}			hex				The color in hex code
		 * @param		{(Boolean|null)}	return_string	False will return an obj {r,g,b}, if true return a string
		 * @return	{object|string} if return_string param is True: return "r,g,b", otherwise an object
		 */
		'hexToRgb': function( hex, return_string ){

			if( typeof hex === 'undefined' ){
				hex = '#000000';
			}
			if( typeof return_string === 'undefined' ){
				return_string = false;
			}

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

			var rgb = result ? {
				'r': parseInt(result[1], 16),
				'g': parseInt(result[2], 16),
				'b': parseInt(result[3], 16)
			} : null;

			if( return_string ){
				return rgb.r +','+ rgb.g +','+ rgb.b;
			}

			return rgb;
		},

		/**
		 * .extend()
		 * @version	1.0
		 * @author		jQuery Foundation
		 */
		'extend': (typeof jQuery !== 'undefined' && jQuery.extend) || function(){

			var isPlainObject = function( obj ){
				// Not plain objects:
				// - Any object or value whose internal [[Class]] property is not "[object Object]"
				// - DOM nodes
				// - window
				if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
					return false;
				}

				if ( obj.constructor && !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
					return false;
				}

				// If the function hasn't returned already, we're confident that
				// |obj| is a plain object, created by {} or constructed with new Object
				return true;
			};

			var options, name, src, copy, copyIsArray, clone,
					target = arguments[0] || {},
					i = 1,
					length = arguments.length,
					deep = false;

			// Handle a deep copy situation
			if ( typeof target === "boolean" ) {
				deep = target;

				// Skip the boolean and the target
				target = arguments[ i ] || {};
				i++;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
				target = {};
			}

			// Extend jQuery itself if only one argument is passed
			if ( i === length ) {
				target = this;
				i--;
			}

			for ( ; i < length; i++ ) {
				// Only deal with non-null/undefined values
				if ( (options = arguments[ i ]) != null ) {
					// Extend the base object
					for ( name in options ) {
						src = target[ name ];
						copy = options[ name ];

						// Prevent never-ending loop
						if ( target === copy ) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
							if( copyIsArray ){
								copyIsArray = false;
								clone = src && Array.isArray(src) ? src : [];
							}else{
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[ name ] = KUtils.extend( deep, clone, copy );

							// Don't bring in undefined values
						} else if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		},

		/**
		 * .range()
		 * @param	start	{mixed}
		 * @param	end		{mixed}
		 * @param	step	{number}
		 * @return array
		 */
		'range': function( start, end, step ){
			var range = [];
			var typeofStart = typeof start;
			var typeofEnd = typeof end;
			if (step === 0) {
				throw new TypeError("Step cannot be zero.");
			}
			if (typeofStart == "undefined" || typeofEnd == "undefined") {
				throw new TypeError("Must pass start and end arguments.");
			} else if (typeofStart != typeofEnd) {
				throw new TypeError("Start and end arguments must be of same type.");
			}
			typeof step == "undefined" && (step = 1);
			if (end < start) {
				step = -step;
			}
			if (typeofStart == "number") {
				while (step > 0 ? end >= start : end <= start) {
					range.push(start);
					start += step;
				}
			}else if (typeofStart == "string") {
				if (start.length != 1 || end.length != 1) {
					throw new TypeError("Only strings with one character are supported.");
				}
				start = start.charCodeAt(0);
				end = end.charCodeAt(0);
				while (step > 0 ? end >= start : end <= start) {
					range.push(String.fromCharCode(start));
					start += step;
				}
			}else{
				throw new TypeError("Only string and number types are supported");
			}
			return range;
		},

		/**
		 var test_fns = {
		'ucFirst1': function(){
			var string = 'aaaaaaaaaaa';
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		'ucFirst2': function(){
			var string = 'aaaaaaaaaaa';
			return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
		},
		'LOL': function(){
			var string = 'aaaaaaaaaaa';
			return string;
		},
	};

		 console.dir( KUtils.benchmark( test_fns) );
		 */
		'benchmark': function( millisecond, howmany, fns ){

			//	function( )	=> error
			if( (typeof millisecond === 'undefined') ){
				console.error('Error: missing fns param');
				return;
			}
			//	function( fns )
			if( millisecond.constructor == Object ){
				fns = millisecond;
				millisecond = 1000; //  one second
				howmany = 1;
			}
			//	function( millisecond, fns )
			if( howmany.constructor == Object ){
				fns = howmany;
				howmany = 1;
			}

			var results = {
				'fns': {},
				'statistics': {
					'faster': {
						'fn': null,
						'loop': Infinity
					},
					'slower': {
						'fn': null,
						'loop': -Infinity
					}
				}
			};

			for( fn_name in fns ){

				var fn = fns[ fn_name ];
				var array_loops = [];

				for(var i=0; i<howmany; i++ ){
					var second = (new Date().getTime()) + millisecond;
					var current_loop = 0;

					while( (new Date().getTime()) < second ){
						current_loop++;
						fn();
					}
					array_loops.push( current_loop );
				}

				//  Average
				number_of_execution = (function(array){
					var avg = 0;
					for( a in array ){
						avg += array[a];
					}
					return (avg/(array.length));
				})(array_loops);

				if( results.statistics.faster.fn == null || results.statistics.faster.number_of_execution < number_of_execution ){
					results.statistics.faster = {
						'fn': fn_name,
						'number_of_execution': number_of_execution
					};
				}
				if( results.statistics.slower.fn == null || results.statistics.slower.number_of_execution > number_of_execution ){
					results.statistics.slower = {
						'fn': fn_name,
						'number_of_execution': number_of_execution
					};
				}

				results['fns'][ fn_name ] = number_of_execution;
			}

			var tmp = (results.statistics.faster.number_of_execution / results.statistics.slower.number_of_execution);
			results.statistics.result = 'The function '+ results.statistics.faster.fn +' is faster than '+ results.statistics.slower.fn +' of '+ ((tmp*100)-100).toFixed(2) +'% ('+ tmp.toFixed(2) +' times)';

			return results;
		},

		'ucFirst': function( string ){
			return (!string) ? "" : string[0].toUpperCase() + string.slice(1);
		},

		'dotdotdot': function( string, how_many_words ){

			if( typeof string === 'undefined' ){
				return '';
			}
			if( typeof how_many_words === 'undefined' ){
				how_many_words = pieces.length/2;
			}

			var pieces = string.split(' ');

			return (pieces.slice(0, how_many_words ).join(' ')) +'...';
		},

		'consoleCheck': function(){

			if( typeof window.console !== 'undefined' ){
				return true;
			}

			var c = {};

			var fns = [
				'log','debug','info','warn','exception','assert','dir','dirxml','trace','group','groupEnd',
				'groupCollapsed','profile','profileEnd','count','clear','time','timeEnd','timeStamp','table','error'
			];
			for( f in fns ){
				c[ fns[f] ] = function(){};
			}
			window.console = c;
		},

		'stack': function( show_anonymous ){
			show_anonymous = (typeof show_anonymous !== 'undefined') ? show_anonymous : false;
			var stack = [];
			var _caller = arguments.callee.caller;
			while( _caller != null ){
				var fn_name = /function ([^(]*)/.exec( _caller+"" );
				fn_name = (fn_name != null && typeof fn_name[1] !== 'undefined') ? fn_name[1] : fn_name;
				if( show_anonymous && fn_name == '' )
					fn_name = 'anonymous';
				if( fn_name != '' )
					stack.push( fn_name );
				_caller = _caller.caller;
			}
			stack.reverse();

			if( stack.length ){
				return stack.join('() -> ') +'()';
			}

			return null;
		},

		'arrayDiff': function( a, b ){

			var tmp=[], diff=[], i= 0, len=0;

			len = a.length;
			for( i=0; i<len; i++ ){
				tmp[a[i]] = true;
			}

			len = b.length;
			for( i=0; i<len; i++ ){
				if( tmp[b[i]] ){
					delete tmp[b[i]];
				}else{
					tmp[b[i]] = true;
				}
			}

			for( var k in tmp ){
				diff.push(k);
			}

			return diff;
		},

		'str_replace': function( string, search, to_replace ){
			var len = search.length,
					i=0;

			if( (search.constructor === Array) && (to_replace.constructor === Array) ){
				for(i=0; i<len; i++ ){
					string = string.replace( search[i], to_replace[i] );
				}
			}else if( search.constructor === Array ){
				for(i=0; i<len; i++ ){
					string = string.replace( search[i], to_replace );
				}
			}else{
				string = string.replace( search, to_replace );
			}

			return string;
		}

	};

////////////////////
	var PrototypeDateUtils = {

		'format': function( format ){

			if( typeof format === 'undefined' ){
				format = 'Y-m-d';
			}

			var date = this;
			var formated = '';

			var length = format.length;
			for(var i=0; i<length; i++ ){
				switch( format[i] ){

					case '\\':
						i++;	//	Jump the next char! :)
						break;
////////////////			Days

					//	Day of the month without leading zeros
					case 'j':
						formated += getDate();
						break;

					//	Day of the month, 2 digits with leading zeros
					case 'd':
						var day = parseInt( date.getDate() );
						formated += ((day < 10) ? '0'+day : day);
						break;

//				case 'D':
//					formated += '';
//					break;

					//	 ISO-8601 numeric representation of the day of the week = 1 (for Monday) through 7 (for Sunday)
					case 'N':
						formated += date.getDay();
						break;


////////////////			Months

					//	Numeric representation of a month, without leading zeros
					case 'n':
						formated += parseInt( date.getMonth() )+1;
						break;

					//	Numeric representation of a month, with leading zeros
					case 'm':
						var month = parseInt( date.getMonth() )+1;
						formated += ((month < 10) ? '0'+month : month);
						break;

					//	Number of days in the given month
					case 't':
						var num_days = {
							'1': 31,
							'2': 28,
							'3': 31,
							'4': 30,
							'5': 31,
							'6': 30,
							'7': 31,
							'8': 31,
							'9': 30,
							'10': 31,
							'11': 30,
							'12': 31
						};
						var month = parseInt( date.getMonth() )+1;
						formated += num_days[ month ];
						break;


////////////////			Years

					case 'Y':
						formated += date.getFullYear();
						break;

					case 'y':
						var year = ''+ ((new Date()).getFullYear());
						var y_length = year.length;
						formated += year.substring( y_length-2, y_length);
						break;


////////////////			Time

					//	12-hour format of an hour without leading zeros 	1 through 12
					case 'g':
						var hours = date.getHours();
						formated += (hours>12) ? hours-12 : hours;
						break;

					//	24-hour format of an hour without leading zeros 	0 through 23
					case 'G':
						formated += date.getHours();
						break;

					//	12-hour format of an hour with leading zeros 	01 through 12
					case 'h':
						var hours = date.getHours();
						hours = (hours>12) ? (hours-12) : hours;
						formated += ((hours < 10) ? '0'+hours : hours);
						break;

					//	24-hour format of an hour with leading zeros 	00 through 23
					case 'H':
						var hours = date.getHours();
						formated += ((hours < 10) ? '0'+hours : hours);
						break;

					//	Minutes with leading zeros 	00 to 59
					case 'i':
						var minutes = date.getMinutes();
						formated += ((minutes < 10) ? '0'+minutes : minutes);
						break;

					//	Seconds, with leading zeros 	00 through 59
					case 's':
						var seconds = date.getSeconds();
						formated += ((seconds < 10) ? '0'+seconds : seconds);
						break;

					case 'c':
						var cents = parseInt(date.getMilliseconds()/10);
						formated += ((cents < 10) ? '0'+cents : cents);
						break;

					case 'u':
						var milli = date.getMilliseconds();
						formated += ((milli < 10) ? '0'+milli : milli);
						break;
////////////////			Another char

					default:
						formated += format[i];
						break;
				}
			}

			return formated;
		},

		'getMillisecondsByIdentifier': function( identifier ){

			switch( identifier ){

				case 'd':
					return 86400000;
					break;

				case 'm':	//	Month (30 days)
					return 2592000000;
					break;

				case 'y':	//	Year
					return 31536000000;
					break;

				case 'h':	//	Hour
					return 3600000;
					break;

				case 'i':	//	Minutes
					return 60000;
					break;

				case 's':	//	Seconds
					return 1000;
					break;

				case 'w':	//	Week
					return 604800000;
					break;

////////////////		Another char

				default:
					console.warn('Identifier "'+ identifier +'" undefined! :( ');
					return 0;
					break;
			}
		},

		'getDateAfterModify': function( operator, modifier ){

			var self = this;
			var milliseconds = 0;
			var modifiers = modifier.split(' ');

			for( m in modifiers ){
				var mod = modifiers[m];

				//	pieces[1] => number of
				//	pieces[2] => identifier
				var pieces = mod.match(/(\d+)([a-zA-Z])/);		//	mod.match(/([+-])(\d+)([a-zA-Z])/);		//	'1d'	'2w'
				var number = pieces[1];
				var identifier = pieces[2];

				milliseconds += PrototypeDateUtils.getMillisecondsByIdentifier(identifier) * number;
			}

			//	Operator determ if i add or sub the value :)
			var new_date = self.getTime() + (milliseconds*operator);
			return (new Date(new_date));
		},

		'add': function( modifier ){
			return (PrototypeDateUtils.getDateAfterModify).apply(this, [1, modifier] );
		},

		'sub': function( modifier ){
			return (PrototypeDateUtils.getDateAfterModify).apply(this, [-1, modifier] );
		}

	};

	Date.prototype.format = PrototypeDateUtils.format;
	Date.prototype.getFormat = function(){
		console_action('DEPRECATED','Date.prototype.getFormat');
		return (Date.prototype.format).apply( this, arguments );
	};
	Date.prototype.add = PrototypeDateUtils.add;
	Date.prototype.sub = PrototypeDateUtils.sub;

	Object.keys = Object.keys || function( obj ){
				var keys = [];
				for( k in obj ){
					if( obj.hasOwnProperty(k) ){
						keys.push( k );
					}
				}
				return keys;
			};

	var console_action = function( type, nameFunction, nameParam ){

		if( typeof console === 'undefined' || typeof console.info === 'undefined' || typeof console.warn === 'undefined' ){
			return;
		}

		var infos = {},
				text = '';

		switch(type){
///////////////////////////////////////////////////////////////
			//	Param Ignored
			case 'PRM_IGN':
				infos['state'] = 'Ignored';
				infos['why'] = 'Invalid value';
				infos['description'] = [
					"Will be use the default value"
				];
				break;
///////////////////////////////////////////////////////////////
			//	Param Ignored
			case 'IDENT_NOT_DEF':
				infos['state'] = 'Ignored';
				infos['why'] = 'Invalid value';
				infos['description'] = [
					"Identifier undefined :( "
				];
				break;
			//	Deprecated
			case 'DEPRECATED':
				infos['state'] = 'Deprecated Function';
				infos['why'] = '';
				infos['description'] = [
					"This function is deprected, it will be removed in the future. View the documention for more info."
				];
				break;
///////////////////////////////////////////////////////////////
		}	// End switch

		text = [
			"Function: "+ nameFunction,
			( (typeof nameParam !== 'undefined') ? "Param: "+ nameParam : null ),
			"State: "+ infos['state'],
			"Why: "+ infos['why'],
			(infos['description']).join("\n\t"),
			"Stack:\t"+ KUtils.stack(),
			"\n"
		].filter(function(el){
			//	Filter the null value
			if( typeof el !== 'undefined' && !KUtils.empty(el) ){
				return el;
			}
		}).join("\n\t");	// Join :)

		switch( type ){
			case 'PRM_IGN':
			case 'IDENT_NOT_DEF':
				console.warn( 'KUtils - WARNING'+ text );
				break;
		}	// End switch

	};


	///////////////
	// Check if exist another functions
	if( typeof jQuery !== 'undefined' ){
		KUtils.version({'jQuery': jQuery.fn.jquery });
		if( typeof jQuery.ui !== 'undefined' ){
			KUtils.version({'jQuery.ui': jQuery.ui.version });
		}
	}
	/////////////////

	//	Assign KUtils to window object for global visibility
	window.KUtils = KUtils;

})( window );


/**
 *	jquery.sake
 *
 *	@version:	5.1.0
 *	@updated:	2018-04-05
 *	@author:	Kevin Lucich
 */
;(function(window,$){

	var $document = $(document);

	var global_sake = {
		'version': '5.0.0',
		'url_source': 'http://sake.lucichkevin.it/',
		'url_plugin': 'http://sake.lucichkevin.it/'
	};

	KUtils.version( {'sake':global_sake.version} );

	/**
	 *	$( __ELEMENT__ ).scrollTo( [params] ); or $( __ELEMENT__ ).scrollTo( [speed] [, easing] );
	 *	Performs scrolling the page using the parameters passed (or the default)
	 *
	 *	@version	2.2
	 *	@author	Kevin Lucich
	 *
	 *	@param	{int|String}	params.speed	The time of animation
	 *	@param	{string}		params.easing	The easing of animation, you can choose from all easing plugin "http://gsgd.co.uk/sandbox/jquery/easing/"
	 *	@param	{Boolean}		params.scrollx	If TRUE performed a X scroll
	 *	@param	{string}		easing			The type of easing of animation
	 */
	$.fn.scrollTo = function( params, easing ){

		// Posso passare i parametri come oggetto o due valori separati  (speed,easing)
		if( (typeof params !== 'undefined') && (typeof params != 'object') ){
			params = {
				'speed': params,	// params is a NUMBER and equal a speed value
				'easing': (typeof easing === 'undefined') ? $.fn.scrollTo.prototype.defaults.easing : easing
			};
		}
		params = KUtils.extend( true, {}, $.fn.scrollTo.prototype.defaults, params);
		if( (params.offset).constructor != Object ){
			var off = params.offset;
			params.offset = {'x':off,'y':off};
		}

		var xpos = 0,
			ypos = 0,
			$document = $(document);

		switch( this.selector ){
			case 'top':
				// xpos and ypos = 0
				if( params.scrollx ){
					xpos = $document.width();
				}
				break;
			case 'bottom':
				if( params.scrollx ){
					xpos = $document.width();
				}
				ypos = $document.height();
				break;
			case 'left':
				// xpos = 0;
				ypos = $document.scrollTop();
				break;
			case 'rigth':
				xpos = $document.width();
				ypos = $document.scrollTop();
				break;
			default:
				var $el = this;
				if( !$el.length ){
					console_action.apply( this, ['PRM_IGN','$().scrollTo'] );
					return this;
				}
				if( params.scrollx )
					xpos = $el.offset().left;
				ypos = $el.offset().top;
				break;
		}

		xpos += params.offset.x;
		ypos += params.offset.y;

		// EEGG
		if( params.speed>100000 ){
			console.info('A very very long time... in the meantime, look at the boobies that are passing! :D');
		}

		$('html, body').animate({
			scrollTop: ypos+'px',
			scrollLeft: xpos+'px'
		}, params.speed, params.easing);
	};
	$.fn.scrollTo.prototype.defaults = {
		'speed': 500,
		'easing': 'linear',
		'scrollx': false,
		'offset': {'x':0,'y':0}
	};

	/**
	 * $( __ELEMENT__ ).validate( [params] );
	 *
	 *	@version 3.4
	 *	@author Kevin Lucich
	 *
	 *	@params {Object} params List of params
	 *	@params {Boolean} params.showTooltip Discriminate if a Tooltip with error will be show (default: True)
	 *	@params {Boolean} params.showRules If set print in console a list of rules for validation (default: True)
	 *	@return {Boolean} Return TRUE if the data are valid
	 *
	 * -------
	 *
	 * v3.4: Add support to "data-other_element" attribute
	 */
	$.fn.validate = function( method, params ){

		if( $('#sake_style').length == 0 ){
			$('body').append('<style id="sake_style" type="text/css"> .invalid { background-color: #fdd; border-color: #f00; } </style>');
		}

		var methodsValidate = {
			'counterElements': 0,

			'__getIdElement': function( $el ){
				if( typeof $el.attr('data-idsake_validate') !== 'undefined' ){
					return $el.attr('data-idsake_validate');
				}

				var id_sake = $el.attr('id');
				id_sake = (typeof id_sake === 'undefined' || id_sake == '') ? 'sake_'+ (++methodsValidate.counterElements) : id_sake;
				$el.attr('data-idsake_validate', id_sake );
				return id_sake;
			},

			'__getValidationRules': function( $el ){
				var datasets = $el.data();
				var rules = {};
				for( var key in datasets ){
					var v = datasets[key];
					// Questa chiave è un'array :)
					if( key == 'notacceptedvalues' ){
						v = eval(v);
					}
					rules[ key ] = v;
				}
				return rules;
			},

			'init': function(params){
				var $el = this;

				params = KUtils.extend( true, {}, $.fn.validate.prototype.defaults, params );

				//	Se non esiste l'elemento contenitore da validare, termino la funzione
				if( !$el.length ){
					return false;
				}

				return params;
			},

			'_do': function( params ){
				var $containerToValidate = this;
				$containerToValidate.find('.invalid').removeClass('invalid');

				var getDictionaryText = function( key ){
					var dictionary = $.fn.validate.prototype.dictionary[ $.fn.validate.prototype.language ];
					if( typeof dictionary[key] === 'undefined' ){
						return '';
					}
					return dictionary[ key ];
				};

				// Controllo la lunghezza del valore nel campo
				var testLength = function( $el ){

					var _min = $el.attr('min');
					var _max = $el.attr('max');
					if( typeof _min === 'undefined' ){
						_min = getDataAttributeValue($el,'min');
					}
					if( typeof _max === 'undefined' ){
						_max = getDataAttributeValue($el,'max');
					}

					//	Backward compatibility
					var data_length_value = getDataAttributeValue($el,'length');
					if( (_min == null) && (_max == null) && (data_length_value != null) ){
						if( data_length_value.indexOf(',') > -1 ){
							var minMax = data_length_value.split(',');
							_min = minMax[0];
							_max = minMax[1];
						}else{
							_min = minMax;
							_max = null;
						}
					}

					//	There aren't value range to check
					if( (_min == null) && (_max == null) ){
						return '';
					}

					var value_input = $el.val(),
						result = '';

					switch( getInputType($el) ){

						case 'text':
							if( _min==0 ){ _min=1; }
							if( (_min != null) && (_max != null) && ( (value_input.length<_min) || (value_input.length>_max) )){
								result = getDictionaryText('MINMAXCHARS').replace('__MIN__',_min).replace('__MAX__',_max);
							}else if( (_min != null) && (value_input.length<_min) ){
								result = getDictionaryText('MINCHARS').replace('__MIN__',_min);
							}
							break;

						case 'number':
							if( (_min != null) && (_max != null) && ( (parseFloat(value_input)<parseFloat(_min)) ||  (parseFloat(value_input)>parseFloat(_max)) )){
								result = getDictionaryText('MINMAXNUM').replace('__MIN__',_min).replace('__MAX__',_max);
							}else if( (_min != null) && (parseFloat(value_input)<parseFloat(_min)) ){
								result = getDictionaryText('MINNUM').replace('__MIN__',_min);
							}
							break;
					}

					return result;
				};
				var testCF = function(cf){
					var i, s, set1, set2, setpari, setdisp;

					cf = cf.toUpperCase();
					if( cf.length != 16 )
						return getDictionaryText('CFFIELD2');
					if( /^([0-9a-z]+)$/.test(cf) )
						return getDictionaryText('CFFIELD3');

					set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
					set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
					setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
					setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
					s = 0;
					for( i = 1; i <= 13; i += 2 ){
						s += setpari.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
					}
					for( i = 0; i <= 14; i += 2 ){
						s += setdisp.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
					}
					if( s%26 != cf.charCodeAt(15)-'A'.charCodeAt(0) ){
						return getDictionaryText('CFFIELD1');
					}
					return false;
				};
				var testPIVA = function(pi){
					if( !KUtils.check({'type':'text','subtype':'piva','value': pi}) ){
						return getDictionaryText('PIVAFIELD');
					}
					var i=0, s=0;
					for( i = 0; i <= 9; i += 2 ){
						s += pi.charCodeAt(i) - '0'.charCodeAt(0);
					}
					for( i = 1; i <= 9; i += 2 ){
						c = 2*( pi.charCodeAt(i) - '0'.charCodeAt(0) );
						if( c > 9 )  c = c - 9;
						s += c;
					}
					if( ( 10 - s%10 )%10 != pi.charCodeAt(10) - '0'.charCodeAt(0) ){
						return getDictionaryText('PIVAFIELD');
					}

					return '';
				};

				var hasValidValue = function( $el ){
					var idChild = $el.attr('id');
					var _value = ($el.is('[type="radio"]')) ? $el.find(':checked').val() : $el.val();

					if( typeof idChild === 'undefined' ){
						idChild = methodsValidate.__getIdElement($el);
						$el.attr('id',idChild);
					}

					var child_rules = methodsValidate.__getValidationRules( $el );
					var not_accepted = child_rules['notacceptedvalues'] || child_rules['not_accepted_values'];
					return (typeof not_accepted !== 'undefined') ? (not_accepted.indexOf(_value) == -1) : true;
				};

				var isCompulsory = function( $el ){
					var attr = (getDataAttributeValue($el,'compulsory') || getDataAttributeValue($el,'cmp'));
					return ( (typeof attr !== 'undefined') && (attr != null) && ((''+attr).toLowerCase() != 'false') );
				};

				/**
				 * Return the value of "data-<attribute_name>", otherwise return the <default_value>
				 * @param	$element		{jQuery}	The element from to read the attribute value
				 * @param	attribute_name	{string}	The attribute to read
				 * @param	default_value	{null|*}	The value to return if the value of "data-<attribute_name>" is undefined (if not set its value is NULL)
				 * @return	{*}
				 */
				var getDataAttributeValue = function( $element, attribute_name,  default_value ){
					if( typeof default_value === 'undefined' ){
						default_value = null;
					}
					try{
						var data_attribute_value = $element.data(attribute_name);
						return (typeof data_attribute_value !== 'undefined') ? data_attribute_value : default_value;
					}catch( error ){
						console_action('GENERIC_ERROR', '.validate()', undefined, 'I encountered an error while retrieving the rules of the element :( '+ "\n"+ error);
					}
				};

				var hideTT = function( $el ){
					$el.attr('data-original-title','').data('bs.tooltip', false);
				};
				var showTT = function( $el, errorText ){

					if( params.showTooltip == false ){
						return;
					}

					$el.attr('title', errorText ).tooltip({
						'title': function(){
							return $(this).attr('title');
						}
					});
				};

				var getInputType = function( $el ){

					var input_type = getDataAttributeValue($el,'type');
					if( input_type != null ){
						return input_type;
					}

					input_type = $el.attr('type');
					if( (typeof input_type !== 'undefined') ){
						//	Check if there in type attribute: <input type="number|email|...">
						switch( input_type ){
							case 'email':
							case 'number':
							case 'date':
								return $el.attr('type');
						}
					}

					return 'text';
				};

				/**
				 * Return a jQuery element to select other element(s) of the $field.
				 * An other element is the field (or fields) that is/are invalid when $field is invalid
				 * @param	$field	{jQuery}
				 * @return	jQuery
				 */
				var __getOtherElementsByField = function( $field ){

					var $other_element = $();
					var other_element = $field.data('other_element');

					switch( other_element ){
						case 'prev':
							$other_element = $field.prev();
							break;
						case 'next':
							$other_element = $field.next();
							break;
						default:
							$other_element = $(other_element);
							break;
					}

					return $other_element;
				};
				/**
				 * Add the class "invalid", that highlight invalid field
				 * @param	$field	{jQuery}	The invalid field to highlight
				 */
				var setInvalidField = function( $field ){
					$field.add(__getOtherElementsByField($field)).addClass('invalid');
				};
				/**
				 * Remove the class "invalid", that highlight invalid field
				 * @param	$field	{jQuery}	The invalid field to restore
				 */
				var removeInvalidField = function( $field ){
					$field.add(__getOtherElementsByField($field)).removeClass('invalid');
				};

				var ok = true;

				var $elements_to_validate = $containerToValidate.find('input[type="text"],input[type="search"],input[type="file"],input[type="hidden"],input[type="password"],input[type="number"],input[type="email"]');
				if( params.ignore_hidden_fields ){
					$elements_to_validate = $elements_to_validate.not(':hidden');
				}
				$elements_to_validate.each(function( i, el ){
					var $el = $(el);
					hideTT($el);

					var _value = $el.trim(),
						isCmp = isCompulsory($el),
						sake_error = '',
						res = false;

					if( isCmp == false ){
						return true;
					}else if( isCmp && _value == '' ){
						sake_error = getDictionaryText('EMPTYFIELD');
					}else{
						if( _value == '' ){
							return true;	// = continue;
						}

						// Se l'elemento non ha un valore valido (definito dall'utente)
						if( !hasValidValue($el) ){
							sake_error = getDictionaryText('VALUENOTACCEPTED');
						}

						var el_subtype = getDataAttributeValue( $el, 'subtype', 'all').toLowerCase();

						if( !sake_error ){

							switch( getInputType($el) ){

								case 'text':
								case 'search':
								case 'file':

									res = KUtils.check({
										'type': 'text',
										'subtype': el_subtype,
										'value': _value
									});
									if( !res ){
										// A seconda del subtype fornisco un errore più corretto
										switch( el_subtype ){
											case 'alphanumeric':
												sake_error = getDictionaryText('ONLYALPHANUMERIC');
												break;
										}
									}else{
										sake_error = testLength( $el );
									}

									break;
								// ///////////////////////////////////////////////////////////////////////////////////////////////////
								case 'number':
									res = KUtils.check({
										'type':'number',
										'subtype': getDataAttributeValue( $el, 'format', 'all'),
										'value': _value
									});
									if( !res ){
										sake_error = getDictionaryText('NUMBERFIELD');
									}else{
										sake_error = testLength( $el );
									}
									break;
								// ///////////////////////////////////////////////////////////////////////////////////////////////////
								case 'no_space':
									res = KUtils.check({
										'type':'text',
										'subtype': 'no_space',
										'value': _value
									});
									if( !res ){
										sake_error = getDictionaryText('NOSPACEFIELD');
									}
									break;
								// ///////////////////////////////////////////////////////////////////////////////////////////////////
								case 'date':
									res = KUtils.check({
										'type':'date',
										'subtype': getDataAttributeValue( $el, 'format', 'all'),
										'value': _value
									});
									if( !res ){
										sake_error = getDictionaryText('DATEFIELD');
									}
									
									if( (typeof $el.attr('data-from') === 'undefined') && (typeof $el.attr('data-to') === 'undefined') ){
										break;
									}

									var parts = null,
										date = null;

									if( (new RegExp("^(([0-9]{4})[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01]))$")).test(_value) ){
										//	'Y-m-d'
										parts = _value.split(_value.charAt(4));
										date = [parts[0],parts[1],parts[2]].join('-');
									}else if( (new RegExp("^((0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]([0-9]{4}))$")).test(_value) ){
										//	'd-m-Y'
										parts = _value.split(_value.charAt(2));
										date = [parts[2],parts[1],parts[0]].join('-');
									}else if( (new RegExp("^((0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]([0-9]{4}))$")).test(_value) ){
										//	'm-d-Y'
										parts = _value.split(_value.charAt(2));
										date = [parts[2],parts[0],parts[1]].join('-');
									}else if( (new RegExp("^(([0-9]{4})[- /.](0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012]))$")).test(_value) ){
										//	'Y-d-m'
										parts = _value.split(_value.charAt(4));
										date = [parts[0],parts[2],parts[1]].join('-');
									}else if( (new RegExp("^(([0-9]{4})[- /.](0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012]))$")).test(_value) ){
										//	'Y-d-m'
										parts = _value.split(_value.charAt(4));
										date = [parts[0],parts[2],parts[1]].join('-');
									}

									var ms = new Date(date).getTime();
									var from = (typeof $el.attr('data-from') !== 'undefined') ? new Date($el.attr('data-from')).getTime() : null;
									var to = (typeof $el.attr('data-to') !== 'undefined') ? new Date($el.attr('data-to')).getTime() : null;

									if( ((from != null) && (to != null)) && ((ms < from) || (ms > to)) ){
										sake_error = getDictionaryText('MIN_MAX_DATE').replace('__MIN__', (new Date(from)).getFormat('Y-m-d') ).replace('__MAX__', (new Date(to)).getFormat('Y-m-d') );
									}else if( (from != null) && (ms < from) ){
										sake_error = getDictionaryText('MIN_DATE').replace('__MIN__', (new Date(from)).getFormat('Y-m-d') );
									}else if( (to != null) && (ms > to) ){
										sake_error = getDictionaryText('MAX_DATE').replace('__MAX__', (new Date(to)).getFormat('Y-m-d') );
									}

									break;
								// ///////////////////////////////////////////////////////////////////////////////////////////////////
								case 'date_creditcard':
									res = KUtils.check({
										'type':'creditcard',
										'subtype':'expdate',
										'value': _value
									});

									if( !res ){
										sake_error = getDictionaryText('DATECREDITCARDFIELD');
									}else{
										var _exp = _value.split('/');
										var _mm = Number(_exp[0]);
										var _yy = Number('20'+_exp[1]);
										var _today = new Date();
										var _todayM = _today.getMonth() + 1;
										var _todayY = _today.getFullYear();
										if( (_todayY > _yy) || (_mm < _todayM && _yy >= _todayY) ){
											sake_error = getDictionaryText('DATECREDITCARDEXPIRED');
										}
									}
									break;
								// ///////////////////////////////////////////////////////////////////////////////////////////////////
								case 'email':
								case 'mail':
									res = KUtils.check({
										'type':'email',
										'value': _value
									});
									if( !res ){
										sake_error = getDictionaryText('EMAILFIELD');
									}
									break;
								// ///////////////////////////////////////////////////////////////////////////////////////////////////
								case 'phone':
									res = KUtils.check({
										'type':'phone',
										'value': _value
									});
									if( !res ){
										sake_error = getDictionaryText('PHONEFIELD');
									}
									break;
								// ///////////////////////////////////////////////////////////////////////////////////////////////////
								case 'codicefiscale':
									sake_error = testCF( _value );
									break;
								// ///////////////////////////////////////////////////////////////////////////////////////////////////
								case 'piva':
									sake_error = testPIVA( _value );
									break;
								// ///////////////////////////////////////////////////////////////////////////////////////////////////
							}
						}
					}

					if( sake_error ){
						setInvalidField($el);
						showTT( $el, sake_error );
						ok = false;
						$el.trigger('sake-validate-failure', {'element': $el, 'error': sake_error});
					}else{
						removeInvalidField($el);
					}

				}); // Fine each - input type text

				// ///////////////////////

				var radios_obj = {};

				$elements_to_validate = $containerToValidate.find('input[type=radio]');
				if( params.ignore_hidden_fields ){
					$elements_to_validate = $elements_to_validate.not(':hidden');
				}
				$elements_to_validate.each(function( i, el ){

					var $el = $(el);
					var nameRadio = $el.attr('name');

					if( typeof radios_obj[ nameRadio ] === 'undefined' ){

						var first = $containerToValidate.find('input[type="radio"][name="'+ nameRadio +'"]').first();

						radios_obj[ nameRadio ] = {
							'first': first,
							'last': $containerToValidate.find('input[type="radio"][name="'+ nameRadio +'"]').last(),
							'cmp': isCompulsory( first )
						};
					}

				});

				$.each( radios_obj, function( nameRadio, infos ){
					hideTT(infos.first);

					if( infos.cmp == false ) {
						return true;
					}

					var sakeerror = false;
					var id_box = 'radio_box_'+ nameRadio;
					var $radios = $containerToValidate.find('input[type="radio"][name='+ nameRadio +']');
					var radio_checked = $radios.is(':checked');

					var show_box = function(){
						var point_a = (infos.first).offset();
						var point_b = (infos.last).offset();
						var w = (point_b.left - point_a.left) + (infos.last).width();
						var h = (infos.first).height();
						$('body').append('<div id="'+ id_box +'"></div>');
						point_a['position'] = 'absolute';
						point_a['width'] = w;
						point_a['height'] = h;
						point_a['z-index'] = -1;
						setInvalidField($('#'+id_box).css(point_a));
					};

					var $box = $('#'+ id_box );
					if( $box.length ){
						$box.remove();
					}

					if( !radio_checked ){
						show_box();
						sakeerror = getDictionaryText('OPTIONREQUIRED');
					}
					if( radio_checked && !hasValidValue( $radios ) ){
						show_box();
						sakeerror = getDictionaryText('VALUENOTACCEPTED');
					}

					if( sakeerror ){
						ok = false;
						showTT( infos.first, sakeerror );
					}

				});

				// /////////////////////

				$elements_to_validate = $containerToValidate.find('select');
				if( params.ignore_hidden_fields ){
					$elements_to_validate = $elements_to_validate.not(':hidden');
				}
				$elements_to_validate.each(function( i, el ){
					var $el = $(el);
					hideTT($el);
					var compulsory = isCompulsory($el);

					if( compulsory && !hasValidValue($el) ){
						var sakeerror = getDictionaryText('OPTIONREQUIRED');
						setInvalidField($el);
						ok = false;
						showTT( $el, sakeerror );
						$el.trigger('sake-validate-failure', {'element': $el, 'error': sakeerror});
					}else{
						removeInvalidField($el);
					}

				}); //	Fine each - input type select

				return ok;
			},

			'options': function( rules ){
				var $el = this;
				var idFather = $el.parents('[data-idsake_validate]').attr('data-idsake_validate');
				var id_subject = $el.attr('id');

				if( typeof ValidateVars['rules'][ idFather ] === 'undefined' ){
					console.warn("I mustn't call the method \"options\" before initialization");
					return;
				}

				ValidateVars['rules'][ idFather ][ id_subject ] = KUtils.extend( ValidateVars['rules'][ idFather ][ id_subject ], rules );
				for( i in rules ){
					$el.attr('data-'+ i, rules[i] );
				}
			}

		};

		// //////////////////////////////////////////////////////////

		var $el = this;

		if(typeof method !== 'undefined'){
			if( (method.constructor === String) ){
				// Call the method passed
				return (methodsValidate[ method ]).apply( $el, [params] );
			}else{
				params = method;
				method = null;
			}
		}
		params = (methodsValidate['init']).apply( $el, [params] );
		return (methodsValidate['_do']).apply( $el, [params] );
	};
	$.fn.validate.prototype.defaults = {
		'showTooltip': true,
		'tooltipSide': 'right',
		'ignore_hidden_fields': false,
		'showRules': false,
		'debug': false,
		'cached': false,
		'rules': {}
	};
	$.fn.validate.prototype.language = 'it';
	$.fn.validate.prototype.dictionary = {
		'it': {
			// Generic
			'EMPTYFIELD': "Il campo non puo' essere vuoto",
			'VALUENOTACCEPTED': 'Valore inserito non valido',

			// Text
			'ONLYALPHANUMERIC': 'Sono ammessi solo caratteri alfanumerici',
			'MINCHARS': 'Il campo deve contenere almeno __MIN__ caratteri',
			'MINMAXCHARS': 'Il campo deve contenere da __MIN__ a __MAX__ caratteri',
			'NOSPACEFIELD': 'In questo campo non sono ammessi spazi',

			// Numeric
			'NUMBERFIELD': 'Sono ammessi solo numeri',
			'MINNUM': 'Il campo deve contenere un numerno maggiore o uguale a __MIN__ ',
			'MINMAXNUM': 'Il campo deve contenere un numero tra __MIN__ e __MAX__ ',

			// Date
			'DATEFIELD': 'Data non corretta',
			'MIN_DATE': 'Il campo deve contenere una data maggiore o uguale a __MIN__ ',
			'MAX_DATE': 'Il campo deve contenere una data minore o uguale a __MAX__ ',
			'MIN_MAX_DATE': 'Il campo deve contenere una data tra __MIN__ e __MAX__ ',

			// Credit card
			'DATECREDITCARDFIELD': 'Numero carta di credito non valida',
			'DATECREDITCARDEXPIRED': 'Carta di credo scaduta',

			// Email
			'EMAILFIELD': 'Email non valida',

			// Telephone
			'PHONEFIELD': 'Telefono non valido',

			// Codice fiscale
			'CFFIELD1': 'Codice fiscale non corretto',
			'CFFIELD2': 'La lunghezza del codice fiscale deve essere di 16 caratteri',
			'CFFIELD3': 'Il codice fiscale contiene un carattere non valido',

			// Partita IVA
			'PIVAFIELD': 'Partita IVA non valida',

			// SELECT e RADIO
			'OPTIONREQUIRED': "E' obbligatorio selezionare un'opzione"
		}
	};

	/* ================================================================== */

	/**
	 * $.check( params|typeCheck, value, [, subtype] ); $( __ELEMENT__ ).check(
	 * params|typeCheck, [, subtype] ); Check the value of __ELEMENT__ with the
	 * "typeCheck"
	 *
	 *	@version 1.2
	 *	@author Kevin Lucich
	 *
	 *	@params {String|Object} params The type of will be the value or list of
	 *         params
	 *	@params {string} subtype A specified type (default: 'all') // it meas "all"
	 *         of typeCheck
	 *	@params {Mixed} valueToCheck The value to check
	 *
	 *	@return {Boolean} Return True if the value is valid
	 */
	$.fn.check = function( params, _subtype ){
		return KUtils.check( params, $(this).val(), _subtype);
	};

	/* ================================================================== */

	/**
	 * .escape()
	 *
	 *	@version 1.2
	 *	@author Salvatore Caputi
	 *
	 *	@desc $.escape( string ); Escape dei caratteri speciali jQuery
	 *
	 *	@param {string}
	 *            str String to escape
	 *
	 *	@return {string} String passed escaped
	 */
	$.escape = function( str ){
		// !"#$%&'()*+,.\/:;<=>?@[\]^`{|}~
		return ((typeof str != 'string') ? str : str.replace(/([!"#$%&'()*+,.\/:;<=>?@[\]^`{|}~])/g, '\\$1'));
	};

	/**
	 *	$().escape()
	 *
	 *	@version 1.0
	 *	@author Kevin Lucich (thanks to Salvatore Caputi)
	 *
	 *	@desc $( __ELEM__ ).escape(); Return the value of element escaped
	 *
	 *	@return {string} Value of element escaped
	 */
	$.fn.escape = function(){
		return $.escape( $(this).val() );
	};

	/* ================================================================== */

	/**
	 *	$('#myelement').replace({ 'search': '{Regex}', 'replacement': '{string}' });
	 *
	 *	@version 1.0
	 *	@author Kevin Lucich
	 *
	 *	@desc Option Values Default Description
	 *
	 *	@param		{string}	search		The string or regular expression to search
	 *	@param		{string}	replacement The replacement string
	 *	@param		{string}	modifier	The regular expression modifier to use (default: 'g')
	 *
	 *	@return {Object} jQuery Object
	 */
	$.fn.replace = function( search, replacement, modifier ){

		if( typeof search == 'object' ){
			replacement = search.replacement;
			modifier = search.modifier;
			search = search.search;
		}

		if( typeof modifier === 'undefined' ){
			modifier = 'g';
		}

		var regex = new RegExp( search, modifier );
		this.text( KUtils.str_replace( this.text(), regex, replacement) );

		return this;
	};

	/* ================================================================== */

	/**
	 *	$( __ELEMENT__ ).lorem( params ); Write in ELEMENT a n paragraf of Lorem ipsum
	 *
	 *	@author Kevin Lucich
	 *	@version 1.2
	 *
	 *	@params {Object} params List of params
	 *
	 *	@params {Number} params.paragraphs Number of paragraphs to print
	 *	@params {Number} params.length Number of chars to print
	 *	@params {Boolean} params.random Discriminate if the paragraph to print is chosen randomly
	 *
	 *	@return {Object} jQuery Object
	 */
	$.fn.lorem = function( params, length, random ){

		if( typeof params == 'object' ){
			var paramsDefault = {
				'paragraphs': 1,
				'length': 0,
				'random': false
			};
			params = $.extend( true, {}, paramsDefault, params );
		}else{
			params = {
				'paragraphs': (typeof params !== 'undefined') ? params : 0,
				'length': (typeof length !== 'undefined') ? length : 0,
				'random': (typeof random !== 'undefined') ? random : false
			};
		}

		var lorem = [
			'Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
			'Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.',
			'Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
			'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.',
			'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
			'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
		];

		var text = '';

		var rand = 0;
		if( params.random ){
			paragraphs = 0;
			rand = Math.floor(Math.random() * lorem.length);
		}

		if( params.paragraphs > 0 ){
			for( var i=0; i<=(params.paragraphs-1); i++ ){
				var temp = lorem[(i%7)];
				if( params.length ){
					temp = temp.substring(0, params.length);
				}
				text += '<div>'+ temp +'</div>';
			}
		}else{
			text = lorem[ rand ];
			if( params.length ){
				text = text.substring(0, params.length);
			}
		}

		this.html(text);

		return this;
	};

	/* ================================================================== */

	/**
	 * $( __ELEMENT__ ).hash(); Return hash of element's value
	 *
	 *	@author Kevin Lucich
	 *	@use KUtils.hash()
	 *
	 *	@return {int}	The hash of the element's value
	 */
	$.fn.hash = function(){
		return KUtils.hash( $(this).val() );
	};

	/* ================================================================== */

	/**
	 *	$(el).trim(); Replace the value of element with the value "trimmed"
	 *
	 *	@author		Kevin Lucich
	 *	@version	1.0
	 *	@return		{string}	The value trimmed
	 */
	$.fn.trim = function(){
		var $el = this;
		if ($el.attr('type') === 'file') {
			return $el.val();
		}
		var value = $.trim($el.val());
		$el.val( value );
		return value;
	};

	/* ================================================================== */
	/**
	 *	$(el).realOuterWidth( [includeMargin] ) Return a width of an element hidden
	 *
	 *	@author		Kevin Lucich
	 *	@version	1.0
	 *	@return		{int}
	 */
	$.each( ['Width','Height'], function( i, attr ){

		$.fn['realOuter'+ attr] = function( includeMargin ){
			includeMargin = (typeof includeMargin !== 'undefined') ? includeMargin : false;
			var $clone = this
					.clone()
					.css({
						'display': 'block',
						'visibility': 'hidden'
					});
			$( this.parent() ).append($clone);
			var attr_value = $clone['outer'+ attr]( includeMargin );
			$clone.remove();
			return attr_value;
		};

	});

	/* ================================================================== */

	/**
	 *	$(container).getDataInfo( [options] )
	 *	Returns an object with field data inside the $container
	 *
	 *	@author		Kevin Lucich
	 *	@version	2.0
	 *	@return		Object
	 */
	$.fn.getDataInfo = function( options ){
		var $container = this;

		options = $.extend( true, {}, $.fn.getDataInfo.prototype.defaults, options );

		var __get = function( struct, keys, $el ){

			var key = keys.shift();

			if( keys.length ){
				if (typeof struct[key] === 'undefined') {
					struct[key] = {};
				}
				struct[key] = __get(struct[key], keys, $el);
				if (((struct[key]).constructor == Object) && !KUtils.objSize(struct[key])) {
					delete(struct[key]);
				}
				return struct;
			}

			if( $el.hasClass('ignore-value') || (!options.include_checkbox_false_value && ($el.is(':checkbox') && !$el.is(':checked')))){
				return struct;
			}

			var v = (typeof $el.attr('data-value') !== 'undefined') ? $el.attr('data-value') : $el.val();

			if( (typeof $el.attr('data-nullable') !== 'undefined') && (v == 'null') ){
				v = null;
			}

			if( !options.__validValue(v) ){
				return struct;
			}

			var type = $el.attr('data-type');
			if( typeof options.types[type] !== 'undefined' && (options.types[type]).constructor == Function ){
				v = (options.types[type])( $el, key, v );
			}

			var is_radio = $el.is(':radio');
			if( typeof struct[key] !== 'undefined' ){
				if( (struct[key]).constructor == Array ){
					(struct[key]).push(v);
				}else if( is_radio ){
					if( $el.is(':checked') ){
						struct[key] = v;
					}
				}else{
					struct[key] = [struct[key],v];
				}
			}else{
				if( typeof type !== 'undefined' && KUtils.inArray(type, ['array', 'list']) ){
					v = [v];
				}

				if(!is_radio || (is_radio && $el.is(':checked'))){
					struct[key] = v;
				}
			}

			return struct;
		};

		var struct = {};

		var $fieldsIntoSearch = $container.find('input, textarea, select');
		if( options.ignoreHidden ){
			$fieldsIntoSearch = $fieldsIntoSearch.filter(':visible');
		}

		$fieldsIntoSearch.each(function( i, field ){
			var $field = $(field);
			if( typeof $field.attr('data-info') === 'undefined' ){
				return;
			}
			var path_keys = $field.attr('data-info').split(options.delimiter);
			struct = __get( struct, path_keys, $field );
		});

		return struct;
	};
	$.fn.getDataInfo.prototype.defaults = {
		'delimiter': '/',
		'ignoreHidden': false,
		'include_checkbox_false_value': false,
		'types': {
			'trimmed': function( $field, key, value ){
				return $field.trim();
			},
			'boolean': function( $field, key, value ){
				if( $field.is(':checkbox') || $field.is(':radio') ){
					return $field.is(':checked');
				}
				return (eval(value)) ? true : false;
			},
			'number': function( $field, key, value ){
				return (KUtils.check('number',value)) ? eval(value) : value;
			}
		},
		'__validValue': function( value ){
			return value != '***';
		}
	};

	/* ================================================================== */

	/**
	 *	$(container).setDataInfo( data )
	 *	Set data info into the children of $container
	 *
	 *	@params		data	Object	The data to set
	 *	@params		options	Object	Options list
	 *
	 *	@author		Kevin Lucich
	 *	@version	1.0
	 *	@return		Object
	 */
	$.fn.setDataInfo = function( data, options ){
		var self = this;

		if( typeof options === 'undefined' ){
			options = {};
		}

		options = $.extend( true, {}, $.fn.setDataInfo.prototype.defaults, options );

		var assign = function( k, v, path ){
			if( typeof path === 'undefined' ){
				path = '';
			}

			if( (v != null) && (v.constructor == Object) ){
				for( var l in v ){
					if( v.hasOwnProperty(l) ){
						var next_path = (path=='') ? (k) : (path + options.delimiter + k);
						assign( l, v[l], next_path );
					}
				}
			}

			var full_path = k;
			if( path != '' ){
				full_path = path + options.delimiter + k;
			}
			var $el = self.find('[data-info="'+ full_path +'"]');

			if( $el.hasClass('ignore-value') || (options.ignore_null == true) ){
				return;
			}

			if( typeof $el.attr('data-value') !== 'undefined' ){
				$el.attr('data-value', v );
			}else if( $el.is('input') || $el.is('select') || $el.is('textarea') ){
				$el.val( v );
			}else{
				if( options.use_html ){
					$el.html( v );
				}else{
					$el.html( v );
				}
			}

		};

		for( var k in data ){
			if( data.hasOwnProperty(k) ){
				assign( k, data[k] );
			}
		}

		return self;
	};
	$.fn.setDataInfo.prototype.defaults = {
		'delimiter': '/',
		'ignore_null': false,
		'use_html': true
	};

	/* ================================================================== */

	/**
	 *	Return values of checkboxes or invert the selection
	 *	$(el).checkboxes( values|invert );
	 *
	 *	@author Kevin Lucich
	 *	@version 1.0
	 *	@return	jQuery
	 *
	 */
	$.fn.checkboxes = function( action ){

		if( typeof action === 'undefined' ){
			action = 'values';
		}

		switch( action ){

			case 'values':
				var values = {};
				this.each(function(i,c){
					var $c = $(c);

					var key = $c.attr('data-info');
					key = (typeof key !== 'undefined') ? key : $c.attr('id');
					key = (typeof key !== 'undefined') ? key : i;

					var type = $c.attr('data-type');
					type = (typeof type !== 'undefined') ? type : null;

					var v = $c.val();
					if( !$c.is(':checked') ){
						v = false;
					}else if( type == 'boolean' ){
						v = true;
					}
					values[ key ] = v;
				});
				return values;

			case 'invert':
				this.each(function(i,c){
					var $c = $(c);
					$c.prop('checked', !$c.is(':checked') );
				});
				break;

		}

		return this;
	};

	/* ================================================================== */
	/* ================================================================== */
	/* ================================================================== */
	/* ================================================================== */

//	For new method
//	$.xxx = function(){
//		var methods = { init: function( params ){ var paramsDefault = {}; params =
//		KUtils.extend( true, {}, paramsDefault, params ); } };
//
//		return (methods['init']).apply( this, [variable] );
//	};

	var console_action = function( type, nameFunction, nameParam, description ){

		// Elemento selezionato con jQuery
		var $el = null;
		if( this.jquery !== 'undefined' ){
			$el = this;
		}

		if( typeof console === 'undefined' || typeof console.info === 'undefined' || typeof console.warn === 'undefined' )
			return;

		var info = {};

		switch(type){
// /////////////////////////////////////////////////////////////
			// Param Ignored
			case 'PRM_IGN':
				info['state'] = 'Ignored';
				info['why'] = 'Invalid value';
				info['description'] = [
					"Will be use the default value"
				];
				break;
// /////////////////////////////////////////////////////////////
			// Param No Longer in Use
			case 'PRM_NLU':
				info['state'] = 'Convert';
				info['why'] = 'No longer in use';
				info['description'] = [
					"The parameter is no longer used or has changed name. Read the api documentation to correct the name of the function.",
					"For backward compatibility the value has been assigned to the correct parameter.",
					"Read the api documentation to correct the name of the parameter."
				];
				break;
// /////////////////////////////////////////////////////////////
			// Function Depracated
			case 'FN_DEP':
				info['state'] = '';
				info['why'] = 'Function depracated';
				info['description'] = [
					"The function is deprecated and will cancel in future. For backward compatibility there is a alias.",
					"Read the api documentation to correct the name of the function."
				];
				break;
// /////////////////////////////////////////////////////////////
			case 'EL_NOT_EXIST':
				info['state'] = 'Fatal Error';
				info['why'] = 'No elements selected';
				info['description'] = [
					"The selector passed does not match any element.",
					"Selector used: "+ $el.selector
				];
				break;
// /////////////////////////////////////////////////////////////
			case 'GENERIC_ERROR':
				info['state'] = 'Error';
				info['why'] = 'Something has gone wrong';
				info['description'] = [
					"I do not really know the cause. Are not useful in these cases, it is true? :("
				];
				break;
// /////////////////////////////////////////////////////////////
			/*
			 * case '': break;
			 */
// /////////////////////////////////////////////////////////////
		}	// End switch

		if( typeof description !== 'undefined' ){
			if( description.constructor != Array ){
				description = [description];
			}
			info['description'] = description;
		}

		var br = "\n\t";

		var text = [
			"Function: "+ nameFunction,
			( (typeof nameParam !== 'undefined') ? "Param: "+ nameParam : null ),
			"State: "+ info['state'],
			"Why: "+ info['why'],
			(info['description']).join("\n\t"),
			( ($el != null) ? "Selector: "+ $el.selector +' (length: '+ $el.length +')' : null ),
			"Stack:\t"+ KUtils.stack(),
			"\n"
		].filter(function(el){ if(typeof el !== 'undefined'){return el;} })		// Filter the null value
				.join( br );	//	Join :)

		switch(type){
			case 'GENERIC_ERROR':
				console.error( 'SAKE - ERROR'+ br + text );
				break;
			case 'FN_DEP':
			case 'PRM_IGN':
				console.warn( 'SAKE - WARNING'+ br + text );
				break;
			case 'PRM_NLU':
				console.info( 'SAKE - INFORMATION'+ br + text );
				break;
		}	// End switch
	};

	window.global_sake = global_sake;

})( window, jQuery );
