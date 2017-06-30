import textTransform from 'src/texttransform.js';
import jquery from 'jquery';
var $ = jquery;

$('#enter').keyup(function () {
    $('#myhtml').html(textTransform($('#enter').val()));
});

var sampleIDs = [
    '001',
    'expected',
    'w-3937540'
];

window.sampleData = {
    's000': ''
};

var i = 0;

// Recursively make sequential network calls
function getData () {
    // '001'
    var id = sampleIDs[i];
    // 's001'
    var sID = 's' + id;
    // Download samples/001.md
    $.get('samples/' + id + '.md', function (data) {
        // store it in window.sampleData.s001
        window.sampleData[sID] = data;
        i = i + 1;
        if (i < sampleIDs.length) {
            getData();
        }
    });
}

getData();

sampleIDs.forEach(function (sampleID) {
    // <option value="001">001</option>
    $('#loaders').append('<option value="' + sampleID + '">' + sampleID + '</option>');
});

$('#loaders').change(function () {
    // <option data-id="001"></option>
    var dataID = $(this).val();

    // text = window.sampleData.001;
    var text = window.sampleData['s' + dataID];

    document.getElementById('enter').value = text;

    $('#myhtml').html(textTransform($('#enter').val()));
});
