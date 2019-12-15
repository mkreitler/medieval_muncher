var c = null;

c = document.createElement("canvas");
document.body.appendChild(c);

c.width = 100;
c.height = 100;
c.id = "testCanvas";

var ctxt = c.getContext('2d');

ctxt.fillStyle = "rgba(0, 0, 0, 255)";
ctxt.fillRect(0, 0, 100, 100);

//ctxt.globalAlpha = 0.1;
ctxt.fillStyle = "rgba(255, 128, 0, 0.1)";
ctxt.fillRect(25, 25, 50, 50);

//ctxt.globalAlpha = 255;

