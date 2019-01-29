 //一般直接写在一个js文件中
 layui.use(['element', 'upload'], function () {
     var element = layui.element;


     var updateHeight = function () {
         var height = $('.layui-tab').height();
         $('.main').css('height', height);
     }

     element.on('tab(app)', function (data) {
         updateHeight();
     });

     var obj = new QRCode(document.getElementById("qrcode-canvas"), {
         text: window.location.href,
         width: 640,
         height: 640,
         correctLevel: QRCode.CorrectLevel.H
     });
     $('#text').val(window.location.href);
     $('#text').on('input propertychange', function () {
         var text = $('#text').val();
         obj.clear();
         obj.makeCode(text);
     });

     //解析
     qrcode.callback = function (text) {
         $('#text-result').val(text || '图片无法识别');
         updateHeight();
     }

     //解析点击
     $('#qrcode-button').click(function (e) {
         var url = $('#qrcode-text').val();
         qrcode.decode(url) || '图片无法识别';
     });

     $('#qrcode-text').on('input propertychange', function (e) {
         $('#qrcode-img').html('');
         $('#qrcode-img').closest('.layui-form-item').hide();
         updateHeight();
         var url = $(this).val();
         $.get(url, function () {
             $('#qrcode-img').html('<img src="' + url + '">');
             $('#qrcode-img').closest('.layui-form-item').show();
             $('#qrcode-button').click();
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
 });