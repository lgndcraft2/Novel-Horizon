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



// function orderNow(meal) {
//   const phoneNumber = "2349074304369";
//   const message = `Hello, I’d like to order ${meal}. Please confirm availability.`;
//   const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//   window.open(whatsappUrl, "_blank");
// };


// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let orderNote = localStorage.getItem('orderNote') || '';

// Update cart display on page load
window.onload = function() {
    updateCartDisplay();
    document.getElementById('order-note').value = orderNote;
};

function toggleCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.classList.toggle('minimized');
}

function addToCart(dishName, price) {
    // If item exists in cart, increment quantity, otherwise add it
    if (cart[dishName]) {
        cart[dishName].quantity += 1;
    } else {
        cart[dishName] = {
            price: price,
            quantity: 1
        };
    }
    
    // Save to localStorage
    saveCart();
    
    // Show success feedback
    showNotification(`Added ${dishName} to cart`);
}

function removeFromCart(dishName) {
    if (cart[dishName]) {
        cart[dishName].quantity -= 1;
        if (cart[dishName].quantity <= 0) {
            delete cart[dishName];
        }
        saveCart();
    }
    toggleCart();
}

function clearCart() {
    if (Object.keys(cart).length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = {};
        orderNote = '';
        localStorage.removeItem('orderNote');
        document.getElementById('order-note').value = '';
        saveCart();
        showNotification('Cart cleared');
    }
    toggleCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartCountSpan = document.getElementById('cart-count');
  const cartCountBubble = document.getElementById('cart-count-bubble');
  const cartTotalDiv = document.getElementById('cart-total');
  const cartContainer = document.getElementById('cart-container');
  
  // Clear current display
  cartItemsDiv.innerHTML = '';
  
  // Calculate totals
  let totalItems = 0;
  let totalPrice = 0;
  
  // Add each item to the display
  for (const [dishName, details] of Object.entries(cart)) {
      totalItems += details.quantity;
      totalPrice += details.price * details.quantity;
      
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
          <div class="cart-item-info">
              <div class="cart-item-name">${dishName}</div>
              <div class="cart-item-price">₦${details.price}</div>
          </div>
          <div class="cart-item-quantity">
              <button class="quantity-btn" onclick="removeFromCart('${dishName}')">-</button>
              <span>${details.quantity}</span>
              <button class="quantity-btn" onclick="addToCart('${dishName}', ${details.price})">+</button>
          </div>
      `;
      cartItemsDiv.appendChild(itemDiv);
  }
  
  // Show/hide cart based on items
  if (totalItems > 0) {
      cartContainer.classList.remove('hidden');
  } else {
      cartContainer.classList.add('hidden');
  }
  
  // Show empty cart message if no items
  if (totalItems === 0) {
      cartItemsDiv.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
  }
  
  // Update total items and price
  cartCountSpan.textContent = `(${totalItems} items)`;
  cartCountBubble.textContent = totalItems;
  cartTotalDiv.textContent = `Total: ₦${totalPrice}`;
}

// Handle order note changes
document.getElementById('order-note').addEventListener('input', function(e) {
    orderNote = e.target.value;
    localStorage.setItem('orderNote', orderNote);
});

function checkout() {
    if (Object.keys(cart).length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    const orderDetails = Object.entries(cart).map(([name, details]) => 
        `${name} x${details.quantity} (₦${details.price * details.quantity})`
    ).join('\n');
    
    const total = Object.entries(cart).reduce((sum, [_, details]) => 
        sum + (details.price * details.quantity), 0
    );
    
    const message = `Order Summary:\n\n${orderDetails}\n\nTotal: ₦${total}${orderNote ? '\n\nNote: ' + orderNote : ''}\nAdress is: `;
    
    // Here you could integrate with a payment gateway or send to your backend
    const phoneNumber = "2349074304369";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    alert(message);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
        zIndex: '1000',
        transition: 'opacity 0.3s ease'
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 1500);
}








document.addEventListener("DOMContentLoaded", function() {
  emailjs.init("p-tIAps-4lC9Ab4ix");
  console.log(emailjs);

});

document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const dotsContainer = document.querySelector('.dots-container');
  
  let currentIndex = 0;
  let interval;
  const slideInterval = 5000; // 5 seconds
  
  // Touch handling variables
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  let startTranslate = 0;
  
  // Create dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });
  
  const dots = document.querySelectorAll('.dot');
  
  function updateDots() {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }
  
  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
    resetInterval();
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(currentIndex);
  }
  
  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, slideInterval);
  }
  
  // Touch event handlers
  function handleTouchStart(e) {
    isDragging = true;
    touchStartX = e.touches[0].clientX;
    startTranslate = -currentIndex * 100;
    
    // Pause transitions during drag
    track.style.transition = 'none';
    
    // Clear auto-slide interval during touch
    clearInterval(interval);
  }
  
  function handleTouchMove(e) {
    if (!isDragging) return;
    
    touchEndX = e.touches[0].clientX;
    const diff = touchEndX - touchStartX;
    const newTranslate = startTranslate + (diff / track.offsetWidth * 100);
    
    // Add resistance at the edges
    if (currentIndex === 0 && diff > 0 || 
        currentIndex === slides.length - 1 && diff < 0) {
      track.style.transform = `translateX(${newTranslate / 3}%)`;
    } else {
      track.style.transform = `translateX(${newTranslate}%)`;
    }
  }
  
  function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    // Restore transitions
    track.style.transition = 'transform 0.3s ease';
    
    const diff = touchEndX - touchStartX;
    const threshold = track.offsetWidth * 0.2; // 20% of slide width
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        prevSlide();
      } else if (diff < 0 && currentIndex < slides.length - 1) {
        nextSlide();
      } else {
        goToSlide(currentIndex); // Reset to current slide
      }
    } else {
      goToSlide(currentIndex); // Reset to current slide if swipe wasn't far enough
    }
    
    // Restart auto-slide interval
    resetInterval();
  }
  
  // Add touch event listeners
  track.addEventListener('touchstart', handleTouchStart);
  track.addEventListener('touchmove', handleTouchMove);
  track.addEventListener('touchend', handleTouchEnd);
  
  // Existing click event listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });
  
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });
  
  // Start auto-sliding
  interval = setInterval(nextSlide, slideInterval);
  
  // Pause auto-sliding on hover
  track.addEventListener('mouseenter', () => clearInterval(interval));
  track.addEventListener('mouseleave', () => interval = setInterval(nextSlide, slideInterval));
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