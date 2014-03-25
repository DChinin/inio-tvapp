/**
 * `filter` component
 *
 * @author Mautilus s.r.o.
 * @class Component.filter
 * @extends Component
 */
(function(Component) {
	function Filter() {
		Component.apply(this, arguments);
	};

	Filter.prototype.isStructured = true;

	Filter.prototype.__proto__ = Component.prototype;

	/**
	 * @inheritdoc Component#normalize
	 */
	Filter.prototype.normalize = function(attrs) {
		return new Content_Model_Filter(attrs);
	};

	Content.registerComponent('filter', Filter);

})(Component);