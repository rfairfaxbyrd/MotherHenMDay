let canvas = document.getElementById("scratchCard");
let ctx = canvas.getContext("2d");

// Image and scratch layer setup
let img = new Image();
img.src = "MotherHen.png";  // Ensure the correct path
let scratchLayer = document.createElement("canvas");
let scratchCtx = scratchLayer.getContext("2d");

img.onload = function () {
    console.log("✅ Image loaded successfully!");

    // Set canvas size to match the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;
    scratchLayer.width = img.width;
    scratchLayer.height = img.height;

    // Draw the image first on the main canvas (background layer)
    ctx.globalCompositeOperation = "source-over";  // Default mode to draw the image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw the gray scratch layer on the scratch canvas without opacity
    scratchCtx.fillStyle = "gray";  // No opacity, solid gray color
    scratchCtx.fillRect(0, 0, scratchLayer.width, scratchLayer.height);

    // Draw the scratch layer on top of the image in the main canvas
    ctx.drawImage(scratchLayer, 0, 0);
};

// Scratch effect settings
let isDrawing = false;

function scratch(e) {
    if (!isDrawing) return;

    let rect = canvas.getBoundingClientRect();
    let x = (e.offsetX || e.touches?.[0]?.clientX - rect.left) * (canvas.width / rect.width);
    let y = (e.offsetY || e.touches?.[0]?.clientY - rect.top) * (canvas.height / rect.height);

    // Ensure correct drawing and erasing behavior
    scratchCtx.globalCompositeOperation = "destination-out";  // Erase from the scratch layer
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 250, 0, Math.PI * 2);  // Large brush for quick reveal
    scratchCtx.fill();

    // Redraw the updated scratch layer on top of the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas to redraw
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  // Draw the image again
    ctx.drawImage(scratchLayer, 0, 0);  // Draw the updated scratch layer
}

// Mouse events for desktop
canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", scratch);

// Touch events for mobile
canvas.addEventListener("touchstart", () => isDrawing = true);
canvas.addEventListener("touchend", () => isDrawing = false);
canvas.addEventListener("touchmove", scratch);
