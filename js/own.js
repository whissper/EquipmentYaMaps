/**
*	Main Class -- TestYaMaps
*/
function TestYaMaps()
{
	//reference to itself
	var self = this;
	
	//methods --(start):
	
	//private
	var somePrivateMathod = function()
	{

	}
	
	//public
	this.somePublicMathod = function()
	{

	}
	
	//methods --(end);
	
	/**
	*	Constructor
	*/
	var constructTestYaMaps = function()
	{

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

// initialization: kinda -- "public static void main(String[] args){ ... }"
/**
*	public static void (String[] args){ ... }
*/
$(document).ready(function(){
	
	var syktyvkar_map;
	
	ymaps.ready(function(){
		
		syktyvkar_map = new ymaps.Map($('#mymap')[0], {
            center: [61.67, 50.82],
            zoom: 12
        });
		
		syktyvkar_map.behaviors.enable('scrollZoom');
		
		syktyvkar_map.controls
			// Кнопка изменения масштаба.
			.add('zoomControl', { left: 5, top: 5 })
			// Список типов карты
			.add('typeSelector')
			// Стандартный набор кнопок
			.add('mapTools', { left: 35, top: 5 });
			

        // Создание макета содержимого балуна.
        // Макет создается с помощью фабрики макетов с помощью текстового шаблона.
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="wrap-shortinfo">' +
                '<div>$[properties.name]</div>' +
				'<div>$[properties.address]</div>' +
				'<br /><br />' +
				'<div class="owners-list-wrap">' +
				'</div>' +
            '</div>', {

            // Переопределяем функцию build, чтобы при создании макета начинать
            // слушать событие click на кнопке-счетчике.
            build: function () {
                // Сначала вызываем метод build родительского класса.
                BalloonContentLayout.superclass.build.call(this);
                // А затем выполняем дополнительные действия.
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

            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function () {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
                $('.ownerlistitem').unbind('click', this.onSpecificClick);
                BalloonContentLayout.superclass.clear.call(this);
            },

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
						modelsList += '<tr class="equipitem" equipid="'+value[0]+'"><td>'+value[1]+'</td><td>'+value[2]+'</td><td>'+value[3]+' руб</td><td>'+value[4]+' шт.</td></tr>';
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
        });
		
		
		var stageInfo = $.parseJSON('{"stageId" : 1, "stageName" : "Корпус №1", "stageAddress" : "Октябрьский пр-т 55"}');
		var ownersList = $.parseJSON('{"ownersList" : [ [1, "Институт 1", 1, "Институты"], [2, "Научно образовательный центр 1", 2, "Научно образовательные центры"], [3, "Научно образовательный центр 2", 2, "Научно образовательные центры"], [4, "Учебная лаборатория 1", 3, "Учебные лаборатории"] ]}');//owner-id, name, type-id, type-name
		var ownerInfo = $.parseJSON('{"ownerId" : 1, "ownerType" : 1, "ownerName" : "Институт 1", "submissionTo" : 0, "director" : "Руководитель 1", "matResponse" : "Мат. отвественный 1", "contacts" : "тел. (000)000-000", "address" : ["Корпус №1, Октябрьский пр-т 55"]}');
		var equipCategoryList = $.parseJSON('{"eqCatList" : [ [1, "МФУ", 1] ]}');//equip-category-id, name, amount
		var equipList = $.parseJSON('{"categoryName" : "МФУ", "eqList" : [ [1, "Модель", "000001A", "32 000.00", 1] ]}');//category-name | equip-id, model-name, inventory-num, cost, amount
		var equipInfo = $.parseJSON('{"equipId" : 1, "model" : "Модель", "spec" : "технические хар-ки", "image" : "/path/to/image.jpg"}');
			
		var placemark = new ymaps.Placemark([61.6651, 50.8131], {
				name: stageInfo.stageName,
				address: stageInfo.stageAddress,
			}, {
				balloonContentLayout: BalloonContentLayout
			});
			
		syktyvkar_map.geoObjects.add(placemark);
		
		$('#btn_close_holder ').bind('click', function(){
			$("body").css({"overflow" : "auto"});
			$("#specific_info_frame").fadeOut(200);
			$("#light_cover").fadeOut(200);
		});
		
	});//ymaps.ready -- end;
	
});//$(document).ready -- end;