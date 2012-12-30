
function get_item_value(item) {
  switch (item.type){
    case 'checkbox':
    case 'radio':
      return item.checked;
    case 'textarea':
      return item.innerHTML;
    case 'text':
    case 'password':
      return item.value;
  }
  return null;
}

function set_item_value(item, value){
  switch (item.type) {
    case 'checkbox':
      item.checked = value;
      break;
    case 'textarea':
      item.innerHTML = value;
      break;
    case 'text':
    case 'password':
      item.value = value;
      break;
  }
}


function save_options() {
  var options = new Object();
  var elements = document.querySelectorAll('input, select, textarea');
  for(var key in elements) {
    options[elements[key].name] = get_item_value(elements[key]);
  }
  save_options_to_storage(options);
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  options = load_options_from_storage();
  var elements = document.querySelectorAll('input, select, textarea');
  for(var key in elements) {
    name = elements[key].name;
    if (options[name] !== undefined){
      set_item_value(elements[key], options[name]);
    }
  }


  //example for select
  // var favorite = localStorage["favorite_color"];
  // if (!favorite) {
  //   return;
  // }
  // var select = document.getElementById("color");
  // for (var i = 0; i < select.children.length; i++) {
  //   var child = select.children[i];
  //   if (child.value == favorite) {
  //     child.selected = "true";
  //     break;
  //   }
  // }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
