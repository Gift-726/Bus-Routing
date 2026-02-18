// Global data storage
let busData = null;

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('data/bus-data.json');
        busData = await response.json();
        return busData;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();

    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Set active navbar link
    setActiveNavLink(currentPage);

    // Initialize page-specific functionality
    if (currentPage === '' || currentPage === 'index.html') {
        initHomePage();
    } else if (currentPage === 'parks.html') {
        initParksPage();
    } else if (currentPage === 'routes.html') {
        initRoutesPage();
    } else if (currentPage === 'details.html') {
        initDetailsPage();
    }

    // Initialize global search
    initGlobalSearch();

    // Initialize mobile menu
    initMobileMenu();

    // Prevent page refresh on home link click (prevent default for internal navigation)
    preventPageReload();
});

// Set active navbar link based on current page
function setActiveNavLink(currentPage) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });

    // Add active class to current page link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Prevent page reload on home link click (with caching for better performance)
function preventPageReload() {
    const homeLink = document.querySelector('a[href="index.html"]');
    const logoLink = document.querySelector('.logo');

    // Cache data in sessionStorage for faster subsequent loads
    if (busData && !sessionStorage.getItem('busDataCached')) {
        sessionStorage.setItem('busDataCached', JSON.stringify(busData));
    }

    // Prevent reload when clicking home while already on home page
    [homeLink, logoLink].forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                if (currentPage === 'index.html' || currentPage === '') {
                    e.preventDefault();
                    setActiveNavLink('index.html');
                    // Scroll to top smoothly
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    });
}

// Home Page Functions
function initHomePage() {
    displayFeaturedParks();
    displayFeaturedRoutes();
}

function displayFeaturedParks() {
    if (!busData) return;

    const featuredContainer = document.getElementById('featured-parks');
    if (!featuredContainer) return;

    // Get first 3 parks
    const featuredParks = busData.busParks.slice(0, 3);

    featuredParks.forEach(park => {
        const card = createParkCard(park);
        featuredContainer.appendChild(card);
    });
}

function displayFeaturedRoutes() {
    if (!busData) return;

    const featuredContainer = document.getElementById('featured-routes');
    if (!featuredContainer) return;

    // Get first 3 routes
    const featuredRoutes = busData.routes.slice(0, 3);

    featuredRoutes.forEach(route => {
        const card = createRouteCard(route);
        featuredContainer.appendChild(card);
    });
}

// Parks Page Functions
function initParksPage() {
    displayAllParks();
    initParkFilters();
}

function displayAllParks(filteredParks = null) {
    if (!busData) return;

    const parksContainer = document.getElementById('parks-container');
    if (!parksContainer) return;

    parksContainer.innerHTML = '';

    const parksToDisplay = filteredParks || busData.busParks;

    if (parksToDisplay.length === 0) {
        parksContainer.innerHTML = '<div class="empty-state"><h3>No parks found</h3><p>Try adjusting your search or filters</p></div>';
        return;
    }

    parksToDisplay.forEach(park => {
        const card = createParkCard(park);
        parksContainer.appendChild(card);
    });
}

function createParkCard(park) {
    const card = document.createElement('a');
    card.href = `details.html?type=park&id=${park.id}`;
    card.className = 'card';

    card.innerHTML = `
        <h3>${park.name}</h3>
        <p><strong>City:</strong> ${park.city}</p>
        <p><strong>State:</strong> ${park.state}</p>
        <p><strong>Contact:</strong> ${park.contactPhone}</p>
        <p><strong>Union:</strong> ${park.transportUnion}</p>
        <span class="badge">View Details</span>
    `;

    return card;
}

function initParkFilters() {
    const cityFilter = document.getElementById('city-filter');
    const stateFilter = document.getElementById('state-filter');

    if (cityFilter) {
        // Populate city filter
        const cities = [...new Set(busData.busParks.map(p => p.city))].sort();
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityFilter.appendChild(option);
        });

        cityFilter.addEventListener('change', applyParkFilters);
    }

    if (stateFilter) {
        // Populate state filter
        const states = [...new Set(busData.busParks.map(p => p.state))].sort();
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateFilter.appendChild(option);
        });

        stateFilter.addEventListener('change', applyParkFilters);
    }
}

function applyParkFilters() {
    const cityFilter = document.getElementById('city-filter');
    const stateFilter = document.getElementById('state-filter');

    let filtered = busData.busParks;

    if (cityFilter && cityFilter.value !== 'all') {
        filtered = filtered.filter(p => p.city === cityFilter.value);
    }

    if (stateFilter && stateFilter.value !== 'all') {
        filtered = filtered.filter(p => p.state === stateFilter.value);
    }

    displayAllParks(filtered);
}

// ============================================
// ROUTES PAGE FUNCTIONS
// ============================================
// These functions handle the routes page functionality including:
// - Displaying routes in a responsive grid layout
// - Creating styled route cards with hover effects
// - Filtering routes by departure park
// - Search functionality integration
// ============================================

