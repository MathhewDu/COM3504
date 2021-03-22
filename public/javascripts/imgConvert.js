
function imageBase64(img){
    let canvas = document.getElementById('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let dataURL = canvas.toDataURL("image/png");
    return dataURL;
}
function getImgBase64(){
    let base64= "";
    let img = new Image();
    img.src="public/images/cathedral.jpg";
    img.onload = function (){
        base64 = imageBase64(img);
        document.write("<img src='"+ base64+"' />");
    }
}