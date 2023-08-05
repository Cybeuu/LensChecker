$(function(){
	var currentval;
	var edgeval;
	var lastchar;
		
/*****************************/

	hide_slider();

	//paste not allowed to input fields 
	$("input").bind('paste', function(event){
		return false;
	})

	$("input")
		.css("font-size","14px")
		.css("font-weight","bold")
		;

	$("#current, #edge").focus(function(event){
		clear_inputs($(this).attr("id"));
	})
	
	$("#current, #edge").keydown(function(event){
		if (!(event.keyCode == 109 ||
					event.keyCode == 110 ||    //comma!
					event.keyCode == 190 ||
					event.keyCode == 46 || 
					event.keyCode == 8 || 
					event.keyCode == 9 || 
					event.keyCode == 37 || 
					event.keyCode == 38 || 
					event.keyCode == 39 || 
					event.keyCode == 40 ||
					(event.keyCode > 47 && 
					 event.keyCode < 58) ||
					(event.keyCode > 95 && 
					 event.keyCode < 106)
		))
			return false;


		//replace comma to dot, as decimal sep.
		if (event.keyCode == 110){
			event.keyCode == 190;
			return event.keyCode;
			}
	})

	$("#current").keypress(function(event){
		var v = $(this).val().replace(",",".");
		if (!isNaN(v))
			currentval = v;
	})


	$("#current").keyup(function(event){
		var v = $(this).val().replace(",",".");
		
		if (v == "") {
			$(this).val("-");
		} else 		
		if (isNaN(v) && v != "-") {
    	$(this).val(currentval);
		} else
		if (v > 0) {
    	$(this).val("-"+v);
    }

		calc_difference();
		return;

		//if both this value and "edge" are numerics, then calculate the difference
		if (!isNaN($(this).val()) && 
					$(this).val() != 0 &&
					!isNaN($("#edge").val())){
			calc_difference();
		} else {
			hide_slider();
		}
	})


	$("#edge").keypress(function(event){
		edgeval = $(this).val().replace(",",".");
	})


	$("#edge").keyup(function(event){
		$(this).val($(this).val().replace(",","."));
		if (isNaN($(this).val())) {
    	$(this).val(edgeval);
		} 

		if (!calc_diopters()){
			hide_slider();
		} else {
			if (!isNaN($("#current").val()) && $("#current").val() < 0)
				calc_difference(); 
		}
	})


	/*
		1. when focusing "current", increase the font size of the input field, and set its
			 content/value to "-" (minus)
		2. when focusing "edge": if "edge" value is not numeric, increase 
			 the font size of the "edge" and "myopia", and clear their content; else do nothing
	*/
	function clear_inputs(input_id){
		var ids;

		if (input_id == "current" && isNaN($("#current").val())){
			$("#current").val("-");
			ids = "#current";
		} else

		if (input_id == "edge"){
			ids = "#edge, #myopia";
			if (isNaN($("#edge").val()))
				$(ids).val("");
		}
	
		if (ids){
			$(ids)
				.css("font-size","22px")
				.css("font-weight","normal")
				;
		}
	} 


	function hide_slider(){
		$("#underp, #correctp,#overp")
			.css("background","none")
			.css("border","none");

		$("#slider-button").css("opacity","0");
		$("#slider-left").css("width","0");
	}
	
	
	function calc_diopters(){
		var cm = $("#edge").val();
		if (isNaN(cm) || cm == 0){
			$("#myopia").val("");
		} else {
			$("#myopia").val(Math.round((100/cm)/-0.25)*.25);
		}
		
		return $("#myopia").val();
	}

	//calc diff, and set slider
	function calc_difference(){
		var diff = parseFloat($("#myopia").val()) - parseFloat($("#current").val()); 
		if (isNaN(diff)) {
			hide_slider();
			return false;
		}

		var w =  diff * 100+200;
		
		w +=5;
		if (w > 400) w = 400;
		if (w < 17) w = 17;
		

		$("#slider-button").css("opacity","1");
		$("#slider-left").animate({width:w+"px"},300);

		$("#underp, #correctp,#overp")
			.css("background","none")
			.css("border","none");
		if (diff < 0) {
			$("#underp")
				.css("background","red url(images/gray-striped-bg.jpg)")
				.css("border","1px #40b6d1 solid");
		} else
		if (diff > 0) {
			$("#overp")
				.css("background","url(images/gray-striped-bg.jpg)")
				.css("border","1px #40b6d1 solid");
		} else	{
			$("#correctp")
				.css("background","url(images/gray-striped-bg.jpg)")
				.css("border","1px #40b6d1 solid");

		}
	}

})

