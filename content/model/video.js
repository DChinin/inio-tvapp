/**
 * Video model
 *
 * @author Mautilus s.r.o.
 * @class Content_Model_Video
 * @extends Content_Model
 */
function Content_Model_Video(attrs) {
	Content_Model.apply(this, arguments);
};

Content_Model_Video.prototype.__proto__ = Content_Model.prototype;

/**
 * Return default attributes
 * @return {Object}
 */
Content_Model_Video.prototype.defaultAttributes = function() {
	return {
		id: null,
		title: '',
		coverImg: '',
		thumbnail: '',
		description: '',
		duration: 0,
		videoUrl: '',
		actors: [],
		directors: [],
		countries: [],
		parentalRating: '',
		rating: 0,
		year: 0
	};
};