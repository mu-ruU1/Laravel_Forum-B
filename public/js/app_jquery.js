/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************!*\
  !*** ./resources/js/dashboard/Create_thread.js ***!
  \*************************************************/
$('#dashboard_create_thread_btn').click(function () {
  var formElm = document.getElementById("dashboard_create_thread_form");
  var threadName = formElm.dashboard_create_thread_text.value;
  var thread_category = formElm.dashboard_thread_category_select.value;
  formElm.dashboard_create_thread_text.value = "";

  if (threadName == '') {
    return;
  }

  if (thread_category == '') {
    return;
  }

  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $.ajax({
    type: "POST",
    url: url + "/jQuery.ajax/create_thread",
    data: {
      "table": threadName,
      'thread_category': thread_category
    }
  }).done(function () {
    window.location.reload();
  }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
    console.log(XMLHttpRequest.status);
    console.log(textStatus);
    console.log(errorThrown.message);
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************!*\
  !*** ./resources/js/dashboard/Get_allRow.js ***!
  \**********************************************/
if (location.href.includes('dashboard/thread/name=') || location.href.includes('public/dashboard/thread/name=')) {
  reload();
  setInterval(reload, 5000);
}

function reload() {
  var displayArea = document.getElementById("dashboard_displayArea");
  var user;
  var msg;
  var show;
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $.ajax({
    type: "POST",
    url: url + "/jQuery.ajax/getRow",
    dataType: "json",
    data: {
      "table": thread_id
    }
  }).done(function (data) {
    displayArea.innerHTML = "<br>";

    for (var item in data) {
      if (data[item]['is_validity']) {
        // 通常
        user = data[item]['user_name'];
        msg = data[item]['message'];
      } else {
        // 管理者によって削除されていた場合
        user = "-----";
        msg = "<br>この投稿は管理者によって削除されました";
      }

      show = "" + "<a id='thread_message_id_" + data[item]['message_id'] + "' href='#dashboard_send_comment_label' type='button' onClick='reply(" + data[item]['message_id'] + ")'>" + data[item]['message_id'] + "</a>" + ": " + user + " " + data[item]['created_at'] + "<br>" + "<p style='overflow-wrap: break-word;'>" + msg + "</p>";

      if (data[item]['img_path'] != null) {
        show += "" + "<p>" + "<img src='" + url + data[item]['img_path'].replace('public', '/storage') + "'>" + "</p>";
      }

      show += "<br>";

      if (data[item]['user_like'] == 0) {
        // いいねが押されていない場合
        show += "<button type='button' class='btn btn-light' onClick='likes(" + data[item]['message_id'] + ", " + data[item]['user_like'] + ")'>like</button> " + data[item]['count_user'];
      } else {
        // いいねが押されていた場合
        show += "<button type='button' class='btn btn-dark' onClick='likes(" + data[item]['message_id'] + ", " + 1 + ")'>like</button> " + data[item]['count_user'];
      }

      show += "<hr>";
      displayArea.insertAdjacentHTML('afterbegin', show);
    }
  }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
    console.log(XMLHttpRequest.status);
    console.log(textStatus);
    console.log(errorThrown.message);
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************!*\
  !*** ./resources/js/dashboard/Reply_message.js ***!
  \*************************************************/
$("#dashboard_send_comment_replay_clear").click(function () {
  $('#dashboard_send_comment_reply_disabled_text').val('');
  $('#dashboard_send_comment_reply_source').attr('href', '#!');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************!*\
  !*** ./resources/js/dashboard/Search_thread.js ***!
  \*************************************************/
$('#dashboard_threads_search_thread').keyup(search_thread);

function search_thread() {
  var input = $('#dashboard_threads_search_thread').val();
  var category_type = $('#dashboard_threads_category_type_select').val();
  var category = $('#dashboard_threads_category_select').val();

  if (input == '') {
    $('#dashboard_threads_threads_table tr').show();
    return;
  }

  $('#dashboard_threads_threads_table tbody tr').each(function () {
    var text = $(this).find("td:eq(0)").html();
    var tb_category = $(this).find("td:eq(3)").html();
    var tb_category_type = $(this).find("td:eq(4)").html();

    if (text.match(input) != null) {
      if (category == tb_category) {
        $(this).show();
      } else if (category == '' && (category_type == '' || category_type == tb_category_type)) {
        $(this).show();
      } else {
        $('#dashboard_threads_threads_table tr').hide();
      }
    } else {
      $(this).hide();
    }
  });
}

$('#dashboard_threads_show_all_threads_button').click(function () {
  $('#dashboard_threads_category_type_select').val('');
  $('#dashboard_threads_category_select').val('');
  $('#dashboard_threads_search_thread').val('');
  $('#dashboard_threads_threads_table tr').show();
});
$('#dashboard_threads_category_type_select').change(function () {
  var category_type = $(this).val();
  search_thread();
  $('#dashboard_threads_category_select').find('option').each(function () {
    var category = $(this).data('val');

    if (category_type == '' || category_type == category) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
  $('#dashboard_threads_category_select').val('');
});
$('#dashboard_threads_category_select').change(search_thread);
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************!*\
  !*** ./resources/js/dashboard/Send_Row.js ***!
  \********************************************/
$('#dashboard_sendMessage_btn').click(function () {
  var rows_limit = 20;
  var bytes_limit = 300;
  var formElm = document.getElementById("dashboard_sendMessage_form");
  var message = formElm.dashboard_message_textarea.value;
  var reply = formElm.dashboard_send_comment_reply_disabled_text.value;
  var formData = new FormData();
  formData.append('table', thread_id);
  formData.append('message', message);
  formData.append('reply', reply);
  formData.append('img', $('#dashboard_send_comment_upload_img').prop('files')[0]);

  if (message.trim() == 0) {
    dashboard_sendAlertArea.innerHTML = "<div class='alert alert-danger'>書き込みなし・空白・改行のみの投稿は出来ません</div>";
  } else if (message.rows() > rows_limit) {
    dashboard_sendAlertArea.innerHTML = "<div class='alert alert-danger'>入力は" + rows_limit + "行以内にして下さい</div>";
  } else if (message.bytes() > bytes_limit) {
    dashboard_sendAlertArea.innerHTML = "<div class='alert alert-danger'>入力は" + bytes_limit / 3 + "文字(英数字は " + bytes_limit + "文字)以内にして下さい</div>";
  } else {
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    });
    $.ajax({
      type: "POST",
      url: url + "/jQuery.ajax/sendRow",
      data: formData,
      processData: false,
      contentType: false
    }).done(function () {}).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest.status);
      console.log(textStatus);
      console.log(errorThrown.message);
    });
    dashboard_sendAlertArea.innerHTML = "";
    formElm.dashboard_message_textarea.value = '';
    $('#dashboard_send_commnet_img_preview').attr('src', '');
    $('#dashboard_send_comment_upload_img').val('');
    $('#dashboard_send_comment_reply_disabled_text').val('');
    $('#dashboard_send_comment_reply_source').attr('href', '#!');
  }
});

String.prototype.bytes = function () {
  return encodeURIComponent(this).replace(/%../g, "x").length;
};

String.prototype.rows = function () {
  if (this.match(/\n/g)) return this.match(/\n/g).length + 1;else return 1;
};

$('#dashboard_send_comment_upload_img').change(function (e) {
  var fileset = $(this).val();

  if (fileset !== '' && e.target.files[0].type.indexOf('image') < 0) {
    dashboard_sendAlertArea.innerHTML = "<div class='alert alert-danger'>画像ファイルを指定してください</div>";
    $('#dashboard_send_commnet_img_preview').attr('src', '');
    $(this).val('');
    return false;
  } else if (file_size_check('dashboard_send_comment_upload_img')) {
    dashboard_sendAlertArea.innerHTML = "<div class='alert alert-danger'>ファイルのサイズは3MB以内にしてください</div>";
    $('#dashboard_send_commnet_img_preview').attr('src', '');
    $(this).val('');
    return false;
  } else {
    dashboard_sendAlertArea.innerHTML = "";

    if (fileset === '') {
      $('#dashboard_send_commnet_img_preview').attr('src', '');
    } else {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#dashboard_send_commnet_img_preview').attr('src', e.target.result);
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  }
});

function file_size_check(idname) {
  var fileset = $('#' + idname).prop('files')[0];

  if (fileset) {
    // 画像サイズ3MBまで
    if (3145728 <= fileset.size) {
      return true;
    } else {
      return false;
    }
  }
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************!*\
  !*** ./resources/js/hub/Create_thread.js ***!
  \*******************************************/
$('#hub_create_thread_btn').click(function () {
  var formElm = document.getElementById("hub_CreateThread_form");
  var threadName = formElm.hub_new_threadName_text.value;
  formElm.hub_new_threadName_text.value = "";
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $.ajax({
    type: "POST",
    url: url + "/jQuery.ajax/create_thread",
    data: {
      "table": threadName
    }
  }).done(function () {}).fail(function (XMLHttpRequest, textStatus, errorThrown) {
    console.log(XMLHttpRequest.status);
    console.log(textStatus);
    console.log(errorThrown.message);
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************!*\
  !*** ./resources/js/hub/Delete_thread.js ***!
  \*******************************************/
$('#hub_delete_thread_btn').click(function () {
  var formElm = document.getElementById("hub_thread_actions_form");
  var thread_id = formElm.hub_thread_id_text.value;
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $.ajax({
    type: "POST",
    url: url + "/jQuery.ajax/admin/delete_thread",
    data: {
      "thread_id": thread_id
    }
  }).done(function () {
    window.location.reload();
  }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
    console.log(XMLHttpRequest.status);
    console.log(textStatus);
    console.log(errorThrown.message);
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************!*\
  !*** ./resources/js/hub/Edit_thread.js ***!
  \*****************************************/
$('#hub_edit_thread_btn').click(function () {
  var formElm = document.getElementById("hub_thread_actions_form");
  var thread_id = formElm.hub_thread_id_text.value;
  var formElm = document.getElementById("hub_edit_thread_form");
  var thread_name = formElm.hub_edit_ThreadName_text.value;
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $.ajax({
    type: "POST",
    url: url + "/jQuery.ajax/admin/edit_thread",
    data: {
      "thread_id": thread_id,
      "thread_name": thread_name
    }
  }).done(function () {
    window.location.reload();
  }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
    console.log(XMLHttpRequest.status);
    console.log(textStatus);
    console.log(errorThrown.message);
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************!*\
  !*** ./resources/js/keiziban/Delete_message.js ***!
  \*************************************************/
$('#keiziban_delete_message_btn').click(function () {
  var formElm = document.getElementById("keiziban_message_actions_form");
  var message_id = formElm.keiziban_message_id_number.value;
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $.ajax({
    type: "POST",
    url: url + "/jQuery.ajax/admin/delete_message",
    data: {
      "thread_id": thread_id,
      "message_id": message_id
    }
  }).done(function () {}).fail(function (XMLHttpRequest, textStatus, errorThrown) {
    console.log(XMLHttpRequest.status);
    console.log(textStatus);
    console.log(errorThrown.message);
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************!*\
  !*** ./resources/js/keiziban/Get_allRow.js ***!
  \*********************************************/
if (location.href.includes('hub/thread_name=')) {
  reload();
  setInterval(reload, 1000);
}

function reload() {
  var displayArea = document.getElementById("keiziban_displayArea");
  var user;
  var msg;
  var show;
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $.ajax({
    type: "POST",
    url: url + "/jQuery.ajax/getRow",
    dataType: "json",
    data: {
      "table": thread_id
    }
  }).done(function (data) {
    displayArea.innerHTML = "<br>";

    for (var item in data) {
      if (data[item]['is_validity']) {
        // 通常
        user = data[item]['name'];
        msg = data[item]['message'];
      } else {
        // 管理者によって削除されていた場合
        user = "-----";
        msg = "<br>この投稿は管理者によって削除されました";
      }

      if (data[item]['user_like'] == 1) {
        // いいねが押されていた場合
        show = "" + data[item]['no'] + ": " + user + " " + data[item]['time'] + "<br>" + "<p style='overflow-wrap: break-word;'>" + msg + "</p>" + "<br>" + "<button type='button' class='btn btn-dark' onClick='likes(" + data[item]['no'] + ", " + data[item]['user_like'] + ")'>like</button> " + data[item]['count_user'] + "<hr>";
      } else {
        // いいねが押されていない場合
        show = "" + data[item]['no'] + ": " + user + " " + data[item]['time'] + "<br>" + "<p style='overflow-wrap: break-word;'>" + msg + "</p>" + "<br>" + "<button type='button' class='btn btn-light' onClick='likes(" + data[item]['no'] + ", " + data[item]['user_like'] + ")'>like</button> " + data[item]['count_user'] + "<hr>";
      }

      displayArea.insertAdjacentHTML('afterbegin', show);
    }
  }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
    console.log(XMLHttpRequest.status);
    console.log(textStatus);
    console.log(errorThrown.message);
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************!*\
  !*** ./resources/js/keiziban/Restore_message.js ***!
  \**************************************************/
$('#keiziban_restore_message_btn').click(function () {
  var formElm = document.getElementById("keiziban_message_actions_form");
  var message_id = formElm.keiziban_message_id_number.value;
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $.ajax({
    type: "POST",
    url: url + "/jQuery.ajax/admin/restore_message",
    data: {
      "thread_id": thread_id,
      "message_id": message_id
    }
  }).done(function () {}).fail(function (XMLHttpRequest, textStatus, errorThrown) {
    console.log(XMLHttpRequest.status);
    console.log(textStatus);
    console.log(errorThrown.message);
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************!*\
  !*** ./resources/js/keiziban/Send_Row.js ***!
  \*******************************************/
$('#keiziban_sendMessage_btn').click(function () {
  var rows_limit = 20;
  var bytes_limit = 300;
  var sendAlertArea = document.getElementById("keiziban_sendAlertArea");
  var formElm = document.getElementById("keiziban_sendMessage_form");
  var message = formElm.keiziban_message_textarea.value;

  if (message.trim() == 0) {
    keiziban_sendAlertArea.innerHTML = "<div class='alert alert-danger'>書き込みなし・空白・改行のみの投稿は出来ません</div>";
  } else if (message.rows() > rows_limit) {
    keiziban_sendAlertArea.innerHTML = "<div class='alert alert-danger'>入力は" + rows_limit + "行以内にして下さい</div>";
  } else if (message.bytes() > bytes_limit) {
    keiziban_sendAlertArea.innerHTML = "<div class='alert alert-danger'>入力は" + bytes_limit / 3 + "文字(英数字は " + bytes_limit + "文字)以内にして下さい</div>";
  } else {
    keiziban_sendAlertArea.innerHTML = "";
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    });
    $.ajax({
      type: "POST",
      url: url + "/jQuery.ajax/sendRow",
      data: {
        "table": thread_id,
        "message": message
      }
    }).done(function () {}).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest.status);
      console.log(textStatus);
      console.log(errorThrown.message);
    });
    formElm.keiziban_message_textarea.value = '';
  }
});

String.prototype.bytes = function () {
  return encodeURIComponent(this).replace(/%../g, "x").length;
};

String.prototype.rows = function () {
  if (this.match(/\n/g)) return this.match(/\n/g).length + 1;else return 1;
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************!*\
  !*** ./resources/js/mypage/SelectPageThema.js ***!
  \************************************************/
$('#mypage_page_thema_select').change(function () {
  var value = $('option:selected').val();

  if (value == 'default') {
    value = 0;
  } else if (value == 'dark') {
    value = 1;
  } else {
    return;
  }

  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $.ajax({
    type: "POST",
    url: url + "/jQuery.ajax/page_thema",
    data: {
      "page_thema": value
    }
  }).done(function () {
    window.location.reload();
  }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
    console.log(XMLHttpRequest.status);
    console.log(textStatus);
    console.log(errorThrown.message);
  });
});
})();

/******/ })()
;