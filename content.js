var RiaVideoParser = function() {};

/**
 * [findVideoPlayers description]
 * @return {[type]} [description]
 */
RiaVideoParser.prototype.findVideoPlayers = function() {
	return $('object');
};

/**
 * [findLink description]
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
RiaVideoParser.prototype.findLink = function(el) {

	var vars = $(el).find('param[name=flashvars]').prop('value');

	vars = vars.split('&');

	vars = (function(arr) {
		var obj = {};

		$.each(arr, function(i, v) {
			var split = v.split('=');
			obj[split[0]] = split[1];
		});

		return obj;
	})(vars);

	var playlistUrl = decodeURIComponent(vars.playlistUrl);

	var parse = document.createElement('a');
	parse.href = playlistUrl;

	var params = parse.search.substring(1);
	url = params.replace('playlist=', '');
	url = decodeURIComponent(url);

	var dfd = $.get(url);
	var link = $.Deferred();

	dfd.done(function(response) {

		var $xml = $(response);
		var href = $xml.find('ref').attr('href');

		$.get(href, function(response) {
			var $xml = $(response);
			var href = $xml.find('ref').attr('href');

			link.resolve(href);
		});
	});

	return link.promise();

};

/**
 * [makeLink description]
 * @param  {[type]} href [description]
 * @return {[type]}      [description]
 */
RiaVideoParser.prototype.makeLink = function(href) {
	return $('<a/>').attr('target', '_blank').attr('href', href).html('&nbsp;<<<-- Скачать');
};

/**
 * [getUrlParameter description]
 * @param  {[type]} url    [description]
 * @param  {[type]} sParam [description]
 * @return {[type]}        [description]
 */
RiaVideoParser.prototype.getUrlParameter = function (url, sParam)
{
	var a = document.createElement('a');
	a.href = url;

    var sPageURL = a.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
};

$('document').ready(function() {
	var parser = new RiaVideoParser();

	// Найдем все видео плееры на странице
	parser.findVideoPlayers().each(function() {
		var $el = $(this);

		// Найдем ссылку на видео
		parser.findLink(this).done(function(href) {

			// Сгенерируем ссылку и подставим ее в текст с размером видео.
			var $link = parser.makeLink(href);
			var $size = $el.closest('.article_video').find('.html5info .videoSize');
			$link.text($size.text());

			$el.closest('.article_video').find('.html5info .videoSize').html($link);
		});
	});
});
