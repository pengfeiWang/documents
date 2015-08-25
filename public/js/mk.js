  (function (){
    function Editor(inp, preview) {
      this.lang = function ( str ) {
        var lang = str.match(/^.+(?=\n)/)
        
        return lang;
      };
      this.replace = function ( str ) {
        var s = str.replace(/^.+(?=\n)/, '')
        return s.replace(/\n/, '');
      };
      this.update = function ( ) {

        var markHtml = markdown.toHTML(inp.value);
        preview.innerHTML = markdown.toHTML(inp.value);
        var code = preview.getElementsByTagName('code');      
        if(code.length){
          var i = 0, 
              str, 
              pre = document.createElement('pre'),
              nPre,
              sClass;
          for( ; i < code.length; i++ ) {
            str = code[i].innerHTML;
            sClass = this.lang(str);
            if( /css|js|html/.test(sClass) ) {
              nPre = pre.cloneNode(false);
              code[i].classList.add(this.lang(str))
              code[i].innerHTML = this.replace(str);
              code[i].parentNode.insertBefore(nPre,code[i]);
              
              nPre.appendChild(code[i]);
              hljs.highlightBlock(code[i]);
            }
          }
          // cont.innerHTML += preview.innerHTML;
        }
      };
      // input.editor = this;
      this.update();
    }
    
    window.onload = function () {
      var inp = $('#inp')[0], prev = $('#preView')[0];
      if( !prev ) return;
      var markDownEditor = new Editor( inp, prev );
      hljs.initHighlightingOnLoad();
      inp.addEventListener('input', function (){
        markDownEditor.update( prev );
      }, false);
    } 
  })();