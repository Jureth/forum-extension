
function StorageManager(storageName){
    this.localStorageName = storageName;
}

StorageManager.prototype = {
    get: function(){
        items = localStorage[this.localStorageName];
        if ( typeof items == 'undefined' ) {
            return new Array();
        }
        items = JSON.parse(items);
        if ( !jQuery.isArray(items) ) {
            items = new Array();
        }
        return items;
    },
    add: function(name){
        items = this.get();
        if ( jQuery.inArray(name, items) == -1 ) {
            items.push(name);
            localStorage[this.localStorageName] = JSON.stringify(items);
        }
    },
    remove: function(name){
        items = this.get();
        id = jQuery.inArray(name, items);
        if ( id != -1 ) {
            delete items[id];
            localStorage[this.localStorageName] = JSON.stringify(items);
        }
    }
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
