/**
 * Filter model
 *
 * @author Mautilus s.r.o.
 * @class Content_Model_Filter
 * @extends Content_Model
 */
function Content_Model_Filter(attrs) {
	Content_Model.apply(this, arguments);
};

Content_Model_Filter.prototype.__proto__ = Content_Model.prototype;

/**
 * Return default attributes
 * @return {Object}
 */
Content_Model_Filter.prototype.defaultAttributes = function() {
	return {
		id: null,
		title: ''
	};
};