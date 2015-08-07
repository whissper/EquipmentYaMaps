/**
*	Main Class -- EquipmentYaMaps
*/
function EquipmentYaMaps(boundSelector)
{
	//reference to itself
	var self = this;
	var syktyvkar_map;
	
	var stageList = $.parseJSON('{"stageList" : [ [1, "Корпус №1", "Октябрьский пр-т 55", 61.6651, 50.8131] ]}');//stage-id, stage-name, stage-address
	var ownersList = $.parseJSON('{"ownersList" : [ [1, "Институт 1", 1, "Институты"], [2, "Научно образовательный центр 1", 2, "Научно образовательные центры"], [3, "Научно образовательный центр 2", 2, "Научно образовательные центры"], [4, "Учебная лаборатория 1", 3, "Учебные лаборатории"] ]}');//owner-id, name, type-id, type-name
	var ownerInfo = $.parseJSON('{"ownerId" : 1, "ownerType" : 1, "ownerName" : "Институт 1", "submissionTo" : 0, "director" : "Руководитель 1", "matResponse" : "Мат. отвественный 1", "contacts" : "тел. (000)000-000", "address" : ["Корпус №1, Октябрьский пр-т 55"]}');
	var equipCategoryList = $.parseJSON('{"eqCatList" : [ [1, "МФУ", 1] ]}');//equip-category-id, name, amount
	var equipList = $.parseJSON('{"categoryName" : "МФУ", "eqList" : [ [1, "Модель", "000001A", "1111111", "32 000.00", 1] ]}');//category-name | equip-id, model-name, inventory-num, barcode, cost, amount
	var equipInfo = $.parseJSON('{"equipId" : 1, "model" : "Модель", "spec" : "технические хар-ки", "image" : "/path/to/image.jpg"}');
	
	//methods --(start):
	
	//private
	var somePrivateMethod = function()
	{

	}
	
	//generate balloon content layout
	//* is called through generatePlacemarks()
	var generateBalloonContentLayout = function()
	{
		//create Balloon content layout
        var balloonContentLayout = ymaps.templateLayoutFactory.createClass(
				'<div class="wrap-shortinfo" stageid="$[properties.id]">' +
					'<div>$[properties.name]</div>' +
					'<div>$[properties.address]</div>' +
					'<br /><br />' +
					'<div class="owners-list-wrap">' +
					'</div>' +
				'</div>', 
				{
					//override build method
					build: function(){
						    //call "native" build method of parent class
							balloonContentLayout.superclass.build.call(this);
							//do additional actions
							//alert($('.wrap-shortinfo').attr('stageid'));
							$.each(ownersList.ownersList, function(index, value){	
								if($('#ownerlist'+value[2]).length)
								{
									$('#ownerlist'+value[2]).append('<li class="ownerlistitem" ownerid="'+value[0]+'">'+value[1]+'</li>');
								}
								else
								{
									$(".owners-list-wrap").append(value[3]+': <ul id="ownerlist'+value[2]+'"></ul>');
									$('#ownerlist'+value[2]).append('<li class="ownerlistitem" ownerid="'+value[0]+'">'+value[1]+'</li>');
								}
							});
							$('.ownerlistitem').bind('click', this.onSpecificClick);
					},
					//override clear method
					clear: function () {
							//wise-versa: firstly make additional actions 
							//then call "native" clear method of parent class
							$('.ownerlistitem').unbind('click', this.onSpecificClick);
							balloonContentLayout.superclass.clear.call(this);
					},
					//additional method
					onSpecificClick: function () {
							$("body").css({"overflow" : "hidden"});
							$("#specific_info_frame").fadeIn(200);
							$("#light_cover").fadeIn(200);
				
							var address_string = '';
							$.each(ownerInfo.address, function(index, value){
								address_string += value;
							});
				
							$("#spcf_info_holder").empty();
							$("#spcf_info_holder").html(
								'Наименование: ' + ownerInfo.ownerName +
								'<br />' +
								'Институт (которому подчиняется): ' + ownerInfo.submissionTo +
								'<br />' +
								'Руководитель: ' + ownerInfo.director +
								'<br />' +
								'Мат. ответственный: ' + ownerInfo.matResponse +
								'<br />' +
								'Контакты: ' + ownerInfo.contacts +
								'<br /><br />' +
								'Список адресов: ' + address_string +
								'<br /><br />' +
								'Оборудование: <ul class="equipcat_list"><ul>'
							);
				
							$.each(equipCategoryList.eqCatList, function(index, value){
								$('.equipcat_list').append('<li class="equipcatitem" equipcatid="'+value[0]+'">'+value[1]+': '+value[2]+' шт.</li>');
							});
							$('.equipcatitem').bind('click', function(){
								var modelsList = '';
								
								$.each(equipList.eqList, function(index, value){
									modelsList += '<tr class="equipitem" equipid="'+value[0]+'"><td>'+value[1]+'</td><td>'+value[2]+'</td><td>'+value[3]+'</td><td>'+value[4]+' руб</td><td>'+value[5]+' шт.</td></tr>';
								});
								
								$("#spcf_info_holder").empty();
								$("#spcf_info_holder").html(
								'<div>'+ equipList.categoryName +' :</div>' +
								'<div>' +
								'<table>' +
								'<tbody>' +
								modelsList +
								'</tbody>' +
								'</table>' +
								'</div>'
								);
								
								$('.equipitem').bind('click', function(){
									$("#spcf_info_holder").empty();
									$("#spcf_info_holder").html(
									'<p>'+ equipInfo.model +'</p>'+
									'<p>'+ equipInfo.spec +'</p>'+
									'<p>'+ equipInfo.image +'</p>'
									);
								});
							});
					}
				});//createClass -- end;
		return balloonContentLayout;
	}//generateBalloonContentLayout -- end;
	
	//generate placemarks 
	//* is called through placeMarks()
	var generatePlacemarks = function()
	{
		var balloonContentLayout = generateBalloonContentLayout();
		var placemarksArray = [];
		
		$.each(stageList.stageList, function(index, value){
			
			var placemark = new ymaps.Placemark([value[3], value[4]], //coords
												{
													id: value[0],	  //properties ...
													name: value[1],	  //...
													address: value[2],//...
												}, 
												{
													balloonContentLayout: balloonContentLayout //balloon content layout
												});
			
			placemarksArray.push(placemark);
			
		});
		
		return placemarksArray;
	}//generatePlacemarks -- end;
	
	//generate map
	var generateMap = function()
	{		
		syktyvkar_map = new ymaps.Map($(boundSelector)[0],
									  {
										center: [61.67, 50.82],
										zoom: 12
									  });
										  
		syktyvkar_map.behaviors.enable('scrollZoom');
		
		syktyvkar_map.controls
			//zoom control button
			.add('zoomControl', { left: 5, top: 5 })
			//map type selector
			.add('typeSelector')
			//Buttons set
			.add('mapTools', { left: 35, top: 5 });
	}
	
	//place marks
	var placeMarks = function()
	{
		var placemarks = generatePlacemarks();
		$.each(placemarks, function(index, value){
			syktyvkar_map.geoObjects.add(value);
		});
	}
	
	//public
	this.somePublicMethod = function()
	{

	}
	
	//methods --(end);
	
	/**
	*	Constructor
	*/
	var constructTestYaMaps = function()
	{
		ymaps.ready(function(){
			generateMap();
			placeMarks();
		});
	}
	
	/**
	*	initialization
	*/
	this.init = function()
	{
		constructTestYaMaps();
	}
	
	//callback init ->
	this.init();
}

//initialization: kinda -- "public static void main(String[] args){ ... }"
/**
*	public static void (String[] args){ ... }
*/
$(document).ready(function(){
	
	$('#btn_close_holder ').bind('click', function(){
		$("body").css({"overflow" : "auto"});
		$("#specific_info_frame").fadeOut(200);
		$("#light_cover").fadeOut(200);
	});
	
	var equipmentInteractiveMap = new EquipmentYaMaps('#mymap');
	
});//$(document).ready -- end;