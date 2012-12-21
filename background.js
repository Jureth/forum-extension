/**
 * Обработчик события chrome.extension api.
 * Нужен лдя непосредственного проксирования
 * @param request Object Данные нашего api-запроса.
 * @param sender Object Объект, характеризующий происхождение нашего запроса.
 * @param callback Function Коллбэк, который мы передаём параллельно с api-запросом.
 */
function onRequest(request, sender, callback) {
    // В данном примере поддерживается только действие xget.
    // В целом же можно построить довольно неплохую RPC-cистему
    switch(request.action){
        case 'options':
            callback(load_options_from_storage());
            break;
    }
}
;

// Регистрируем обработчик события.
chrome.extension.onRequest.addListener(onRequest);

//chrome.extension.options = localst

// Из скрипта обращение к прокси будет выглядеть так:
// chrome.extension.sendRequest({'action' : 'xget', 'url':url}, callback);
