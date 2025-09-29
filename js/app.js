// Dish Comparison App JavaScript
class DishCompareApp {
    constructor() {
        this.currentUser = null;
        this.comparisons = [];
        this.weights = {
            taste: 30,
            presentation: 20,
            texture: 25,
            aroma: 15,
            value: 10
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.updateWeightDisplay();
        this.setupSliders();
        this.setupPWAInstallPrompt();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.showSection(section);
                this.closeMobileMenu();
            });
        });

        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Authentication
        document.getElementById('loginBtn').addEventListener('click', () => this.showModal('loginModal'));
        document.getElementById('signupBtn').addEventListener('click', () => this.showModal('signupModal'));
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Modal controls
        document.getElementById('showSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('loginModal');
            this.showModal('signupModal');
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('signupModal');
            this.showModal('loginModal');
        });

        // Close modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.hideAllModals();
            });
        });

        // Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));

        // Comparison
        document.getElementById('compareBtn').addEventListener('click', () => this.compareDishes());

        // Weight sliders
        document.querySelectorAll('.weight-slider').forEach(slider => {
            slider.addEventListener('input', () => this.updateWeights());
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });
    }

    setupSliders() {
        // Setup parameter sliders for both dishes
        ['1', '2'].forEach(dishNum => {
            ['taste', 'presentation', 'texture', 'aroma', 'value'].forEach(param => {
                const slider = document.getElementById(`${param}${dishNum}`);
                const scoreDisplay = document.getElementById(`${param}Score${dishNum}`);
                
                slider.addEventListener('input', () => {
                    scoreDisplay.textContent = slider.value;
                });
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('fade-in');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Load section-specific data
        if (sectionId === 'dashboard') {
            this.loadDashboard();
        } else if (sectionId === 'profile') {
            this.loadProfile();
        }
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        
        if (navMenu && hamburger) {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        // Simulate user creation
        this.currentUser = {
            id: Date.now(),
            name: name,
            email: email,
            memberSince: new Date().getFullYear(),
            comparisons: 0,
            preferences: { ...this.weights }
        };

        this.saveUserData();
        this.updateAuthUI();
        this.hideAllModals();
        
        alert('Account created successfully! Welcome to DishCompare!');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simulate login (in real app, this would check against a database)
        const savedUser = localStorage.getItem('dishCompareUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            if (user.email === email) {
                this.currentUser = user;
                this.saveUserData();
                this.updateAuthUI();
                this.hideAllModals();
                alert('Login successful!');
                return;
            }
        }
        
        alert('Invalid credentials. Please try again or sign up.');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('dishCompareUser');
        this.updateAuthUI();
        this.showSection('home');
        alert('Logged out successfully!');
    }

    updateAuthUI() {
        const isLoggedIn = this.currentUser !== null;
        
        document.getElementById('loginBtn').style.display = isLoggedIn ? 'none' : 'inline-block';
        document.getElementById('signupBtn').style.display = isLoggedIn ? 'none' : 'inline-block';
        document.getElementById('logoutBtn').style.display = isLoggedIn ? 'inline-block' : 'none';
        document.getElementById('profileLink').style.display = isLoggedIn ? 'inline-block' : 'none';
    }

    loadUserData() {
        const savedUser = localStorage.getItem('dishCompareUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateAuthUI();
        }

        const savedComparisons = localStorage.getItem('dishCompareComparisons');
        if (savedComparisons) {
            this.comparisons = JSON.parse(savedComparisons);
        }
    }

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('dishCompareUser', JSON.stringify(this.currentUser));
        }
        localStorage.setItem('dishCompareComparisons', JSON.stringify(this.comparisons));
    }

    updateWeights() {
        const tasteWeight = parseInt(document.getElementById('tasteWeight').value);
        const presentationWeight = parseInt(document.getElementById('presentationWeight').value);
        const textureWeight = parseInt(document.getElementById('textureWeight').value);
        const aromaWeight = parseInt(document.getElementById('aromaWeight').value);
        const valueWeight = parseInt(document.getElementById('valueWeight').value);

        // Normalize weights to ensure they add up to 100%
        const total = tasteWeight + presentationWeight + textureWeight + aromaWeight + valueWeight;
        
        this.weights = {
            taste: Math.round((tasteWeight / total) * 100),
            presentation: Math.round((presentationWeight / total) * 100),
            texture: Math.round((textureWeight / total) * 100),
            aroma: Math.round((aromaWeight / total) * 100),
            value: Math.round((valueWeight / total) * 100)
        };

        this.updateWeightDisplay();
    }

    updateWeightDisplay() {
        // Update weight displays for both dishes
        ['1', '2'].forEach(dishNum => {
            document.getElementById(`tasteWeight${dishNum}`).textContent = this.weights.taste;
            document.getElementById(`presentationWeight${dishNum}`).textContent = this.weights.presentation;
            document.getElementById(`textureWeight${dishNum}`).textContent = this.weights.texture;
            document.getElementById(`aromaWeight${dishNum}`).textContent = this.weights.aroma;
            document.getElementById(`valueWeight${dishNum}`).textContent = this.weights.value;
        });

        // Update weight sliders
        document.getElementById('tasteWeight').value = this.weights.taste;
        document.getElementById('presentationWeight').value = this.weights.presentation;
        document.getElementById('textureWeight').value = this.weights.texture;
        document.getElementById('aromaWeight').value = this.weights.aroma;
        document.getElementById('valueWeight').value = this.weights.value;

        // Update weight value displays
        document.querySelectorAll('.weight-value').forEach((span, index) => {
            const weights = [this.weights.taste, this.weights.presentation, this.weights.texture, this.weights.aroma, this.weights.value];
            span.textContent = weights[index] + '%';
        });
    }

    compareDishes() {
        const dish1Name = document.getElementById('dish1Name').value;
        const dish2Name = document.getElementById('dish2Name').value;

        if (!dish1Name || !dish2Name) {
            alert('Please enter names for both dishes!');
            return;
        }

        // Get scores for dish 1
        const dish1Scores = {
            taste: parseInt(document.getElementById('taste1').value),
            presentation: parseInt(document.getElementById('presentation1').value),
            texture: parseInt(document.getElementById('texture1').value),
            aroma: parseInt(document.getElementById('aroma1').value),
            value: parseInt(document.getElementById('value1').value)
        };

        // Get scores for dish 2
        const dish2Scores = {
            taste: parseInt(document.getElementById('taste2').value),
            presentation: parseInt(document.getElementById('presentation2').value),
            texture: parseInt(document.getElementById('texture2').value),
            aroma: parseInt(document.getElementById('aroma2').value),
            value: parseInt(document.getElementById('value2').value)
        };

        // Calculate weighted scores
        const dish1FinalScore = this.calculateWeightedScore(dish1Scores);
        const dish2FinalScore = this.calculateWeightedScore(dish2Scores);

        // Display results
        this.displayResults(dish1Name, dish2Name, dish1FinalScore, dish2FinalScore, dish1Scores, dish2Scores);

        // Save comparison
        this.saveComparison(dish1Name, dish2Name, dish1FinalScore, dish2FinalScore);

        // Update user stats
        if (this.currentUser) {
            this.currentUser.comparisons++;
            this.saveUserData();
        }
    }

    calculateWeightedScore(scores) {
        let weightedSum = 0;
        let totalWeight = 0;

        Object.keys(scores).forEach(parameter => {
            const score = scores[parameter];
            const weight = this.weights[parameter] / 100;
            weightedSum += score * weight;
            totalWeight += weight;
        });

        return Math.round((weightedSum / totalWeight) * 10) / 10;
    }

    displayResults(dish1Name, dish2Name, dish1Score, dish2Score, dish1Scores, dish2Scores) {
        // Update result names and scores
        document.getElementById('dish1ResultName').textContent = dish1Name;
        document.getElementById('dish2ResultName').textContent = dish2Name;
        document.getElementById('dish1FinalScore').textContent = dish1Score;
        document.getElementById('dish2FinalScore').textContent = dish2Score;

        // Create score breakdowns
        const dish1Breakdown = this.createScoreBreakdown(dish1Scores);
        const dish2Breakdown = this.createScoreBreakdown(dish2Scores);
        
        document.getElementById('dish1Breakdown').innerHTML = dish1Breakdown;
        document.getElementById('dish2Breakdown').innerHTML = dish2Breakdown;

        // Show winner badge
        const winnerBadge = document.getElementById('winnerBadge');
        if (dish1Score > dish2Score) {
            winnerBadge.style.display = 'flex';
            winnerBadge.style.order = '1';
        } else if (dish2Score > dish1Score) {
            winnerBadge.style.display = 'flex';
            winnerBadge.style.order = '3';
        } else {
            winnerBadge.style.display = 'none';
        }

        // Show results section
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }

    createScoreBreakdown(scores) {
        let breakdown = '';
        Object.keys(scores).forEach(parameter => {
            const score = scores[parameter];
            const weight = this.weights[parameter];
            const weightedScore = (score * weight / 100).toFixed(1);
            breakdown += `<div>${parameter.charAt(0).toUpperCase() + parameter.slice(1)}: ${score}/10 (${weightedScore} weighted)</div>`;
        });
        return breakdown;
    }

    saveComparison(dish1Name, dish2Name, dish1Score, dish2Score) {
        const comparison = {
            id: Date.now(),
            dish1: { name: dish1Name, score: dish1Score },
            dish2: { name: dish2Name, score: dish2Score },
            winner: dish1Score > dish2Score ? dish1Name : dish2Name,
            date: new Date().toLocaleDateString(),
            weights: { ...this.weights }
        };

        this.comparisons.unshift(comparison);
        this.saveUserData();
    }

    loadDashboard() {
        const recentComparisons = document.getElementById('recentComparisons');
        const totalComparisons = document.getElementById('totalComparisons');
        const topPreference = document.getElementById('topPreference');

        // Update total comparisons
        totalComparisons.textContent = this.comparisons.length;

        // Update top preference
        if (this.currentUser && this.currentUser.preferences) {
            const topPref = Object.keys(this.currentUser.preferences).reduce((a, b) => 
                this.currentUser.preferences[a] > this.currentUser.preferences[b] ? a : b
            );
            topPreference.textContent = topPref.charAt(0).toUpperCase() + topPref.slice(1);
        }

        // Display recent comparisons
        if (this.comparisons.length === 0) {
            recentComparisons.innerHTML = '<p class="empty-state">No comparisons yet. Start comparing dishes!</p>';
        } else {
            const recentHTML = this.comparisons.slice(0, 5).map(comp => `
                <div class="comparison-item" style="padding: 1rem; border-bottom: 1px solid #e9ecef; margin-bottom: 0.5rem;">
                    <div style="font-weight: bold; color: #333;">${comp.dish1.name} vs ${comp.dish2.name}</div>
                    <div style="color: #666; font-size: 0.9rem;">Winner: ${comp.winner} | ${comp.date}</div>
                </div>
            `).join('');
            recentComparisons.innerHTML = recentHTML;
        }
    }

    loadProfile() {
        if (!this.currentUser) {
            alert('Please log in to view your profile.');
            this.showSection('home');
            return;
        }

        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userEmail').textContent = this.currentUser.email;
        document.getElementById('memberSince').textContent = this.currentUser.memberSince;
        document.getElementById('profileTotalComparisons').textContent = this.currentUser.comparisons || 0;

        // Find favorite dish
        const favoriteDish = this.findFavoriteDish();
        document.getElementById('profileFavoriteDish').textContent = favoriteDish || '-';
    }

    findFavoriteDish() {
        const dishWins = {};
        
        this.comparisons.forEach(comp => {
            if (comp.dish1.score > comp.dish2.score) {
                dishWins[comp.dish1.name] = (dishWins[comp.dish1.name] || 0) + 1;
            } else if (comp.dish2.score > comp.dish1.score) {
                dishWins[comp.dish2.name] = (dishWins[comp.dish2.name] || 0) + 1;
            }
        });

        const favorite = Object.keys(dishWins).reduce((a, b) => 
            dishWins[a] > dishWins[b] ? a : b, null
        );

        return favorite;
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionId) {
    window.dishCompareApp.showSection(sectionId);
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dishCompareApp = new DishCompareApp();
    
    // Register Service Worker for PWA functionality
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered successfully:', registration.scope);
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }

    // PWA Installation prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });

    function showInstallPrompt() {
        // Create install button
        const installBtn = document.createElement('button');
        installBtn.innerHTML = '📱 Install DishCompare App';
        installBtn.className = 'btn btn-primary';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            padding: 12px 20px;
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease-out;
        `;
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                deferredPrompt = null;
                installBtn.remove();
            }
        });
        
        document.body.appendChild(installBtn);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (installBtn.parentNode) {
                installBtn.remove();
            }
        }, 10000);
    }
});

// Add some demo data for first-time users
if (!localStorage.getItem('dishCompareDemoData')) {
    const demoComparisons = [
        {
            id: Date.now() - 86400000,
            dish1: { name: "Margherita Pizza", score: 8.2 },
            dish2: { name: "Pepperoni Pizza", score: 7.8 },
            winner: "Margherita Pizza",
            date: new Date(Date.now() - 86400000).toLocaleDateString(),
            weights: { taste: 30, presentation: 20, texture: 25, aroma: 15, value: 10 }
        },
        {
            id: Date.now() - 172800000,
            dish1: { name: "Caesar Salad", score: 7.5 },
            dish2: { name: "Greek Salad", score: 8.1 },
            winner: "Greek Salad",
            date: new Date(Date.now() - 172800000).toLocaleDateString(),
            weights: { taste: 30, presentation: 20, texture: 25, aroma: 15, value: 10 }
        }
    ];
    
    localStorage.setItem('dishCompareComparisons', JSON.stringify(demoComparisons));
    localStorage.setItem('dishCompareDemoData', 'true');
}

// PWA Installation Methods
function setupPWAInstallPrompt() {
    let deferredPrompt;
    const installPrompt = document.getElementById('pwaInstallPrompt');
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return; // Already installed
    }
    
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
        hideInstallPrompt();
        console.log('PWA was installed');
    });
    
    // Check if user dismissed the prompt before
    const dismissed = localStorage.getItem('pwaInstallDismissed');
    if (!dismissed && installPrompt) {
        // Show prompt after a delay
        setTimeout(() => {
            showInstallPrompt();
        }, 3000);
    }
}

function showInstallPrompt() {
    const installPrompt = document.getElementById('pwaInstallPrompt');
    if (installPrompt) {
        installPrompt.style.display = 'block';
    }
}

function hideInstallPrompt() {
    const installPrompt = document.getElementById('pwaInstallPrompt');
    if (installPrompt) {
        installPrompt.style.display = 'none';
    }
}

function installPWA() {
    // For iOS, we can't programmatically install, so show instructions
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        showIOSInstallInstructions();
    } else {
        // For other browsers, use the deferred prompt
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                window.deferredPrompt = null;
            });
        }
    }
}

function dismissInstallPrompt() {
    hideInstallPrompt();
    localStorage.setItem('pwaInstallDismissed', 'true');
}

function showIOSInstallInstructions() {
    const instructions = `
        <div class="ios-install-modal">
            <div class="modal-content">
                <h3>📱 Install DishCompare on iOS</h3>
                <ol>
                    <li>Tap the <strong>Share</strong> button (□↗) at the bottom of Safari</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                    <li>Tap <strong>"Add"</strong> to install the app</li>
                    <li>Find the DishCompare icon on your home screen!</li>
                </ol>
                <button class="btn btn-primary" onclick="closeIOSInstructions()">Got it!</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', instructions);
}

function closeIOSInstructions() {
    const modal = document.querySelector('.ios-install-modal');
    if (modal) {
        modal.remove();
    }
}
