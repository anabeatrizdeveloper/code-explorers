const backClouds = document.querySelector(".cloud-back");
const frontClouds = document.querySelector(".cloud-front");

function moveClouds() {
  const scrollY = window.scrollY;

  if (backClouds) {
    backClouds.style.transform = `translateY(${scrollY * 0.12}px) translateX(${scrollY * -0.04}px)`;
  }

  if (frontClouds) {
    frontClouds.style.transform = `translateY(${scrollY * 0.2}px) translateX(${scrollY * 0.06}px)`;
  }
}

window.addEventListener("scroll", moveClouds);
window.addEventListener("load", moveClouds);