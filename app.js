// Mahua Movers Website JavaScript - Fixed Version

class MahuaMoversApp {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupForms();
        this.setupTracking();
        this.setupDateInputs();
        this.setupSmoothScrolling();
    }

    // Navigation Management
    setupNavigation() {
        // Handle navigation link clicks with event delegation
        document.body.addEventListener('click', (e) => {
            // Check if clicked element or its parent has data-section attribute
            let target = e.target;
            while (target && target !== document.body) {
                if (target.hasAttribute('data-section')) {
                    e.preventDefault();
                    const sectionId = target.getAttribute('data-section');
                    this.showSection(sectionId);
                    return;
                }
                target = target.parentElement;
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const hash = window.location.hash.substring(1) || 'home';
            this.showSection(hash, false);
        });

        // Initialize based on URL hash
        const initialHash = window.location.hash.substring(1) || 'home';
        this.showSection(initialHash, false);
    }

    showSection(sectionId, updateHistory = true) {
        console.log('Switching to section:', sectionId); // Debug log
        
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('section--active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('section--active');
            this.currentSection = sectionId;

            // Update navigation active state
            document.querySelectorAll('.nav__link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Update URL
            if (updateHistory) {
                history.pushState(null, '', `#${sectionId}`);
            }

            // Close mobile menu if open
            this.closeMobileMenu();

            // Scroll to top
            window.scrollTo(0, 0);
            
            console.log('Section switched successfully to:', sectionId); // Debug log
        } else {
            console.error('Section not found:', sectionId); // Debug log
        }
    }

    // Mobile Menu
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navList = document.querySelector('.nav__list');

        if (navToggle && navList) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                navList.classList.toggle('active');
                navToggle.classList.toggle('active');
                console.log('Mobile menu toggled'); // Debug log
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close menu when clicking on nav links
            navList.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav__link')) {
                    setTimeout(() => this.closeMobileMenu(), 100);
                }
            });
        }
    }

    closeMobileMenu() {
        const navList = document.querySelector('.nav__list');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navList && navToggle) {
            navList.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    // Form Management
    setupForms() {
        // Quote Form
        const quoteForm = document.getElementById('quote-form');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuoteSubmission(quoteForm);
            });
        }

        // Booking Form
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBookingSubmission(bookingForm);
            });
        }

        // Contact Form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(contactForm);
            });
        }
    }

    async handleQuoteSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const successDiv = document.getElementById('quote-success');
        const referenceSpan = document.getElementById('quote-reference');

        try {
            // Show loading state
            this.setButtonLoading(submitBtn, true);

            // Validate form
            if (!this.validateForm(form)) {
                throw new Error('Please fill in all required fields correctly.');
            }

            // Simulate API call
            await this.delay(1500);

            // Generate reference ID
            const referenceId = this.generateReferenceId('QT');
            if (referenceSpan) {
                referenceSpan.textContent = referenceId;
            }

            // Show success message
            form.style.display = 'none';
            if (successDiv) {
                successDiv.classList.remove('hidden');
            }

            // Reset form
            form.reset();

        } catch (error) {
            this.showAlert(error.message, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleBookingSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const successDiv = document.getElementById('booking-success');
        const referenceSpan = document.getElementById('booking-reference');
        const pickupTimeSpan = document.getElementById('booking-pickup-time');

        try {
            // Show loading state
            this.setButtonLoading(submitBtn, true);

            // Validate form
            if (!this.validateForm(form)) {
                throw new Error('Please fill in all required fields correctly.');
            }

            // Simulate API call
            await this.delay(2000);

            // Generate booking details
            const referenceId = this.generateReferenceId('BK');
            const pickupDate = document.getElementById('book-pickup-date')?.value || 'TBD';
            const pickupTime = document.getElementById('book-pickup-time')?.value || '';
            
            if (referenceSpan) {
                referenceSpan.textContent = referenceId;
            }
            
            let estimatedPickup = pickupDate;
            if (pickupTime) {
                const timeSlots = {
                    'morning': '10:00 AM - 12:00 PM',
                    'afternoon': '1:00 PM - 3:00 PM',
                    'evening': '5:00 PM - 7:00 PM',
                    'flexible': 'To be confirmed'
                };
                estimatedPickup += ` (${timeSlots[pickupTime] || 'To be confirmed'})`;
            }
            
            if (pickupTimeSpan) {
                pickupTimeSpan.textContent = estimatedPickup;
            }

            // Show success message
            form.style.display = 'none';
            if (successDiv) {
                successDiv.classList.remove('hidden');
            }

            // Reset form
            form.reset();

        } catch (error) {
            this.showAlert(error.message, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleContactSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const successDiv = document.getElementById('contact-success');

        try {
            // Show loading state
            this.setButtonLoading(submitBtn, true);

            // Validate form
            if (!this.validateForm(form)) {
                throw new Error('Please fill in all required fields correctly.');
            }

            // Simulate API call
            await this.delay(1000);

            // Show success message
            form.style.display = 'none';
            if (successDiv) {
                successDiv.classList.remove('hidden');
            }

            // Reset form
            form.reset();

        } catch (error) {
            this.showAlert(error.message, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    // Tracking System
    setupTracking() {
        const trackBtn = document.getElementById('track-btn');
        const trackingInput = document.getElementById('tracking-id');

        if (trackBtn && trackingInput) {
            trackBtn.addEventListener('click', () => {
                this.handleTracking();
            });

            trackingInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleTracking();
                }
            });
        }
    }

    async handleTracking() {
        const trackingInput = document.getElementById('tracking-id');
        const trackingResult = document.getElementById('tracking-result');
        const trackBtn = document.getElementById('track-btn');
        const displayTrackingId = document.getElementById('display-tracking-id');
        const estimatedDelivery = document.getElementById('estimated-delivery');

        if (!trackingInput || !trackingResult) {
            console.error('Tracking elements not found');
            return;
        }

        const trackingId = trackingInput.value.trim().toUpperCase();

        if (!trackingId) {
            this.showAlert('Please enter a tracking ID or booking reference.', 'warning');
            return;
        }

        try {
            // Show loading state
            this.setButtonLoading(trackBtn, true);

            // Simulate API call
            await this.delay(1000);

            // Update tracking info
            if (displayTrackingId) {
                displayTrackingId.textContent = trackingId;
            }
            
            // Generate estimated delivery based on tracking ID
            const deliveryTimes = {
                'MM001234': 'Today, 6:00 PM',
                'MM005678': 'Today, 4:30 PM',
                'MM009012': 'Delivered - Yesterday, 3:45 PM'
            };
            
            if (estimatedDelivery) {
                estimatedDelivery.textContent = deliveryTimes[trackingId] || 'Tomorrow, 2:00 PM';
            }

            // Update progress based on tracking ID
            this.updateTrackingProgress(trackingId);

            // Show result
            trackingResult.classList.remove('hidden');

            // Clear input
            trackingInput.value = '';

            console.log('Tracking completed for:', trackingId); // Debug log

        } catch (error) {
            this.showAlert('Error retrieving tracking information. Please try again.', 'error');
        } finally {
            this.setButtonLoading(trackBtn, false);
        }
    }

    updateTrackingProgress(trackingId) {
        const progressItems = document.querySelectorAll('.progress-item');
        
        // Reset all items
        progressItems.forEach(item => {
            item.classList.remove('completed', 'active');
        });

        // Define progress states
        const progressStates = {
            'MM001234': 3, // In Transit
            'MM005678': 4, // Out for Delivery
            'MM009012': 5  // Delivered
        };

        const currentProgress = progressStates[trackingId] || 3;

        // Update progress
        progressItems.forEach((item, index) => {
            if (index < currentProgress) {
                item.classList.add('completed');
            } else if (index === currentProgress) {
                item.classList.add('active');
            }
        });
    }

    // Form Validation
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required.');
                isValid = false;
            } else {
                this.clearFieldError(field);
                
                // Additional validation based on field type
                if (field.type === 'email' && !this.isValidEmail(field.value)) {
                    this.showFieldError(field, 'Please enter a valid email address.');
                    isValid = false;
                } else if (field.type === 'tel' && !this.isValidPhone(field.value)) {
                    this.showFieldError(field, 'Please enter a valid phone number.');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = 'var(--color-error)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = 'var(--color-error)';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--space-4)';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    // Date Input Setup
    setupDateInputs() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];
        
        dateInputs.forEach(input => {
            input.min = today;
            if (!input.value) {
                input.value = today;
            }
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    // Alert System
    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `alert alert--${type}`;
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.padding = 'var(--space-16)';
        alert.style.borderRadius = 'var(--radius-base)';
        alert.style.zIndex = '1000';
        alert.style.maxWidth = '400px';
        alert.style.boxShadow = 'var(--shadow-lg)';
        
        // Set colors based on type
        switch (type) {
            case 'error':
                alert.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
                alert.style.borderLeft = '4px solid var(--color-error)';
                alert.style.color = 'var(--color-error)';
                break;
            case 'warning':
                alert.style.backgroundColor = 'rgba(var(--color-warning-rgb), 0.1)';
                alert.style.borderLeft = '4px solid var(--color-warning)';
                alert.style.color = 'var(--color-warning)';
                break;
            case 'success':
                alert.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
                alert.style.borderLeft = '4px solid var(--color-success)';
                alert.style.color = 'var(--color-success)';
                break;
            default:
                alert.style.backgroundColor = 'rgba(var(--color-info-rgb), 0.1)';
                alert.style.borderLeft = '4px solid var(--color-info)';
                alert.style.color = 'var(--color-info)';
        }
        
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    // Utility Functions
    setButtonLoading(button, isLoading) {
        if (!button) return;
        
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            button.setAttribute('data-original-text', button.textContent);
            button.textContent = 'Please wait...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.textContent = originalText;
                button.removeAttribute('data-original-text');
            }
        }
    }

    generateReferenceId(prefix) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        return `${prefix}${timestamp}${random}`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public methods for external access
    navigateToSection(sectionId) {
        this.showSection(sectionId);
    }

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            form.style.display = 'block';
            
            // Hide success messages
            const successElements = [
                document.getElementById('quote-success'),
                document.getElementById('booking-success'),
                document.getElementById('contact-success')
            ];
            
            successElements.forEach(element => {
                if (element) {
                    element.classList.add('hidden');
                }
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Mahua Movers App...'); // Debug log
    window.mahuaMoversApp = new MahuaMoversApp();
    console.log('Mahua Movers App initialized'); // Debug log
});

// Additional Event Listeners for enhanced UX
document.addEventListener('DOMContentLoaded', () => {
    // Demo tracking ID functionality
    setTimeout(() => {
        const demoTrackingIds = document.querySelectorAll('.track-demo code');
        demoTrackingIds.forEach(code => {
            code.style.cursor = 'pointer';
            code.title = 'Click to copy and try';
            
            code.addEventListener('click', function() {
                const trackingInput = document.getElementById('tracking-id');
                if (trackingInput) {
                    trackingInput.value = this.textContent;
                    // Auto-trigger tracking after a short delay
                    setTimeout(() => {
                        if (window.mahuaMoversApp) {
                            window.mahuaMoversApp.handleTracking();
                        }
                    }, 100);
                }
            });
        });
    }, 1000);

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            this.value = value;
        });
    });

    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });

    // Add keyboard navigation for better accessibility
    document.addEventListener('keydown', (e) => {
        // Quick navigation with Alt + number keys
        if (e.altKey) {
            const sectionMap = {
                '1': 'home',
                '2': 'services', 
                '3': 'quote',
                '4': 'book',
                '5': 'track',
                '6': 'about',
                '7': 'contact'
            };
            
            const section = sectionMap[e.key];
            if (section && window.mahuaMoversApp) {
                e.preventDefault();
                window.mahuaMoversApp.navigateToSection(section);
            }
        }
    });

    // Form enhancement
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentNode.classList.add('form-group--focused');
        });
        
        control.addEventListener('blur', function() {
            this.parentNode.classList.remove('form-group--focused');
        });
    });

    console.log('Additional event listeners setup complete'); // Debug log
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MahuaMoversApp;
}