var arr = [{"Id":1587482074805,"Position":{"x":4,"y":132,"x2":84,"y2":180,"w":80,"h":48},"Code":"C_1","BColor":"#123456","IsBColor":true,"Border":"solid 1px #123456","IsBorder":true,"SelectedColor":"#123456","IsSelected":true,"IsShow":true,"Flag":true},{"Id":1587482101799,"Position":{"x":82,"y":132,"x2":160,"y2":180,"w":78,"h":48},"Code":"C_2","BColor":"#123456","IsBColor":true,"Border":"solid 1px #123456","IsBorder":true,"SelectedColor":"#123456","IsSelected":true,"IsShow":true,"Flag":true},{"Id":1587482149046,"Position":{"x":162,"y":131,"x2":238,"y2":180,"w":76,"h":49},"Code":"C_3","BColor":"#123456","IsBColor":true,"Border":"solid 1px #123456","IsBorder":true,"SelectedColor":"#123456","IsSelected":true,"IsShow":true,"Flag":true},{"Id":1587482165833,"Position":{"x":235,"y":131,"x2":302,"y2":180,"w":67,"h":49},"Code":"C_4","BColor":"#123456","IsBColor":true,"Border":"solid 1px #123456","IsBorder":true,"SelectedColor":"#123456","IsSelected":true,"IsShow":true,"Flag":true}];
var src = 'https://images1.ipsosinteractive.com/ABC_VIETNAM/images/2020 - Projects/2020XXX_CMI_AVENGERS/concepts/concept_test.png';
var FilterCodes = '';	//过滤集合 string类型   "1,2,3,4"
var clearId = ''; //清除互斥的答案

Array.prototype.indexOf = function(id) {
	var _self = this;
	for(var i = 0; i < _self.length; i++) {
		if(_self[i].Id == id) {
			return i;
		}
	}
	return -1;
};
Array.prototype.indexOfByCode = function(code) {
	var _self = this;
	for(var i = 0; i < _self.length; i++) {
		if(_self[i] == code) {
			return i;
		}
	}
	return -1;
};
//删除匹配项
Array.prototype.removeCode = function(code) {
	var flag = false;
	for(var i = 0; i < this.length; i++) {
		if(this[i] === code) {
			this.splice(i, 1);
			flag = true;
			break;
		}
	}
	return flag;
}
//状态变换
Array.prototype.ReplaceStatus = function(code, flag) {
	var _self = this;
	var tempArray = [];
	for(var i = 0; i < _self.length; i++) {
		if(_self[i].Code == code) {
			_self[i].Flag = flag;
		}
	}
};
var imgPoint = null;

var targetId = '';
//目标显示位置ID
var resultId = "ljxljjl";

$(function($) {
	FilterCodes = $("input.mrEdit:eq(1)") ? $("input.mrEdit:eq(1)").val() : '';

	if(!imgPoint)
		imgPoint = new ImagePointer(src, arr, resultId);
	$("#"+clearId).click(function() {
		imgPoint.ClearAll();
	});
});
function ImagePointer() {
	//集合
	this.Positions = [];
	//答案集合
	this.SelectCode = [];
	//答案集合 tostring
	this.Result = "";
	this.ResultId = '';
	this.FilterCodes = '';
	this.FilterCodesArray = [];
	this.isRadioMode = false; //单选模式
	
	//当前的Position
	this.ThisObject = {
		Id : null,                       //唯一标记
		Position : {
			x : null,
			y : null,
			x2 : null,
			y2 : null,
			w : null,
			h : null
		},
		Code : null,                   //答案值
		BColor : '',                       //背景色
		Border : '',                        //边框颜色
		IsBColor : true,                       //是否显背景色
		IsBorder : true,                       //是否显示边框
		SelectedColor : '',                      //选中颜色
		IsSelected : true,                       //是否显示选中以后颜色
		IsShow : true,                //默认显示
		Flag : true //已被选择标记
	};
	//保存著所有生成的div
	this.Content = null;
	if(arguments[1]) {
		this.Positions = eval(arguments[1]);
	}
	if(arguments[2]) {
		this.ResultId = arguments[2];
	}

	if(FilterCodes) {
		this.FilterCodes = FilterCodes;
		this.FilterCodesArray = FilterCodes.split(',');
	}

	//初始化
	this.ImageSrc = arguments ? arguments[0] : '';
	this.init(this.ImageSrc);
	this.CreateContent();
}

