// ==UserScript==
// @name forum_sources_ru_hack
// @description Хак внешнего вида форума на исходниках
// @author Yuri 'Jureth' Minin
// @license MIT
// @version 1.1
// ==/UserScript==

// [1] Оборачиваем скрипт в замыкание, для кроссбраузерности (opera, ie)
(function (window, undefined) {
// [2] нормализуем window
    var w;
    w = window;
    if (w.self != w.top) {
        return;
    }

    function supports_html5_storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    var excluded_users = new Object;
	/**
	 * Retreive ignore list
	 */
    excluded_users.get = function(){
        users = localStorage['sources.forum.excluded'];
        if ( typeof users == 'undefined' ) {
            return new Array();
        }
        users = JSON.parse(users);
        if ( !jQuery.isArray(users) ) {
            users = new Array();
        }
        return users;
    }

	/**
	 * Add user to ignore list
	 */
    excluded_users.add = function(name){
        users = this.get();
        if ( jQuery.inArray(name, users) == -1 ) {
            users.push(name);
            localStorage['sources.forum.excluded'] = JSON.stringify(users);
        }
    }

    /**
	 * Delete user from ignore list
	 */
    excluded_users.remove = function(name){
        users = this.get();
        id = jQuery.inArray(name, users);
        if ( id != -1 ) {
            delete users[id];
            localStorage['sources.forum.excluded'] = JSON.stringify(users);
        }
    }

    $.noConflict();
    jQuery.getScript('http://forum.sources.ru/html/global.js');
    jQuery(document).ready(function ($) {
        //удаление ссылок на правила, поиск и т.д.

        $('#submenu').first().hide();
        //удаление новостей
        $news = $('#navstrip').closest('table').next().next();
        if ( $news.attr('id') == 'submenu'){
            $news = $news.next();
        }
        if ($news.html().indexOf('новости') > -1 || $news.html().indexOf('голосования') > -1) {
            $news.hide();
        }
        //замена моего помошника на избранное
        $('a[href*="buddy_pop()"]').replaceWith('<a href="http://forum.sources.ru/index.php?act=fav&show=1" id="new_favorites_button">Избранное</a>')
        if ($('table#submenu:first').find('img[src*="atb_favs_new.gif"]').length > 0) {
            //реакция на наличие обновлений избранных тем
            $('#new_favorites_button').css('color', 'red');
        }

        //удаление статистики форума
        $('div:contains("Статистика форума")').closest('.tableborder').hide();

        //удаление powered by invision и прочей информации
        //не реализуется через css. поведение :NOT отличается
        $('#ipbwrapper > div:not(".tableborder,.tablefill,#qr_open,#ipbwrapper")').hide();

        //обёртывание правил в спойлер
        $('#ipbwrapper #ipbwrapper').before("<div class='postcolor' id='rules_spoiler'><div class='spoiler closed'><div class='spoiler_header'>Правила</div><div class='body'></div></div><div>");
        $('#rules_spoiler .spoiler_header').click(function () {
            openCloseParent(this);
        });
        $('#rules_spoiler .body').append($('#ipbwrapper #ipbwrapper'));

        //поиск "неугодных" сообщений
        if (location.href.indexOf('showtopic=') > 0) {
            var excluded = excluded_users.get();
            $posts_to_hide = $('.postlinksbar').closest('.tableborder').find('table').filter(function (index) {
                return -1 != jQuery.inArray($(this).find('.normalname a:first').text(), excluded);
            });
            $posts_to_hide.each(function () {
                $(this).find('tr:eq(1) td:eq(1) div.postcolor').each(function () {
                    $(this).html("<div class='spoiler closed'><div class='spoiler_header'>Не интересно</div><div class='body'>" + $(this).html() + "</div></div>");
                    $(this).find('.spoiler_header:first').click(function () {
                        openCloseParent(this);
                    });
                })
            });

            //add links
            $table = $('.postlinksbar').closest('.tableborder').find('table');
            $table.each(function(){
                $(this).find('tr:eq(1) .postdetails').append('<a href="#" class="add_excluded_link">Добавить в игнор</a>');
                $(this).find('tr:eq(1) .postdetails').append('<a href="#" class="remove_excluded_link">Убрать из игнора</a>');
                if ( -1 != jQuery.inArray($(this).find('.normalname a:first').text(), excluded) ) {
                    $(this).find('.add_excluded_link').hide();
                }else{
                    $(this).find('.remove_excluded_link').hide();
                }
            });

            $('a.add_excluded_link').click(function (){
                excluded_users.add($(this).closest('table').find('.normalname a').first().text());
                w.location.reload();
            });
            $('a.remove_excluded_link').click(function (){
                excluded_users.remove($(this).closest('table').find('.normalname a').first().text());
                w.location.reload();
            });
        }
    })
})(window);

