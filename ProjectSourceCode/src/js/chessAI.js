$(document).ready(function(){
    var minimaxDepth = 2;
	Game();

    function Game(){
		$('#board').hide();
		$('#gameover').hide();
		$('#restart').hide();
		$('#difficulty').show();

		$('.easy').click(function(){
			setDepth(0);
		});
		$('.medium').click(function(){
			setDepth(1);
		});
		$('.hard').click(function(){
			setDepth(2);
		});

		function setDepth(depth){
			$('#difficulty').hide();
			$('#board').show();
			$('#restart').show();
			console.log(depth);
			minimaxDepth = depth;
		}
	}
});