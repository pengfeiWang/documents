document.addEventListener("DOMContentLoaded",function(){var m=document,h=m.getElementById("tool-nav-user"),c=m.getElementById("tool-nav"),k=c.getElementsByTagName("a"),n=c.getElementsByTagName("li"),d=h.querySelectorAll(".select-dep")[0],f=h.querySelectorAll(".select-pro")[0],j=m.getElementById("create-project");function i(a){}function l(){}function o(t,r){var s=r||c;var q=s.childNodes;for(var p=0,a=q.length;p<a;p++){q[p].classList.remove("active")}r&&r.classList.add("active");t.classList.add("active")}var e=[,'<div class="msgbox-login">','	<div class="">','		用户名: <input type="text" name="user" class="msgbox-login-user name">',"	</div>",'	<div class="">','		密　码: <input type="password" name="password" class="msgbox-login-password pass">',"	</div>","</div>"].join("");var b=[,'<div class="msgbox-login">','	<div class="">','		用户名: <input type="text" name="user" class="msgbox-login-user user" required>',"	</div>",'	<div class="">','		密　码: <input type="password" name="password" class="msgbox-login-password password" required>',"	</div>",'	<div class="">','		邮　箱: <input type="mail" name="email" class="msgbox-login-email email">',"	</div>","</div>"].join("");function g(u){var r=u.okBtn,t=u.content,a=t.querySelectorAll(".msgbox-login-user")[0],s=t.querySelectorAll(".msgbox-login-password")[0],p=t.querySelectorAll(".msgbox-login-email")[0],q=[];r.disabled=true;r.classList.add("disabled");$.each([a,s],function(x,y){q.push(0);(function w(v,z){$.on(z,"input",function(A){if(this.value){q[v]=1}if(/^1+$/g.test(q.join(""))){r.classList.remove("disabled");r.removeAttribute("disabled")}})})(x,y)})}h.addEventListener("click",function(p){var a=p.target;if(a.classList.contains("login")){$.ui.msgbox({title:"用户登录",msg:e,type:"confirm",callBack:{preInput:function(){g(this)},okFn:function(){var r=this.okBtn,t=this.content,q=t.querySelectorAll(".msgbox-login-user")[0],s=t.querySelectorAll(".msgbox-login-password")[0];$.ui.mask.show(true);$.ajax({url:"/login",type:"post",data:{name:q.value,password:s.value},success:function(u){if(u.status==0){$.ui.mask.show({tipText:'<span style="color:#ff0000">错误:</span>'+u.msg})}else{$.ui.mask.show({tipText:"登陆成功",autoHide:2000})}}})}}})}else{if(a.classList.contains("register")){$.ui.msgbox({title:"用户注册",msg:b,type:"confirm",callBack:{preInput:function(){g(this)},okFn:function(){var t=this.content,q=t.querySelectorAll(".msgbox-login-user")[0],s=t.querySelectorAll(".msgbox-login-password")[0],r=t.querySelectorAll(".msgbox-login-email")[0],u={};$.ui.mask.show(true);$.ajax({url:"/reg",type:"post",data:{name:q.value,password:s.value,email:r.value},success:function(v){if(v.status==1){$.ui.mask.show({tipText:"注册成功",autoHide:2000})}}})}}})}else{if(a.classList.contains("select-project")){}else{if(a.classList.contains("create-doc")){}else{if(a.classList.contains("edit-doc")){}}}}}},false);$.on(d,"change",function(p){var a=this.value;if(a){$.ajax({url:"/project",type:"post",data:{department:a},success:function(r){var q=0;var s=r.result;if(!r.status){$.ui.msgbox({msg:"暂无项目, 是否立即创建",type:"confirm",callBack:{okFn:function(){window.location="http://127.0.0.1:3000/create"}}})}}})}});c.addEventListener("click",function(t){t.preventDefault();var u=t.target,s=u.tagName.toLowerCase(),x,v,w,p,q,r;if(s=="li"||s=="a"){w=u.parentNode;while(w.tagName.toLowerCase()!=="ul"){w=w.parentNode}i(w);if(s=="li"){x=u}else{x=u.parentNode}if(w.id){o(x)}else{o(x,w)}}},false);if(j){j.addEventListener("submit",function(a){a.preventDefault();console.log(a)},false)}},false);
