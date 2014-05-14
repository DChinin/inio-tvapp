/**
 * Error dialog view
 *
 * @author Mautilus s.r.o.
 * @class View_Dialog_Error
 * @extends View
 */
function View_Dialog_Error() {
	View_Dialog.apply(this, arguments);
};

View_Dialog_Error.prototype.__proto__ = View_Dialog.prototype;

/**
 * @inheritdoc View#render
 */
View_Dialog_Error.prototype.render = function() {
	return Template.render('dialog-error', this).done(function(html) {
		this.$el.html(html);
	}, this);
};
/**
 * @inheritdoc View#onEnter
 */
View_Dialog_Error.prototype.onEnter = function($el) {
	var btn = $el.attr('data-btn');

	if (btn === 'ok') {
		this.close();
	}

	return false;
};