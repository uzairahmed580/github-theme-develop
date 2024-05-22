const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("KYX_navbar");
const navbar_div = document.getElementById("KYX_navbar_div");
const closebtn = document.getElementById("close");
const searchIcon = document.getElementById("search");
const searchBar = document.getElementById("searchBar");
const companyLogo = document.getElementById("company_logo");
const searchClose = document.getElementById("cancel");
const product = document.getElementById("toggle");
const btn = document.getElementById("showHide");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navbar.classList.add("active");
    navbar_div.classList.add("active");
    hamburger.classList.add("active");
    closebtn.classList.add("active");
  });
}

if (closebtn) {
  closebtn.addEventListener("click", () => {
    navbar.classList.remove("active");
    navbar_div.classList.remove("active");
    hamburger.classList.remove("active");
    closebtn.classList.remove("active");
  });
}

if (searchIcon) {
  searchIcon.addEventListener("click", () => {
    searchIcon.classList.add("active");
    searchBar.classList.add("active");
    companyLogo.classList.add("active");
    searchClose.classList.add("active");
  });
}

if (searchClose) {
  searchClose.addEventListener("click", () => {
    searchIcon.classList.remove("active");
    searchBar.classList.remove("active");
    companyLogo.classList.remove("active");
    searchClose.classList.remove("active");
  });
}

if (product) {
  function toggleView() {
    if (product.style.display !== "block") {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
    if (btn.innerHTML == "VIEW DETAILS") {
      btn.innerHTML = "HIDE DETAILS";
    } else btn.innerHTML = "VIEW DETAILS";
  }
}

function togglePopup() {
  document.getElementById("popup1").classList.toggle("active");
}

function togglePopup1() {
  document.getElementById("firstPage").classList.toggle("disActive");
  document.getElementById("page2").classList.toggle("active");
  document.getElementById("image").classList.toggle("active");
}

function toggleButton1() {
  document.getElementById("firstToggleDiv").classList.toggle("toggleOn");
  document.getElementById("secondToggleDiv").classList.toggle("toggleOn");
}

function toggleButton2() {
  document.getElementById("thirdToggleDiv").classList.toggle("toggleOn");
  document.getElementById("fourthToggleDiv").classList.toggle("toggleOn");
}

let icon = document.querySelector("i");
icon.onclick = function () {
  icon.classList.toggle("active");
};
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
  document.getElementById("myDropdownMobile").classList.toggle("show");
}

function changeContent(contentId) {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    // Remove active class from all titles
    var titles = document.querySelectorAll(".toggleContainer .style");

    // Add active class to selected title
    var selectedTitle = document.querySelector(
      ".toggleContainer .style[onclick=\"changeContent('" +
      contentId +
      "')\"]"
    );

    if ([...selectedTitle.classList].includes("active")) {
      selectedTitle.classList.remove("active");
    } else {
      titles.forEach(signleTile => {
        signleTile.classList.remove("active");
      })

      selectedTitle.classList.add("active");
    }

    // Show selected content and hide others
    var contents = document.querySelectorAll(".contents .content");
    for (var j = 0; j < contents.length; j++) {

      if (contents[j].id == contentId) {
        if ([...contents[j].classList].includes("active")) {
          contents[j].classList.remove("active");
        } else {
          contents[j].classList.add("active");
        }
      } else {
        contents[j].classList.remove("active");
      }
    }

  } else {
    // Remove active class from all titles
    var titles = document.querySelectorAll(".toggleContainer .style");
    for (var i = 0; i < titles.length; i++) {
      titles[i].classList.remove("active");
      titles[i].style.backgroundColor = "";
    }

    // Add active class to selected title
    var selectedTitle = document.querySelector(
      ".toggleContainer .style[onclick=\"changeContent('" +
      contentId +
      "')\"]"
    );
    selectedTitle.classList.add("active");

    // Show selected content and hide others
    var contents = document.querySelectorAll(".contents .content");
    for (var j = 0; j < contents.length; j++) {
      contents[j].classList.remove("active");
      if (contents[j].id == contentId) {
        contents[j].classList.add("active");
      }
    }
  }
}

const heart = document.getElementById("heart");

if(heart != null) {
heart.addEventListener("click", function () {
  heart.classList.add("heart-red"); /* apply red color effect */
});
  
}
