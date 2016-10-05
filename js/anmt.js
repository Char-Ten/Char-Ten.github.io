createrAnmt();
scollAnmt();
function createrAnmt() {
	var loop,timeOut,index = 0;
	$('.u-crt').click(function() {
		clearInterval(loop);
		clearTimeout(timeOut);
		index = $(this).index();
		update();
		timeOut = setTimeout(function() {
			clearTimeout(timeOut);
			run();
		}, 1000)
	});
	run();
	function run() {
		loop = setInterval(function() {
			index++;
			if(index > 2) {
				index = 0
			}
			update();
		}, 2000);
	}
	function update() {
		$('.u-crt').removeClass('u-crt1 u-crt2 u-crt3');
		$('.u-crt').eq(index).addClass('u-crt2');
		$('.u-crt').eq(index - 1 < 0 ? 2 : index - 1).addClass('u-crt1');
		$('.u-crt').eq(index + 1 > 2 ? 0 : index + 1).addClass('u-crt3');
	}
}

function scollAnmt(){
	var mWork=$('#mWork');
	var mPro=$('#mPro');
	var workTarget=mWork.offset().top+mWork.height()/2;
	var proTarget=mPro.offset().top+mPro.height()/2;
	$('#main').scroll(function(){
		var scollHeight=$(this).height()+$(this).scrollTop();
		if(scollHeight>workTarget){
			$('.u-work').removeClass('u-work1 u-work2 u-work3');
		}
		if(scollHeight>proTarget){
			$('.u-box').removeClass('u-box1');
			$('#mPro .g-tp').removeClass('z-anmt');
		}
	})
}