//初始化模板
ImagePointer.prototype.init = function() {
	this.Content = document.createElement('div');
	$(this.Content).attr('id', 'DivImage');
	this.Content.style.position = 'relative';
	if(arguments[0]) {
		var img = document.createElement('img');
		img.src = arguments[0];
		this.Content.appendChild(img);
	}
}
//创建
ImagePointer.prototype.Create = function() {
	if(this.Positions.length > 0) {
		$(this.Content).find('div').remove();
		for(var i = 0; i < this.Positions.length; i++) {
			var obj = this.Positions[i];
			if(this.FilterCodesArray.indexOfByCode(obj.Code) > -1)
				continue;
			if(!obj.IsShow)
				continue;
			var div = document.createElement('div');
			div.Id = obj.Id
			$(div).attr('name', obj.Code);
			$(div).attr('id', obj.Id);
			$(div).css({
				'position' : 'absolute',
				'backgroundColor' : obj.BColor ? obj.BColor : '#fff',
				'opacity' : obj.BColor ? '0.6' : '0',
				'border' : obj.Border,
				'top' : obj.Position.y + "px",
				'left' : obj.Position.x + "px",
				'width' : obj.Position.w + "px",
				'height' : obj.Position.h + 'px',
				'zIndex' : '999999',
				'cursor' : 'pointer'
			})
			if(arguments[0]) {
				div.onclick = arguments[0];
			} else {
				var that = this;
				div.onclick = function() {
					if(that.Positions.indexOf(this.Id) > -1) {
						var index = that.Positions.indexOf(this.Id);
						obj = that.Positions[index];
						that.ObjClick(obj);
					}

				};
			}
			this.Content.appendChild(div);
		};
	}
};
//单机生成后的事件
ImagePointer.prototype.ObjClick = function() {
	if(arguments[0]) {
		var obj = arguments[0];

		if(this.isRadioMode){
			this.ClearAll();
		}
		
		if(clearId) {
			var index = this.Positions.indexOf(clearId);
			if(index > -1) {
				var clear = this.Positions[index].Code;
				this.Positions[index].Flag = true;
				var tempObj = this.Positions[index];
				var opac = tempObj.BColor ? '0.6' : '0';
				$('#DivImage div[name="'+tempObj.Code+'"]').css({
					'backgroundColor' : tempObj.BColor ? tempObj.BColor : '#fff',
					'opacity' : opac
				});
				this.SelectCode.removeCode(clear);
			}

		}

		if(obj.Flag) {
			this.SelectCode.push(obj.Code);
			if(obj.IsSelected)
				$('#DivImage div[name="'+obj.Code+'"]').css({
					'backgroundColor' : obj.SelectedColor,
					'opacity' : '0.6'
				});
			if(clearId) {
				if(obj.Id == clearId)
					return false;
			}
			this.Positions.ReplaceStatus(obj.Code, !obj.Flag);

		} else {
			this.SelectCode.removeCode(obj.Code);
			this.Positions.ReplaceStatus(obj.Code, !obj.Flag);
			var opac = obj.BColor ? '0.6' : '0';
			$('#DivImage div[name="'+obj.Code+'"]').css({
				'backgroundColor' : obj.BColor ? obj.BColor : '#fff',
				'opacity' : opac
			});
		}
		$('#DivImage div[id="'+obj.Id+'"]').focus();
		this.Result = this.SelectCode.toString();
		this.GetResult();
	}

};
//取结果
ImagePointer.prototype.GetResult = function() {
	$("input.mrEdit:eq(0)").val(this.Result);
}
//创建模板
ImagePointer.prototype.CreateContent = function() {
	this.Create();
	
	$('span[class="mrQuestionText"]').parent().append('<div id="IsView"></div>');
	$("#IsView")[0].appendChild(this.Content);
};
//清空
ImagePointer.prototype.ClearAll = function() {
	if(this.Positions) {
		var clear = null;
		var index = this.Positions.indexOf(clearId);
		if(index > -1){
						clear = this.Positions[index].Code;
		}
		for(var i = 0; i < this.Positions.length; i++) {
			if(this.Positions[i].Id == clearId) continue;
			this.Positions[i].Flag = true;
			var obj = this.Positions[i];
			var opac = obj.BColor ? '0.6' : '0';
			$('#DivImage div[name="'+obj.Code+'"]').css({
				'backgroundColor' : obj.BColor ? obj.BColor : '#fff',
				'opacity' : opac
			});
		};
		this.SelectCode = [];
		//重置
		if(clear)
		this.Result = clear;
		else
		this.Result = "";
		this.GetResult();
	}
};

			