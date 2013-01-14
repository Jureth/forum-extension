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

    var excluded_users = new StorageManager('sources.forum.excluded_users');

    var grayed_themes = new StorageManager('sources.form.grayed_themes');
    var global_options = load_options_from_storage();
    chrome.extension.sendMessage({action: "options"}, function(response) {
        global_options = response;
        //syncing options. not a good idea, but it's there are no other ways
        save_options_to_storage(global_options);
    });

    $.noConflict();

    jQuery(document).ready(function ($) {
        //удаление ссылок на правила, поиск и т.д.

        //Главная страница
        if ( !/act=|showtopic=|showforum=/.test(w.location.href) ){
            //удаление новостей. Пока костылями
            $news = $('#navstrip').closest('table').next().next();
            if ( $news.attr('id') == 'submenu'){
                $news = $news.next();
            }
            if ($news.html().indexOf('новости') > -1 || $news.html().indexOf('голосования') > -1) {
                $news.remove();
            }
            delete $news;
        }

        favButton();
        clubButton();

        $('#submenu').first().remove();

        //удаление статистики форума
        $('div:contains("Статистика форума")').closest('.tableborder').remove();

        //удаление powered by invision и прочей информации
        //не реализуется через css. поведение :NOT отличается
        $('#ipbwrapper > div:not(".tableborder,.tablefill,#qr_open,#ipbwrapper")').remove();

        hideRules();

        //поиск "неугодных" сообщений
        if (/showtopic=/.test(w.location.href)) {
            hideUserPosts();
        }else if (/showforum=/.test(w.location.href)){
            hideTopics();
        }else if ( /CODE_MODE=(my)?getnew/.test(w.location.href) ){
            hideSearchResults();
        }
        var bgcolor = jQuery(this).find('.tablebasic tr:eq(2) td:first').css('background-color');
        $('.tablebasic').css('background-color', bgcolor);

        if ( global_options['show_create_post_btn']) {
            add_topic_buttons();
        }
    })//ready

    //Скрытие правил
    function hideRules(){
        var $rules = jQuery('#ipbwrapper #ipbwrapper');
        jQuery('<span id="rules_spoiler">Правила</span>').insertBefore($rules)
            .css({'cursor': 'pointer', 'color': 'red', 'font-style': 'bold'})
            .toggle(function(){ $rules.show('fast')}, function(){$rules.hide('fast')});
        delete rules;
    }

    //Добавление кнопки клуба
    function clubButton(){
        jQuery('#new_favorites_button').after(' &middot; <a href="http://forum.sources.ru/index.php?c=9" id="club_button">Клуб</a>');
    }

    //замена моего помошника на избранное
    function favButton(){
        jQuery('a[href*="buddy_pop()"]').replaceWith('<a href="http://forum.sources.ru/index.php?act=fav&show=1" id="new_favorites_button">Избранное</a>')
        if (jQuery('table#submenu:first').find('img[src*="atb_favs_new.gif"]').length > 0) {
            //реакция на наличие обновлений избранных тем
            jQuery('#new_favorites_button').addClass('have_new');
        }
    }

    //Добавление кнопок создания темы/опроса
    function add_topic_buttons(){
        //add new poll && new topic buttons
        jQuery('.row2 b a[href*="showforum"]').each(function()
        {
            var href;
            if ( (href = /showforum=(\d+)/.exec(jQuery(this).attr('href'))) != null ) {
                var links =
                      '<a class="cs-button new-poll-button" href="http://forum.sources.ru/index.php?act=Post&CODE=10&f=' + href[1] + '">Новое голосование</a>'
                    + '<a class="cs-button new-topic-button" href="http://forum.sources.ru/index.php?act=Post&CODE=00&f=' + href[1] + '">Новая тема</a>';
                 jQuery(links).prependTo(jQuery(this).closest('td'));
            }
        });
    }

    function hideUserPosts(){
        var excluded = excluded_users.get();

        //add links
        $table = jQuery('.postlinksbar').closest('.tableborder').find('table');
        $table.each(function(){
            if ( -1 != jQuery.inArray(jQuery(this).find('.normalname a:first').text(), excluded) ) {
                //В списке
                //Кнопка работы с игнором
                jQuery(this).find('tr:eq(1) .postdetails').append(
                    jQuery('<a>', {
                        href:"#",
                        class:"remove_excluded_link",
                        text:"Убрать из игнора",
                        click: function (){
                            excluded_users.remove(jQuery(this).closest('table').find('.normalname a:first').text());
                            w.location.reload();//самый простой путь.
                        }
                    })
                );
                //Текст поста
                var $post = jQuery(this).find('tr:eq(1) div.postcolor:first');
                //Переключатель скрыть/показать сообщение
                jQuery('<a>', {
                    href: '#',//иначе нет подчеркивания
                    class:'j_show_hide_post',
                    text:'Показать',
                })
                .toggle(
                    function(){//show
                        jQuery(this).text('Скрыть');
                        $post.show('fast');
                        $post.siblings('.hide_message').hide();
                    },
                    function(){//hide
                        jQuery(this).text('Показать');
                        $post.hide('fast');
                        $post.siblings('.hide_message').show();
                    }
                )
                .prependTo(jQuery(this).find('tr:eq(0) td:eq(1) div:eq(1)'))
                .after(' &middot; ');
                //Добавляем сообщение о скрытии
                $post.before('<div class="hide_message">Сообщение скрыто</div>')
                .hide();

            }else{
                //Просто добавляем кнопку работы с игнором
                jQuery(this).find('tr:eq(1) .postdetails').append(
                    jQuery('<a>', {
                        href:"#",
                        class:"add_excluded_link",
                        text:"Добавить в игнор",
                        click:function (){
                            excluded_users.add(jQuery(this).closest('table').find('.normalname a:first').text());
                            w.location.reload();
                        }
                    })
                );
            }

        });

    }

    function hideSearchResults(){
        var excluded = grayed_themes.get();
        //console.log(excluded);
        var bgcolor = jQuery(this).find('.tablebasic tr:eq(2) td:first').css('background-color');
        jQuery('.tablebasic tr:not(:first)').each(function(){
            var $row = jQuery(this);
            var themeId = /showtopic=(\d+)/.exec($row.html())[1];

            if ( excluded.indexOf(themeId) > -1 ){
                $row.addClass('ignored_topic');
            }

            $row.find('td:first span').html(jQuery('<a>', {
                class: 'ignore_theme_button',
                html: '<b>#</b>',
                css: {
                    cursor: 'pointer',
                },
                click: function(){
                    index = excluded.indexOf(themeId);
                    if ( index > -1 ){
//                            console.log('remove ' + themeId);
                        grayed_themes.remove(themeId);
                        excluded.remove(index);
                        $row.removeClass('ignored_topic');
                    }else{
//                            console.log('add ' + themeId);
                        grayed_themes.add(themeId);
                        excluded.push(themeId);
                        $row.addClass('ignored_topic');
                    }
                    console.log(excluded);
                }
            }));

        })
    }

    function hideTopics(){
        var excluded = grayed_themes.get();

        //Создаём собственно кнопки
        getButton = function(topicId){
            $r = this.clone(true);
            $r.attr('topicId', topicId);
            return $r;
        }

        var $show_button_template = jQuery('<a>', {
            class: 'show-topic-button',
            html: 'Показать',
            click: function(){
                topicId = jQuery(this).attr('topicId');
                grayed_themes.remove(topicId);
                jQuery(this).closest('tr').removeClass('ignored_topic');
                jQuery(this).replaceWith($hide_button_template.getButton(topicId));
            },
        });
        $show_button_template.getButton = getButton;

        var $hide_button_template = jQuery('<a>', {
            class: 'hide-topic-button',
            html: 'Скрыть',
            click: function(){
                topicId = jQuery(this).attr('topicId');
                grayed_themes.add(topicId);
                jQuery(this).closest('tr').addClass('ignored_topic');
                jQuery(this).replaceWith($show_button_template.getButton(topicId));
            }
        });
        $hide_button_template.getButton = getButton;

        //Добавляем кнопки
        jQuery('a[href*=showtopic]').not('a[href*=getlastpost]').parents('tr').each(function(){
            var $row = jQuery(this);
            var topicId = /showtopic=(\d+)/.exec($row.html())[1];

            if ( excluded.indexOf(topicId) > -1 ){
                $row.addClass('ignored_topic');
                $row.find('td:eq(2)').prepend($show_button_template.getButton(topicId));
            }else{
                $row.find('td:eq(2)').prepend($hide_button_template.getButton(topicId));
            }
        })
    }
})(window);
