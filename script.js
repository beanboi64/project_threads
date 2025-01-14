document.addEventListener("DOMContentLoaded", () => {
    const postIcon = document.getElementById("post");
    const overlay = document.getElementById("overlay");
    const cancelButton = document.getElementById("cancel");

    // Show the overlay
    postIcon.addEventListener("click", () => {
        overlay.classList.remove("hidden-create-post");
        // Show the overlay background
        document.body.style.overflow = "hidden"; // Prevent scrolling
    });

    // Hide the overlay
    cancelButton.addEventListener("click", () => {
        overlay.classList.add("hidden-create-post");
        document.body.style.overflow = "hidden"; // Restore scrolling
    });

    // Close overlay if clicking outside of it
    window.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.add("hidden-create-post");
            document.body.style.overflow = "hidden"; // Restore scrolling
        }
    });
});

// Array of Font Awesome icons
const iconClasses = [
    'fa-comment', 'fa-comment-dots', 'fa-paperclip', 'fa-user', 'fa-users', 
    'fa-share', 'fa-reply', 'fa-link', 'fa-fire'
];

// Array to store falling icons and their positions
let fallingIcons = [];
let iconPositions = [];

// Max number of icons at any time
const maxIcons = 30;

// Cursor shield radius
const shieldRadius = 100;

// Function to create a random falling icon
function createFallingIcon() {
    if (fallingIcons.length >= maxIcons) return;

    const randomIcon = iconClasses[Math.floor(Math.random() * iconClasses.length)];
    const icon = document.createElement('i');
    icon.classList.add('fas', randomIcon, 'icon');
    let position = getRandomPosition();
    icon.style.left = `${position}px`;
    icon.style.top = `0px`;
    icon.style.fontSize = `${Math.random() * 30 + 20}px`;
    setIconColor(icon);
    fallingIcons.push(icon);
    iconPositions.push(position);
    document.body.appendChild(icon);
}

// Function to get a valid random position without overlap
function getRandomPosition() {
    let position;
    let overlap = true;
    let tries = 0;
    while (overlap && tries < 10) {
        position = Math.random() * window.innerWidth;
        overlap = iconPositions.some(p => Math.abs(position - p) < 50);
        tries++;
    }
    return position;
}

// Function to update the icons' positions and check for cursor collision
function updateIconPositions(cursorX, cursorY) {
    fallingIcons.forEach((icon, index) => {
        let iconY = parseFloat(icon.style.top) || 0;
        iconY += 5;

        // Avoid cursor shield
        const iconX = parseFloat(icon.style.left);
        const dx = iconX - cursorX;
        const dy = iconY - cursorY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < shieldRadius) {
            const angle = Math.atan2(dy, dx);
            icon.style.left = `${iconX + Math.cos(angle) * 5}px`;
            icon.style.top = `${iconY + Math.sin(angle) * 5}px`;
        } else {
            icon.style.top = `${iconY}px`;
        }

        // Remove icon if it goes off-screen
        if (iconY > window.innerHeight) {
            document.body.removeChild(icon);
            fallingIcons.splice(index, 1);
            iconPositions.splice(index, 1);
        }
    });
}

// Cursor position tracking
let cursorX = 0;
let cursorY = 0;
document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

// Set interval to create icons
setInterval(createFallingIcon, 700);

// Update falling icons' positions
setInterval(() => updateIconPositions(cursorX, cursorY), 50);

// Function to set icon color
let darkMode = localStorage.getItem("darkMode") === "true"; 

// Handle theme toggle
const themeSwitchButton = document.getElementById('switched-theme');
const lightSwitchButton = document.getElementById('hide-switch');

// Apply the theme on page load
applyTheme(darkMode);

// Event listeners to toggle theme on button click
themeSwitchButton.addEventListener('click', () => {
    darkMode = !darkMode;
    applyTheme(darkMode);
    localStorage.setItem("darkMode", darkMode);  // Store the current theme in localStorage
});

lightSwitchButton.addEventListener('click', () => {
    darkMode = !darkMode;
    applyTheme(darkMode);
    localStorage.setItem("darkMode", darkMode);  // Store the current theme in localStorage
});

// Function to apply the theme based on darkMode flag
function applyTheme(isDarkMode) {
    if (isDarkMode) {
        // Apply Dark Mode styles
        document.body.style.backgroundColor = '#000';
        document.body.style.color = 'white';
        themeSwitchButton.innerHTML = '<i class="fa-regular fa-lightbulb"></i>'; // Change to lightbulb icon
        lightSwitchButton.innerHTML = '<i class="fa-solid fa-sun"></i>'; // Change to sun icon

        // Update other elements for dark mode
        document.querySelectorAll('.username-sect').forEach(element => {
            element.style.color = '#fff';
        });
        document.querySelectorAll('.icon-color').forEach(icon => {
            icon.style.background = 'linear-gradient(to left, #f58529, #dd2a7b, #8134af, #515bd4)';
            icon.style.webkitBackgroundClip = 'text';
            icon.style.color = 'transparent';
        });
        document.querySelectorAll('.title-trending').forEach(icon => {
            icon.style.color = '#32CD32'; // Make the text transparent to show the gradient
        });
        document.querySelectorAll('.follow-btn').forEach(button => {
            button.style.background = '#fff';
            button.style.color = '#000';
        });
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.style.borderColor = '#eee';
            button.style.color = '#fff';
        });
    } else {
        document.body.style.backgroundColor = '#f0f0f0';
        document.body.style.color = 'black';
        themeSwitchButton.innerHTML = '<i class="fa-solid fa-moon"></i>'; // Change to moon icon
        lightSwitchButton.innerHTML = '<i class="fa-regular fa-lightbulb"></i>'; // Change to lightbulb icon

        // Update other elements for light mode
        document.querySelectorAll('.username-sect').forEach(element => {
            element.style.color = '';
        });
        document.querySelectorAll('.icon-color').forEach(icon => {
            icon.style.background = '';
            icon.style.webkitBackgroundClip = '';
            icon.style.color = '';
        });
        document.querySelectorAll('.title-trending').forEach(icon => {
            icon.style.background = '';
            icon.style.webkitBackgroundClip = '';
            icon.style.color = ''; // Make the text transparent to show the gradient
        });
        document.querySelectorAll('.follow-btn').forEach(button => {
            button.style.background = '';
            button.style.color = '';
        });
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.style.borderColor = '';
            button.style.color = '';
        });
    }
    // Ensure the icons reflect the current theme
    document.querySelectorAll('.icon').forEach(icon => {
        setIconColor(icon);
    });
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to set icon color based on current theme
function setIconColor(icon) {
    if (darkMode) {
        icon.style.color = getRandomColor(); // Random color in dark mode
    } else {
        icon.style.color = 'black'; // Black color in light mode
    }
}

// Update the position of falling icons
setInterval(() => {
    if (window.fallingIcons && window.fallingIcons.length > 0) {
        window.fallingIcons.forEach((icon, index) => {
            let iconY = parseFloat(icon.style.top) || 0;
            icon.style.top = `${iconY + 5}px`; // Move the icon down

            // Remove icon if it goes off-screen
            if (iconY > window.innerHeight) {
                document.body.removeChild(icon);
                window.fallingIcons.splice(index, 1);
            }
        });
    }
}, 100);

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    } else {
        return num.toString();
    }
}

function createRandomProfiles() {
    const images = [
        "pfp2", "pfp4", "pfp5", "pfp6", "pfp7", "pfp8", "pfp9", "pfp10", "pfp11",
        "pfp12", "pfp13", "pfp14", "pfp15", "pfp16", "pfp17", "pfp18", "pfp19", "pfp20", "pfp21", 
        "pfp22", "pfp23", "pfp24", "pfp25", "pfp26", "pfp27", "pfp28", "pfp29", "pfp30", "pfp31", 
        "pfp32", "pfp33", "pfp34", "pfp35", "pfp36", "pfp37", "pfp38", "pfp39", "pfp40", "pfp41"
    ];

    const usernames = [
        "ashford_smith", "lila.astro", "chroma.sky", "sarah_tech", "zenith.wave", "echo_dreams",
        "pixel.blaze", "skyfall.x", "harmony.chord", "stellar.nova", "quantum.arc", "venom.shade",
        "luna.spectra", "chrome.ghost", "nebula.shadow", "code.bender", "frost.fire", "electro.jive",
        "wild.card", "nova.quest", "electric.surge", "cosmic_vibe", "lunar_glow", "techno_spectrum",
        "vortex_rider", "digital_orbit", "starry_horizon", "binary_storm", "crimson.dusk", "polar.phoenix",
        "quantum_flux", "velvet.night", "digital_ether", "galactic_wind", "solar_wave", "neon_frost",
        "skyline_haze", "atomic_aurora", "solarflare_zen", "nebula_fusion", "void_ranger", "cyber_orb",
        "stellar_drift", "cosmic_pulse", "lunar_phantom", "hypernova_surge", "electron_vibe", "blackhole.eon",
        "waveform_rise", "phantom.sphere", "pixel_rift", "glitch_spectra", "eclipse_drift", "spectrum.breach",
        "nova_blaze", "stellar.frost", "vortex_haze", "astro_vortex", "galaxy_shift", "cosmic_mirror",
        "sunflare_prism", "starfall_rift", "celestial_horizon", "nightfall_surge", "neon_realm", "atomic_echo",
        "lunar_essence", "quantum_flux", "hypernova_wake", "frostburst_chill", "stellar_crash", "orbital_tide",
        "digital_waves", "void_echo", "cosmic_nova", "skyfall_chase", "photon_dream", "solarflare_wind",
        "starlight_abyss", "galactic_haze", "fusion_breath", "celestial_pulse", "crimson_moon", "spectrum_rift",
        "binary_frost", "neutron_wave", "quantum_realm", "horizon_zen", "wild.horizon", "galaxy_shade",
        "lunar_pulse", "techno_warp", "starfield_rise", "electric_vision", "nova_frost", "glitch_wave",
        "void_vision", "nova_spectrum", "lunar_breach", "crimson_radiance", "hyperflux_mirror", "stellar_shine",
        "darkwave_prism", "solarflare_surge", "orbital_rift", "quantum_shadow", "stellar_phantom", "nebula_rise",
        "cosmic_veil", "astral_night", "electro.flare", "void_cascade", "stellar_awakening", "neon_horizon"
    ];

    const accounts = document.querySelectorAll('.account-suggested');

    accounts.forEach(account => {
        const imageElement = account.querySelector('.pfp-image1 img');
        const usernameElement = account.querySelector('.profile-info #username');
        const threadsElement = account.querySelector('.profile-info #threads');
        const followersElement = account.querySelector('.profile-info #followers');
        const followingElement = account.querySelector('.profile-info #following');

        // Update profile image
        const randomImage = getRandomElement(images);
        imageElement.src = `./img/recommendation-img/${randomImage}.jpeg`;

        // Update username
        const randomUsername = getRandomElement(usernames);
        usernameElement.textContent = randomUsername;

        // Update stats
        threadsElement.textContent = formatNumber(generateRandomNumber(0, 50000));
        followersElement.textContent = formatNumber(generateRandomNumber(0, 230000000));
        followingElement.textContent = formatNumber(generateRandomNumber(0, 10000));
    });
}

