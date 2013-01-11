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
chrome.extension.onMessage.addListener(onRequest);

//chrome.extension.options = localst
