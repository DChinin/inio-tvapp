/**
 * Content model
 *
 * @author Mautilus s.r.o.
 * @class Content_Model
 * @abstract
 * @mixins Deferrable
 */
function Content_Model(attrs) {
	Deferrable.call(this);

	if(attrs){
		this.setAttributes(true, attrs);
	}

	this.init();
};

Content_Model.prototype.__proto__ = Deferrable.prototype;

/**
 * Init model
 * @template
 */
Content_Model.prototype.init = function() {
	
};

/**
 * Return default attributes
 * @template
 * @return {Object}
 */
Content_Model.prototype.defaultAttributes = function() {
	return {};
};

/**
 * Seter for multiple attributes
 * @param  {Object} [attrs]
 * @return {Object}
 */
Content_Model.prototype.setAttributes = function(attrs){
	var reset, defaults;

	if(typeof attrs === 'boolean' && arguments[1]){
		reset = true;
		attrs = arguments[1];
	}

	if(reset){
		defaults = this.defaultAttributes();

		for (var i in defaults) {
			if (defaults.hasOwnProperty(i)) {
				this[i] = defaults[i];
			}
		}
	}

	for (var i in attrs) {
		if (attrs.hasOwnProperty(i)) {
			this[i] = attrs[i];
		}
	}

	return this;
};