/**
 * Initialize the routes page
 * Sets up route display and filter functionality
 */
function initRoutesPage() {
    displayAllRoutes();
    initRouteFilters();
}

/**
 * Display all routes in a responsive grid container
 * @param {Array} filteredRoutes - Optional filtered routes array, defaults to all routes
 */
function displayAllRoutes(filteredRoutes = null) {
    if (!busData) return;

    const routesContainer = document.getElementById('routes-container');
    if (!routesContainer) return;

    routesContainer.innerHTML = '';

    const routesToDisplay = filteredRoutes || busData.routes;

    // Show empty state if no routes found
    if (routesToDisplay.length === 0) {
        routesContainer.innerHTML = '<div class="empty-state"><h3>No routes found</h3><p>Try adjusting your search or filters</p></div>';
        return;
    }

    // Create and append route cards
    routesToDisplay.forEach(route => {
        const card = createRouteCard(route, true);
        routesContainer.appendChild(card);
    });
}

/**
 * Create a styled route card element
 * @param {Object} route - Route object with destination, fare, etc.
 * @param {Boolean} clickable - Whether the card should be clickable (link)
 * @returns {HTMLElement} - The created route card element
 * 
 * Route cards feature:
 * - Destination with location icon
 * - Prominent fare range badge
 * - Departure park information
 * - Route name
 * - Hover effects and smooth transitions
 */
function createRouteCard(route, clickable = false) {
    const card = document.createElement(clickable ? 'a' : 'div');
    if (clickable) {
        card.href = `details.html?type=route&id=${route.id}`;
        card.className = 'route-item';
    } else {
        card.className = 'card';
    }

    // Format fare range with Nigerian Naira symbol
    const fareRange = `₦${route.estimatedFareMin.toLocaleString()} - ₦${route.estimatedFareMax.toLocaleString()}`;

    if (clickable) {
        // Styled route card for routes page (with hover effects)
        card.innerHTML = `
            <div class="route-header">
                <div class="route-destination">${route.destination}</div>
                <div class="fare-range">${fareRange}</div>
            </div>
            <div class="route-details">
                <p><strong>From:</strong> ${route.departureParkName}</p>
                <p><strong>Route:</strong> ${route.routeName}</p>
            </div>
        `;
    } else {
        // Simple card for featured routes on home page
        card.innerHTML = `
            <h3>${route.routeName}</h3>
            <p><strong>From:</strong> ${route.departureParkName}</p>
            <p><strong>To:</strong> ${route.destination}</p>
            <p><strong>Fare:</strong> ${fareRange}</p>
        `;
    }

    return card;
}

/**
 * Initialize route filters
 * Populates the departure park filter dropdown with unique park names
 */
function initRouteFilters() {
    const parkFilter = document.getElementById('park-filter');

    if (parkFilter) {
        // Get unique departure park names and sort alphabetically
        const parks = [...new Set(busData.routes.map(r => r.departureParkName))].sort();
        parks.forEach(parkName => {
            const option = document.createElement('option');
            option.value = parkName;
            option.textContent = parkName;
            parkFilter.appendChild(option);
        });

        // Add event listener for filter changes
        parkFilter.addEventListener('change', applyRouteFilters);
    }
}

/**
 * Apply route filters based on selected departure park
 * Updates the displayed routes when filter changes
 */
function applyRouteFilters() {
    const parkFilter = document.getElementById('park-filter');

    let filtered = busData.routes;

    // Filter by departure park if a specific park is selected
    if (parkFilter && parkFilter.value !== 'all') {
        filtered = filtered.filter(r => r.departureParkName === parkFilter.value);
    }

    // Update display with filtered results
    displayAllRoutes(filtered);
}

// Details Page Functions
function initDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const id = urlParams.get('id');

    if (type === 'park') {
        displayParkDetails(id);
    } else if (type === 'route') {
        displayRouteDetails(id);
    }
}

