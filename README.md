# canvasDrawingJS
Responsive JS Wrapper to allow drawing in a canvas with the mouse or touching the screen. It can be used either on a desktop, a tablet or a smartphone and render img to the wanted size even on small screen

### How to use

- import canvasDrawing.js in the file you need it
- create a new instance of the plugin calling ```new CanvasDrawing.CanvasDrawing(elt,width,height);```
- store the result to be able to call plugin's methods

### Dependance

If you want to be able to export the image drawn, you have to import that library provided by gillyb : [gillyb/reimg](https://github.com/gillyb/reimg)

### Methods

- ```setColor(rgb)``` : set color used to draw
- ```getColor()``` : return the currently color used to draw
- ```setSize(px)``` : set the size used to draw
- ```getSize()``` : return the currently color used to draw
- ```getImg()``` : return the image drawn (need 'reimg', see *Dependance*)
- ```getContext()``` : return the canvas context
- ```setImgSrc(url)``` : set the background image used
- ```setImgFromVideo(videoElement)``` : set the background img from a video element
- ```setImgFromDataUrl(dataUrl)``` : set the background img from a dataUrl
- ```clear()``` : clear the canvas
- ```triggerResize()``` : usefull when the plugin was created with a display to none

### Examples

Examples are availables in the *examples* directory

### Requests

Feel free to ask for request or to do pull request if you think you've improved the plugin

## License  
This piece of software is issued under the GNU GENERAL PUBLIC LICENSE. You can view the license [here](https://github.com/A2SI-RFID/canvasDrawingJS/blob/master/LICENSE)
