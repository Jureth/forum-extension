if ( location.href.indexOf('sources.ru') > 0 ){
  $(window).load(function(){
    //настройка highslide. использован window.load т.к. сразу после getScript
    //переменная hs ещё не инициализирована.
    //Может есть другие способы.
    hs.graphicsDir = 'http://92.255.182.186/highslide/graphics/';
    hs.maxWidth = 1000;
    hs.align = 'center';
    hs.transitions = ['expand', 'crossfade'];
    hs.fadeInOut = true;
    //удаление двоеточия в описании картинки
    hs.captionEval = 'this.thumb.alt.replace(/:$/,"")';
  });
                
  $(document).ready(function(){
    //удаление новостей
    $news = $('#navstrip').closest('table').next().next();
    if ( $news.html().indexOf('новости') > -1 || $news.html().indexOf('голосования') > -1 ) {
      $news.remove();
    }
    //замена моего помошника на избранное
    $buddy = $('a[href*="buddy_pop()"]');
    $buddy.text('Избранное');
    $buddy.attr('href', "http://forum.sources.ru/index.php?act=fav&show=1");
    $buddy.attr('id', 'buddy');
    $buddy.attr('title', '');
    if ( $('table#submenu').find('img[src*="atb_favs_new.gif"]').length > 0 ) {
      //реакция на наличие обновлений избранных тем
      $buddy.css('color', 'red');
    }
    //удаление баннеров и дай5
    $('#navstrip').siblings().text('');
    //удаление ссылок на правила, поиск и т.д.
    $('#submenu').remove();
    //удаление шапки
    $('#logostrip').closest('table').remove();

    //отступ от верхнего края
    $('#userlinks').css('margin-top', '10px');

    //удаление статистики форума
    $('div:contains("Статистика форума")').closest('.tableborder').remove();
    //удаление powered by invision и прочей информации
    $('#ipbwrapper').children('noindex').remove();
    $('#ipbwrapper').children('div').not('.tableborder,.tablefill,#qr_open,#ipbwrapper').remove();

    //обёртывание правил в спойлер
    $('#ipbwrapper #ipbwrapper').before("<div class='postcolor' id='rules_spoiler'><div class='spoiler closed'><div class='spoiler_header'>Правила</div><div class='body'></div></div><div>");
    $('#rules_spoiler .spoiler_header').click(function(){openCloseParent(this);});
    $('#rules_spoiler .body').append($('#ipbwrapper #ipbwrapper'));

    //добавление highslide
    //********************
    $('span.attach_preview').each(function(){
      //подключение классов и реакции на нажатия мышкой
      $a = $(this).find('a');
      $a.addClass('highslide');
      $a.click(function(){ return hs.expand(this); });
      //добавление текста аттача в alt к картинке для последующего использования highslide
      $a.find('img').attr('alt', $(this).find('p').text());
    });
    //загрузка скрипта и css извне.
    //todo надо найти способ подключать локальные файлы
    $.getScript('http://92.255.182.186/highslide/highslide.packed.js');
    $("head").append("<link>");
    css = $("head").children().last();
    css.attr({
      rel:  "stylesheet",
      type: "text/css",
      href: "http://92.255.182.186/highslide/highslide.css"
    });
  })
}
//vim:ts=4,expandtab
