// --- Configuration & State ---
const state = {
    searchType: 'phone',
    isScanning: false,
    history: []
};

// --- DOM Elements ---
const tabs = document.querySelectorAll('.tab');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const statusArea = document.getElementById('statusArea');
const resultsContainer = document.getElementById('resultsContainer');
const resultsContent = document.getElementById('resultsContent');

// --- Initialization ---
function init() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.searchType = tab.dataset.type;
            updatePlaceholder();
        });
    });

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

function updatePlaceholder() {
    if (state.searchType === 'phone') {
        searchInput.placeholder = 'Enter phone number (e.g. +1234567890)...';
    } else {
        searchInput.placeholder = 'Enter Discord User ID (e.g. 155149108183695360)...';
    }
}

// --- Terminal Logic ---
function log(message, delay = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'status-line';
            const time = new Date().toLocaleTimeString([], { hour12: false });
            line.innerHTML = `<span class="timestamp">[${time}]</span> <span class="msg">${message}</span>`;
            statusArea.appendChild(line);
            statusArea.scrollTop = statusArea.scrollHeight;
            resolve();
        }, delay);
    });
}

// --- Search Handler ---
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    if (state.isScanning) return;
    state.isScanning = true;

    // Reset UI
    resultsContainer.style.display = 'none';
    resultsContent.innerHTML = '';
    statusArea.style.display = 'block';
    statusArea.innerHTML = '';
    searchBtn.disabled = true;
    searchBtn.innerHTML = `<span>Scanning...</span> <i data-lucide="loader-2" class="spin" size="18"></i>`;
    lucide.createIcons();

    try {
        await log(`Initializing TracePoint Engine v1.0.4...`, 200);
        await log(`Target identified: [${query}]`, 400);
        await log(`Bypassing redundant nodes...`, 600);
        await log(`Scanning Global Breach Index (GBI)...`, 800);

        if (state.searchType === 'discord') {
            await performDiscordSearch(query);
        } else {
            await performPhoneSearch(query);
        }

    } catch (error) {
        await log(`[ERROR] Search interrupted: ${error.message}`, 500);
    } finally {
        state.isScanning = false;
        searchBtn.disabled = false;
        searchBtn.innerHTML = `<span>Initiate Scan</span> <i data-lucide="zap" size="18"></i>`;
        lucide.createIcons();
    }
}

// --- Search Logic: Discord ---
async function performDiscordSearch(userId) {
    if (!/^\d{17,19}$/.test(userId)) {
        await log(`[CRITICAL] Invalid Discord ID format. Must be 17-19 digits.`, 300);
        return;
    }

    try {
        const response = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${userId}`);
        if (!response.ok) throw new Error('User not found or API limited');
        const data = await response.json();

        await log(`[SUCCESS] Packet received from Discord API.`, 400);
        await log(`Correlating with public data dumps...`, 600);
        
        // Mocking leak correlation for demonstration
        const leaks = [
            { source: 'NitroGenerator.zip (Malware)', date: '2023-11-12', severity: 'danger', fields: 'Token, Email, Phone' },
            { source: 'Discord.io Breach', date: '2023-08-14', severity: 'warning', fields: 'Username, ID, Join Date' }
        ];

        renderDiscordResult(data, leaks);
        resultsContainer.style.display = 'block';
        await log(`Report generated. Data integrity: 98%.`, 300);

    } catch (err) {
        await log(`[WARN] Discord API unreachable. Falling back to cached index...`, 400);
        // Provide a mock result if API fails (for demo)
        renderDiscordResult({ 
            username: 'UnknownTarget', 
            id: userId, 
            avatar: null,
            created_at: '2021-04-12T14:22:00Z'
        }, []);
        resultsContainer.style.display = 'block';
    }
}

// --- Search Logic: Phone ---
async function performPhoneSearch(phone) {
    // Basic cleanup
    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) {
        await log(`[CRITICAL] Input too short. International format required.`, 300);
        return;
    }

    await log(`Analyzing carrier and region metadata...`, 500);
    await log(`Scanning 4,821 databases for match...`, 800);

    // Mocking Phone Results (Real phone breach check usually requires HIBP key)
    const mockData = {
        carrier: 'Simulated Carrier Network',
        region: 'United States',
        leaks: [
            { source: 'Facebook 533M Dump', date: '2021-04-03', severity: 'danger', fields: 'Phone, Full Name, DOB, Location' },
            { source: 'Ledger Marketing Leak', date: '2020-07-25', severity: 'warning', fields: 'Phone, Email, Address' }
        ]
    };

    setTimeout(async () => {
        renderPhoneResult(phone, mockData);
        resultsContainer.style.display = 'block';
        await log(`[ALERT] High-severity matches found in ${mockData.leaks.length} archives.`, 400);
        await log(`Process complete.`, 200);
    }, 1500);
}

// --- Rendering Logic ---
function renderDiscordResult(user, leaks) {
    const avatarUrl = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png';
    
    let leaksHtml = leaks.map(leak => `
        <div class="result-card" style="border-left: 4px solid var(--${leak.severity}-color)">
            <div class="result-header">
                <div>
                    <h3 style="color: var(--${leak.severity}-color)">${leak.source}</h3>
                    <p class="data-label">Identified on: ${leak.date}</p>
                </div>
                <span class="badge badge-${leak.severity}">${leak.severity}</span>
            </div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="data-label">Compromised Data</span>
                    <span class="data-value">${leak.fields}</span>
                </div>
            </div>
        </div>
    `).join('');

    resultsContent.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <div style="display: flex; gap: 1.5rem; align-items: center;">
                    <img src="${avatarUrl}" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid var(--accent-color)">
                    <div>
                        <h2>${user.username}${user.discriminator !== '0' ? '#' + user.discriminator : ''}</h2>
                        <p class="data-label">Discord Snowflake ID: ${user.id}</p>
                    </div>
                </div>
                <span class="badge badge-success">Active Target</span>
            </div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="data-label">Account Created</span>
                    <span class="data-value">${new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div class="data-item">
                    <span class="data-label">Global Name</span>
                    <span class="data-value">${user.global_name || 'N/A'}</span>
                </div>
            </div>
        </div>
        ${leaks.length > 0 ? `<h2 style="margin-bottom: 1.5rem; color: var(--danger-color)">Associated Leaks</h2>` + leaksHtml : `<div class="result-card"><p>No direct leaks found in public index.</p></div>`}
    `;
}

function renderPhoneResult(phone, data) {
    let leaksHtml = data.leaks.map(leak => `
        <div class="result-card" style="border-left: 4px solid var(--${leak.severity}-color)">
            <div class="result-header">
                <div>
                    <h3 style="color: var(--${leak.severity}-color)">${leak.source}</h3>
                    <p class="data-label">Breach Date: ${leak.date}</p>
                </div>
                <span class="badge badge-${leak.severity}">${leak.severity}</span>
            </div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="data-label">Compromised Data</span>
                    <span class="data-value">${leak.fields}</span>
                </div>
            </div>
        </div>
    `).join('');

    resultsContent.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <div>
                    <h2>${phone}</h2>
                    <p class="data-label">Phone Identity Report</p>
                </div>
                <span class="badge badge-warning">Scanned</span>
            </div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="data-label">Carrier</span>
                    <span class="data-value">${data.carrier}</span>
                </div>
                <div class="data-item">
                    <span class="data-label">Region</span>
                    <span class="data-value">${data.region}</span>
                </div>
            </div>
        </div>
        <h2 style="margin-bottom: 1.5rem; color: var(--danger-color)">Intelligence Correlation</h2>
        ${leaksHtml}
    `;
}

// Start
init();
