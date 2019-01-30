 //一般直接写在一个js文件中
 layui.use(['element', 'upload'], function () {
     var element = layui.element,
         $ = layui.$,
         layer = layui.layer;

     element.on('tab(app)', function () {
         localStorage.setItem('last_qrcode_extention', $(this).attr('lay-id'));
     });

     //初始化二维码生成
     var init = function (url) {
        $('#text').val(url);
         var obj = new QRCode('qrcode-canvas', {
             text: url,
             width: 640,
             height: 640,
             correctLevel: QRCode.CorrectLevel.H
         });

         $(document).on('input propertychange', '#text', function () {
             var text = $('#text').val();
             obj.clear();
             obj.makeCode(text);
         });
     }

     if (typeof chrome.tabs != 'undefined') {
         chrome.tabs.getSelected(null, function (tab) {
             init(tab.url);
         });
     } else {
         init(window.location.href);
     }

     //解析
     qrcode.callback = function (text) {
         $('#text-result').val(text || '图片无法识别');
     }

     //解析点击
     $('#qrcode-button').click(function (e) {
         var url = $('#qrcode-text').val();
         qrcode.decode(url) || '图片无法识别';
     });

     $('#upload-clear').click(function () {
         localStorage.setItem('qrcode_text', '');
         $('#qrcode-text').val('');
         changeTextArea();
     });

     //teatarea 变化事件
     var changeTextArea = function () {
         $('#qrcode-img').html('');
         $('#qrcode-img').closest('.layui-form-item').hide();
         var url = $('#qrcode-text').val();
         localStorage.setItem('qrcode_text', url);
         $.get(url, function () {
             $('#qrcode-img').html('<img src="' + url + '">');
             $('#qrcode-img').closest('.layui-form-item').show();
             $('#qrcode-button').click();
         });
     }
     $(document).on('input propertychange', '#qrcode-text', changeTextArea);

     //双击复制
     $('.layui-textarea').dblclick(function () {
         $(this).select();
         document.execCommand('copy');
         layer.msg("结果已复制", {
             time: 1000
         });
     });

     //执行实例
     layui.upload.render({
         elem: '#upload-qrcode',
         accept: 'images',
         acceptMime: 'image/jpg, image/png',
         auto: false,
         choose: function (obj) {
             obj.preview(function (index, file, result) {
                 //$('#qrcode-img').html('<img src="' + result + '">');
                 $('#qrcode-text').val(result);
                 changeTextArea();
             });
         }
     });

     document.addEventListener("error", function (e) {
         var elem = e.target;
         if (elem.tagName.toLowerCase() == 'img') {
             $(elem).remove();
         }
     }, true);

     //获取上次选中
     var last_lay_id = localStorage.getItem('last_qrcode_extention') || 1;
     if (last_lay_id == 2) {
         element.tabChange('app', last_lay_id);
     }

     var data = localStorage.getItem('qrcode_text');
     if (data) {
         $('#qrcode-text').val(data);
         changeTextArea();
     }
 });