// Call the function to update profiles on page load
createRandomProfiles();

const categoriesWithTitles = {
    Sports: ["ManchesterUnited", "SuperBowl", "WorldCup2024", "NBAFinals"],
    People: ["ChristianDiddy", "ElonMusk", "TaylorSwift", "Beyoncé"],
    "Health & Wellness": ["HealthyMindset", "YogaForAll", "MentalClarity", "FitnessGoals"],
    Gaming: ["CallOfDuty", "Fortnite", "LeagueOfLegends", "Minecraft"],
    "Music & Entertainment": ["SoundtrackOfLife", "Oscars2024", "GrammyAwards", "NewAlbumRelease"],
    "Beauty & Skincare": ["GlowUpGoals", "SkincareRoutine", "MakeupTrends2024", "BeautyHacks"],
    Lifestyle: ["SelfCareMatters", "MinimalistLiving", "TravelTips2024", "EcoFriendlyLifestyle"],
    "Social Experiment": ["Gwababa", "SocialMediaChallenge", "PublicReactions", "StreetInterviews"],
    Finance: ["CryptoTrends", "StockMarket2024", "WealthManagement", "SavingTips"],
    Technology: ["AIRevolution", "NewGadgets", "SpaceXLaunch", "TechForGood"],
};

  // Function to generate random post totals
