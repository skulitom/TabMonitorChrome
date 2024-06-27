let lastCPUInfo = null;
let lastUpdateTime = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
    if (request.action === 'getResourceUsage') {
        chrome.tabs.query({}, (tabs) => {
            console.log('Found tabs:', tabs.length);
            getSystemInfo(tabs).then(tabUsageData => {
                console.log('Sending response with tab data:', tabUsageData);
                sendResponse({ tabUsageData });
            }).catch(error => {
                console.error('Error in getSystemInfo:', error);
                sendResponse({ error: error.message });
            });
        });
        return true; // Indicates we will send a response asynchronously
    }
});

async function getSystemInfo(tabs) {
    console.log('Getting system info');
    return new Promise((resolve, reject) => {
        Promise.all([
            new Promise(resolve => chrome.system.cpu.getInfo(resolve)),
            new Promise(resolve => chrome.system.memory.getInfo(resolve))
        ]).then(([cpuInfo, memoryInfo]) => {
            console.log('Received CPU info:', cpuInfo);
            console.log('Received Memory info:', memoryInfo);
            const currentTime = Date.now();
            let totalCPUUsage = 0;

            if (lastCPUInfo && lastUpdateTime) {
                const timeDiff = (currentTime - lastUpdateTime) / 1000; // seconds
                totalCPUUsage = cpuInfo.processors.reduce((sum, processor, index) => {
                    const usageDiff = processor.usage.total - lastCPUInfo.processors[index].usage.total;
                    return sum + (usageDiff / timeDiff / 10); // Divide by 10 to convert to percentage
                }, 0) / cpuInfo.numOfProcessors;
            }

            console.log('Calculated total CPU usage:', totalCPUUsage);

            lastCPUInfo = cpuInfo;
            lastUpdateTime = currentTime;

            const totalMemory = memoryInfo.capacity;
            const usedMemory = totalMemory - memoryInfo.availableCapacity;

            let tabUsageData = tabs.map(tab => {
                if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
                    // Distribute CPU and memory usage evenly among tabs as a fallback
                    const cpuUsage = totalCPUUsage / tabs.length;
                    const memoryUsage = (usedMemory / tabs.length) / (1024 * 1024); // Convert to MB

                    return {
                        tabId: tab.id,
                        tabTitle: tab.title,
                        cpuUsage: cpuUsage.toFixed(2),
                        memoryUsage: memoryUsage.toFixed(2),
                    };
                }
                return null;
            }).filter(Boolean);

            console.log('Processed tab usage data:', tabUsageData);
            resolve(tabUsageData);
        }).catch(error => {
            console.error('Error getting system info:', error);
            reject(error);
        });
    });
}

chrome.tabs.onRemoved.addListener((tabId) => {
    console.log('Tab removed:', tabId);
});