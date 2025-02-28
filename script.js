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

// Handle address changes (formerly order note)
document.getElementById('order-note').addEventListener('input', function(e) {
  orderNote = e.target.value;
  localStorage.setItem('orderNote', orderNote);
});

function clearCart() {
  if (Object.keys(cart).length === 0) return;
  
  if (confirm('Are you sure you want to clear your cart?')) {
      cart = {};
      orderNote = '';
      localStorage.removeItem('orderNote');
      document.getElementById('order-note').value = '';
      saveCart();
      showToast('Cart cleared', 'success');
  }
  toggleCart();
}

function checkout() {
  if (Object.keys(cart).length === 0) {
      showToast('Your cart is empty', 'error');
      return;
  }
  
  // Validate delivery address
  if (!document.getElementById('order-note').value.trim()) {
      showToast('Please enter your delivery address', 'error');
      document.getElementById('order-note').focus();
      return;
  }
  
  const orderDetails = Object.entries(cart).map(([name, details]) => 
      `${name} x${details.quantity} (₦${details.price * details.quantity})`
  ).join('\n');
  
  const total = Object.entries(cart).reduce((sum, [_, details]) => 
      sum + (details.price * details.quantity), 0
  );
  
  const message = `Order Summary:\n\n${orderDetails}\n\nTotal: ₦${total}\n\nDelivery Address: ${orderNote}`;
  
  // Open WhatsApp with order details
  const phoneNumber = "2349074304369";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
  
  // Show success toast instead of alert
  showToast('Order placed successfully!', 'success');
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
      } else if (diff < 0) {
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
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    message: document.getElementById("message").value,
  }
  
  const submitButton = document.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.innerHTML = '<div class="spinner"></div>';
  submitButton.disabled = true;

  emailjs.send('service_7l8ezu9', 'template_hz2gpqy', parms)
    .then(function() {
      // Show toast notification instead of alert
      showToast('Message sent successfully!', 'success');
      document.getElementById('contactForm').reset();
    }, function(error) {
      console.log(error);
      // Show error toast instead of alert
      showToast('Failed to send message. Please try again.', 'error');
    })
    .finally(function() {
      // Restore button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

// Add this new function for toast notifications
function showToast(message, type = 'success') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Create toast content
  toast.innerHTML = `
    <div class="toast-icon">
      ${type === 'success' 
        ? '<ion-icon name="checkmark-circle"></ion-icon>' 
        : '<ion-icon name="alert-circle"></ion-icon>'}
    </div>
    <div class="toast-message">${message}</div>
    <div class="toast-close" onclick="this.parentElement.remove()">
      <ion-icon name="close-outline"></ion-icon>
    </div>
  `;
  
  // Style the toast notification
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '1000',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '4px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
    animation: 'slideIn 0.3s, fadeOut 0.5s 3.5s forwards',
    background: type === 'success' ? '#4CAF50' : '#F44336',
    color: 'white',
    maxWidth: '300px'
  });
  
  // Add to document
  document.body.appendChild(toast);
  
  // Remove after 4 seconds
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.remove();
    }
  }, 4000);
}

// Add this CSS to your stylesheet or include it in a style tag in your HTML
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .toast-icon {
      font-size: 24px;
      display: flex;
    }
    
    .toast-message {
      flex: 1;
      font-size: 14px;
    }
    
    .toast-close {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px;
    }
    
    .toast-close:hover {
      opacity: 0.8;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  </style>
`);