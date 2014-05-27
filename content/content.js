/**
 * Content main object
 *
 * @author Mautilus s.r.o.
 * @class Content
 * @singleton
 */

var Content = (function() {
	function Factory() {
		Deferrable.call(this);
	};

	Factory.prototype.VERSION = '1.0.1';
	Factory.prototype.components = {};
	Factory.prototype.instances = {};

	Factory.prototype.__proto__ = Deferrable.prototype;

	Factory.prototype.init = function() {
		this.parser = new Content_Parser();

		return this.parser.load();
	};

	/**
	 * Extend object
	 *
	 * @param {Object} target
	 * @param {Object} source (1...n)
	 * @returns {Object}
	 */
	Factory.prototype.extend = function(target) {
		var i = 1,
			o, n, isDefinedProperty, defineProperty;

		isDefinedProperty = function(obj) {
			return (typeof obj == 'object' && (
				obj.hasOwnProperty('value') || obj.hasOwnProperty('writable') || obj.hasOwnProperty('configurable') || obj.hasOwnProperty('get') || obj.hasOwnProperty('set')
			));
		};

		defineProperty = function(obj, prop, desc) {
			if (Object.defineProperty) {
				return Object.defineProperty(obj, prop, desc);
			}

			obj[prop] = desc.value;
		};

		for (; i < arguments.length; i++) {
			if ((o = arguments[i]) !== null) {
				for (n in o) {
					if (o[n] === null || target[n] === null || (typeof o[n] === 'object' && o[n].constructor !== Object)) {
						target[n] = o[n];

					} else if (o[n] instanceof Array || target[n] instanceof Array) {
						target[n] = this.extend([], target[n], o[n]);

					} else if (typeof o[n] === 'object' || typeof target[n] === 'object') {
						if (isDefinedProperty(o[n])) {
							defineProperty(target, n, o[n]);

						} else {
							target[n] = this.extend({}, target[n], o[n]);
						}

					} else {
						target[n] = o[n];
					}
				}
			}
		}

		return target;
	};
	/*
	 * Binding function for prevent scope or global variables.
	 *
	 * @param {Function} func called function
	 * @param {Object} scope which scope has to function use ?
	 * @param {Array} addArg array of arguments which are passed to function
	 * @returns {Function} returns new function
	 */
	Factory.prototype.bind = function(func, scope, addArg) {
		return function() {
			if (addArg) {
				var args = Array.prototype.slice.call(arguments);
				return func.apply(scope, args.concat(addArg));
			} else
				return func.apply(scope, arguments);
		};
	};

	/**
	 * Serialize object into query string
	 *
	 * @param {Object} obj
	 * @returns {String}
	 */
	Factory.prototype.param = function(obj) {
		var parts = [];

		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
			}
		}

		return parts.join("&").replace(/%20/g, "+");
	};

	/**
	 * Register new component
	 *
	 * @param {String} path
	 * @param {Object} component
	 */
	Factory.prototype.registerComponent = function(path, component) {
		this.components[path] = component;
	};
	/**
	 * Get registered component
	 *
	 * @param {String} path
	 * @return {Object}
	 */
	Factory.prototype.getComponent = function(path) {
		if (typeof this.components[path] !== 'undefined') {
			return this.components[path];
		}

		return false;
	};
	/**
	 * Find component by its path
	 *
	 * @param {String} path
	 * @param {Boolean} forceNew TRUE to force new instance
	 * @return {Object}
	 */
	Factory.prototype.find = function(path, forceNew) {
		try {
			if(! forceNew && this.instances[path]){
				return this.instances[path];
			}

			this.instances[path] = this.parser.find.apply(this.parser, arguments);

			return this.instances[path];

		} catch (e) {
			console.error(e, this.parser);

			if(typeof Inio !== 'undefined' && typeof Inio.displayError === 'function'){
				Inio.displayError(e);
			}
		}

		return false;
	};
	/**
	 * AJAX request
	 *
	 * @param  {String} url
	 * @param  {Object} options
	 * @return {Promise}
	 */
	Factory.prototype.ajax = function(url, options) {
		var xhr, opts, serialize, promise, resp, headers, tmp, uid;

		promise = new Promise();
		headers = {};

		serialize = function(data) {
			var arr = [];

			for (var i in data) {
				if (data.hasOwnProperty(i)) {
					if (typeof data[i] === 'object' || (data[i] instanceof Array)) {
						for (var j in data[i]) {
							arr.push(i + '=' + data[i][j]);
						}

					} else {
						arr.push(i + '=' + data[i]);
					}
				}
			}

			return arr.join('&');
		};

		opts = this.extend({
			method: 'GET', // GET, POST, PUT, etc.
			type: '', // html, json, jsonp, xml
			data: null, // payload
			timeout: 5000,
			headers: {},
			jsonpCallback: null
		}, options || {});

		if (opts.method === 'GET' && opts.data) {
			if (/\?/.test(url)) {
				url += '&' + serialize(opts.data);

			} else {
				url += '?' + serialize(opts.data);
			}
		}

		xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function(ev) {
			if (xhr.readyState === 4 && xhr.status !== 0) {
				resp = xhr.responseText;
				tmp = xhr.getAllResponseHeaders();

				if (tmp) {
					tmp.split(/\r?\n/).forEach(function(h) {
						var m = h.match(/^([^\:]+)\:\s+(.*)$/);
						if (m && m[1]) {
							headers[m[1]] = m[2];
						}
					});
				}

				if (opts.type === 'json') {
					try {
						resp = JSON.parse(resp);

					} catch (e) {
						if(console.network !== undefined){
							console.network(uid, 'error', '>>> ' + xhr.statusText.toUpperCase() + ' [' + xhr.status + ' ' + xhr.statusText + '] ' + resp);
						}

						promise.reject('parse', resp, headers, xhr);
						return;
					}
				}

				if (xhr.status >= 400 && xhr.status <= 599) {
					if(console.network !== undefined){
						console.network(uid, 'error', '>>> ' + xhr.statusText.toUpperCase() + ' [' + xhr.status + ' ' + xhr.statusText + '] ' + resp);
					}

					promise.reject('status', resp, headers, xhr);

				} else {
					if(console.network !== undefined){
						console.network(uid, xhr.statusText);
					}

					promise.resolve(resp, headers, xhr);
				}
			}
		};

		xhr.ontimeout = function(ev) {
			promise.reject('timeout', resp, headers, xhr);
		};

		xhr.onerror = function(ev) {
			if(console.network !== undefined){
				if(xhr.status === 0 && ! resp){
					resp = 'Connection refused';
				}

				console.network(uid, 'error', '>>> ' + xhr.statusText.toUpperCase() + ' [' + xhr.status + ' ' + xhr.statusText + '] ' + resp);
			}
			
			promise.reject(ev.type || 'error', resp, headers, xhr);
		};

		xhr.onabort = function(ev) {
			promise.reject('abort', resp, headers, xhr);
		};

		if(console.network !== undefined){
			uid = console.network(opts.method || 'GET', url);
		}

		xhr.open(opts.method || 'GET', url);

		if (opts.timeout) {
			xhr.timeout = opts.timeout >> 0;
		}

		if (opts.headers) {
			for (var i in opts.headers) {
				if (opts.headers.hasOwnPropert(i)) {
					xhr.setRequestHeader(i, opts.headers[i]);
				}
			}
		}

		if (opts.data) {
			xhr.send(serialize(opts.data));

		} else {
			xhr.send();
		}

		return promise;
	};

	return new Factory();
})();