function formatPostCount(number) {
    if (number >= 1_000_000_000) return `${(number / 1_000_000_000).toFixed(1)}B`;
    if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`;
    if (number >= 1_000) return `${(number / 1_000).toFixed(1)}k`;
    return number.toString();
}

  // Function to dynamically generate trending topics
function generateTrendingTopics() {
    const trendingContainer = document.querySelector(".trending");
    trendingContainer.innerHTML = ""; // Clear existing content

    for (const category in categoriesWithTitles) {
        // Select a random title from the category
        const titles = categoriesWithTitles[category];
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];

        // Generate a random post count
        const postCount = Math.floor(Math.random() * 2_000_000_000) + 100_000; // 100k to 2B
        const formattedPostCount = formatPostCount(postCount);

        // Create HTML structure
        const trendingNewsHTML = `
        <div class="trending-news">
            <span id="category-news" class="${category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}-trending">${category}</span>
            <span id="trending-title" class="title-trending"><i class="fa-brands fa-threads"></i>${randomTitle}</span>
            <span id="total-posts" class="total-trending">${formattedPostCount} Threads</span>
        </div>
        <hr>
        `;

        trendingContainer.innerHTML += trendingNewsHTML;
    }
}

// Initial population of trending topics
generateTrendingTopics();

document.addEventListener("DOMContentLoaded", () => {
    const threadContainer = document.querySelector(".threads");
    const images = [
        "pfp2", "pfp4", "pfp5", "pfp6", "pfp7", "pfp8", "pfp9", "pfp10", "pfp11",
        "pfp12", "pfp13", "pfp14", "pfp15", "pfp16", "pfp17", "pfp18", "pfp19", "pfp20", "pfp21",
        "pfp22", "pfp23", "pfp24", "pfp25", "pfp26", "pfp27", "pfp28", "pfp29", "pfp30", "pfp31",
        "pfp32", "pfp33", "pfp34", "pfp35", "pfp36", "pfp37", "pfp38", "pfp39", "pfp40", "pfp41",
        "pfp42", "pfp43", "pfp44", "pfp45", "pfp46", "pfp47", "pfp48", "pfp49", "pfp50", "pfp51",
        "pfp52", "pfp53", "pfp54", "pfp55", "pfp56", "pfp57", "pfp58", "pfp59", "pfp60", "pfp61",
        "pfp62", "pfp63", "pfp64", "pfp65", "pfp66", "pfp67", "pfp68", "pfp69", "pfp70", "pfp71",
        "pfp72", "pfp73", "pfp74", "pfp75", "pfp76", "pfp77", "pfp78", "pfp79", "pfp80", "pfp81",
        "pfp82", "pfp83", "pfp84", "pfp85", "pfp86", "pfp87", "pfp88", "pfp89", "pfp90", "pfp91",
        "pfp92", "pfp93", "pfp94", "pfp95", "pfp96", "pfp97", "pfp98", "pfp99", "pfp100", "pfp101"
    ];

    const usernames = [
        "ashford_smith", "lila.astro", "chroma.sky", "sarah_tech", "zenith.wave", "echo_dreams",
        "pixel.blaze", "skyfall.x", "harmony.chord", "stellar.nova", "quantum.arc", "venom.shade",
        "luna.spectra", "chrome.ghost", "nebula.shadow", "code.bender", "frost.fire", "electro.jive",
        "wild.card", "nova.quest", "electric.surge", "cosmic_vibe", "lunar_glow", "techno_spectrum",
        "vortex_rider", "digital_orbit", "starry_horizon", "binary_storm", "crimson.dusk", "polar.phoenix",
        "quantum_flux", "velvet.night", "digital_ether", "galactic_wind", "solar_wave", "neon_frost",
        "skyline_haze", "atomic_aurora", "solarflare_zen", "nebula_fusion", "void_ranger", "cyber_orb",
        "radiant.night", "digital_mist", "void.pulse", "cosmic_verse", "blaze.frost", "solar.light",
        "data_surge", "lunar_radiance", "digital_frost", "electronic_haze", "pixel_illusion", "storm_hunter",
        "astral_quest", "cyber.nova", "galaxy.shift", "luminous_edge", "starlight_rift", "plasma_echo",
        "spectrum_ghost", "lunar_vision", "crimson.pulse", "tech_vibe", "frosted.surge", "horizon_mist",
        "vortex_lunar", "neon_wave", "electro_nova", "starlight_code", "cosmic_echo", "flame.rise",
        "hyper_spectrum", "neon_shadow", "solar_quest", "moonlit_ranger", "stellar_rise", "crimson_wave",
        "quantum_veil", "solar_rift", "digital_shade", "celestial_vibe", "data.flare", "lunar_code",
        "infinite.shadow", "radiant_sky", "cosmic_frost", "digital.vibe", "electro_crimson", "echo_rider",
        "neon_pulse", "spectra.rise", "lunar.mist", "galactic_rift", "infinity.charge", "dark_wave",
        "starry_glow", "neon_aurora", "astral_flare", "tech_rift", "lunar.eclipse", "stellar.pulse",
        "plasma_wave", "cosmic_flare", "aurora.mist", "lunar.glitch", "electro_surge", "sky_ranger",
        "moonlit.echo", "starlight.pulse", "pulse_vibe", "cosmic.electron", "horizon.flare", "neon.storm",
        "quantum_realm", "stellar.haze", "celestial.shade", "space_rise", "electro_orbit", "astral.haze",
        "lunar_glimpse", "solar_ghost", "techno.pulse", "infinity.flare", "void_tech", "crimson.horizon",
        "lunar.reverie", "glimmer_wave", "aurora_drift", "cyberwave_rider", "starlight_haze", "digital_realm",
        "nova_breeze", "radiant_surge", "stellar_surge", "neon_tide", "echo_strike", "celestial_blaze",
        "astral_vision", "digital_wind", "cosmic_flicker", "quantum_echo", "lunar_breeze", "plasma_tide",
        "vortex_wave", "nebula_glow", "digital_flicker", "cyber_frost", "lunar_frost", "pulse_lunar",
        "solarflare_nova", "starlight_realm", "galactic.echo", "horizon_aurora", "cosmic_blaze", "lunar_rift",
        "pulse_light", "quantum_flux", "lunar_sky", "astral_blaze", "solarstorm_nova", "cosmic_rider",
        "neon_surge", "stormflare_wave", "nova_vision", "lunar_radiant", "digital_horizon", "solar_drift",
        "electro_flicker", "pulse_realm", "techno_nova", "binary_vibe", "stellar_flux", "celestial_lumen",
        "quantum_wind", "cosmic_quest", "neon_glare", "vortex_rift", "digital_sky", "stellar_flux",
        "electro_rift", "galaxy_surge", "pulse_flicker", "cosmic_rift", "nova_shadow", "starlight_ghost",
        "digital_breeze", "lunar_glare", "cosmic_drift", "astral_light", "stellar_breeze", "lunar_pulse",
        "techno_surge", "cyber_vision", "pulse_aurora", "nebula_drift", "cosmic_wavelength", "solar_pulse",
        "vortex_flicker", "quantum_surge", "stellar_pulse", "nova_skyline", "celestial_flicker", "lunar_realm",
        "quantum_breeze", "stellar_vision", "solar_surge", "galaxy_light", "celestial_vortex", "nebula_realm",
        "lunar_breeze", "cosmic_drift", "pulse_storm", "digital_light", "solar_tide", "nebula_rider",
        "stellar_glow", "quantum_tide", "lunar_quest", "techno_blaze", "astral_tide", "neon_rift", "radiant_pulse",
        "cosmic_waves", "nova_glow", "stellar_wave", "quantum_rider", "digital_waves", "nebula_breeze",
        "pulse_skyline", "stellar_drift", "quantum_rift", "cosmic_blaze", "nova_tide", "electro_skyline",
        "lunar_flux", "digital_pulse", "celestial_skyline", "astral_drift", "neon_flicker", "stellar_rider",
        "lunar_waves", "nova_realm", "cosmic_riders", "stellar_ghost", "digital_tide", "nebula_wave", "lunar_echo",
        "solar_drift", "quantum_glow", "radiant_waves", "cosmic_glare", "starlight_rider", "stellar_breeze",
        "cyber_aurora", "stellar_blaze", "cosmic_realm", "radiant_glow", "lunar_flicker", "nova_waves",
        "pulse_tide", "stellar_flicker", "quantum_drift", "cosmic_vision", "lunar_rider", "radiant_breeze",
        "nebula_skyline", "stellar_glow", "pulse_wind", "astral_rider", "solar_flicker", "quantum_breeze"
    ];

    const randomPosts = [
        "Exploring new horizons every day. 🌟",
        "Coffee first, everything else later. ☕",
        "Is it Friday yet? 😅",
        "Coding my way through life. 💻",
        "The weekend vibes are undefeated. 🏖️",
        "Thought of the day: Stay positive! 🌈",
        "Just vibing with the universe. ✨",
        "Chasing dreams and caffeine. 🌱",
        "Grateful for today. 🙏",
        "The adventure continues. 🚀",
        "I need more weekends. ⏳",
        "Finding magic in the ordinary. 🌸",
        "Keep calm and carry on. ✌️",
        "On a mission to make today amazing. 🌞",
        "Good things come to those who hustle. 💪",
        "Waking up with a smile! 😁",
        "Currently crushing my to-do list. 📋",
        "Life's a journey, not a destination. 🌍",
        "Good vibes only! ✨",
        "Taking it one step at a time. 👣",
        "Running on caffeine and dreams. ☕✨",
        "Embracing the chaos. 🔥",
        "Let’s make today legendary. 💫",
        "Wandering, wondering, and waiting. 🤔",
        "Manifesting good things today. 🌟",
        "When in doubt, dance it out. 💃",
        "Making memories wherever I go. 📸",
        "Today's mood: Chill. 😌",
        "Living for the little moments. 💖",
        "Let’s just breathe and relax. 🌬️",
        "Taking a break to recharge. ⚡",
        "Every day is a fresh start. 🌞",
        "Just a reminder: You’re amazing! 🌻",
        "Being present in every moment. 🧘‍♀️",
        "A little bit of kindness goes a long way. 💛",
        "Currently living in my own dream world. 🌙",
        "The best is yet to come. ⏳",
        "Keep your face always toward the sunshine. 🌅",
        "Some days are better than others. 💫",
        "Today’s forecast: 100% chance of success. 📈",
        "Embrace the journey, not just the destination. 🛤️",
        "Taking time to appreciate the simple things. 🌻",
        "Just keep swimming. 🐠",
        "Let’s make today unforgettable. 🗝️",
        "You’re only one decision away from a totally different life. 💭",
        "Be your own kind of beautiful. 💅",
        "Smile and the world will smile with you. 😊",
        "Life is better with a good playlist. 🎶",
        "Trying to make today count. 📅",
        "Dancing like no one’s watching. 💃",
        "Your vibe attracts your tribe. ✨",
        "Happiness looks good on you! 🌸",
        "Inhale confidence, exhale doubt. 🌬️",
        "Living in the moment. ⏳",
        "Let your light shine. 🌟",
        "Collecting memories, not things. 📸",
        "Wake up with determination, go to bed with satisfaction. 🌙",
        "Gratitude is the best attitude. 🙌",
        "Let’s make today amazing! 💖",
        "Happiness is a choice. 🌞",
        "Woke up feeling inspired. ✨",
        "Be the reason someone smiles today. 😊",
        "Trust the timing of your life. ⏰",
        "Let’s create something beautiful today. 🎨",
        "Feeling the good vibes today. ✌️",
        "Every day is a new beginning. 🌅",
        "Life’s a climb, but the view is great. 🏔️",
        "Find joy in the little things. 🌼",
        "Believe in yourself and magic will happen. ✨",
        "Just here to spread some positive energy. ⚡",
        "Smiling is contagious. 😊",
        "Do what makes your soul shine. 🌟",
        "Today is another chance to be awesome. 🌞",
        "Making it happen, one step at a time. 👣",
        "Staying focused and ready for anything. 🎯",
        "Sometimes, the best therapy is a good walk. 🚶‍♀️",
        "Grateful for the simple things. 🌷",
        "Collecting sunshine today. 🌞",
        "Just a little reminder: You're amazing! ✨",
        "Start each day with a grateful heart. 💖",
        "Today is a perfect day to start something new. 🌟",
        "Feeling good and ready for the day ahead. 💪",
        "Be the energy you want to attract. ✨",
        "Rise and shine! 🌞",
        "Life is too short to be anything but happy. 🌻",
        "Just living in the moment. ⏳",
        "Surround yourself with positive people. ✨",
        "Small steps lead to big changes. 👣",
        "Let’s make today count. 💥",
        "Take time to do what makes your soul happy. 🌸",
        "Grateful for another beautiful day. 🌻",
        "Keep going, you’re doing great. 💪",
        "Today’s goal: Be happy. 😁",
        "Positive thoughts = Positive life. 💫",
        "Every day is a second chance. ⏳",
        "Good vibes, good life. ✌️",
        "Stay strong, stay focused. 💪",
        "The sky’s the limit! 🌤️",
        "Your only limit is you. 🚀",
        "Live life with no regrets. 🌟",
        "Be the reason someone believes in kindness. 💛",
        "Every day is a chance to grow. 🌱",
        "Stay true to yourself. 🌸",
        "You’ve got this! 💪",
        "Make it happen today. 💥",
        "Life is beautiful. Take a moment to appreciate it. 🌼",
        "It’s a good day to have a good day! 🌞",
        "Dream it, believe it, achieve it. 🌠",
        "Let’s make today better than yesterday. 🌟",
        "Good vibes and positive thoughts. ✨",
        "Work hard, dream big. 💭",
        "Be the change you wish to see. 🌍",
        "Believe in your dreams. 🌟",
        "Feeling unstoppable today. 🚀",
        "Let your dreams be bigger than your fears. 🌈",
        "Believe in the magic of new beginnings. ✨",
        "Let’s do this! 💪",
        "Take it easy today. 🌱",
        "Keep pushing forward. 💥",
        "Be fearless in the face of challenges. 💪",
        "Follow your heart, it knows the way. ❤️",
        "Chasing dreams and making them happen. ✨",
        "Happiness is homemade. 🏠",
        "Live for today, plan for tomorrow. 📅",
        "Grateful for everything in my life. 🙏",
        "Choose happiness every day. 🌞",
        "Every day brings something new. 🌍",
        "Don’t wait for opportunity, create it. 🚀",
        "Let’s make today amazing. ✨",
        "Take a deep breath and enjoy the moment. 🌬️",
        "Be kind to yourself. 💖",
        "It’s okay to take a break. 🌿",
        "Work hard, play hard. 💪🎉",
        "Dream big, work hard, stay focused. 💯",
        "Start your day with a smile. 😊",
        "Today is a good day to start something new. 🌟",
        "Keep dreaming, keep believing. 💫",
        "Make today better than yesterday. 🌞",
        "Life is short, make it sweet. 🍭",
        "You are stronger than you think. 💪",
        "Be brave, be bold, be you. 🌟",
        "Today is your day to shine! ✨",
        "Keep going, you’re doing amazing. 🌟",
        "Stay positive, work hard, make it happen. 💪",
        "Just take it one step at a time. 👣",
        "Live with purpose, love with passion. 💖",
        "Work hard, make your dreams a reality. 💫",
        "Life is better with a little bit of sunshine. 🌞",
        "Your energy introduces you before you even speak. ✨",
        "Make today the best day of your life. 💥",
        "Keep your head up, keep your heart strong. 💖",
        "Take a moment to reflect on how far you’ve come. 🌟",
        "You’re doing amazing, don’t forget that. 💖",
        "Don’t just exist, live. 🌟",
        "Everything you need is already inside you. 💫",
        "Sometimes the smallest step in the right direction ends up being the biggest step of your life. 👣",
        "What you do today can improve all your tomorrows. 🌱",
        "Live your life with love and laughter. 💛",
        "Every day brings a new chance to grow. 🌱",
        "Good things are coming your way. 🌈",
        "Trust the process, trust yourself. 💪",
        "Chasing the dream, not the destination. 🌠",
        "Start where you are. Use what you have. Do what you can. 💥",
        "The best is yet to come. 🌟",
        "Take a moment for yourself today. 💖",
        "Everything happens for a reason. Trust the journey. 🌍",
        "Dream, believe, achieve. 💫",
        "The only limit is the one you set for yourself. 🚀",
        "Take the risk or lose the chance. ✨",
        "Keep going, keep glowing. 🌟",
        "Choose joy over everything. 💛"
    ];

    const generateRandomDate = () => {
    const now = new Date();
    const randomTime = Math.random() * (14 * 24 * 60 * 60 * 1000); // Up to 14 days
    const randomDate = new Date(now - randomTime);
    const diff = (now - randomDate) / 1000;

    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return randomDate.toLocaleDateString("en-US");
    };

    const createThreadPost = () => {
        const username = usernames[Math.floor(Math.random() * usernames.length)];
        const image = images[Math.floor(Math.random() * images.length)];
        const postContent = randomPosts[Math.floor(Math.random() * randomPosts.length)];
        const datePosted = generateRandomDate();

    return `
    <div class="users-threads">
    <div class="pfp-image">
        <div class="username">
        <img src="./img/thread-post-img/${image}.jpeg" alt="pfp">
        <h2 class="username-sect">@<span id="username-tag">${username}</span></h2>
        </div>
        <div class="interactions">
        <ul>
            <li><i class="icon-color fa-regular fa-heart"></i> <span id="likes-count">0</span></li>
            <li><i class="icon-color fa-regular fa-comment"></i> <span id="comments-count">0</span></li>
            <li><i class="icon-color fa-solid fa-retweet"></i> <span id="repost-count">0</span></li>
            <li><i class="icon-color fa-regular fa-paper-plane"></i> <span id="share-count">0</span></li>
        </ul>
        </div>
    </div>
    <div class="thread-post">
        <p id="users-thread-post">${postContent}</p>
        <div>
        <span id="date-posted">${datePosted}</span>
        </div>
    </div>
    </div>`;
};

const loadMoreThreads = () => {
    for (let i = 0; i < 10; i++) {
        threadContainer.innerHTML += createThreadPost();
    }
};

    // Initial load
    loadMoreThreads();

    // Generate 10 threads every 10 seconds
setInterval(() => {
    loadMoreThreads();
}, 5000);
});

document.addEventListener("DOMContentLoaded", () => {
    // Function to format numbers into K/M format
    const formatNumber = (num) => {
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + "M";
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + "K";
        } else {return num.toString();}
    };

    // Function to initialize random values for interaction icons
    const initializeThreadInteractions = (thread) => {
        const randomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const likesCount = thread.querySelector("#likes-count");
        const commentsCount = thread.querySelector("#comments-count");
        const repostCount = thread.querySelector("#repost-count");
        const shareCount = thread.querySelector("#share-count");

        // Assign random initial values
        likesCount.textContent = formatNumber(randomValue(100, 1e6)); // 100 to 1M
        commentsCount.textContent = formatNumber(randomValue(10, 1e5)); // 10 to 100K
        repostCount.textContent = formatNumber(randomValue(5, 5e4)); // 5 to 50K
        shareCount.textContent = formatNumber(randomValue(1, 1e4)); // 1 to 10K
    };

    // Function to update engagement rates
    const updateEngagementRates = () => {
        const threads = document.querySelectorAll(".users-threads");
        threads.forEach((thread) => {
            const likesCount = thread.querySelector("#likes-count");
            const commentsCount = thread.querySelector("#comments-count");
            const repostCount = thread.querySelector("#repost-count");
            const shareCount = thread.querySelector("#share-count");

            // Parse existing counts
            const parseValue = (value) =>
                value.includes("M")
                    ? parseFloat(value) * 1e6
                    : value.includes("K")
                    ? parseFloat(value) * 1e3
                    : parseInt(value);

            let likes = parseValue(likesCount.textContent);
            let comments = parseValue(commentsCount.textContent);
            let reposts = parseValue(repostCount.textContent);
            let shares = parseValue(shareCount.textContent);

            // Simulate dynamic growth
            likes += Math.random() > 0.8 ? Math.floor(Math.random() * 100) : 0; // Moderate growth
            comments += Math.random() > 0.9 ? Math.floor(Math.random() * 10) : 0; // Slower growth
            reposts += Math.random() > 0.95 ? Math.floor(Math.random() * 5) : 0; // Rare growth
            shares += Math.random() > 0.98 ? Math.floor(Math.random() * 3) : 0; // Very rare growth

            // Update counts and apply formatting
            likesCount.textContent = formatNumber(likes);
            commentsCount.textContent = formatNumber(comments);
            repostCount.textContent = formatNumber(reposts);
            shareCount.textContent = formatNumber(shares);
        });
    };

    // Initialize all thread posts
    const threads = document.querySelectorAll(".users-threads");
    threads.forEach(initializeThreadInteractions);

    // Periodically update engagement rates
    setInterval(() => {
        updateEngagementRates();
    }, 1000); // Update every 5 seconds
});

document.addEventListener('DOMContentLoaded', () => {
    const accounts = [
        {
            username: 'cristiano',
            threads: 37700,
            followers: 760400000,
            following: 590,
            bio: 'SIUUUbscribe to my Youtube Channel!',
            profileImg: './img/profile-img/pfp1.jpg'
        },
        {
            username: 'spursofficial',
            threads: 138671,
            followers: 26000000,
            following: 330,
            bio: 'COYS 🤍',
            profileImg: './img/profile-img/pfp2.jpg'
        },
        {
            username: 'wolves',
            threads: 128598,
            followers: 4100000,
            following: 325,
            bio: 'Fear Nothing.',
            profileImg: './img/profile-img/pfp4.jpg'
        },
        {
            username: 'chelseafc',
            threads: 144500,
            followers: 68700000,
            following: 228,
            bio: 'Chelsea FC',
            profileImg: './img/profile-img/pfp5.jpg'
        },
        {
            username: 'arsenal',
            threads: 133700,
            followers: 52600000,
            following: 216,
            bio: 'The official account of Arsenal Football Club',
            profileImg: './img/profile-img/pfp6.jpg'
        },
        {
            username: 'mancity',
            threads: 202300,
            followers: 72900000,
            following: 630,
            bio: 'WATCH TOGETHER: 4-IN-A-ROW 🍿',
            profileImg: './img/profile-img/pfp7.jpg'
        },
        {
            username: 'manchesterunited',
            threads: 125300,
            followers: 102800000,
            following: 135,
            bio: 'The home of Manchester United.',
            profileImg: './img/profile-img/pfp8.jpg'
        },
        {
            username: 'liverpoolfc',
            threads: 153000,
            followers: 72700000,
            following: 307,
            bio: 'Official Threads account of Liverpool Football Club 🔴 Stop The Hate, Report It. #RedTogether ✊',
            profileImg: './img/profile-img/pfp9.jpg' // Replace with actual profile image
        },
        {
            username: 'premierleague',
            threads: 195800,
            followers: 121600000,
            following: 35,
            bio: 'The official Threads account of the Premier League',
            profileImg: './img/profile-img/pfp10.jpg'
        },
        {
            username: 'officialnffc',
            threads: 78600,
            followers: 1700000,
            following: 66,
            bio: 'The official Threads account of Nottingham Forest.',
            profileImg: './img/profile-img/pfp11.jpg'
        },
        {
            username: 'afcb',
            threads: 89600,
            followers: 1700000,
            following: 86,
            bio: 'The official page of AFC Bournemouth 🍒',
            profileImg: './img/profile-img/pfp12.jpg'
        },
        {
            username: 'fulhamfc',
            threads: 84000,
            followers: 1900000,
            following: 148,
            bio: 'London’s Original Football Club. #FFC',
            profileImg: './img/profile-img/pfp13.jpg'
        },
        {
            username: 'officialbhafc',
            threads: 101600,
            followers: 3200000,
            following: 223,
            bio: 'The official account of Brighton & Hove Albion. 📸',
            profileImg: './img/profile-img/pfp14.jpg'
        },
        {
            username: 'krissattack0',
            threads: 63,
            followers: 213,
            following: 173,
            bio: '🌐Web Dev | 📱Mobile Dev | 🤖ML Dev | 👾 Malware Analyst (10%)',
            profileImg: './img/profile-img/pfp3.jpeg'
        },
        {
            username: 'nufc',
            threads: 97400,
            followers: 5500000,
            following: 125,
            bio: 'HOWAY THE LADS! ⚫️⚪️ Shop our 2024/25 home, away and third kits ⤵️',
            profileImg: './img/profile-img/pfp15.jpg'
        },
        {
            username: 'avfcofficial',
            threads: 106934,
            followers: 6400000,
            following: 148,
            bio: 'UP THE VILLA! 🟣',
            profileImg: './img/profile-img/pfp16a.jpg'
        },
        {
            username: 'nostxlgic.geek',
            threads: 0,
            followers: 3171,
            following: 994,
            bio: '𝙸𝙽𝚂𝙿𝙸𝚁𝙴𝙳 𝙱𝚈 𝚃𝙷𝙴 𝙵𝙴𝙰𝚁 𝙾𝙵 𝙱𝙴𝙸𝙽𝙶 𝙰𝚅𝙴𝚁𝙰𝙶𝙴',
            profileImg: './img/profile-img/pfp17.jpg'
        },
        {
            username: 'houstonrockets',
            threads: 6718,
            followers: 6300000,
            following: 556,
            bio: '❤️ @rocketsgiveback',
            profileImg: './img/profile-img/pfp18.jpg'
        },
        {
            username: 'jalen',
            threads: 212,
            followers: 2400000,
            following: 104,
            bio: '559 4',
            profileImg: './img/profile-img/pfp19.jpg'
        },
        {
            username: 'adrian.griffinjr',
            threads: 120,
            followers: 139000,
            following: 1025,
            bio: '“And whatever you ask in prayer, you will receive, if you have faith” - Matthew 21:22 | God is Love ✝️| 🎤: AJoyfullministry@icloud.com |',
            profileImg: './img/profile-img/pfp20.jpg'
        },
        {
            username: 'jabarismithjr',
            threads: 43,
            followers: 167000,
            following: 1036,
            bio: 'Forever Humble',
            profileImg: './img/profile-img/pfp21.jpg'
        },
        {
            username: 'amen.thompson',
            threads: 25,
            followers: 347000,
            following: 946,
            bio: '',
            profileImg: './img/profile-img/pfp22.jpg'
        },
        {
            username: 'ausarthompson',
            threads: 13,
            followers: 298000,
            following: 1059,
            bio: 'The World Is Yours',
            profileImg: './img/profile-img/pfp23.jpg'
        },
        {
            username: 'camwhitmore',
            threads: 88,
            followers: 123000,
            following: 228,
            bio: 'ɢᴏᴅsᴘᴇᴇᴅ ☮️ ᴅᴇꜱᴛɪɴᴇᴅ ꜰᴏʀ ɢʀᴇᴀᴛɴᴇꜱꜱ',
            profileImg: './img/profile-img/pfp24.jpg'
        },
        {
            username: 'alperen.sengun',
            threads: 111,
            followers: 679000,
            following: 227,
            bio: '@houstonrockets & @tbf',
            profileImg: './img/profile-img/pfp25.jpg'
        },
        {
            username: 'tarieason',
            threads: 49,
            followers: 80300,
            following: 1020,
            bio: '#YUK🤴🏿',
            profileImg: './img/profile-img/pfp26.jpg'
        },
        {
            username: 'dillonbrooks24',
            threads: 2,
            followers: 200000,
            following: 1,
            bio: 'Villain',
            profileImg: './img/profile-img/pfp27.jpg'
        },
        {
            username: 'fredvanvleet',
            threads: 76,
            followers: 636000,
            following: 558,
            bio: '',
            profileImg: './img/profile-img/pfp28.jpg'
        },
        {
            username: 'reedsheppard3',
            threads: 99,
            followers: 185000,
            following: 513,
            bio: '@houstonrockets Partner: @carsx.ai',
            profileImg: './img/profile-img/pfp29.jpg'
        },
        {
            username: 'nba',
            threads: 82167,
            followers: 89400000,
            following: 1221,
            bio: 'MONDAY on NBA TV ⤵️',
            profileImg: './img/profile-img/pfp30.jpg'
        },
        {
            username: 'dejan.k10',
            threads: 404,
            followers: 1300000,
            following: 880,
            bio: '@spursofficial',
            profileImg: './img/profile-img/pfp31.jpg'
        },
        {
            username: 'russwest44',
            threads: 55,
            followers: 23000000,
            following: 2372,
            bio: 'WHY NOT?',
            profileImg: './img/profile-img/pfp32.jpg'
        },
        {
            username: 'hm_son7',
            threads: 305,
            followers: 14200000,
            following: 241,
            bio: '',
            profileImg: './img/profile-img/pfp33.jpg'
        },
        {
            username: 'yves_bissouma',
            threads: 59,
            followers: 777000,
            following: 213,
            bio: 'SonofGod 🙏🏾',
            profileImg: './img/profile-img/pfp34.jpg'
        },
        {
            username: 'pape',
            threads: 134,
            followers: 848000,
            following: 309,
            bio: '🦁',
            profileImg: './img/profile-img/pfp35.jpg'
        },
        {
            username: 'solanke',
            threads: 324,
            followers: 1100000,
            following: 611,
            bio: 'Hello',
            profileImg: './img/profile-img/pfp36.jpg'
        },
        {
            username: 'madders',
            threads: 545,
            followers: 2000000,
            following: 696,
            bio: 'Tottenham Hotspur #10',
            profileImg: './img/profile-img/pfp37.jpg'
        },
        {
            username: 'djedspence',
            threads: 49,
            followers: 201000,
            following: 140,
            bio: 'Empty',
            profileImg: './img/profile-img/pfp38.jpg'
        },
        {
            username: 'rodrigo_bentancur',
            threads: 425,
            followers: 1800000,
            following: 242,
            bio: 'Jugador de Tottenham Hotspur',
            profileImg: './img/profile-img/pfp39.jpg'
        },
        {
            username: 'baustin_',
            threads: 77,
            followers: 47300,
            following: 344,
            bio: '@spursofficial',
            profileImg: './img/profile-img/pfp40.jpg'
        },
        {
            username: 'harrykane',
            threads: 1539,
            followers: 17300000,
            following: 280,
            bio: '⚽️ @fcbayern 🏴 @England 🙌 @skechersfootball',
            profileImg: './img/profile-img/pfp41.jpg'
        },
        {
            username: 'manorsolomon',
            threads: 286,
            followers: 280000,
            following: 676,
            bio: '⚽️ @spursofficial & @leedsunited @isr.fa',
            profileImg: './img/profile-img/pfp42.jpg'
        },
        {
            username: 'sergioregui',
            threads: 250,
            followers: 1900000,
            following: 559,
            bio: '⚽️❤️',
            profileImg: './img/profile-img/pfp43.jpg'
        },
        {
            username: 'brenjohnson_',
            threads: 124,
            followers: 368000,
            following: 406,
            bio: '',
            profileImg: './img/profile-img/pfp44.jpg'
        },
        {
            username: 'archie.gray06',
            threads: 54,
            followers: 289000,
            following: 917,
            bio: '@spursofficial | @adidasfootball | @blueskysports_uk',
            profileImg: './img/profile-img/pfp45.jpg'
        },
        {
            username: 'lucasbergvall',
            threads: 50,
            followers: 478000,
            following: 659,
            bio: '@spursofficial @nikefootball @nordicskysweden',
            profileImg: './img/profile-img/pfp46.jpg'
        },
        {
            username: 'pedroporro29_',
            threads: 430,
            followers: 570000,
            following: 719,
            bio: '@spursofficial',
            profileImg: './img/profile-img/pfp47.jpg'
        },
        {
            username: 'udogiethree',
            threads: 40,
            followers: 340000,
            following: 192,
            bio: 'BLESSED ☝🏾🙏🏾',
            profileImg: './img/profile-img/pfp48.jpg'
        },
        {
            username: 'cutiromero2',
            threads: 578,
            followers: 5000000,
            following: 365,
            bio: 'Credo nei miei sogni',
            profileImg: './img/profile-img/pfp49.jpg'
        },
        {
            username: 'bendavies33',
            threads: 301,
            followers: 398000,
            following: 283,
            bio: 'Footballer for Spurs & Wales International',
            profileImg: './img/profile-img/pfp50.jpg'
        },
        {
            username: 'mickyvdven',
            threads: 98,
            followers: 515000,
            following: 386,
            bio: 'Tottenham Hotspur #37',
            profileImg: './img/profile-img/pfp51.jpg'
        },
        {
            username: 'radudragusin5',
            threads: 195,
            followers: 540000,
            following: 442,
            bio: 'Player of @spursofficial 🤍 Hard work beats talent ⚔',
            profileImg: './img/profile-img/pfp52.jpg'
        },
        {
            username: 'tondakinsky',
            threads: 54,
            followers: 112000,
            following: 591,
            bio: '@spursofficial / @ceskarepre',
            profileImg: './img/profile-img/pfp53.jpg'
        },
        {
            username: 'fraserforster',
            threads: 36,
            followers: 209000,
            following: 82,
            bio: 'Bigs',
            profileImg: './img/profile-img/pfp54.jpg'
        },
        {
            username: 'timowerner',
            threads: 391,
            followers: 2600000,
            following: 287,
            bio: 'Football Player ⚽️',
            profileImg: './img/profile-img/pfp55.jpg'
        },
        {
            username: 'mikeymoore_10',
            threads: 11,
            followers: 119,
            following: 566,
            bio: '@spursofficial | @nikefootball✍️',
            profileImg: './img/profile-img/pfp56.jpg'
        },
        {
            username: 'officialkayflocka',
            threads: 14,
            followers: 808000,
            following: 442,
            bio: 'Official Instagram of Kay Flock.',
            profileImg: './img/profile-img/pfp57.jpg'
        },
        {
            username: 'fatedclothing2025.__',
            threads: 1,
            followers: 54,
            following: 5,
            bio: 'Up and coming clothing brand.',
            profileImg: './img/profile-img/pfp58.jpg'
        },
        {
            username: 'bkabybently._',
            threads: 4,
            followers: 595,
            following: 1479,
            bio: 'LLSPAZZ.💔',
            profileImg: './img/profile-img/pfp59.jpg'
        },
        {
            username: 'junior.0.2.4',
            threads: 0,
            followers: 215,
            following: 795,
            bio: '',
            profileImg: './img/profile-img/pfp60.jpg'
        },
        {
            username: 'dillonsigma',
            threads: 0,
            followers: 40,
            following: 43,
            bio: '',
            profileImg: './img/profile-img/pfp61.jpg'
        },
        {
            username: 'official_keans',
            threads: 17,
            followers: 155,
            following: 27,
            bio: 'Hand painted 🎨',
            profileImg: './img/profile-img/pfp62.jpg'
        },
        {
            username: 'bkabykaleb_',
            threads: 0,
            followers: 910,
            following: 985,
            bio: 'Bk4L',
            profileImg: './img/profile-img/pfp63.jpg'
        },
        {
            username: '5star.lillathi',
            threads: 2,
            followers: 1709,
            following: 1689,
            bio: 'exodus 33:14🤞🏽',
            profileImg: './img/profile-img/pfp64.jpg'
        },
        {
            username: 'evoonaah',
            threads: 2,
            followers: 122,
            following: 139,
            bio: '🦢✨',
            profileImg: './img/profile-img/pfp65.jpg'
        },
        {
            username: 'k_lwano',
            threads: 1,
            followers: 73,
            following: 79,
            bio: '⏳️ #christian',
            profileImg: './img/profile-img/pfp66.jpg'
        },
        {
            username: 'ola_g_art',
            threads: 53,
            followers: 3412,
            following: 424,
            bio: '🧑🏽‍🎨: @imkingola 📸: @ojovision_',
            profileImg: './img/profile-img/pfp67.jpg'
        },
        {
            username: 'ojovision_',
            threads: 3,
            followers: 44,
            following: 48,
            bio: 'Welcome to Ojovision 📸 Capturing moments & creating memories.',
            profileImg: './img/profile-img/pfp68.jpg'
        },
        {
            username: 'imkingola',
            threads: 3,
            followers: 511,
            following: 377,
            bio: 'Art account: @ola_g_art',
            profileImg: './img/profile-img/pfp69.jpg'
        },
        {
            username: 'vinkasiyo012',
            threads: 3,
            followers: 94,
            following: 185,
            bio: 'Programmer Football 1 of 1',
            profileImg: './img/profile-img/pfp70.jpg'
        },
        {
            username: 'gabe_the.outcast',
            threads: 14,
            followers: 395,
            following: 529,
            bio: 'Romans 10:9-10🙏🏽 Basketball 🏀',
            profileImg: './img/profile-img/pfp71.jpg'
        },
        {
            username: 'chris_not_christian',
            threads: 2,
            followers: 521,
            following: 592,
            bio: 'Fe Fi Fo Fum @official_keans',
            profileImg: './img/profile-img/pfp72.jpg'
        },
        {
            username: 'thats_owami',
            threads: 1,
            followers: 497,
            following: 2081,
            bio: 'John:1:1| basketball is a lifestyle',
            profileImg: './img/profile-img/pfp73.jpg'
        },
        {
            username: 'chopmazibuko',
            threads: 0,
            followers: 368,
            following: 289,
            bio: '#2 ecstatic🧘🏽‍♂️',
            profileImg: './img/profile-img/pfp74.jpg'
        },
        {
            username: 'b00tyf0ndler',
            threads: 3,
            followers: 357,
            following: 298,
            bio: 'Basketball Player Type shii',
            profileImg: './img/profile-img/pfp75.jpg'
        },
        {
            username: 'ntuks.s',
            threads: 3,
            followers: 211,
            following: 249,
            bio: 'Basketball Player Type shii',
            profileImg: './img/profile-img/pfp76.jpg'
        },
        {
            username: 'bunzi_nba_132',
            threads: 4,
            followers: 544,
            following: 1202,
            bio: 'You don\'t stop playing cause you get old🔥🔥',
            profileImg: './img/profile-img/pfp77.jpg'
        },
        {
            username: 'maps2x',
            threads: 16,
            followers: 278,
            following: 284,
            bio: 'Uncertified psychologist 🧠',
            profileImg: './img/profile-img/pfp78.jpg'
        },
        {
            username: 'p.king21',
            threads: 0,
            followers: 38,
            following: 48,
            bio: 'IT Student',
            profileImg: './img/profile-img/pfp79.jpg'
        },
        {
            username: 'blythe__marre',
            threads: 3,
            followers: 289,
            following: 356,
            bio: 'وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
            profileImg: './img/profile-img/pfp81.jpg'
        }
    ]

    const searchInput = document.querySelector('.search-area input');
    const foundAccounts = document.getElementById('found-accounts');

    const renderSearchResults = (query) => {
        foundAccounts.innerHTML = ''; // Clear previous results
        if (!query.trim()) return; // If input is empty, do nothing
    
        const following = JSON.parse(localStorage.getItem('following')) || []; // Get the current following list from localStorage
    
        accounts.forEach((account) => {
            if (account.username.toLowerCase().includes(query.toLowerCase())) {
                const isFollowing = following.includes(account.username); // Check if the user is already following this account
                const accountHTML = `
                    <div class="profile-details">
                    <div class="top-info">
                        <div id="profile-image" class="pfp-image">
                            <img src="${account.profileImg}" alt="pfp">
                        </div>
                        <div class="profile-info-search">
                        <h2>@<span id="username2">${account.username}</span></h2>
                        <ul>
                            <li><span id="user-threads">${formatCount(account.threads)}</span> Threads</li>
                            <li><span id="user-followers">${formatCount(account.followers)}</span> Followers</li>
                            <li><span id="user-following">${account.following}</span> Following</li>
                        </ul>
                        </div>
                        <div class="follow-them">
                            <button id="follow-btn" class="follow-btn" data-username="${account.username}">
                                ${isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        </div>
                    </div>
                    <div class="account-bio">
                        <p id="account-bio">${account.bio}</p>
                    </div>
                    </div>`;
                foundAccounts.insertAdjacentHTML('beforeend', accountHTML);
            }
        });
        attachFollowListeners();
    };

    const attachFollowListeners = () => {
        document.querySelectorAll('.follow-btn').forEach(button => {
            button.addEventListener('click', e => {
                const username = e.target.getAttribute('data-username');
                toggleFollow(username, e.target);
            });
        });
    };

    const toggleFollow = (username, button) => {
        let following = JSON.parse(localStorage.getItem('following')) || [];
        if (following.includes(username)) {
            following = following.filter(user => user !== username);
            button.textContent = 'Follow';
            updateUserFollowing(-1);
        } else {
            following.push(username);
            button.textContent = 'Unfollow';
            updateUserFollowing(1);
        }
        localStorage.setItem('following', JSON.stringify(following));
        updateAllPages();
    };

    const updateUserFollowing = (change) => {
        const myFollowing = document.getElementById('myfollowing');
        const currentFollowing = parseInt(myFollowing.textContent);
        myFollowing.textContent = currentFollowing + change;
        localStorage.setItem('myfollowing', myFollowing.textContent);
    };

    const updateAllPages = () => {
        // Broadcast to other pages
        const event = new Event('updateFollowStatus');
        document.dispatchEvent(event);
    };

    const formatCount = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count;
    };

    const updateProfileStats = () => {
        document.getElementById('mythreads').textContent = 0;
        document.getElementById('myfollowers').textContent = 
            localStorage.getItem('myfollowers') || 0;
        document.getElementById('myfollowing').textContent =
            localStorage.getItem('myfollowing') || 0; 
    };

    const loadUserStats = () => {
        updateProfileStats();
    };

    const initFollowStatusListener = () => {
        document.addEventListener('updateFollowStatus', () => {
            loadUserStats(); // Reload stats when changes are made on other pages
        });
    };

    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        renderSearchResults(query);
    });

    loadUserStats();
    initFollowStatusListener();
});

// Get all required elements
const editButton = document.getElementById('edits-account');
const profileNameTag = document.getElementById('profile-name-tag');
const usernameTag = document.getElementById('profile-username-tag');
const bioEdit = document.getElementById('boi-edit');
const mainImage = document.getElementById('image-account-main')?.querySelector('img');
const profileImage = document.getElementById('image-account')?.querySelector('img');
const pfpImages = document.querySelectorAll('.pfp-image img');

// Get all username elements that need to be synced
const allUsernameElements = document.querySelectorAll('#profile-username-tag, #profile-username');

// Character limits
const BIO_CHAR_LIMIT = 150;
const USERNAME_CHAR_LIMIT = 30;

// Create hidden file input for image upload
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

let isEditing = false;

function updateAllUsernames(newUsername) {
    allUsernameElements.forEach(element => {
        // Add @ symbol if it's not already present
        if (!newUsername.startsWith('@')) {
            element.textContent = '@' + newUsername.replace('@', '');
        } else {
            element.textContent = newUsername;
        }
    });
}

function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('profileData')) || {};
    
    if (savedData.imageUrl) {
        updateProfilePictures(savedData.imageUrl);
    }

    if (editButton) {
        if (savedData.name) profileNameTag.textContent = savedData.name;
        if (savedData.username) {
            updateAllUsernames(savedData.username);
        }
        if (savedData.bio) bioEdit.textContent = savedData.bio;
    } else {
        if (savedData.username) {
            updateAllUsernames(savedData.username);
        }
    }
}

// Updates all profile pictures
function updateProfilePictures(imageUrl) {
    // Update main profile images if they exist
    if (mainImage) mainImage.src = imageUrl;
    if (profileImage) profileImage.src = imageUrl;
    
    // Updates all pfp-image class images
    pfpImages.forEach(img => {
        img.src = imageUrl;
    });
}

// Saves data to localStorage
function saveData() {
    const profileData = {
        name: profileNameTag?.textContent,
        username: usernameTag?.textContent,
        bio: bioEdit?.textContent,
        imageUrl: mainImage?.src
    };
    localStorage.setItem('profileData', JSON.stringify(profileData));
}

// Handle character limit for contentEditable elements
function handleCharacterLimit(event, limit) {
    const text = event.target.textContent;
    if (text.length > limit) {
        event.target.textContent = text.substring(0, limit);
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(event.target);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        
        showCharLimitWarning(event.target, limit);
    }
}

// Show character limit warning
function showCharLimitWarning(element, limit) {
    const warning = document.createElement('div');
    warning.style.color = 'red';
    warning.style.fontSize = '12px';
    warning.textContent = `Character limit reached (${limit} characters)`;
    warning.style.position = 'absolute';
    warning.style.marginTop = '5px';
    
    const existingWarning = element.parentElement.querySelector('.char-limit-warning');
    if (existingWarning) {
        existingWarning.remove();
    }
    
    warning.className = 'char-limit-warning';
    element.parentElement.appendChild(warning);
    
    setTimeout(() => warning.remove(), 2000);
}

function makeEditable() {
    if (!profileNameTag) return;

    profileNameTag.contentEditable = true;
    usernameTag.contentEditable = true;
    bioEdit.contentEditable = true;
    mainImage.style.cursor = 'pointer';
    
    bioEdit.addEventListener('input', (e) => handleCharacterLimit(e, BIO_CHAR_LIMIT));
    usernameTag.addEventListener('input', (e) => {
        handleCharacterLimit(e, USERNAME_CHAR_LIMIT);
        updateAllUsernames(e.target.textContent);
    });
    
    mainImage.addEventListener('click', () => fileInput.click());
}

// Make elements non-editable
function makeNonEditable() {
    if (!profileNameTag) return;

    profileNameTag.contentEditable = false;
    usernameTag.contentEditable = false;
    bioEdit.contentEditable = false;
    mainImage.style.cursor = 'default';
    
    bioEdit.removeEventListener('input', (e) => handleCharacterLimit(e, BIO_CHAR_LIMIT));
    usernameTag.removeEventListener('input', (e) => handleCharacterLimit(e, USERNAME_CHAR_LIMIT));
    mainImage.removeEventListener('click', () => fileInput.click());
}

// Add change listeners to editable elements
function addChangeListeners() {
    const elements = [profileNameTag, usernameTag, bioEdit];
    elements.forEach(element => {
        if (element) {
            element.addEventListener('input', () => {
                editButton.innerHTML = '<p>Save</p>';
            });
        }
    });
}

// Handle image upload
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            updateProfilePictures(imageUrl);
            if (editButton) editButton.innerHTML = '<p>Save</p>';
        };
        reader.readAsDataURL(file);
    }
});

// Toggle edit mode
function toggleEditMode() {
    isEditing = !isEditing;
    
    if (isEditing) {
        editButton.innerHTML = '<p>Save</p>';
        makeEditable();
        addChangeListeners();
    } else {
        editButton.innerHTML = '<p>Edit profile</p>';
        makeNonEditable();
        saveData();
    }
}

// Add edit button click handler if it exists
if (editButton) {
    editButton.addEventListener('click', toggleEditMode);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadSavedData);

document.querySelectorAll('.posts-header li').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.posts-header li').forEach(li => li.classList.remove('active-bottom'));
        
        item.classList.add('active-bottom');
        
        const messageElement = document.getElementById('message');
        
        if (item.id === 'threads-threads' || item.id === 'replies-threads' || item.id === 'reposts-threads') {
            if (item.id === 'threads-threads') {
                messageElement.textContent = "No Threads";
            } else if (item.id === 'replies-threads') {
                messageElement.textContent = "No Replies";
            } else if (item.id === 'reposts-threads') {
                messageElement.textContent = "No Reposts";
            }
    
            messageElement.classList.remove('hidden');
        } else {
            messageElement.classList.add('hidden');
        }
    });
});

/* document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    loadSavedPosts();

    const postButton = document.querySelector('.post-btn');
    const threadInput = document.getElementById('thread-post-by');
    const postContainer = document.querySelector('.post-container');

    threadInput.addEventListener('input', () => {
        postButton.disabled = !threadInput.value.trim();
    });

    postButton.addEventListener('click', () => {
        const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
        const username = profileData.username || '@anonymous';
        const imageUrl = profileData.imageUrl || './img/thread-post-img/default-pfp.jpeg';
        const threadContent = threadInput.value.trim();

        if (!threadContent) return;

        const newPostHTML = `
            <div class="user-post">
                <div class="pfp-post-image">
                    <div id="image-account" class="username">
                        <img src="${imageUrl}" alt="pfp">
                        <h3 class="username-sect"><span id="profile-username-tag">${username}</span></h3>
                    </div>
                    <div class="post-interactions">
                        <ul>
                            <li><i class="icon-color fa-regular fa-heart"></i> <span class="likes-count">0</span></li>
                            <li><i class="icon-color fa-regular fa-comment"></i> <span class="comments-count">0</span></li>
                            <li><i class="icon-color fa-solid fa-retweet"></i> <span class="repost-count">0</span></li>
                            <li><i class="icon-color fa-regular fa-paper-plane"></i> <span class="share-count">0</span></li>
                        </ul>
                    </div>
                </div>
                <div class="thread-post">
                    <p id="users-thread-post">${threadContent}</p>
                    <div class="">
                        <span id="date-posted">${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;

        postContainer.insertAdjacentHTML('afterbegin', newPostHTML);

        savePostToLocalStorage(threadContent, username, imageUrl);

        threadInput.value = '';
        postButton.disabled = true;

        simulateEngagement();
    });

    function savePostToLocalStorage(content, username, imageUrl) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.unshift({ content, username, imageUrl, date: new Date().toISOString() });
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    // Load saved posts
    function loadSavedPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach(post => {
            const postHTML = `
                <div class="user-post">
                    <div class="pfp-post-image">
                        <div id="image-account" class="username">
                            <img src="${post.imageUrl}" alt="pfp">
                            <h3 class="username-sect"><span id="profile-username-tag">${post.username}</span></h3>
                        </div>
                        <div class="post-interactions">
                            <ul>
                                <li><i class="icon-color fa-regular fa-heart"></i> <span class="likes-count">0</span></li>
                                <li><i class="icon-color fa-regular fa-comment"></i> <span class="comments-count">0</span></li>
                                <li><i class="icon-color fa-solid fa-retweet"></i> <span class="repost-count">0</span></li>
                                <li><i class="icon-color fa-regular fa-paper-plane"></i> <span class="share-count">0</span></li>
                            </ul>
                        </div>
                    </div>
                    <div class="thread-post">
                        <p id="users-thread-post">${post.content}</p>
                        <div class="date-area">
                            <span id="date-posted">${new Date(post.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <hr>
            `;
            postContainer.insertAdjacentHTML('beforeend', postHTML);
        });
    }

    function simulateEngagement() {
        const posts = document.querySelectorAll('.user-post');
        posts.forEach(post => {
            const likesCount = post.querySelector('.likes-count');
            const commentsCount = post.querySelector('.comments-count');
            const repostCount = post.querySelector('.repost-count');
            const shareCount = post.querySelector('.share-count');

            const updateEngagement = () => {
                likesCount.textContent = parseInt(likesCount.textContent) + Math.floor(Math.random() * 5);
                commentsCount.textContent = parseInt(commentsCount.textContent) + Math.floor(Math.random() * 2);
                repostCount.textContent = parseInt(repostCount.textContent) + Math.floor(Math.random() * 3);
                shareCount.textContent = parseInt(shareCount.textContent) + Math.floor(Math.random() * 2);

                const postsData = JSON.parse(localStorage.getItem('posts')) || [];
                postsData.forEach((savedPost, index) => {
                    if (savedPost.content === post.querySelector('#users-thread-post').textContent) {
                        postsData[index].engagement = {
                            likes: likesCount.textContent,
                            comments: commentsCount.textContent,
                            reposts: repostCount.textContent,
                            shares: shareCount.textContent
                        };
                    }
                });
                localStorage.setItem('posts', JSON.stringify(postsData));
            };

            setInterval(updateEngagement, 5000);
        });
    }
}); */

