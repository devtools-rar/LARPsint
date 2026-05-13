const state = {
    type: 'phone',
    isScanning: false
};

const elements = {
    tabs: document.querySelectorAll('.tab'),
    input: document.getElementById('searchInput'),
    button: document.getElementById('searchBtn'),
    log: document.getElementById('scanLog'),
    area: document.getElementById('resultsArea'),
    content: document.getElementById('resultsContent')
};

// --- INIT ---
elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        elements.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.type = tab.dataset.type;
        elements.input.placeholder = `ENTER_${state.type.toUpperCase()}...`;
    });
});

elements.button.addEventListener('click', startScan);
elements.input.addEventListener('keypress', e => e.key === 'Enter' && startScan());

// --- CORE LOGIC ---
async function startScan() {
    const val = elements.input.value.trim();
    if (!val || state.isScanning) return;

    state.isScanning = true;
    elements.button.disabled = true;
    elements.button.innerText = 'SCANNING...';
    elements.area.style.display = 'none';
    elements.content.innerHTML = '';
    elements.log.style.display = 'block';
    elements.log.innerHTML = '';

    await log('INITIALIZING ANALYZER...');
    await log(`TARGET_TARGET: ${val}`);

    try {
        if (state.type === 'discord') {
            await runDeepDiscordScan(val);
        } else {
            await runDeepPhoneScan(val);
        }
    } catch (err) {
        await log(`CRITICAL_ERROR: ${err.message}`);
    } finally {
        state.isScanning = false;
        elements.button.disabled = false;
        elements.button.innerText = 'EXECUTE_SCAN';
    }
}

async function log(msg) {
    const div = document.createElement('div');
    div.className = 'log-line';
    div.innerHTML = `<span class="log-time">[${new Date().toLocaleTimeString()}]</span> ${msg}`;
    elements.log.appendChild(div);
    elements.log.scrollTop = elements.log.scrollHeight;
    return new Promise(r => setTimeout(r, 400));
}

// --- SCAN STAGES ---
async function runDeepDiscordScan(id) {
    await log('QUERYING DISCORD_PRIMARY_API...');
    
    // Stage 1: Basic Info
    let primaryData;
    try {
        const res = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${id}`);
        primaryData = res.ok ? await res.json() : null;
    } catch (e) { primaryData = null; }

    if (primaryData) {
        await log('PRIMARY_MATCH_FOUND. RESOLVING METADATA...');
    } else {
        await log('PRIMARY_API_TIMEOUT. PIVOTING TO ARCHIVE_INDEX...');
        primaryData = { username: 'TARGET_USER', id: id, created_at: 'N/A' };
    }

    // Stage 2: Connected Apps (Pivot)
    await log('SCANNING_FOR_CONNECTED_APPLICATIONS...');
    await new Promise(r => setTimeout(r, 1000));
    const connections = [
        { platform: 'Github', account: 'ghost_dev_99', verified: 'YES' },
        { platform: 'Steam', account: '765611980000000', verified: 'YES' },
        { platform: 'Twitter', account: '@unknown_hacker', verified: 'NO' }
    ];
    await log(`FOUND ${connections.length} ASSOCIATED_PLATFORMS.`);

    // Stage 3: Breach Data (Deep Scan)
    await log('CORRELATING_WITH_LEAK_DATABASES...');
    const leaks = [
        { db: 'DISCORD_IO_2023', email: 'user***@gmail.com', pass: '$2y$10$xyz...', ip: '192.168.1.44' },
        { db: 'NITRO_SCRAPER_DUMP', email: 'user***@proton.me', pass: 'cleartext_pass123', ip: '45.12.33.102' }
    ];

    renderDiscordDeepResult(primaryData, connections, leaks);
}

async function runDeepPhoneScan(phone) {
    await log('VALIDATING_CARRIER_DATA...');
    await log('PIVOTING_TO_GEO_LOCATION_INDEX...');
    
    // Mock Deep Scan
    const geo = { carrier: 'VERIZON_WIRELESS', region: 'LOS_ANGELES, CA', coord: '34.0522, -118.2437' };
    await log('GEOLOCATION_SUCCESSFUL.');

    await log('SCANNING_GLOBAL_LEAK_ARCHIVES...');
    const leaks = [
        { db: 'FACEBOOK_500M', name: 'John Doe (Extracted)', email: 'j.doe***@gmail.com', address: '123 Fake St, LA, CA 90001' },
        { db: 'LEDGER_LEAK', name: 'N/A', email: 'crypto_hacker@proton.me', address: 'REDACTED_BY_API' }
    ];

    renderPhoneDeepResult(phone, geo, leaks);
}

// --- RENDERERS ---
function renderDiscordDeepResult(user, conn, leaks) {
    elements.area.style.display = 'block';
    
    let html = `
        <div class="section-title">PRIMARY_ACCOUNT_INFO</div>
        <table>
            <tr><th>KEY</th><th>VALUE</th></tr>
            <tr><td>USERNAME</td><td>${user.username}</td></tr>
            <tr><td>SNOWFLAKE_ID</td><td>${user.id}</td></tr>
            <tr><td>CREATED_ON</td><td>${user.created_at}</td></tr>
            <tr><td>GLOBAL_NAME</td><td>${user.global_name || 'N/A'}</td></tr>
        </table>

        <div class="section-title">CONNECTED_APPLICATIONS</div>
        <table>
            <tr><th>PLATFORM</th><th>ACCOUNT_IDENTIFIER</th><th>VERIFIED</th></tr>
            ${conn.map(c => `<tr><td>${c.platform}</td><td>${c.account}</td><td>${c.verified}</td></tr>`).join('')}
        </table>

        <div class="section-title">BREACH_DATA_DETECTION</div>
        <table>
            <tr><th>SOURCE_DATABASE</th><th>EMAIL_LEAKED</th><th>PASSWORD_HASH/TEXT</th><th>LAST_KNOWN_IP</th></tr>
            ${leaks.map(l => `<tr><td>${l.db}</td><td>${l.email}</td><td class="val-critical">${l.pass}</td><td>${l.ip}</td></tr>`).join('')}
        </table>
    `;
    elements.content.innerHTML = html;
}

function renderPhoneDeepResult(phone, geo, leaks) {
    elements.area.style.display = 'block';

    let html = `
        <div class="section-title">CARRIER_INTEL</div>
        <table>
            <tr><th>KEY</th><th>VALUE</th></tr>
            <tr><td>PHONE_NUMBER</td><td>${phone}</td></tr>
            <tr><td>CARRIER</td><td>${geo.carrier}</td></tr>
            <tr><td>LAST_KNOWN_REGION</td><td>${geo.region}</td></tr>
            <tr><td>COORDINATES</td><td>${geo.coord}</td></tr>
        </table>

        <div class="section-title">PHYSICAL_ADDRESS_TRACE</div>
        <table>
            <tr><th>SOURCE_DB</th><th>NAME_MATCH</th><th>ASSOCIATED_ADDRESS</th></tr>
            ${leaks.map(l => `<tr><td>${l.db}</td><td>${l.name}</td><td class="val-critical">${l.address}</td></tr>`).join('')}
        </table>

        <div class="section-title">BREACHED_CREDENTIALS</div>
        <table>
            <tr><th>DATABASE</th><th>EMAIL_LINKED</th></tr>
            ${leaks.map(l => `<tr><td>${l.db}</td><td>${l.email}</td></tr>`).join('')}
        </table>
    `;
    elements.content.innerHTML = html;
}
