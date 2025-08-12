// ===== APPLICATION STATE =====
let cart = [];
let user = {
    isLoggedIn: false,
    cardType: 'silver',
    cardNumber: '001',
    name: '',
    email: ''
};

let introTimer;

// ===== INTRO VIDEO MANAGEMENT =====
function startIntroVideo() {
    introTimer = setTimeout(() => {
        document.getElementById('skipButton').style.display = 'block';
    }, 5000);
    
    // Auto-hide intro after 15 seconds
    setTimeout(() => {
        skipIntro();
    }, 15000);
}

function skipIntro() {
    const overlay = document.getElementById('introOverlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
    clearTimeout(introTimer);
}

// ===== CART MANAGEMENT =====
function addToCart(productId, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            price: price,
            quantity: 1,
            name: productId.replace('-', ' ').toUpperCase()
        });
    }
    
    updateCartUI();
    showNotification(`Added to cart! 🛒`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

function toggleCart() {
    if (cart.length === 0) {
        showNotification('Your cart is empty! 📦');
        return;
    }
    
    let cartHTML = 'Shopping Cart\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartHTML += `${item.name} x${item.quantity} - ₹${itemTotal}\n`;
    });
    
    // Apply VIP discount
    const discount = getVIPDiscount();
    const discountAmount = total * (discount / 100);
    const finalTotal = total - discountAmount;
    
    cartHTML += `\nSubtotal: ₹${total}`;
    if (discount > 0) {
        cartHTML += `\nVIP Discount (${discount}%): -₹${discountAmount.toFixed(2)}`;
    }
    cartHTML += `\nTotal: ₹${finalTotal.toFixed(2)}`;
    
    alert(cartHTML);
}

function getVIPDiscount() {
    switch(user.cardType) {
        case 'silver': return 5;
        case 'platinum': return 10;
        case 'gold': return 15;
        case 'black': return 20;
        default: return 0;
    }
}

// ===== PRODUCT VIDEO MANAGEMENT =====
function showProductVideo(productType) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    
    // In a real implementation, these would be actual video URLs
    const videoSources = {
        'naruto': 'https://example.com/naruto-poster-video.mp4',
        'ferrari': 'https://example.com/ferrari-poster-video.mp4',
        'onepiece': 'https://example.com/onepiece-poster-video.mp4',
        'lambo': 'https://example.com/lambo-poster-video.mp4',
        'bookmark': 'https://example.com/bookmark-video.mp4',
        'aot': 'https://example.com/aot-poster-video.mp4'
    };
    
    video.src = videoSources[productType] || '';
    modal.style.display = 'flex';
    
    // Show notification for demo
    showNotification(`🎬 Playing ${productType.toUpperCase()} promotional video`);
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    modal.style.display = 'none';
    video.pause();
}

// ===== VIP CARD SELECTION =====
function selectCard(cardType) {
    user.cardType = cardType;
    
    const messages = {
        'silver': '🥈 Silver Card selected! 5% discount on orders ₹100+',
        'platinum': '🥉 Platinum Card selected! 10% discount on orders ₹200+',
        'gold': '🥇 Gold Card selected! 15% discount on orders ₹500+',
        'black': '🖤 Black Card selected! 20% discount + 120hr delivery'
    };
    
    showNotification(messages[cardType]);
}

// ===== SEARCH FUNCTIONALITY =====
function performSearch() {
    const query = document.getElementById('searchInput').value;
    if (query.trim() === '') {
        showNotification('Please enter a search term! 🔍');
        return;
    }
    
    showNotification(`🔍 Searching for "${query}"...`);
    
    // Simulate search results
    setTimeout(() => {
        showNotification(`Found products matching "${query}"! 📦`);
    }, 1500);
}

// ===== AUTHENTICATION =====
function showLogin() {
    const email = prompt('Enter your email:');
    if (email) {
        user.isLoggedIn = true;
        user.email = email;
        updateAuthUI();
        showNotification('Welcome back! 👋');
    }
}

