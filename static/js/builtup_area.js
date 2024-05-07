(function() {
document.addEventListener("DOMContentLoaded", function() {
    const slider = document.getElementById("slider");
    const image = document.getElementById("image");
    const yearDisplay = document.getElementById("year-display");

    const imagePaths = ["static/images/1975.png", "static/images/1990.png", "static/images/2005.png", "static/images/2020.png"];

    // function to update the image and year
    function updateImageAndYear() {
        const index = (slider.value - 1975) / 15; // calculate the index of the image path according to year
        const year = slider.value;
        const imageUrl = imagePaths[index];
        image.src = imageUrl;
        yearDisplay.textContent = year;
    }

    // call the update function while initailizing
    updateImageAndYear();

    // monitor the change of the slider
    slider.addEventListener("input", updateImageAndYear);
});
})();