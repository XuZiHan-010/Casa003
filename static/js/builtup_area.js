(function() {
document.addEventListener("DOMContentLoaded", function() {
    const slider = document.getElementById("slider");
    const image = document.getElementById("image");
    const yearDisplay = document.getElementById("year-display");

    const imagePaths = ["static/images/1975.png", "static/images/1990.png", "static/images/2005.png", "static/images/2020.png"];

    // 更新图片和年份显示函数
    function updateImageAndYear() {
        const index = (slider.value - 1975) / 15; // 根据年份计算索引
        const year = slider.value;
        const imageUrl = imagePaths[index];
        image.src = imageUrl;
        yearDisplay.textContent = year;
    }

    // 初始化时先调用一次更新函数
    updateImageAndYear();

    // 监听滑块变化
    slider.addEventListener("input", updateImageAndYear);
});
})();