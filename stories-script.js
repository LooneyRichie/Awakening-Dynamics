// Spiritual Stories Script with Input Sanitization

// Load stories from localStorage
let stories = JSON.parse(localStorage.getItem('spiritualStories')) || [];

// Input Sanitization Functions
const sanitizeInput = {
    // Remove all HTML tags and script content
    stripHTML: (str) => {
        if (!str) return '';
        // Remove script tags and their content
        str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        // Remove all HTML tags
        str = str.replace(/<[^>]*>/g, '');
        // Decode HTML entities
        const textarea = document.createElement('textarea');
        textarea.innerHTML = str;
        return textarea.value;
    },

    // Remove potentially dangerous characters and patterns
    removeDangerousPatterns: (str) => {
        if (!str) return '';
        // Remove javascript: protocol
        str = str.replace(/javascript:/gi, '');
        // Remove data: protocol
        str = str.replace(/data:/gi, '');
        // Remove vbscript: protocol
        str = str.replace(/vbscript:/gi, '');
        // Remove on* event handlers
        str = str.replace(/on\w+\s*=/gi, '');
        return str;
    },

    // Escape special characters for safe HTML rendering
    escapeHTML: (str) => {
        if (!str) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
        };
        return str.replace(/[&<>"'/]/g, (char) => map[char]);
    },

    // Comprehensive sanitization
    sanitize: (str) => {
        if (!str) return '';
        // First strip HTML
        str = sanitizeInput.stripHTML(str);
        // Then remove dangerous patterns
        str = sanitizeInput.removeDangerousPatterns(str);
        // Trim whitespace
        str = str.trim();
        // Limit length as extra protection
        const maxLength = 5000;
        if (str.length > maxLength) {
            str = str.substring(0, maxLength);
        }
        return str;
    },

    // Validate input doesn't contain common XSS patterns
    isValid: (str) => {
        if (!str) return true;
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /eval\(/i,
            /expression\(/i,
        ];
        return !dangerousPatterns.some(pattern => pattern.test(str));
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    renderStories('all');
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Form submission
    const form = document.getElementById('storyForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Character counter
    const storyContent = document.getElementById('storyContent');
    if (storyContent) {
        storyContent.addEventListener('input', updateCharCounter);
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter stories
            const category = e.target.getAttribute('data-category');
            renderStories(category);
        });
    });
}

// Handle form submission with sanitization
function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitMessage = document.getElementById('submitMessage');

    // Get form values
    const rawName = form.storyName.value;
    const rawTitle = form.storyTitle.value;
    const rawCategory = form.storyCategory.value;
    const rawContent = form.storyContent.value;

    // Validate inputs before sanitization
    if (!sanitizeInput.isValid(rawName) || 
        !sanitizeInput.isValid(rawTitle) || 
        !sanitizeInput.isValid(rawContent)) {
        showMessage('Error: Invalid content detected. Please remove any HTML or script tags.', 'error');
        return;
    }

    // Sanitize all inputs
    const name = sanitizeInput.sanitize(rawName);
    const title = sanitizeInput.sanitize(rawTitle);
    const category = sanitizeInput.sanitize(rawCategory);
    const content = sanitizeInput.sanitize(rawContent);

    // Validate sanitized inputs
    if (!name || !title || !category || !content) {
        showMessage('Error: All fields are required.', 'error');
        return;
    }

    if (name.length > 50) {
        showMessage('Error: Name must be 50 characters or less.', 'error');
        return;
    }

    if (title.length > 100) {
        showMessage('Error: Title must be 100 characters or less.', 'error');
        return;
    }

    if (content.length < 50) {
        showMessage('Error: Story must be at least 50 characters.', 'error');
        return;
    }

    if (content.length > 5000) {
        showMessage('Error: Story must be 5000 characters or less.', 'error');
        return;
    }

    // Create story object
    const story = {
        id: Date.now(),
        name: name,
        title: title,
        category: category,
        content: content,
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        timestamp: Date.now()
    };

    // Add to stories array
    stories.unshift(story); // Add to beginning of array

    // Save to localStorage
    try {
        localStorage.setItem('spiritualStories', JSON.stringify(stories));
        showMessage('✨ Your story has been shared! Thank you for inspiring others. ✨', 'success');
        
        // Reset form
        form.reset();
        updateCharCounter();
        
        // Refresh stories display
        renderStories('all');
        
        // Reset filter to "All Stories"
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('active');
            }
        });

        // Scroll to stories section
        setTimeout(() => {
            document.getElementById('storiesContainer').scrollIntoView({ behavior: 'smooth' });
        }, 1000);

    } catch (error) {
        showMessage('Error: Could not save story. Your browser storage may be full.', 'error');
        console.error('Storage error:', error);
    }
}