const predefinedUsers = [{
        "username": "techguy_01",
        "pfp": "./img/searched-img/pfp2.jpeg",
        "followed": false
    },
    {
        "username": "krissattack0",
        "pfp": "./img/searched-img/pfp3.jpeg",
        "followed": false
    },
    {
        "username": "digital_wizard",
        "pfp": "./img/searched-img/pfp4.jpeg",
        "followed": false
    },
    {
        "username": "thecodingmaster",
        "pfp": "./img/searched-img/pfp5.jpeg",
        "followed": false
    },
    {
        "username": "photoguru",
        "pfp": "./img/searched-img/pfp6.jpeg",
        "followed": false
    },
    {
        "username": "mystic_panda",
        "pfp": "./img/searched-img/pfp7.jpeg",
        "followed": false
    },
    {
        "username": "traveljunkie_23",
        "pfp": "./img/searched-img/pfp8.jpeg",
        "followed": false
    },
    {
        "username": "sunnysideup",
        "pfp": "./img/searched-img/pfp9.jpeg",
        "followed": false
    },
    {
        "username": "cityvibes_91",
        "pfp": "./img/searched-img/pfp10.jpeg",
        "followed": false
    },
    {
        "username": "pixel_perfectionist",
        "pfp": "./img/searched-img/pfp11.jpeg",
        "followed": false
    },
    {
        "username": "spaceadventurer",
        "pfp": "./img/searched-img/pfp12.jpeg",
        "followed": false
    },
    {
        "username": "thehikingnomad",
        "pfp": "./img/searched-img/pfp13.jpeg",
        "followed": false
    },
    {
        "username": "urban_explorer_7",
        "pfp": "./img/searched-img/pfp14.jpeg",
        "followed": false
    },
    {
        "username": "bookworm_13",
        "pfp": "./img/searched-img/pfp15.jpeg",
        "followed": false
    },
    {
        "username": "cosmic_vision",
        "pfp": "./img/searched-img/pfp16.jpeg",
        "followed": false
    },
    {
        "username": "starlight_dreamer",
        "pfp": "./img/searched-img/pfp17.jpeg",
        "followed": false
    },
    {
        "username": "artistic_muse",
        "pfp": "./img/searched-img/pfp18.jpeg",
        "followed": false
    },
    {
        "username": "fashionista_99",
        "pfp": "./img/searched-img/pfp19.jpeg",
        "followed": false
    },
    {
        "username": "gadgetlover_45",
        "pfp": "./img/searched-img/pfp20.jpeg",
        "followed": false
    },
    {
        "username": "sneakerhead_23",
        "pfp": "./img/searched-img/pfp21.jpeg",
        "followed": false
    },
    {
        "username": "calm_waves_77",
        "pfp": "./img/searched-img/pfp22.jpeg",
        "followed": false
    },
    {
        "username": "dreams_onthego",
        "pfp": "./img/searched-img/pfp23.jpeg",
        "followed": false
    },
    {
        "username": "simple_joys_04",
        "pfp": "./img/searched-img/pfp24.jpeg",
        "followed": false
    },
    {
        "username": "charming_vibes",
        "pfp": "./img/searched-img/pfp25.jpeg",
        "followed": false
    },
    {
        "username": "worldwanderer_78",
        "pfp": "./img/searched-img/pfp26.jpeg",
        "followed": false
    },
    {
        "username": "creativemind_22",
        "pfp": "./img/searched-img/pfp27.jpeg",
        "followed": false
    },
    {
        "username": "mindful_moments",
        "pfp": "./img/searched-img/pfp28.jpeg",
        "followed": false
    },
    {
        "username": "vintage_vibes_99",
        "pfp": "./img/searched-img/pfp29.jpeg",
        "followed": false
    },
    {
        "username": "tech_trendsetter",
        "pfp": "./img/searched-img/pfp30.jpeg",
        "followed": false
    },
    {
        "username": "themodernera",
        "pfp": "./img/searched-img/pfp31.jpeg",
        "followed": false
    },
    {
        "username": "smooth_rider_88",
        "pfp": "./img/searched-img/pfp32.jpeg",
        "followed": false
    },
    {
        "username": "zen_vibes_10",
        "pfp": "./img/searched-img/pfp33.jpeg",
        "followed": false
    },
    {
        "username": "coffee_lover_14",
        "pfp": "./img/searched-img/pfp34.jpeg",
        "followed": false
    },
    {
        "username": "urban_artist_56",
        "pfp": "./img/searched-img/pfp35.jpeg",
        "followed": false
    },
    {
        "username": "wanderlust_22",
        "pfp": "./img/searched-img/pfp36.jpeg",
        "followed": false
    },
    {
        "username": "northernlights_89",
        "pfp": "./img/searched-img/pfp37.jpeg",
        "followed": false
    },
    {
        "username": "sunset_chaser_44",
        "pfp": "./img/searched-img/pfp38.jpeg",
        "followed": false
    },
    {
        "username": "hiking_enthusiast",
        "pfp": "./img/searched-img/pfp39.jpeg",
        "followed": false
    },
    {
        "username": "creativespark_77",
        "pfp": "./img/searched-img/pfp40.jpeg",
        "followed": false
    },
    {
        "username": "mindfulmuse_23",
        "pfp": "./img/searched-img/pfp41.jpeg",
        "followed": false
    },
    {
        "username": "artistry_unfolds",
        "pfp": "./img/searched-img/pfp42.jpeg",
        "followed": false
    },
    {
        "username": "techie_dreamer",
        "pfp": "./img/searched-img/pfp43.jpeg",
        "followed": false
    },
    {
        "username": "gadget_enthusiast",
        "pfp": "./img/searched-img/pfp44.jpeg",
        "followed": false
    },
    {
        "username": "night_owls_89",
        "pfp": "./img/searched-img/pfp45.jpeg",
        "followed": false
    },
    {
        "username": "techguy_02",
        "pfp": "./img/searched-img/pfp46.jpeg",
        "followed": false
    },
    {
        "username": "explorer_xx",
        "pfp": "./img/searched-img/pfp47.jpeg",
        "followed": false
    },
    {
        "username": "pixel_pioneer",
        "pfp": "./img/searched-img/pfp48.jpeg",
        "followed": false
    },
    {
        "username": "smart_solutions",
        "pfp": "./img/searched-img/pfp49.jpeg",
        "followed": false
    },
    {
        "username": "creative_soul_21",
        "pfp": "./img/searched-img/pfp50.jpeg",
        "followed": false
    },
    {
        "username": "vintage_junkie_34",
        "pfp": "./img/searched-img/pfp51.jpeg",
        "followed": false
    },
    {
        "username": "adventure_skyline",
        "pfp": "./img/searched-img/pfp52.jpeg",
        "followed": false
    },
    {
        "username": "the_wandering_eyes",
        "pfp": "./img/searched-img/pfp53.jpeg",
        "followed": false
    },
    {
        "username": "design_lover_12",
        "pfp": "./img/searched-img/pfp54.jpeg",
        "followed": false
    },
    {
        "username": "journeyseeker_91",
        "pfp": "./img/searched-img/pfp55.jpeg",
        "followed": false
    },
    {
        "username": "dreaming_of_the_ocean",
        "pfp": "./img/searched-img/pfp56.jpeg",
        "followed": false
    },
    {
        "username": "yogini_spirit",
        "pfp": "./img/searched-img/pfp57.jpeg",
        "followed": false
    },
    {
        "username": "urban_explorer_44",
        "pfp": "./img/searched-img/pfp58.jpeg",
        "followed": false
    },
    {
        "username": "roamfree_22",
        "pfp": "./img/searched-img/pfp59.jpeg",
        "followed": false
    },
    {
        "username": "tech_enthusiast_101",
        "pfp": "./img/searched-img/pfp60.jpeg",
        "followed": false
    },
    {
        "username": "stargazer_00",
        "pfp": "./img/searched-img/pfp61.jpeg",
        "followed": false
    },
    {
        "username": "inspired_creative",
        "pfp": "./img/searched-img/pfp62.jpeg",
        "followed": false
    },
    {
        "username": "calming_vibes_55",
        "pfp": "./img/searched-img/pfp63.jpeg",
        "followed": false
    },
    {
        "username": "wanderlust_adventurer",
        "pfp": "./img/searched-img/pfp64.jpeg",
        "followed": false
    },
    {
        "username": "the_art_lover_98",
        "pfp": "./img/searched-img/pfp65.jpeg",
        "followed": false
    },
    {
        "username": "mindful_moments_01",
        "pfp": "./img/searched-img/pfp66.jpeg",
        "followed": false
    },
    {
        "username": "adventure_awaits_55",
        "pfp": "./img/searched-img/pfp67.jpeg",
        "followed": false
    },
    {
        "username": "bold_creative_09",
        "pfp": "./img/searched-img/pfp68.jpeg",
        "followed": false
    },
    {
        "username": "serenity_found",
        "pfp": "./img/searched-img/pfp69.jpeg",
        "followed": false
    },
    {
        "username": "dreamy_explorer",
        "pfp": "./img/searched-img/pfp70.jpeg",
        "followed": false
    },
    {
        "username": "creative_vibes_98",
        "pfp": "./img/searched-img/pfp71.jpeg",
        "followed": false
    },
    {
        "username": "the_vintage_collector",
        "pfp": "./img/searched-img/pfp72.jpeg",
        "followed": false
    },
    {
        "username": "gadget_geek_01",
        "pfp": "./img/searched-img/pfp73.jpeg",
        "followed": false
    },
    {
        "username": "sky_travelers",
        "pfp": "./img/searched-img/pfp74.jpeg",
        "followed": false
    },
    {
        "username": "eco_warrior_04",
        "pfp": "./img/searched-img/pfp75.jpeg",
        "followed": false
    },
    {
        "username": "cosmic_explorer_07",
        "pfp": "./img/searched-img/pfp76.jpeg",
        "followed": false
    },
    {
        "username": "photographic_visionary",
        "pfp": "./img/searched-img/pfp77.jpeg",
        "followed": false
    },
    {
        "username": "light_chaser_23",
        "pfp": "./img/searched-img/pfp78.jpeg",
        "followed": false
    },
    {
        "username": "travel_scholar_88",
        "pfp": "./img/searched-img/pfp79.jpeg",
        "followed": false
    },
    {
        "username": "the_crafting_mind",
        "pfp": "./img/searched-img/pfp80.jpeg",
        "followed": false
    },
    {
        "username": "the_seeker_33",
        "pfp": "./img/searched-img/pfp81.jpeg",
        "followed": false
    },
    {
        "username": "urban_escapee_45",
        "pfp": "./img/searched-img/pfp82.jpeg",
        "followed": false
    },
    {
        "username": "trendy_techie_72",
        "pfp": "./img/searched-img/pfp83.jpeg",
        "followed": false
    },
    {
        "username": "indie_art_06",
        "pfp": "./img/searched-img/pfp84.jpeg",
        "followed": false
    },
    {
        "username": "sunrise_chaser_12",
        "pfp": "./img/searched-img/pfp85.jpeg",
        "followed": false
    },
    {
        "username": "modern_creative_55",
        "pfp": "./img/searched-img/pfp86.jpeg",
        "followed": false
    },
    {
        "username": "urban_roamer_22",
        "pfp": "./img/searched-img/pfp87.jpeg",
        "followed": false
    },
    {
        "username": "wilderness_wanderer",
        "pfp": "./img/searched-img/pfp88.jpeg",
        "followed": false
    },
    {
        "username": "the_digital_dreamer",
        "pfp": "./img/searched-img/pfp89.jpeg",
        "followed": false
    },
    {
        "username": "vintage_traveler_11",
        "pfp": "./img/searched-img/pfp90.jpeg",
        "followed": false
    },
    {
        "username": "explorer_in_motion",
        "pfp": "./img/searched-img/pfp91.jpeg",
        "followed": false
    },
    {
        "username": "cosmic_wanderlust_22",
        "pfp": "./img/searched-img/pfp92.jpeg",
        "followed": false
    },
    {
        "username": "urban_explorer_99",
        "pfp": "./img/searched-img/pfp93.jpeg",
        "followed": false
    },
    {
        "username": "innovative_soul_89",
        "pfp": "./img/searched-img/pfp94.jpeg",
        "followed": false
    },
    {
        "username": "tech_explorer_88",
        "pfp": "./img/searched-img/pfp95.jpeg",
        "followed": false
    },
    {
        "username": "artistic_journey_34",
        "pfp": "./img/searched-img/pfp96.jpeg",
        "followed": false
    },
    {
        "username": "roaming_dreams_90",
        "pfp": "./img/searched-img/pfp97.jpeg",
        "followed": false
    },
    {
        "username": "light_finder_81",
        "pfp": "./img/searched-img/pfp98.jpeg",
        "followed": false
    },
    {
        "username": "northern_visionary_76",
        "pfp": "./img/searched-img/pfp99.jpeg",
        "followed": false
    },
    {
        "username": "the_eco_travelers",
        "pfp": "./img/searched-img/pfp100.jpeg",
        "followed": false
    },
    {
        "username": "sunset_explorer_12",
        "pfp": "./img/searched-img/pfp101.jpeg",
        "followed": false
    }
];

