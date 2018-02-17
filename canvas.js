function signatureCapture() {
	let canvas = document.getElementById("signatureCanvas");
	let context = canvas.getContext("2d");
	
	canvas.height = 150 ;
	canvas.width = 350 ;

	context.fillStyle = "#fff";
	context.strokeStyle = "#343A40";
	context.lineWidth = 1.6;
	context.lineCap = "round";

	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#3a87ad";
	context.strokeStyle = "#3a87ad";
	context.lineWidth = 1.5;
	context.moveTo(20,220);
	context.lineTo(454,220);
	context.stroke();

	context.fillStyle = "#fff";
	context.strokeStyle = "#444";
	
	let disableSave = true;
	let pixels = [];
	let cpixels = [];
	let xyLast = {};
	let xyAddLast = {};
	let calculate = false;

	{
		
		function remove_event_listeners() {
			canvas.removeEventListener('mousemove', on_mousemove, false);
			canvas.removeEventListener('mouseup', on_mouseup, false);
			canvas.removeEventListener('touchmove', on_mousemove, false);
			canvas.removeEventListener('touchend', on_mouseup, false);

			document.body.removeEventListener('mouseup', on_mouseup, false);
			document.body.removeEventListener('touchend', on_mouseup, false);
		}
		function get_board_coords(e) {
			let x, y;

			if (e.changedTouches && e.changedTouches[0]) {
				let offsety = canvas.offsetTop || 0;
				let offsetx = canvas.offsetLeft || 0;
				x = e.changedTouches[0].pageX - offsetx;
				y = e.changedTouches[0].pageY - offsety;
			} else if (e.layerX || 0 == e.layerX) {
				x = e.layerX;
				y = e.layerY;
			} else if (e.offsetX || 0 == e.offsetX) {
				x = e.offsetX;
				y = e.offsetY;
			}
			return {
				x : x,
				y : y
			};
		}
		function on_mousedown(e) {
			e.preventDefault();
			e.stopPropagation();
			
			canvas.addEventListener('mousemove', on_mousemove, false);
			canvas.addEventListener('mouseup', on_mouseup, false);
			canvas.addEventListener('touchmove', on_mousemove, false);
			canvas.addEventListener('touchend', on_mouseup, false);

			document.body.addEventListener('mouseup', on_mouseup, false);
			document.body.addEventListener('touchend', on_mouseup, false);

			empty = false;
			let xy = get_board_coords(e);
			context.beginPath();
			pixels.push('moveStart');
			context.moveTo(xy.x, xy.y);
			pixels.push(xy.x, xy.y);
			xyLast = xy;
		}

		function on_mousemove(e, finish) {
			//e.preventDefault();
			
			let xy = get_board_coords(e);
			let xyAdd = {
				x : (xyLast.x + xy.x) / 2,
				y : (xyLast.y + xy.y) / 2
			};

			if (calculate) {
				let xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
				let yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
				pixels.push(xLast, yLast);
			} else {
				calculate = true;
			}

			context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
			pixels.push(xyAdd.x, xyAdd.y);
			context.stroke();
			context.beginPath();
			context.moveTo(xyAdd.x, xyAdd.y);
			xyAddLast = xyAdd;
			xyLast = xy;

		}

		function on_mouseup(e) {
			remove_event_listeners();
			disableSave = false;
			context.stroke();
			pixels.push('e');
			calculate = false;
		}
	}
	canvas.addEventListener('mousedown', on_mousedown, false);
	canvas.addEventListener('touchmove', on_mousedown, false);
}
function signatureClear() {
	const canvas = document.getElementById("signatureCanvas");
	const context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}





