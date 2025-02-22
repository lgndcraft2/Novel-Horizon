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
    
    const message = `Order Summary:\n\n${orderDetails}\n\nTotal: ₦${total}${orderNote ? '\n\nNote: ' + orderNote : ''}`;
    
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