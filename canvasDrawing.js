var CanvasDrawing = {
    /**
     * Library version
     * @type Number
     */
    version: 1.0,
    /**
     *
     * @param {Div} elt
     * @param {int} width
     * @param {int} height
     * @param {object} optional canvas parameters
     * @returns {CanvasDrawing}
     */
    CanvasDrawing: function (elt, width, height, params) {
        
        var defaultParams  = {
            background_color : "#ffffff"
        };
        var canvasParams = Object.assign({}, defaultParams, params);
	/* begin vars */
	var elt = elt;
	var width = width;
	var height = height;
	var curColor = "#000000";
	var curSize = "5";
	var curRatio = 1;
	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var clickColor = new Array();
	var clickSize = new Array();
	var paint = false;
	var canvas = null;
	var context = null;
	var img = null;
	/* end vars */

	/* Private function */
	/**
	 * Resize canvas depending on available space
	 * @returns {undefined}
	 */
	function resizeCanvas() {
	    canvas.width = canvas.clientWidth;
	    canvas.height = 0.75 * canvas.width;
	    curRatio = canvas.width / width;
	    redraw();
	}
	/**
	 * Callback for touch or click release
	 * @param {event} e
	 * @returns {undefined}
	 */
	var release = function (e) {
	    paint = false;
	    // Prevent the whole page from dragging if on mobile
	    e.preventDefault();
	};
	/**
	 * Callback for click or touch get out of canvas
	 * @param {event} e
	 * @returns {undefined}
	 */
	var cancel = function (e) {
	    paint = false;
	    // Prevent the whole page from dragging if on mobile
	    e.preventDefault();
	};
	/**
	 * Callback for click or touch
	 * @param {event} e
	 * @returns {undefined}
	 */
	var press = function (e) {
	    // Mouse down location either touch or click
	    var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft;
	    var mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
	    paint = true;
	    addClick(mouseX, mouseY, false);
	    redraw();
	    // Prevent the whole page from dragging if on mobile
	    e.preventDefault();
	};
	/**
	 * Callback for touch or click move on canvas
	 * @param {type} e
	 * @returns {undefined}
	 */
	var drag = function (e) {
	    if (paint) {
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft;
		var mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
		addClick(mouseX, mouseY, true);
		redraw();
	    }

	    // Prevent the whole page from dragging if on mobile
	    e.preventDefault();
	};
	/**
	 * Add a click in the arrays
	 * @param {int} x
	 * @param {int} y
	 * @param {bool} dragging
	 * @returns {undefined}
	 */
	function addClick(x, y, dragging)
	{
	    // push coord modified with the ratio
	    clickX.push(x / curRatio);
	    clickY.push(y / curRatio);
	    // drag state
	    clickDrag.push(dragging);
	    // add current color
	    clickColor.push(curColor);
	    // add current size
	    clickSize.push(curSize);
	}

	/**
	 * Redraw the canvas
	 * @param {type} useRatio
	 * @returns {undefined}
	 */
	function redraw(useRatio) {
	    // verify if useRatio is set and set default value
	    if (typeof useRatio === "undefined") {
		useRatio = true;
	    }

	    // calc the ratio to use depending on useRatio
	    var ratio = 1;
	    if (useRatio) {
		ratio = curRatio;
	    }

	    // canvas clearing
	    context.restore();
	    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	    context.save();

	    // if we have an image we draw it
	    if (img !== null) {
		// we scale the image on the canvas size
		context.drawImage(img, 0, 0, canvas.width, canvas.height);
	    }
            else {
                if (canvasParams.background_color !== null)
                {
                    // Positionnement d'un rectablge de couleur backgroungColor sous le dessin du canvas pour ne pas avoir de fond noir à la génération de l'image
                    context.globalAlpha = 1;
                    context.fillStyle = canvasParams.background_color;
                    context.fillRect(0, 0, width, height);
                }
            }

	    // set lineJoin property
	    context.lineJoin = "round";

	    // for each click stored in arrays
	    for (var i = 0; i < clickX.length; i++) {
		// begin the path
		context.beginPath();

		// if it's not the first point it is draggin
		if (clickDrag[i] && i) {
		    // we move to the previous point
		    context.moveTo((clickX[i - 1]) * ratio, (clickY[i - 1]) * ratio);
		} else {
		    // else we move to the current point
		    context.moveTo((clickX[i]) * ratio, (clickY[i]) * ratio);
		}
		// create the line to the current point
		context.lineTo((clickX[i]) * ratio, (clickY[i]) * ratio);
		// close the path
		context.closePath();
		// set stroke color and line width
		context.strokeStyle = clickColor[i];
		context.lineWidth = clickSize[i] * (useRatio ? ratio : 1);
		// draw the line
		context.stroke();
	    }

	}

	/* end private function */

	// create canvas and add to the elt
	canvas = document.createElement('canvas');
	context = canvas.getContext('2d');
	canvas.height = height;
	canvas.width = width;
	canvas.classList.add("canvasDrawing");
	elt.appendChild(canvas);
	resizeCanvas();



	// bind event
	// resize
	window.addEventListener("resize", resizeCanvas);

	// drawing
	canvas.addEventListener("mousedown", press, false);
	canvas.addEventListener("touchstart", press, false);
	canvas.addEventListener("mousemove", drag, false);
	canvas.addEventListener("touchmove", drag, false);
	canvas.addEventListener("mouseup", release);
	canvas.addEventListener("touchend", release, false);
	canvas.addEventListener("mouseout", cancel, false);
	canvas.addEventListener("touchcancel", cancel, false);

	/* begin methods */
	/**
	 * Set the current color to use
	 * @param {string} color
	 * @returns {undefined}
	 */
	this.setColor = function (color) {
	    curColor = color;
	};

	/**
	 * Set the current size to use
	 * @param {int} size
	 * @returns {undefined}
	 */
	this.setSize = function (size) {
	    curSize = parseInt(size);
	};

	/**
	 * Return the current color used
	 * @returns {color|String}
	 */
	this.getColor = function () {
	    return curColor;
	};

	/**
	 * Return the current size used
	 * @returns {size|Int}
	 */
	this.getSize = function () {
	    return parseInt(curSize);
	};

	/**
	 * return the canvas context
	 * @returns {CanvasDrawing.CanvasDrawing.context}
	 */
	this.getContext = function () {
	    return context;
	};

	/**
	 * Return the image base64 value using the ReImg library
	 * @returns {string}
	 */
	this.getImg = function () {
	    // if ReImg is not available => throw error
	    if (typeof ReImg === "undefined") {
		throw "You need ReImg to use getImg";
	    }

	    // store temp size
	    var tmpWidth = canvas.width;
	    var tmpHeight = canvas.height;

	    // set canvas to expected size
	    canvas.width = width;
	    canvas.height = height;
	    // redraw without the ratio
	    redraw(false);
	    // get base64 value
	    var img = ReImg.fromCanvas(canvas).toBase64();
	    // restore canvas size
	    canvas.width = tmpWidth;
	    canvas.height = tmpHeight;
	    // redraw with ratio
	    redraw();

	    return img;
	};

	/**
	 * set the background image source
	 * @param {string} imgSrc
	 * @returns {undefined}
	 */
	this.setImgSrc = function (imgSrc) {
	    // create the image
	    img = new Image();
	    // allow cross server request
	    img.setAttribute('crossOrigin', 'anonymous');
	    // set source
	    img.src = imgSrc;
	    // redraw after the image loaded
	    img.onload = redraw;
	};

	/**
	 * Set image from a video tag
	 * @param {videoDOMElement} src
	 * @returns {undefined}
	 */
	this.setImgFromVideo = function (src) {
	    // get the tmp dataUrl
	    var tmp = document.createElement("canvas");
	    tmp.width = width;
	    tmp.height = height;

	    var scale = (((src.clientWidth * (height / src.clientHeight)) > width) ? (width / src.clientWidth) : (height / src.clientHeight));
	    var dx = (width - (src.clientWidth * scale)) / 2;
	    var dy = (height - (src.clientHeight * scale)) / 2;
	    var dw = (src.clientWidth * scale) ;
	    var dh = (src.clientHeight * scale);

	    tmp.getContext('2d').drawImage(src, dx, dy, dw, dh);



	    // get dataUrl
	    var dataUrl = tmp.toDataURL();

	    // create the image
	    img = new Image();
	    // set source
	    img.src = dataUrl;
	    // redraw after the image loaded
	    img.onload = redraw;
	};

	/**
	 * Set img from dataUrl
	 * @param {String} data
	 * @returns {undefined}
	 */
	this.setImgFromDataUrl = function (data) {
	    img = new Image();
	    img.src = data;
	    img.onload = redraw;
	};

	/**
	 * clear the actual drawing
	 * @returns {undefined}
	 */
	this.clear = function () {
	    // clear arrays
	    clickX = new Array();
	    clickY = new Array();
	    clickDrag = new Array();
	    clickColor = new Array();
	    clickSize = new Array();
	    // remove the image
	    img = null;
	    // redraw in the canvas
	    redraw();
	};

	/**
	 * Trigger a resize
	 * @returns {undefined}
	 */
	this.triggerResize = function () {
	    resizeCanvas();
	};
	/* end methods */
    }
};
