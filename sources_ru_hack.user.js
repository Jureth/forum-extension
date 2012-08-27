// ==UserScript==
// @name forum_sources_ru_hack
// @description Хак внешнего вида форума на исходниках
// @author Yuri 'Jureth' Minin
// @license Personal use only. Not for distribution
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

    if (/forum.sources.ru/.test(w.location.href)) {
        var excluded_users = new Array(
            'DrUnkard',
            'Koss',
            'мыш',
            '#SI#',
            'Booze'
        );
        $.getScript('http://forum.sources.ru/html/global.js');
        $(document).ready(function () {
            //удаление ссылок на правила, поиск и т.д.
            $('#submenu').hide();
            //удаление шапки
            $('#logostrip').closest('table').hide();
            //удаление новостей
            $news = $('#navstrip').closest('table').next().next();
            if ($news.html().indexOf('новости') > -1 || $news.html().indexOf('голосования') > -1) {
                $news.hide();
            }
            //замена моего помошника на избранное
            $buddy = $('a[href*="buddy_pop()"]');
            $buddy.text('Избранное');
            $buddy.attr('href', "http://forum.sources.ru/index.php?act=fav&show=1");
            $buddy.attr('id', 'buddy');
            $buddy.attr('title', '');
            if ($('table#submenu').find('img[src*="atb_favs_new.gif"]').length > 0) {
                //реакция на наличие обновлений избранных тем
                $buddy.css('color', 'red');
            }
            //удаление баннеров и дай5
            $('#navstrip').siblings().text('');

            //отступ от верхнего края
            $('#userlinks').css('margin-top', '10px');

            //удаление статистики форума
            $('div:contains("Статистика форума")').closest('.tableborder').remove();
            //удаление powered by invision и прочей информации
            $('#ipbwrapper').children('noindex').remove();
            $('#ipbwrapper').children('div').not('.tableborder,.tablefill,#qr_open,#ipbwrapper').remove();

            //обёртывание правил в спойлер
            $('#ipbwrapper #ipbwrapper').before("<div class='postcolor' id='rules_spoiler'><div class='spoiler closed'><div class='spoiler_header'>Правила</div><div class='body'></div></div><div>");
            $('#rules_spoiler .spoiler_header').click(function () {
                openCloseParent(this);
            });
            $('#rules_spoiler .body').append($('#ipbwrapper #ipbwrapper'));

            //поиск "неугодных" сообщений
            if (location.href.indexOf('showtopic=') > 0) {
                $posts_to_hide = $('.postlinksbar').closest('.tableborder').find('table').filter(function (index) {
                    return -1 != jQuery.inArray($(this).find('.normalname a').first().text(), excluded_users);
                });
                $posts_to_hide.each(function () {
                    $(this).find('tr:eq(1) td:eq(1) div.postcolor').each(function () {
                        $(this).html("<div class='spoiler closed'><div class='spoiler_header'>Не интересно</div><div class='body'>" + $(this).html() + "</div></div>");
                        $(this).find('.spoiler_header').first().click(function () {
                            openCloseParent(this);
                        });
                    })
                });
            }
        if ( supports_html5_storage() ) {
		alert('ye');
	}
        })
    }
})(window);

