document.addEventListener("DOMContentLoaded", () => {
  // Check if the scroll-to-top button exists
  const scrollToTopButton = document.getElementById('scroll-to-top');
  if (scrollToTopButton) {
    // Add event listener to scroll-to-top button
    scrollToTopButton.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default anchor behavior
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scroll to top
      });
      console.log("Scroll to top button clicked");
    });
  } else {
    console.error("Scroll-to-top button not found");
  }

  // Existing theme toggle logic and other code goes here...
});

document.documentElement.setAttribute("data-theme", localStorage.getItem('light-mode') === 'active' ? 'light' : 'dark');

document.addEventListener("DOMContentLoaded", () => {
  let lightmode = localStorage.getItem('light-mode');
  const themeSwitch = document.getElementById('theme-switch');

  // Function to enable light mode
  const enablelightmode = () => {
    console.log("light mode on");
    document.body.classList.add('light-mode');
    localStorage.setItem('light-mode', 'active');
    document.documentElement.setAttribute("data-theme", "light");

    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    document.getElementById('main-id').classList.add('light-theme');
    document.getElementById('main-id').classList.remove('dark-theme');

    document.querySelector('.navbar').classList.add('navbar-light', 'light-theme');
    document.querySelector('.navbar').classList.remove('navbar-dark', 'dark-theme');
    document.getElementById('theme-toggle').classList.add('text-light-theme');
    document.getElementById('theme-toggle').classList.remove('text-dark-theme');
    document.getElementById('profile-toggle').classList.add('text-light-theme');
    document.getElementById('profile-toggle').classList.remove('text-dark-theme');
    document.getElementById('profile-invert').style.filter = 'invert(0)';
    document.getElementById('profile-invert2').style.filter = 'invert(1)';
    document.querySelector('.profile-invert3').style.filter = 'invert(0)';

    document.querySelector('.foot-theme').classList.remove('dark-theme-footer');
    document.querySelector('.foot-theme').classList.add('light-theme-footer');
    document.getElementById('profile-invert4').style.filter = 'invert(0)';
    document.getElementById('profile-invert5').style.filter = 'invert(0)';
    document.getElementById('change-bg2').classList.add('light-mycontainer-contact-us');
  };

  // Function to disable light mode (enable dark mode)
  const disablelightmode = () => {
    console.log("light mode off");
    document.body.classList.remove('light-mode');
    localStorage.setItem('light-mode', '');
    document.documentElement.setAttribute("data-theme", "dark");

    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    document.getElementById('main-id').classList.add('dark-theme');
    document.getElementById('main-id').classList.remove('light-theme');

    document.querySelector('.navbar').classList.add('navbar-dark', 'dark-theme');
    document.querySelector('.navbar').classList.remove('navbar-light', 'light-theme');
    document.getElementById('theme-toggle').classList.add('text-dark-theme');
    document.getElementById('theme-toggle').classList.remove('text-light-theme');
    document.getElementById('profile-toggle').classList.add('text-dark-theme');
    document.getElementById('profile-toggle').classList.remove('text-light-theme');

    document.getElementById('profile-invert').style.filter = 'invert(1)';
    document.getElementById('profile-invert2').style.filter = 'invert(0)';
    document.querySelector('.profile-invert3').style.filter = 'invert(1)';
    document.querySelector('.foot-theme').classList.remove('light-theme-footer');
    document.querySelector('.foot-theme').classList.add('dark-theme-footer');
    document.getElementById('profile-invert4').style.filter = 'invert(1)';
    document.getElementById('profile-invert5').style.filter = 'invert(1)';
    document.getElementById('change-bg2').classList.remove('light-mycontainer-contact-us');
  };

  // Check if light mode is active on page load
  if (lightmode === 'active') enablelightmode();

  // Add event listener to themeSwitch button
  if (themeSwitch) {
    themeSwitch.addEventListener("click", () => {
      console.log("Theme switch clicked");
      lightmode = localStorage.getItem('light-mode');
      lightmode !== 'active' ? enablelightmode() : disablelightmode();
    });
  } else {
    console.error('themeSwitch button not found');
  }
});

//   My old code(sr)

// function addNewPerson() {
//   console.log("lets");

//   let temp = "new";

//   document.getElementById('add-new-cards').innerHTML += `<div style="width: 370px" class="card m-4">
//         <img style="width: 100%" src="Images/person-1.png" alt="" class="card-img-top" />
//         <div class="card-body text-dark">
//           <h4 class="card-title">Mr. New Scheduler</h4>
//           <p class="card-text">
//             Some example text some example text. Jane Doe is an architect
//             and engineer
//           </p>
//           <div class="d-flex flex-column g-1">
//             <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#profile-modal">See Profile</a>
//             <a href="#" class="btn btn-success mt-3" data-toggle="modal" data-target="#book-modal">Book
//               Appoinment</a>

//           </div>
//         </div>
//       </div>`
// }


