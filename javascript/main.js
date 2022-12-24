document.addEventListener("DOMContentLoaded", start);

let gl;

function start() {
  console.log("Game started!");

  const canvas = document.getElementById("renderCanvas");
  gl = canvas.getContext("webgl2");

  const triangeVertices = [1.0, -1.0, 0.0, 0.0, 1.0, 0.0, -1.0, -1.0, 0.0];

  const triangleVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangeVertices),
    gl.STATIC_DRAW
  );

  const triangleColors = [
    1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
  ];

  const triangleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleColors),
    gl.STATIC_DRAW
  );

  const triangleVerticesAndColors = [
    1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, -1.0,
    -1.0, 0.0, 0.0, 0.0, 1.0, 1.0,
  ];

  const triangleVertexPositionAndColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionAndColorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVerticesAndColors),
    gl.STATIC_DRAW
  );

  const vertexShader = getAndCompileShader("vertexShader");
  const fragmentShader = getAndCompileShader("fragmentShader");
  

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  const positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "position"
  );

  const vertexArrayObject = gl.createVertexArray();
  gl.bindVertexArray(vertexArrayObject);

  gl.enableVertexAttribArray(positionAttributeLocation);
  // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
  // gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)

  const colorAttributeLocation = gl.getAttribLocation(shaderProgram, "color");
  gl.enableVertexAttribArray(colorAttributeLocation);
  // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  // gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0)
  const FLOAT_SIZE = 4;
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionAndColorBuffer);
  gl.vertexAttribPointer(
    positionAttributeLocation,
    3,
    gl.FLOAT,
    false,
    7 * FLOAT_SIZE,
    0
  );
  gl.vertexAttribPointer(
    colorAttributeLocation,
    4,
    gl.FLOAT,
    false,
    7 * FLOAT_SIZE,
    3 * FLOAT_SIZE
  );

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not link shaders!");
  }

  requestAnimationFrame(runRenderLoop);

  function runRenderLoop() {
   
    gl.clearColor(1,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);
    gl.drawArrays(gl.TRIANGLES, 0, 3);


    requestAnimationFrame(runRenderLoop);
  }
}

function getAndCompileShader(id) {
  let shader;
  const shaderElement = document.getElementById(id);
  const shaderText = shaderElement.textContent.trim();

  if (id == "fragmentShader") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }

  gl.shaderSource(shader, shaderText);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}
