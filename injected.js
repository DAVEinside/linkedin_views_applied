(function() {
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            const url = args[0];
            
            if (typeof url === 'string' && url.includes('voyager/api/jobs/jobPostings')) {
                response.clone().json().then(data => {
                    try {
                        if (data && data.data) {
                            const applies = findInObject(data.data, 'applies');
                            const views = findInObject(data.data, 'views');
                            
                            window.postMessage({
                                type: 'LINKEDIN_JOB_DATA',
                                applies: applies,
                                views: views
                            }, '*');
                        }
                    } catch (error) {
                        console.error('Error parsing LinkedIn job data:', error);
                    }
                });
            }
            
            return response;
        });
    };
    
    function findInObject(obj, key) {
        if (typeof obj !== 'object' || obj === null) {
            return null;
        }
        
        if (obj.hasOwnProperty(key)) {
            return obj[key];
        }
        
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                const result = findInObject(obj[prop], key);
                if (result !== null) {
                    return result;
                }
            }
        }
        
        return null;
    }
})();