// Initialize followed accounts array from localStorage
let followedAccounts = JSON.parse(localStorage.getItem("followedAccounts")) || [];

// Function to update followers count in both display and localStorage
function updateFollowersCount() {
    const currentFollowers = followedAccounts.length;
    localStorage.setItem("myfollowers", currentFollowers.toString());

    // Update display in both profile info and any thread views
    const followerElements = ["myfollowers", "myfollowers-thread"];
    followerElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = currentFollowers;
        }
    });
}

// Function to get the next available user
function getNextAvailableUser() {
    const followedUsernames = new Set(followedAccounts.map(account => account.username));
    return predefinedUsers.find(user => !followedUsernames.has(user.username));
}

// Function to display a notification
function displayNotification(notification) {
    const notificationPanel = document.querySelector('.notification-panel');
    if (!notificationPanel) return;

    const notificationHTML = `
    <div class="account-detail" id="${notification.id}">
    <div class="top-info">
        <div id="profile-image" class="pfp-image">
        <img src="${notification.pfp}" alt="pfp">
        </div>
        <div class="account-following">
        <h2>@${notification.username} <span id="time-${notification.id}">0s</span></h2>
        <p>Followed you</p>
        </div>
        <div class="follow-them">
        <button onclick="toggleFollow('${notification.id}')" 
            class="follow-btn ${notification.isFollowed ? 'followed' : ''}">
            ${notification.isFollowed ? 'Following' : 'Follow'}
        </button>
        </div>
    </div>
    </div>
    `;

    notificationPanel.insertAdjacentHTML('afterbegin', notificationHTML);
}

