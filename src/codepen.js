import textTransform from 'src/texttransform.js';
import jquery from 'jquery';
var $ = jquery;

$('#enter').keyup(function () {
    $('#myhtml').html(textTransform($('#enter').val()));
});
