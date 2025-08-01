# LinkedIn Job Applicant Counter

A Chrome extension that automatically displays the number of applicants and views for LinkedIn job postings.

## Features

- 👥 Shows total number of applicants for any LinkedIn job post
- 👁️ Displays total job views count
- 🚀 Automatic detection - no manual interaction required
- 💫 Clean, professional UI that integrates seamlessly with LinkedIn

## How it Works

The extension intercepts LinkedIn's internal API calls (`voyager/api/jobs/jobPostings`) and extracts the applicant and view count data that LinkedIn uses internally. This data is then displayed in a clean, styled box at the top of each job posting.

## Installation

### Method 1: Load Unpacked (Development)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the folder containing these files
5. The extension is now installed and active

### Method 2: From Chrome Web Store

*Coming soon - extension will be published to the Chrome Web Store*

## Usage

1. Navigate to any LinkedIn job posting (e.g., `https://www.linkedin.com/jobs/view/123456789`)
2. The extension will automatically detect the page and extract job statistics
3. View the applicant count and job views in the "Job Statistics" box that appears at the top of the job details

## Files Structure

```
├── manifest.json     # Extension configuration
├── content.js        # Main content script
├── injected.js       # Network request interceptor
├── styles.css        # UI styling
└── README.md         # This file
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Active tab and LinkedIn host permissions only
- **Privacy**: No data is collected or transmitted - everything runs locally
- **Compatibility**: Works with all modern versions of Chrome

## Privacy & Security

- No user data is collected or stored
- No external servers or APIs are contacted
- Only accesses LinkedIn pages when you visit them
- Source code is fully open and auditable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on LinkedIn job pages
5. Submit a pull request

## License

MIT License - feel free to use and modify as needed.

## Disclaimer

This extension is for educational and personal use. Please respect LinkedIn's terms of service and use responsibly.