// Function to toggle follow status
function toggleFollow(accountId) {
    const accountIndex = followedAccounts.findIndex(account => account.id === accountId);
    if (accountIndex !== -1) {
        followedAccounts[accountIndex].isFollowed = !followedAccounts[accountIndex].isFollowed;
        localStorage.setItem("followedAccounts", JSON.stringify(followedAccounts));

        const button = document.querySelector(`#${accountId} .follow-btn`);
        if (button) {
            button.textContent = followedAccounts[accountIndex].isFollowed ? 'Following' : 'Follow';
            button.classList.toggle('followed');
        }
    }
}

// Function to update time display
function updateTime(notification) {
    const timeElement = document.getElementById(`time-${notification.id}`);
    if (!timeElement) return;

    const now = Date.now();
    const diff = Math.floor((now - notification.timestamp) / 1000); 

    let timeString;
    if (diff < 60) timeString = `${diff}s`;
    else if (diff < 3600) timeString = `${Math.floor(diff/60)}m`;
    else if (diff < 86400) timeString = `${Math.floor(diff/3600)}h`;
    else if (diff < 604800) timeString = `${Math.floor(diff/86400)}d`;
    else if (diff < 2592000) timeString = `${Math.floor(diff/604800)}w`;
    else if (diff < 31536000) timeString = `${Math.floor(diff/2592000)}m`;
    else timeString = `${Math.floor(diff/31536000)}y`;

    timeElement.textContent = timeString;
}

