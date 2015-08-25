(function () {
  var f = document,
  d = f.getElementById('tool-nav-user');
  var c = [
    ,
    '<div class="msgbox-login">',
    '   <div class="">',
    '               用户名: <input type="text" name="user" class="msgbox-login-user name" required>',
    '      </div>',
    '       <div class="">',
    '               密　码: <input type="password" name="password" class="msgbox-login-password pass" required>',
    '  </div>',
    '</div>'
  ].join('');
  var b = [
    ,
    '<div class="msgbox-login">',
    '       <div class="">',
    '               用户名: <input type="text" name="user" class="msgbox-login-user" required>',
    '   </div>',
    '       <div class="">',
    '               密　码: <input type="password" name="password" class="msgbox-login-password" required>',
    '       </div>',
    '       <div class="">',
    '               邮　箱: <input type="mail" name="email" class="msgbox-login-email">',
    '  </div>',
    '</div>'
  ].join('');
  function a(n) {
    var k = n.okBtn,
    m = n.content,
    h = m.querySelectorAll('.msgbox-login-user') [0],
    l = m.querySelectorAll('.msgbox-login-password') [0],
    i = m.querySelectorAll('.msgbox-login-email') [0],
    j = [
    ];
    k.disabled = true;
    k.classList.add('disabled');
    $.each([h,
    l], function (p, q) {
      j.push(0);
      (function o(r, s) {
        $.on(s, 'input', function (t) {
          if (this.value) {
            j[r] = 1
          }
          if (/^1+$/g.test(j.join(''))) {
            k.classList.remove('disabled');
            k.removeAttribute('disabled')
          }
        })
      }) (p, q)
    })
  }
  function e() {
    $.ui.msgbox({
      title: '用户登录',
      msg: c,
      type: 'confirm',
      callBack: {
        preInput: function () {
        },
        okFn: function () {
          var i = this.okBtn,
          k = this.content,
          h = k.querySelectorAll('.msgbox-login-user') [0],
          j = k.querySelectorAll('.msgbox-login-password') [0];
          $.ui.mask.show(true);
          $.ajax({
            url: '/login',
            type: 'post',
            data: {
              name: h.value,
              password: j.value
            },
            success: function (l) {
              if (l.status == 0) {
                $.ui.mask.show({
                  tipText: '<span style="color:#fff;">错误:</span>' + l.msg,
                  autoHide: 3000
                })
              } else {
                $.ui.mask.show({
                  tipText: '登陆成功',
                  autoHide: 2000,
                  showCallBack: function () {
                    window.location.reload()
                  }
                })
              }
            }
          })
        },
        cancelFn: function () {
        }
      }
    })
  }
  function g() {
    $.ui.msgbox({
      title: '用户注册',
      msg: b,
      type: 'confirm',
      callBack: {
        preInput: function () {
          a(this)
        },
        okFn: function () {
          var k = this.content,
          h = k.querySelectorAll('.msgbox-login-user') [0],
          j = k.querySelectorAll('.msgbox-login-password') [0],
          i = k.querySelectorAll('.msgbox-login-email') [0],
          l = {
          };
          $.ui.mask.show(true);
          $.ajax({
            url: '/reg',
            type: 'post',
            data: {
              name: h.value,
              password: j.value,
              email: i.value
            },
            success: function (m) {
              if (m.status == 1) {
                $.ui.mask.show({
                  tipText: '注册成功',
                  autoHide: 2000,
                  showCallBack: function () {
                    window.location.reload()
                  }
                })
              } else {
                $.ui.mask.show({
                  tipText: '<span style="color:#ff0000">错误:</span>' + m.msg,
                  autoHide: 3000
                })
              }
            }
          })
        },
        cancelFn: function () {
        }
      }
    })
  }
  window.registerHandle = g;
  window.loginHandle = e;
  d.addEventListener('click', function (i) {
    var h = i.target;
    if (h.classList.contains('login')) {
      e()
    } else {
      if (h.classList.contains('register')) {
        //g()
        
        $.ui.mask.show({
          tipText: '暂未开放注册',
          autoHide: 2000
        });
      } else {
        if (h.classList.contains('btn-logout')) {
          $.ajax({
            url: '/logout',
            type: 'get',
            dataType: 'json',
            success: function (j) {
              if (j.status) {
                window.location.reload()
              }
            }
          })
        }
      }
    }
  }, false)
}) ();

