/*===== MENU SHOW Y HIDDEN =====*/ 
const navMenu = document.getElementById('nav-menu'),
      toggleMenu = document.getElementById('nav-toggle'),
      closeMenu = document.getElementById('nav-close')

/*SHOW*/ 
toggleMenu.addEventListener('click', ()=>{
    navMenu.classList.toggle('show')
})

/*HIDDEN*/
closeMenu.addEventListener('click', ()=>{
    navMenu.classList.remove('show')
})

/*===== ACTIVE AND REMOVE MENU =====*/
const navLink = document.querySelectorAll('.nav__link');   

function linkAction(){
  /*Active link*/
  navLink.forEach(n => n.classList.remove('active'));
  this.classList.add('active');
  
  /*Remove menu mobile*/
  navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction));



document.addEventListener("DOMContentLoaded", function() {
  emailjs.init("p-tIAps-4lC9Ab4ix");
  console.log(emailjs);

});


function sendMail() {
  let parms = {
    name : document.getElementById("name").value,
    email : document.getElementById("email").value,
    phone : document.getElementById("phone").value,
    message : document.getElementById("message").value,
  }
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<div class="spinner"></div>';
    submitButton.disabled = true;

    emailjs.send('service_7l8ezu9', 'template_hz2gpqy', parms)
        .then(function() {
            alert('Message sent successfully!');
            document.getElementById('contactForm').reset();
        }, function(error) {
          console.log(error);
            alert('Failed to send message. Please try again.');
        })
        .finally(function() {
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });

    }