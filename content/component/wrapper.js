/**
 * `wrapper` component
 *
 * @author Mautilus s.r.o.
 * @class Component.wrapper
 * @extends Component
 */
(function(Component) {
	function Wrapper() {
		Component.apply(this, arguments);
	};

	Wrapper.prototype.__proto__ = Component.prototype;

	Content.registerComponent('wrapper', Wrapper);

})(Component);