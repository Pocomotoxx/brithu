function handleCredentialResponse(response) {
  const responsePayload = decodeJwtResponse(response.credential);

  console.log("ID: " + responsePayload.sub);
  console.log('Full Name: ' + responsePayload.name);
  console.log('Given Name: ' + responsePayload.given_name);
  console.log('Family Name: ' + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);

  // You can also pass the token to your backend for verification
  const id_token = response.credential;
  console.log("ID Token: " + id_token);

  // Close the login modal and show user info
  document.getElementById('login-modal').classList.add('hidden');
  document.getElementById('user-info').classList.remove('hidden');
  document.getElementById('login-btn').innerHTML = '👤 ' + responsePayload.name;
  document.getElementById('login-btn').classList.remove('from-green-500', 'to-blue-500');
  document.getElementById('login-btn').classList.add('from-gray-500', 'to-gray-600');
}

function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

// CRM System Class
class CRMSystem {
    constructor() {
        this.isLoggedIn = false;
        this.services = {
            gmail: { name: 'Gmail', url: 'https://mail.google.com', color: 'red' },
            calendar: { name: 'Google Calendar', url: 'https://calendar.google.com', color: 'blue' },
            drive: { name: 'Google Drive', url: 'https://drive.google.com', color: 'green' },
            keep: { name: 'Google Keep', url: 'https://keep.google.com', color: 'yellow' },
            tasks: { name: 'Google Tasks', url: 'https://tasks.google.com', color: 'purple' },
            meet: { name: 'Google Meet', url: 'https://meet.google.com', color: 'indigo' },
            contacts: { name: 'Google Contacts', url: 'https://contacts.google.com', color: 'teal' },
            gemini: { name: 'Gemini AI', url: 'https://gemini.google.com', color: 'gradient' },
            // Sidebar services
            chat: { name: 'Google Chat', url: 'https://chat.google.com', color: 'green' },
            groups: { name: 'Google Groups', url: 'https://groups.google.com', color: 'blue' },
            docs: { name: 'Google Docs', url: 'https://docs.google.com', color: 'blue' },
            sheets: { name: 'Google Sheets', url: 'https://sheets.google.com', color: 'green' },
            slides: { name: 'Google Slides', url: 'https://slides.google.com', color: 'orange' },
            forms: { name: 'Google Forms', url: 'https://forms.google.com', color: 'purple' },
            sites: { name: 'Google Sites', url: 'https://sites.google.com', color: 'gray' },
            photos: { name: 'Google Photos', url: 'https://photos.google.com', color: 'red' },
            youtube: { name: 'YouTube', url: 'https://youtube.com', color: 'red' },
            maps: { name: 'Google Maps', url: 'https://maps.google.com', color: 'green' },
            translate: { name: 'Google Translate', url: 'https://translate.google.com', color: 'blue' },
            scholar: { name: 'Google Scholar', url: 'https://scholar.google.com', color: 'yellow' }
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.showNotification();
        this.initSidebar();
    }

    bindEvents() {
        // Login button
        document.getElementById('login-btn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('close-login').addEventListener('click', () => this.hideLoginModal());

        // Tour modal
        document.getElementById('tour-btn').addEventListener('click', () => this.showTourModal());
        document.getElementById('close-tour').addEventListener('click', () => this.hideTourModal());

        // Service modal
        document.getElementById('close-service').addEventListener('click', () => this.closeServiceModal());

        // Service tiles - main grid
        document.querySelectorAll('[data-service]').forEach(tile => {
            tile.addEventListener('click', (e) => {
                const service = e.currentTarget.dataset.service;
                this.openService(service);
            });
        });

        // Sidebar hover effect
        document.getElementById('sidebar').addEventListener('mouseenter', () => {
            document.querySelector('.content-area').classList.add('sidebar-expanded');
        });
        document.getElementById('sidebar').addEventListener('mouseleave', () => {
            document.querySelector('.content-area').classList.remove('sidebar-expanded');
        });
    }

    initSidebar() {
        // Sidebar items already have click handlers from the main bindEvents
    }

    showNotification() {
        setTimeout(() => {
            document.getElementById('notification').classList.add('show');
        }, 1000);

        setTimeout(() => {
            document.getElementById('notification').classList.remove('show');
        }, 8000);
    }

    showLoginModal() {
        document.getElementById('login-modal').classList.remove('hidden');
    }

    hideLoginModal() {
        document.getElementById('login-modal').classList.add('hidden');
    }

    showTourModal() {
        document.getElementById('tour-modal').classList.remove('hidden');
    }

    hideTourModal() {
        document.getElementById('tour-modal').classList.add('hidden');
    }

    openService(serviceName) {
        if (!this.isLoggedIn) {
            // Check if the user is logged in via Google
            if (typeof google !== 'undefined' && google.accounts.id.prompt) {
                 this.showNotification('⚠️ Kérjük, jelentkezzen be először!', 'orange');
                 this.showLoginModal();
                 return;
            }
        }


        const service = this.services[serviceName];
        if (!service) return;

        if (serviceName === 'gemini') {
            // Open Gemini in new tab
            window.open(service.url, '_blank');
            this.showNotification(`🚀 ${service.name} megnyitva új ablakban!`, 'blue');
        } else {
            // Open in modal
            this.showServiceModal(service);
        }

        this.logEvent('service_opened', { service: serviceName });
    }

    showServiceModal(service) {
        document.getElementById('service-title').textContent = service.name;
        document.getElementById('service-content').innerHTML = `
            <iframe src="${service.url}" class="service-iframe"></iframe>
        `;
        document.getElementById('service-modal').classList.remove('hidden');
    }

    closeServiceModal() {
        document.getElementById('service-modal').classList.add('hidden');
    }

    showNotification(message, color = 'blue') {
        const notification = document.createElement('div');
        const colors = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            orange: 'bg-orange-500',
            red: 'bg-red-500'
        };

        notification.className = `fixed top-20 right-4 ${colors[color]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    logEvent(eventType, data) {
        console.log(`Event: ${eventType}`, data);
    }
}

// Initialize the system when page loads
document.addEventListener('DOMContentLoaded', () => {
    const crm = new CRMSystem();
    const clientId = document.getElementById('g_id_onload').getAttribute('data-client_id');
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
        crm.showNotification('Kérjük, adja meg a Google Client ID-t a bejelentkezéshez!', 'red');
    }
});