// Function to generate next follow
function generateNextFollow() {
    const nextUser = getNextAvailableUser();
    if (!nextUser) return false; // No more users available

    const notification = {
        id: `user-${Date.now()}`,
        username: nextUser.username,
        pfp: nextUser.pfp,
        timestamp: Date.now(),
        isFollowed: false
    };

    followedAccounts.push(notification);
    localStorage.setItem("followedAccounts", JSON.stringify(followedAccounts));

    // Update followers count
    updateFollowersCount();

    displayNotification(notification);
    return true;
}

// Function to restore existing notifications
function restoreExistingNotifications() {
    const notificationPanel = document.querySelector('.notification-panel');
    if (!notificationPanel) return;

    // Clear existing notifications
    notificationPanel.innerHTML = '';

    // Display saved notifications in chronological order (oldest first)
    [...followedAccounts]
    .sort((a, b) => a.timestamp - b.timestamp)
        .forEach(notification => displayNotification(notification));
}

// Load notifications and setup page on load
document.addEventListener("DOMContentLoaded", function () {
    // Setup navigation
    const navElements = ['homepage', 'search', 'notification', 'myaccount'];
    navElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("click", () => {
                window.location.href = `./${id === 'homepage' ? 'index' : id}.html`;
            });
        }
    });

    // Restore existing notifications
    restoreExistingNotifications();

    // Update initial followers count
    updateFollowersCount();

    // Start generating new follows if there are still available users
    if (followedAccounts.length < predefinedUsers.length) {
        let followInterval = setInterval(() => {
            const hasMoreUsers = generateNextFollow();
            if (!hasMoreUsers) {
                clearInterval(followInterval);
            }
        }, 200000);

        // Generate first new follow immediately
        generateNextFollow();
    }

    // Update times every second
    setInterval(() => {
        followedAccounts.forEach(notification => {
            updateTime(notification);
        });
    }, 1000);
});

document.addEventListener("DOMContentLoaded", function () {
    function loadUserStats() {
        const threads = localStorage.getItem("mythreads") || 0;
        const followers = localStorage.getItem("myfollowers") || 0;
        const following = localStorage.getItem("myfollowing") || 0;

        document.getElementById("mythreads").textContent = threads;
        document.getElementById("myfollowers").textContent = followers;
        document.getElementById("myfollowing").textContent = following;
        document.getElementById("mythreads-thread").textContent = threads;
        document.getElementById("myfollowers-thread").textContent = followers;
        document.getElementById("myfollowing-thread").textContent = following;
    }

    function navigateTo(path) {
        window.location.href = path + ".html";
    }

    document.getElementById("homepage").addEventListener("click", function () {
        navigateTo("./index");
    });

    document.getElementById("search").addEventListener("click", function () {
        navigateTo("./search");
    });

    document.getElementById("notification").addEventListener("click", function () {
        navigateTo("./notifications");
    });

    document.getElementById("myaccount").addEventListener("click", function () {
        navigateTo("./account");
    });

    loadUserStats();
});