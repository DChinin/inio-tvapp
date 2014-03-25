/**
 * Configuration parser
 *
 * @author Mautilus s.r.o.
 * @class Content_Parser
 * @singleton
 * @mixins Deferrable
 */
function Content_Parser() {
	Deferrable.call(this);

	this.data = null;
	this.cache = {};
};

Content_Parser.prototype.__proto__ = Deferrable.prototype;

/**
 * Load the config file from the URL
 * @param  {String} [file] URL address
 * @return {Promise}
 */
Content_Parser.prototype.load = function(file) {
	var promise = new Promise();

	if(typeof Inio_JSON === 'undefined'){
		throw new Error('Configuration file `inio.js` is missing');
	}

	if (!file && Inio_JSON instanceof Array) {
		this.data = Inio_JSON;

		this.validate();

		promise.resolve();
	}

	return promise;
};

/**
 * Validate configuration
 */
Content_Parser.prototype.validate = function() {
	if (!(this.data instanceof Array)) {
		throw new Error('Invalid data format of the `inio.js` config file');
	}

	if (!this.find('configuration')) {
		//throw new Error('Missing component id `configuration` in `inio.js` config file');
	}
};

/**
 * Return component's function
 * @param  {String} path
 * @return {Function}
 */
Content_Parser.prototype.getComponentFunc = function(path) {
	return Content.getComponent(path);
};

/**
 * Find the component and return its instance
 * @param  {String} path
 * @param  {String} [returnAttr] Attribute name that should be returned
 * @return {Mixed}
 */
Content_Parser.prototype.find = function(path, returnAttr) {
	var obj, p, comp, inst, getObj;

	getObj = function(obj, id, returnComponent) {
		for (var i in obj) {
			if (typeof obj[i] === 'object' && obj[i].component) {
				if (obj[i].id === id) {
					if (returnComponent) {
						return obj[i];
					}

					return obj[i].items;
				}
			}
		}

		return null;
	};

	if (path === undefined) {
		path = '';
	}

	path = path.replace(/^\.+/, '');

	if (this.cache[path]) {
		return this.cache[path];
	}

	p = path.split('.');
	id = p.pop();
	obj = this.data;

	for (var i in p) {
		obj = getObj(obj, p[i]);

		if (!obj) {
			break;
		}
	}

	obj = getObj(obj, id, true);

	if (obj && obj.component) {
		comp = this.getComponentFunc(obj.component);

		if (typeof comp === 'function') {
			if (returnAttr) {
				return obj[returnAttr];
			}

			inst = new comp(path, obj.id, obj.attrs);

			if (inst.isSingleton) {
				this.cache[path] = inst;
			}

			return inst;

		} else {
			throw new Error('Component `' + obj.component + '` is not installed.');
		}
	}

	return false;
};