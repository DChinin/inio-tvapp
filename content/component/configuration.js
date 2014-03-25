/**
 * `configuration` component
 *
 * @author Mautilus s.r.o.
 * @class Component.configuration
 * @extends Component
 */
(function(Component) {
	function Configuration() {
		Component.apply(this, arguments);
	};

	Configuration.prototype.__proto__ = Component.prototype;

	Content.registerComponent('configuration', Configuration);

})(Component);