function showRegister() {
    const name = prompt('Enter your name:');
    const email = prompt('Enter your email:');
    
    if (name && email) {
        user.isLoggedIn = true;
        user.name = name;
        user.email = email;
        user.cardType = 'silver';
        user.cardNumber = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
        
        updateAuthUI();
        showNotification(`🎉 Welcome ${name}! Silver Card #${user.cardNumber} assigned!`);
    }
}

function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    if (user.isLoggedIn) {
        authButtons.innerHTML = `
            <button class="auth-button" onclick="showProfile()">${user.name || user.email}</button>
            <button class="auth-button" onclick="logout()">Logout</button>
        `;
    }
}

function showProfile() {
    const modal = document.getElementById('profileModal');
    const cardType = document.getElementById('cardType');
    const cardBenefits = document.getElementById('cardBenefits');
    const cardExpiry = document.getElementById('cardExpiry');
    
    cardType.textContent = `${user.cardType.toUpperCase()} #${user.cardNumber}`;
    cardBenefits.textContent = `${getVIPDiscount()}% OFF on applicable orders`;
    
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 3);
    cardExpiry.textContent = `Expires: ${expiryDate.toLocaleDateString()}`;
    
    modal.style.display = 'flex';
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}

function logout() {
    user = {
        isLoggedIn: false,
        cardType: 'silver',
        cardNumber: '001',
        name: '',
        email: ''
    };
    
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <button class="auth-button" onclick="showLogin()">Login</button>
        <button class="auth-button primary" onclick="showRegister()">Sign Up</button>
    `;
    
    showNotification('Logged out successfully! 👋');
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b35, #ff8c42);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize intro video
    startIntroVideo();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Search on Enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Close modals on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('video-modal')) {
            closeVideoModal();
        }
        if (e.target.classList.contains('profile-modal')) {
            closeProfile();
        }
    });
    
    // Initialize cart UI
    updateCartUI();
});

// ===== ADDITIONAL UTILITY FUNCTIONS =====

// Format currency
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate unique card number
function generateCardNumber() {
    return String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
}

// Calculate shipping cost
function calculateShipping(total, cardType) {
    if (cardType === 'platinum' || cardType === 'gold' || cardType === 'black') {
        return 0; // Free shipping for premium cards
    }
    return total > 500 ? 0 : 50; // Free shipping above ₹500
}

// Handle product wishlist (placeholder for future implementation)
function addToWishlist(productId) {
    showNotification('Added to wishlist! ❤️');
    // Future: Add to user wishlist array
}

// Handle product comparison (placeholder for future implementation)
function addToComparison(productId) {
    showNotification('Added to comparison! ⚖️');
    // Future: Add to comparison array
}

// Handle newsletter subscription
function subscribeNewsletter() {
    const email = prompt('Enter your email for newsletter:');
    if (email && isValidEmail(email)) {
        showNotification('Successfully subscribed to newsletter! 📧');
    } else if (email) {
        showNotification('Please enter a valid email address! ❌');
    }
}

// Handle feedback submission
function submitFeedback() {
    const feedback = prompt('Please share your feedback:');
    if (feedback && feedback.trim()) {
        showNotification('Thank you for your feedback! 🙏');
    }
}

// ===== ANALYTICS & TRACKING (Placeholder) =====

// Track page view
function trackPageView(page) {
    // Future: Send to analytics service
    console.log(`Page view: ${page}`);
}

// Track user action
function trackUserAction(action, details = {}) {
    // Future: Send to analytics service
    console.log(`User action: ${action}`, details);
}

// Track purchase
function trackPurchase(total, items) {
    // Future: Send to analytics service
    console.log(`Purchase completed: ₹${total}`, items);
}

// Initialize tracking
trackPageView('home');

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        closeVideoModal();
        closeProfile();
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Future: Send error to logging service
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Track page load time
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Future: Send to analytics service
    trackUserAction('page_load', { loadTime: loadTime });
});