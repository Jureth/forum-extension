// ==UserScript==
// @name forum_sources_ru_hack
// @description Хак внешнего вида форума на исходниках
// @author Yuri 'Jureth' Minin
// @license Personal use only.
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
    jQuery(document).ready(function ($) {
        //удаление ссылок на правила, поиск и т.д.

        $('#submenu').first().remove();
        //удаление новостей. Пока костылями
        $news = $('#navstrip').closest('table').next().next();
        if ( $news.attr('id') == 'submenu'){
            $news = $news.next();
        }
        if ($news.html().indexOf('новости') > -1 || $news.html().indexOf('голосования') > -1) {
            $news.remove();
        }
        delete $news;

        //замена моего помошника на избранное
        $('a[href*="buddy_pop()"]').replaceWith('<a href="http://forum.sources.ru/index.php?act=fav&show=1" id="new_favorites_button">Избранное</a>')
        if ($('table#submenu:first').find('img[src*="atb_favs_new.gif"]').length > 0) {
            //реакция на наличие обновлений избранных тем
            $('#new_favorites_button').css('color', 'red');
        }

        //удаление статистики форума
        $('div:contains("Статистика форума")').closest('.tableborder').remove();

        //удаление powered by invision и прочей информации
        //не реализуется через css. поведение :NOT отличается
        $('#ipbwrapper > div:not(".tableborder,.tablefill,#qr_open,#ipbwrapper")').remove();

        //Скрытие правил
        var $rules = $('#ipbwrapper #ipbwrapper');
//        $rules.hide();
        $('<span id="rules_spoiler">Правила</span>').insertBefore($rules)
            .css({'cursor': 'pointer', 'color': 'red', 'font-style': 'bold'})
            .toggle(function(){ $rules.show('fast')}, function(){$rules.hide('fast')});
        delete rules;

        //поиск "неугодных" сообщений
        if (/showtopic=/.test(w.location.href)) {
            var excluded = excluded_users.get();

            //add links
            $table = $('.postlinksbar').closest('.tableborder').find('table');
            $table.each(function(){
                if ( -1 != $.inArray($(this).find('.normalname a:first').text(), excluded) ) {
                    //В списке
                    //Кнопка работы с игнором
                    $(this).find('tr:eq(1) .postdetails').append(
                        $('<a>', {
                            href:"#",
                            class:"remove_excluded_link",
                            text:"Убрать из игнора",
                            click: function (){
                                excluded_users.remove($(this).closest('table').find('.normalname a:first').text());
                                w.location.reload();//самый простой путь.
                            }
                        })
                    );
                    //Текст поста
                    var $post = $(this).find('tr:eq(1) div.postcolor:first');
                    //Переключатель скрыть/показать сообщение
                    $('<a>', {
                        href: '#',//иначе нет подчеркивания
                        class:'j_show_hide_post',
                        text:'Показать',
                    })
                    .toggle(
                        function(){//show
                            $(this).text('Скрыть');
                            $post.show('fast');
                            $post.siblings('.hide_message').hide();
                        },
                        function(){//hide
                            $(this).text('Показать');
                            $post.hide('fast');
                            $post.siblings('.hide_message').show();
                        }
                    )
                    .prependTo($(this).find('tr:eq(0) td:eq(1) div:eq(1)'))
                    .after(' &middot; ');
                    //Добавляем сообщение о скрытии
                    $post.before('<div class="hide_message">Сообщение скрыто</div>')
                    .hide();

                }else{
                    //Просто добавляем кнопку работы с игнором
                    $(this).find('tr:eq(1) .postdetails').append(
                        $('<a>', {
                            href:"#",
                            class:"add_excluded_link",
                            text:"Добавить в игнор",
                            click:function (){
                                excluded_users.add($(this).closest('table').find('.normalname a:first').text());
                                w.location.reload();
                            }
                        })
                    );
                }

            });
        }
    })
})(window);

