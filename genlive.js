$( "#genlive" ).click(function() {
var bloglink = $('#bloglink').val();
var livelink = $('#livelink').val();







$('#jwp').val('<iframe allowfullscreen="true" frameborder="0" height="500px" scrolling="no" src="'+bloglink+'/search?q='+window.btoa(livelink)+'&m=1&view=jwp" width="100%"></iframe>');
$('#clappr').val('<iframe allowfullscreen="true" frameborder="0" height="500px" scrolling="no" src="'+bloglink+'/search?q='+window.btoa(livelink)+'&m=1&view=clappr" width="100%"></iframe>');
$('#radian').val('<iframe allowfullscreen="true" frameborder="0" height="500px" scrolling="no" src="'+bloglink+'/search?q='+window.btoa(livelink)+'&m=1&view=radia" width="100%"></iframe>');
$('#plyr').val('<iframe allowfullscreen="true" frameborder="0" height="500px" scrolling="no" src="'+bloglink+'/search?q='+window.btoa(livelink)+'&m=1&view=plyr" width="100%"></iframe>');

 $('#jwpl').attr('href' ,bloglink+'/search?q='+window.btoa(livelink)+'&m=1&view=jwp');
 $('#clapprl').attr('href' ,bloglink+'/search?q='+window.btoa(livelink)+'&m=1&view=clappr');
 $('#radianl').attr('href' ,bloglink+'/search?q='+window.btoa(livelink)+'&m=1&view=radia');
 $('#plyrl').attr('href' , bloglink+'/search?q='+window.btoa(livelink)+'&m=1&view=plyr');


});
