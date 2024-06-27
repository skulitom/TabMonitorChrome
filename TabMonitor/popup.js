document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup DOM loaded');
    const tabUsageContainer = document.getElementById('tabUsageContainer');

    const updateResourceUsage = () => {
        console.log('Updating resource usage');
        chrome.runtime.sendMessage({ action: 'getResourceUsage' }, handleResponse);
    };

    const handleResponse = (response) => {
        console.log('Received response:', response);
        if (response && Array.isArray(response.tabUsageData)) {
            console.log('Updating tab data');
            updateTabData(response.tabUsageData);
        } else if (response && response.error) {
            console.error('Error from background script:', response.error);
            handleError(response.error);
        } else {
            console.error('Invalid response format:', response);
            handleError('Invalid response format');
        }
    };

    const handleError = (error) => {
        console.error('Error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error updating data: ' + error;
        errorMessage.className = 'error-message';
        tabUsageContainer.innerHTML = '';
        tabUsageContainer.appendChild(errorMessage);
    };

    const updateTabData = (tabUsageData) => {
        console.log('Updating tab data:', tabUsageData);
        if (tabUsageData.length === 0) {
            console.log('No tabs to monitor');
            tabUsageContainer.innerHTML = '<p>No active tabs to monitor.</p>';
            return;
        }

        tabUsageContainer.innerHTML = '';
        tabUsageData.forEach(tabData => {
            const tabElement = createTabElement(tabData);
            tabUsageContainer.appendChild(tabElement);
        });
    };

    const createTabElement = (tabData) => {
        console.log('Creating tab element:', tabData);
        const tabElement = document.createElement('div');
        tabElement.className = 'tab-info';
        updateTabElement(tabElement, tabData);
        return tabElement;
    };

    const updateTabElement = (tabElement, tabData) => {
        console.log('Updating tab element:', tabData);
        const cpuUsage = parseFloat(tabData.cpuUsage);
        const memoryUsage = parseFloat(tabData.memoryUsage);
        const cpuColor = getCPUColor(cpuUsage);
        tabElement.innerHTML = `
            <div class="tab-title">${tabData.tabTitle}</div>
            <div class="tab-stats">
                <span>CPU: <span class="cpu-usage" style="color: ${cpuColor};">${cpuUsage}%</span></span>
                <span>Memory: <span class="memory-usage">${memoryUsage.toFixed(2)} MB</span></span>
            </div>
            <div class="cpu-bar">
                <div class="cpu-bar-fill" style="width: ${Math.min(cpuUsage, 100)}%; background-color: ${cpuColor};"></div>
            </div>
            <button class="close-btn" data-tabid="${tabData.tabId}">Close</button>
        `;
        tabElement.querySelector('.close-btn').addEventListener('click', closeTab);
    };

    const getCPUColor = (usage) => {
        if (usage < 30) return '#03dac6';
        if (usage < 70) return '#bb86fc';
        return '#cf6679';
    };

    const closeTab = function() {
        const tabId = parseInt(this.getAttribute('data-tabid'), 10);
        console.log('Closing tab:', tabId);
        chrome.tabs.remove(tabId);
        this.closest('.tab-info').remove();
    };

    console.log('Setting up update interval');
    updateResourceUsage();
    setInterval(updateResourceUsage, 1000); // Update every second
});