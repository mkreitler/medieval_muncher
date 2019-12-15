jb.program = {
  test: function() {
    var testImage = null;

    jb.setBackColor("black");
    jb.clear();

    testImage =  jb.EZglyphs.generate(8, ShapeData.backTest.shapes, ShapeData.backTest.colors, 2/*, "#FFFF00"*/);
    jb.ctxt.drawImage(testImage, 0, 0);
  }
};




