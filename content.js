let jobStats = null;

function injectScript() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
}

window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    
    if (event.data.type === 'LINKEDIN_JOB_DATA') {
        jobStats = {
            applies: event.data.applies,
            views: event.data.views
        };
        
        setTimeout(() => {
            displayJobStats();
        }, 1000);
    }
});

function displayJobStats() {
    if (!jobStats) return;
    
    const existingStats = document.getElementById('linkedin-job-stats');
    if (existingStats) {
        existingStats.remove();
    }
    
    const jobDetailsSection = document.querySelector('.jobs-search__job-details, .job-details-jobs-unified-top-card, [data-test-id="job-details-card"]');
    
    if (jobDetailsSection) {
        const statsContainer = document.createElement('div');
        statsContainer.id = 'linkedin-job-stats';
        statsContainer.className = 'job-stats-container';
        
        statsContainer.innerHTML = `
            <div class="job-stats-header">Job Statistics</div>
            <div class="job-stats-content">
                ${jobStats.applies !== null ? `<div class="job-stat-item">
                    <span class="job-stat-icon">👥</span>
                    <span class="job-stat-label">Applications:</span>
                    <span class="job-stat-value">${jobStats.applies}</span>
                </div>` : ''}
                ${jobStats.views !== null ? `<div class="job-stat-item">
                    <span class="job-stat-icon">👁️</span>
                    <span class="job-stat-label">Views:</span>
                    <span class="job-stat-value">${jobStats.views}</span>
                </div>` : ''}
            </div>
        `;
        
        jobDetailsSection.insertBefore(statsContainer, jobDetailsSection.firstChild);
    }
}

function checkForJobPage() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/jobs/view/')) {
        jobStats = null;
        setTimeout(() => {
            const existingStats = document.getElementById('linkedin-job-stats');
            if (existingStats) {
                existingStats.remove();
            }
        }, 500);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectScript);
} else {
    injectScript();
}

let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        checkForJobPage();
        if (url.includes('/jobs/view/')) {
            setTimeout(injectScript, 1000);
        }
    }
}).observe(document, { subtree: true, childList: true });