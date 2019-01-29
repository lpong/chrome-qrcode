 //一般直接写在一个js文件中
 layui.use(['element', 'upload'], function () {
     var element = layui.element,
         layer = layui.layer;

     element.on('tab(app)', function () {
         localStorage.setItem('last_qrcode_extention', $(this).attr('lay-id'));
     });

     //获取上次选中
     var last_lay_id = localStorage.getItem('last_qrcode_extention') || 1;
     element.tabChange('app', last_lay_id);

     var obj = new QRCode(document.getElementById("qrcode-canvas"), {
         text: window.location.href,
         width: 640,
         height: 640,
         correctLevel: QRCode.CorrectLevel.H
     });

     //访问粘贴板
     var paste = function () {
         var textarea = $('<textarea></textarea>');
         $("#clipboard_text").html(textarea);
         textarea[0].select();
         document.execCommand('paste');
         var string = $.trim(textarea.val());
         $('#clipboard_text').empty();
         return string;
     }


     $('#text').on('input propertychange', function () {
         var text = $('#text').val();
         obj.clear();
         obj.makeCode(text);
     });
     $('#text').on('click', function () {
         $(this).select();
         document.execCommand('copy');
         layer.msg("结果已复制", {
             time: 1000
         });
     });


     //解析
     qrcode.callback = function (text) {
         $('#text-result').val(text || '图片无法识别');
     }

     //解析点击
     $('#qrcode-button').click(function (e) {
         var url = $('#qrcode-text').val();
         qrcode.decode(url) || '图片无法识别';
     });

     $('#qrcode-text').on('input propertychange', function (e) {
         $('#qrcode-img').html('');
         $('#qrcode-img').closest('.layui-form-item').hide();
         var url = $(this).val();
         $.get(url, function () {
             $('#qrcode-img').html('<img src="' + url + '">');
             $('#qrcode-img').closest('.layui-form-item').show();
             $('#qrcode-button').click();
         });
     });

     $('#text-result').on('click', function () {
         $(this).select();
         document.execCommand('copy');
         layer.msg("结果已复制", {
             time: 1000
         });
     });
     $('#qrcode-text').on('click', function () {
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
                 $('#qrcode-img').html('<img src="' + result + '">');
                 $('#qrcode-text').val(result);
                 $('#qrcode-button').click();
                 $('#qrcode-img').closest('.layui-form-item').show();
             });
         }
     });

     //禁用右键
     document.oncontextmenu = function () {
         return false
     }

     var text = paste();
     if (!text) {
         text = window.location.href;
     }
     $('#text').val(text);
     $('#qrcode-text').val(paste());
 });