function displayParkDetails(parkId) {
    if (!busData) return;

    const park = busData.busParks.find(p => p.id === parkId);
    if (!park) {
        document.getElementById('details-content').innerHTML = '<div class="empty-state"><h3>Park not found</h3></div>';
        return;
    }

    // Get routes for this park
    const parkRoutes = busData.routes.filter(r => r.departureParkId === parkId);

    const detailsContent = document.getElementById('details-content');
    detailsContent.innerHTML = `
        <div class="details-container">
            <div class="details-header">
                <h1>${park.name}</h1>
                <p>${park.address}</p>
            </div>
            
            <div class="details-section">
                <h2>Park Information</h2>
                <div class="info-item">
                    <span class="info-label">City:</span>
                    <span class="info-value">${park.city}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">State:</span>
                    <span class="info-value">${park.state}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Contact Phone:</span>
                    <span class="info-value">${park.contactPhone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Transport Union:</span>
                    <span class="info-value">${park.transportUnion}</span>
                </div>
            </div>
            
            <div class="details-section">
                <h2>Available Routes</h2>
                ${parkRoutes.length > 0 ?
            `<ul class="routes-list">
                        ${parkRoutes.map(route => `
                            <li class="route-item" onclick="window.location.href='details.html?type=route&id=${route.id}'">
                                <div class="route-header">
                                    <div class="route-destination">${route.destination}</div>
                                    <div class="fare-range">₦${route.estimatedFareMin.toLocaleString()} - ₦${route.estimatedFareMax.toLocaleString()}</div>
                                </div>
                                <div class="route-details">
                                    <p><strong>Route:</strong> ${route.routeName}</p>
                                </div>
                            </li>
                        `).join('')}
                    </ul>` :
            '<p>No routes available from this park.</p>'
        }
            </div>
            
            <div class="details-section">
                <h2>Location</h2>
                <div id="map" class="map-container"></div>
            </div>
        </div>
    `;

    // Initialize map
    initMap(park.latitude, park.longitude, park.name);
}

function displayRouteDetails(routeId) {
    if (!busData) return;

    const route = busData.routes.find(r => r.id === routeId);
    if (!route) {
        document.getElementById('details-content').innerHTML = '<div class="empty-state"><h3>Route not found</h3></div>';
        return;
    }

    const park = busData.busParks.find(p => p.id === route.departureParkId);

    const detailsContent = document.getElementById('details-content');
    detailsContent.innerHTML = `
        <div class="details-container">
            <div class="details-header">
                <h1>${route.routeName}</h1>
                <p>${route.departureParkName} to ${route.destination}</p>
            </div>
            
            <div class="details-section">
                <h2>Route Information</h2>
                <div class="info-item">
                    <span class="info-label">Departure Park:</span>
                    <span class="info-value">${route.departureParkName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Destination:</span>
                    <span class="info-value">${route.destination}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Estimated Fare:</span>
                    <span class="info-value">₦${route.estimatedFareMin.toLocaleString()} - ₦${route.estimatedFareMax.toLocaleString()}</span>
                </div>
            </div>
            
            ${park ? `
            <div class="details-section">
                <h2>Departure Park Details</h2>
                <div class="info-item">
                    <span class="info-label">Park Name:</span>
                    <span class="info-value"><a href="details.html?type=park&id=${park.id}">${park.name}</a></span>
                </div>
                <div class="info-item">
                    <span class="info-label">City:</span>
                    <span class="info-value">${park.city}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">State:</span>
                    <span class="info-value">${park.state}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Contact:</span>
                    <span class="info-value">${park.contactPhone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Transport Union:</span>
                    <span class="info-value">${park.transportUnion}</span>
                </div>
            </div>
            
            <div class="details-section">
                <h2>Park Location</h2>
                <div id="map" class="map-container"></div>
            </div>
            ` : ''}
        </div>
    `;

    // Initialize map if park exists
    if (park) {
        initMap(park.latitude, park.longitude, park.name);
    }
}

// Map Functions
function initMap(lat, lng, title) {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }

    // Initialize map
    const map = L.map('map').setView([lat, lng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add marker
    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(title)
        .openPopup();
}

// Search Functions
function initGlobalSearch() {
    const searchForm = document.getElementById('global-search-form');
    const searchInput = document.getElementById('global-search-input');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();

            if (!query) return;

            // Search in parks
            const parkResults = busData.busParks.filter(park =>
                park.name.toLowerCase().includes(query) ||
                park.city.toLowerCase().includes(query) ||
                park.state.toLowerCase().includes(query)
            );

            // Search in routes
            const routeResults = busData.routes.filter(route =>
                route.destination.toLowerCase().includes(query) ||
                route.routeName.toLowerCase().includes(query) ||
                route.departureParkName.toLowerCase().includes(query)
            );

            // Store results in sessionStorage and redirect to search results
            sessionStorage.setItem('searchQuery', query);
            sessionStorage.setItem('parkResults', JSON.stringify(parkResults));
            sessionStorage.setItem('routeResults', JSON.stringify(routeResults));

            // Redirect to parks page with search results
            window.location.href = 'parks.html?search=' + encodeURIComponent(query);
        });
    }

    // Check for search query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
        const parkResults = JSON.parse(sessionStorage.getItem('parkResults') || '[]');
        const routeResults = JSON.parse(sessionStorage.getItem('routeResults') || '[]');

        if (window.location.pathname.includes('parks.html')) {
            displayAllParks(parkResults);
        } else if (window.location.pathname.includes('routes.html')) {
            displayAllRoutes(routeResults);
        }
    }
}

// Mobile Menu Functions
function initMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    // Open mobile menu
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            document.body.classList.add('menu-open');
        });
    }

    // Close mobile menu
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }

    // Close menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}
