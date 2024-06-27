# Tab Resource Monitor

Tab Resource Monitor is a Chrome extension that allows users to monitor the CPU and memory usage of their active browser tabs in real-time. This tool is designed to help users identify resource-intensive tabs and manage their browser's performance more effectively.

## Features

- Real-time monitoring of CPU and memory usage for each active tab
- Visual representation of CPU usage with color-coded bars
- Ability to close resource-intensive tabs directly from the extension popup
- DevTools panel integration for more detailed analysis
- Sleek, dark-themed user interface for easy readability

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.
5. The Tab Resource Monitor extension should now appear in your Chrome toolbar.

## Usage

1. Click on the Tab Resource Monitor icon in the Chrome toolbar to open the popup.
2. The popup will display a list of active tabs with their respective CPU and memory usage.
3. CPU usage is represented by a color-coded bar:
   - Green: Low usage
   - Purple: Moderate usage
   - Red: High usage
4. To close a resource-intensive tab, click the "Close" button next to the tab's information.
5. The information updates automatically every second.

## DevTools Integration

Tab Resource Monitor also includes a DevTools panel for more detailed analysis:

1. Open Chrome DevTools (F12 or Ctrl+Shift+I).
2. Look for the "Tab Resource Monitor" panel in the DevTools tabs.
3. This panel provides additional debugging information and performance metrics.

## Project Structure

- `manifest.json`: Extension configuration file
- `background.js`: Background script for handling extension logic
- `popup.html` & `popup.js`: User interface for the extension popup
- `devtools.html` & `devtools.js`: DevTools panel integration
- `styles.css`: Styling for the extension UI

## Permissions

This extension requires the following permissions:

- `tabs`: To access and manage browser tabs
- `system.cpu`: To monitor CPU usage
- `system.memory`: To monitor memory usage
- `<all_urls>`: To access tab information across all websites

## Contributing

Contributions to improve Tab Resource Monitor are welcome. Please feel free to submit issues or pull requests on the project repository.

## Disclaimer

This extension is for informational purposes only. CPU and memory usage data are approximations and may not reflect exact system resource allocation.
