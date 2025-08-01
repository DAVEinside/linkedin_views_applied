let jobStats = null;

function injectScript() {
    if (document.getElementById('linkedin-extension-injected')) {
        return;
    }
    
    const script = document.createElement('script');
    script.id = 'linkedin-extension-injected';
    script.src = chrome.runtime.getURL('injected.js');
    script.onload = function() {
        console.log('LinkedIn extension script injected successfully');
    };
    script.onerror = function() {
        console.error('Failed to inject LinkedIn extension script');
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
    
    // Multiple selectors to find job details section across different LinkedIn page layouts
    const selectors = [
        '.jobs-search__job-details',
        '.job-details-jobs-unified-top-card',
        '[data-test-id="job-details-card"]',
        '.jobs-unified-top-card',
        '.job-details-module',
        '.jobs-details',
        '.jobs-search__right-rail',
        '.job-view-layout'
    ];
    
    let jobDetailsSection = null;
    for (const selector of selectors) {
        jobDetailsSection = document.querySelector(selector);
        if (jobDetailsSection) break;
    }
    
    if (jobDetailsSection) {
        const statsContainer = document.createElement('div');
        statsContainer.id = 'linkedin-job-stats';
        statsContainer.className = 'job-stats-container';
        
        statsContainer.innerHTML = `
            <div class="job-stats-header">📊 Job Statistics</div>
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
        console.log('LinkedIn job stats displayed:', jobStats);
    } else {
        console.log('Could not find job details section to display stats');
    }
}

function checkForJobPage() {
    const currentUrl = window.location.href;
    const isJobPage = currentUrl.includes('/jobs/') && (
        currentUrl.includes('/jobs/view/') ||
        currentUrl.includes('/jobs/search-results/') ||
        currentUrl.includes('/jobs/collections/') ||
        currentUrl.includes('currentJobId=')
    );
    
    if (isJobPage) {
        jobStats = null;
        setTimeout(() => {
            const existingStats = document.getElementById('linkedin-job-stats');
            if (existingStats) {
                existingStats.remove();
            }
        }, 500);
        
        // Re-inject script for new page
        setTimeout(() => {
            injectScript();
        }, 1000);
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
        
        const isJobPage = url.includes('/jobs/') && (
            url.includes('/jobs/view/') ||
            url.includes('/jobs/search-results/') ||
            url.includes('/jobs/collections/') ||
            url.includes('currentJobId=')
        );
        
        if (isJobPage) {
            setTimeout(injectScript, 1000);
        }
    }
}).observe(document, { subtree: true, childList: true });