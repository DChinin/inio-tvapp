/**
 * TV shows scene
 *
 * @author Mautilus s.r.o.
 * @class Scene_Tvshows
 * @extends Scene
 */
function Scene_Tvshows() {
	Scene.apply(this, arguments);
};

Scene_Tvshows.prototype.__proto__ = Scene.prototype;

Scene_Tvshows.prototype.init = function() {
	this.catalog = new View_Catalog();

	this.catalog.on('select', function($el, title) {
		App.header.setBreadcrumbPath([this.filterName, title]);
	}, this);
};
/**
 * @inheritdoc Scene#create
 */
Scene_Tvshows.prototype.create = function() {
	return $('<div class="scene" id="scene-tvshows" />').appendTo(App.$viewport);
};
/**
 * @inheritdoc Scene#onShow
 */
Scene_Tvshows.prototype.onShow = function() {
	App.throbber();
};
/**
 * @inheritdoc Scene#activate
 */
Scene_Tvshows.prototype.activate = function() {
	this.collection = Content.find('content.tvshows');

	return this.collection.load().done(function() {
		//this.catalog.setFormat('landscape', 4, 4, 3);
		this.catalog.setCollection(this.collection);
	}, this);
};
/**
 * @inheritdoc Scene#render
 */
Scene_Tvshows.prototype.render = function() {
	return this.when(function(promise) {
		Template.render('scene-catalog', this).done(function(html) {
			this.$el.html(html);

			this.catalog.renderTo(this.$el.find('.movies')).done(function() {
				promise.resolve();
				App.throbberHide();

			}).fail(function() {
				promise.reject();
				App.throbberHide();
			})
		}, this);
	});
};
/**
 * @inheritdoc Scene#focus
 */
Scene_Tvshows.prototype.focus = function() {
	if(this.catalog.focus() === false){
		App.sidebar.focus();
	}
};
/**
 * @inheritdoc Scene#onClick
 */
Scene_Tvshows.prototype.onClick = function() {
	return this.onEnter.apply(this, arguments);
};
/**
 * @inheritdoc Scene#onEnter
 */
Scene_Tvshows.prototype.onEnter = function($el) {
	var id = $el.attr('data-id');

	if (id) {
		Router.go('catalog', id, $el.attr('data-title'), true);
		return false;
	}
};
/**
 * @inheritdoc Scene#onReturn
 */
Scene_Tvshows.prototype.onReturn = function() {
	App.sidebar.focus();
	return false;
};