// Update character counter
function updateCharCounter() {
    const textarea = document.getElementById('storyContent');
    const counter = document.getElementById('charCount');
    if (textarea && counter) {
        const count = textarea.value.length;
        counter.textContent = count;
        
        // Change color if approaching limit
        if (count > 4500) {
            counter.style.color = '#ef4444';
        } else if (count > 4000) {
            counter.style.color = '#f59e0b';
        } else {
            counter.style.color = 'var(--text-muted)';
        }
    }
}

// Show message to user
function showMessage(message, type) {
    const messageEl = document.getElementById('submitMessage');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `submit-message ${type}`;
        messageEl.style.display = 'block';

        // Hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

// Render stories with filtering
function renderStories(category) {
    const container = document.getElementById('storiesContainer');
    const noStoriesEl = document.getElementById('noStories');
    
    if (!container) return;

    // Filter stories
    let filteredStories = stories;
    if (category !== 'all') {
        filteredStories = stories.filter(story => story.category === category);
    }

    // Clear container except sample stories
    const sampleStories = container.querySelectorAll('.story-card');
    
    // Remove only user-submitted stories (those with data-id attribute)
    container.querySelectorAll('.story-card[data-id]').forEach(card => card.remove());

    // Hide sample stories if filtering for specific category
    sampleStories.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            const cardCategory = card.getAttribute('data-category');
            card.style.display = cardCategory === category ? 'block' : 'none';
        }
    });

    if (filteredStories.length === 0) {
        // Check if any sample stories are visible
        const visibleSamples = Array.from(sampleStories).some(card => 
            card.style.display !== 'none'
        );
        
        if (!visibleSamples && noStoriesEl) {
            noStoriesEl.style.display = 'block';
        }
        return;
    }

    if (noStoriesEl) {
        noStoriesEl.style.display = 'none';
    }

    // Render user stories
    filteredStories.forEach(story => {
        const storyCard = createStoryCard(story);
        container.appendChild(storyCard);
    });
}

// Create story card element
function createStoryCard(story) {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.setAttribute('data-category', story.category);
    card.setAttribute('data-id', story.id);

    // Map category to display name
    const categoryMap = {
        'awakening': 'Spiritual Awakening',
        'healing': 'Energy Healing',
        'manifestation': 'Manifestation Success',
        'curse-breaking': 'Breaking Curses/Hexes',
        'ancestral': 'Ancestral Healing',
        'meditation': 'Meditation Experience',
        'synchronicity': 'Synchronicities & Signs',
        'other': 'Other Spiritual Experience'
    };

    const categoryDisplay = categoryMap[story.category] || story.category;

    // Escape content for safe rendering (double protection)
    const safeName = sanitizeInput.escapeHTML(story.name);
    const safeTitle = sanitizeInput.escapeHTML(story.title);
    const safeContent = sanitizeInput.escapeHTML(story.content);
    const safeDate = sanitizeInput.escapeHTML(story.date);

    // Format content with line breaks
    const formattedContent = safeContent.replace(/\n/g, '<br>');

    card.innerHTML = `
        <div class="story-header">
            <h4>${safeTitle}</h4>
            <span class="story-category">${categoryDisplay}</span>
        </div>
        <div class="story-meta">
            <span class="story-author">By ${safeName}</span>
            <span class="story-date">${safeDate}</span>
        </div>
        <div class="story-content">
            <p>${formattedContent}</p>
        </div>
    `;

    return card;
}

// Optional: Add function to clear all stories (for development/admin)
function clearAllStories() {
    if (confirm('Are you sure you want to delete all user stories? This cannot be undone.')) {
        stories = [];
        localStorage.removeItem('spiritualStories');
        renderStories('all');
        showMessage('All stories have been cleared.', 'success');
    }
}

// Expose clear function to console for admin use
window.clearAllStories = clearAllStories;