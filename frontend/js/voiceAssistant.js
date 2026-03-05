/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║        FARMER MEDICINE SHOP — VOICE ASSISTANT v2.0          ║
 * ║  Web Speech API · Multilingual · Full e-commerce workflow   ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Supports: English (en-IN) | Hindi (hi-IN) | Kannada (kn-IN)
 * Works across: index, login, signup, cart, checkout, product-detail, orders
 */

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────────
    // LANGUAGE DATA
    // ─────────────────────────────────────────────────────────────────
    const LANGS = {
        en: {
            code: 'en-IN',
            label: 'EN',
            fullLabel: 'English',

            // ── Welcome messages per page ───────────────
            welcome: {
                '/': 'Welcome to Farmer Medicine Shop! I am your voice assistant. You can say search fertilizer, add to cart, checkout, or say help to know all commands.',
                '/index.html': 'Welcome to Farmer Medicine Shop! Say search followed by a product name to find what you need. Or say help for all commands.',
                '/login.html': 'Welcome! Please enter your email and password to login. Or say create account to register.',
                '/signup.html': 'Let\'s create your account. Please fill in the form, or say login if you already have an account.',
                '/cart.html': 'This is your cart. You can say checkout to place your order, or say go home to continue shopping.',
                '/checkout.html': 'You are almost done! Fill in your delivery address. Say place order when you are ready.',
                '/product-detail.html': 'You are viewing a product. Say add to cart to add it to your cart, or say go back to return.',
                '/order-history.html': 'Here are your orders. Say go home to continue shopping.',
                'default': 'Welcome to Farmer Medicine Shop! Say help to know all available voice commands.',
            },

            // ── Responses ───────────────────────────────
            r: {
                searching: (q) => `Searching for ${q}. Please wait.`,
                searchDone: (n, q) => `I found ${n} results for ${q}. You can say add first product to cart, or scroll to browse.`,
                searchNone: (q) => `Sorry, I could not find any products for ${q}. Please try a different search term.`,
                addedToCart: (name) => `${name} has been added to your cart. Do you want to continue shopping or say checkout?`,
                cartEmpty: 'Your cart is empty. Say search to find products.',
                navigating: (page) => `Going to ${page}.`,
                notLoggedIn: 'Please login to continue. Say login or create account.',
                notUnderstood: 'Sorry, I did not understand that. You can say search product, add to cart, checkout, or say help.',
                helpOpened: 'Here are all the commands you can use.',
                turnedOff: 'Voice assistant turned off. You can turn it back on using the microphone button.',
                turnedOn: 'Voice assistant turned on. I am here to help!',
                noSpeech: 'I did not hear anything. Please try again.',
                browserNoSupport: 'Sorry, your browser does not support voice recognition. Please use Google Chrome.',
                langChanged: (lang) => `Language switched to ${lang}.`,
                orderPlaced: 'Your order has been placed successfully! You will receive your delivery soon. Thank you for using Farmer Medicine Shop.',
                cartItemCount: (n, total) => `You have ${n} item${n !== 1 ? 's' : ''} in your cart. Total amount is ${total} rupees. Say place order to confirm.`,
            },

            // ── Commands (keywords to match) ────────────
            cmd: {
                search: ['search', 'find', 'show', 'look for', 'get'],
                addCart: ['add to cart', 'add this', 'add first', 'add product', 'buy this', 'buy first'],
                cart: ['open cart', 'my cart', 'show cart', 'view cart', 'go to cart'],
                checkout: ['checkout', 'check out', 'go to checkout', 'proceed to checkout'],
                placeOrder: ['place order', 'confirm order', 'order now', 'place my order'],
                login: ['login', 'log in', 'sign in'],
                register: ['create account', 'register', 'sign up', 'signup'],
                home: ['go home', 'home page', 'home', 'main page', 'go to home'],
                orders: ['my orders', 'track order', 'order history', 'track my order'],
                help: ['help', 'what can i say', 'commands', 'how to use', 'what can you do'],
                stop: ['stop assistant', 'turn off assistant', 'mute assistant', 'stop voice', 'disable voice', 'turn off voice'],
                start: ['turn on assistant', 'enable assistant', 'start assistant', 'turn on voice'],
                back: ['go back', 'back'],
                fertilizers: ['fertilizer', 'fertilizers', 'khad', 'urea'],
                pesticides: ['pesticide', 'pesticides', 'insecticide', 'keetanashak', 'spray'],
                seeds: ['seed', 'seeds', 'beej'],
                tools: ['tool', 'tools', 'equipment', 'yantra'],
            }
        },

        hi: {
            code: 'hi-IN',
            label: 'हिं',
            fullLabel: 'हिंदी',
            welcome: {
                'default': 'किसान मेडिसिन शॉप में आपका स्वागत है! आप बोल सकते हैं खाद खोजें, कार्ट में जोड़ें, चेकआउट, या मदद के लिए हेल्प बोलें।',
            },
            r: {
                searching: (q) => `${q} खोज रहा हूं। कृपया प्रतीक्षा करें।`,
                searchDone: (n, q) => `${q} के लिए ${n} परिणाम मिले। पहला उत्पाद जोड़ने के लिए बोलें: पहला कार्ट में जोड़ें।`,
                searchNone: (q) => `माफ़ करें, ${q} के लिए कोई उत्पाद नहीं मिला।`,
                addedToCart: (name) => `${name} कार्ट में जोड़ा गया। चेकआउट के लिए बोलें: चेकआउट।`,
                cartEmpty: 'आपका कार्ट खाली है। उत्पाद खोजने के लिए बोलें: खोजें।',
                navigating: (page) => `${page} पर जा रहा हूं।`,
                notLoggedIn: 'कृपया लॉगिन करें। बोलें: लॉगिन या अकाउंट बनाएं।',
                notUnderstood: 'माफ़ करें, समझ नहीं आया। मदद के लिए बोलें: हेल्प।',
                helpOpened: 'यहाँ सभी आदेश हैं जो आप उपयोग कर सकते हैं।',
                turnedOff: 'वॉयस असिस्टेंट बंद किया गया।',
                turnedOn: 'वॉयस असिस्टेंट चालू है! मैं आपकी मदद के लिए यहां हूं।',
                noSpeech: 'कुछ सुनाई नहीं दिया। कृपया पुनः प्रयास करें।',
                browserNoSupport: 'माफ़ करें, आपका ब्राउज़र वॉयस को सपोर्ट नहीं करता। Chrome उपयोग करें।',
                langChanged: (lang) => `भाषा ${lang} में बदली गई।`,
                orderPlaced: 'आपका ऑर्डर सफलतापूर्वक दिया गया! जल्द ही डिलीवरी होगी। धन्यवाद!',
                cartItemCount: (n, total) => `आपके कार्ट में ${n} आइटम हैं। कुल राशि ${total} रुपए है। बोलें: ऑर्डर दें।`,
            },
            cmd: {
                search: ['खोजें', 'खोजो', 'ढूंढो', 'दिखाओ', 'सर्च'],
                addCart: ['कार्ट में जोड़ें', 'जोड़ें', 'खरीदें', 'पहला जोड़ें'],
                cart: ['कार्ट', 'मेरा कार्ट', 'कार्ट दिखाओ'],
                checkout: ['चेकआउट', 'ऑर्डर करें', 'खरीदारी पूरी करें'],
                placeOrder: ['ऑर्डर दें', 'ऑर्डर करें', 'पुष्टि करें'],
                login: ['लॉगिन', 'साइन इन'],
                register: ['अकाउंट बनाएं', 'रजिस्टर', 'साइन अप'],
                home: ['होम', 'घर', 'मुख्य पृष्ठ'],
                orders: ['मेरे ऑर्डर', 'ऑर्डर इतिहास', 'ट्रैक ऑर्डर'],
                help: ['हेल्प', 'मदद', 'क्या बोलूं'],
                stop: ['बंद करो', 'असिस्टेंट बंद', 'म्यूट'],
                start: ['चालू करो', 'असिस्टेंट चालू'],
                back: ['वापस', 'पीछे'],
                fertilizers: ['खाद', 'उर्वरक', 'यूरिया'],
                pesticides: ['कीटनाशक', 'स्प्रे', 'दवाई'],
                seeds: ['बीज', 'बीजें'],
                tools: ['यंत्र', 'उपकरण', 'औजार'],
            }
        },

        kn: {
            code: 'kn-IN',
            label: 'ಕನ್ನ',
            fullLabel: 'ಕನ್ನಡ',
            welcome: {
                'default': 'ರೈತ ಮೆಡಿಸಿನ್ ಶಾಪ್‌ಗೆ ಸ್ವಾಗತ! ನೀವು ಹೇಳಬಹುದು: ಗೊಬ್ಬರ ಹುಡುಕಿ, ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ, ಚೆಕ್‌ಔಟ್, ಅಥವಾ ಸಹಾಯ ಹೇಳಿ.',
            },
            r: {
                searching: (q) => `${q} ಹುಡುಕಲಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ.`,
                searchDone: (n, q) => `${q} ಗಾಗಿ ${n} ಉತ್ಪನ್ನಗಳು ಸಿಕ್ಕಿವೆ.`,
                searchNone: (q) => `ಕ್ಷಮಿಸಿ, ${q} ಗಾಗಿ ಉತ್ಪನ್ನಗಳು ಸಿಗಲಿಲ್ಲ.`,
                addedToCart: (name) => `${name} ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ.`,
                cartEmpty: 'ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ.',
                navigating: (page) => `${page} ಗೆ ಹೋಗಲಾಗುತ್ತಿದೆ.`,
                notLoggedIn: 'ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.',
                notUnderstood: 'ಕ್ಷಮಿಸಿ, ಅರ್ಥವಾಗಲಿಲ್ಲ. ಸಹಾಯ ಹೇಳಿ.',
                helpOpened: 'ಇಲ್ಲಿ ಎಲ್ಲಾ ಆದೇಶಗಳಿವೆ.',
                turnedOff: 'ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್ ಆಫ್ ಮಾಡಲಾಗಿದೆ.',
                turnedOn: 'ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್ ಆನ್ ಆಗಿದೆ!',
                noSpeech: 'ಏನೂ ಕೇಳಿಸಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
                browserNoSupport: 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ವಾಯ್ಸ್ ಅನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. Chrome ಬಳಸಿ.',
                langChanged: (lang) => `ಭಾಷೆ ${lang} ಗೆ ಬದಲಾಯಿಸಲಾಯಿತು.`,
                orderPlaced: 'ನಿಮ್ಮ ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿ ನೀಡಲಾಗಿದೆ! ಧನ್ಯವಾದ!',
                cartItemCount: (n, total) => `ನಿಮ್ಮ ಕಾರ್ಟ್‌ನಲ್ಲಿ ${n} ವಸ್ತುಗಳಿವೆ. ಒಟ್ಟು ₹${total}.`,
            },
            cmd: {
                search: ['ಹುಡುಕಿ', 'ತೋರಿಸಿ', 'ಹುಡುಕು', 'ಸರ್ಚ್'],
                addCart: ['ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ', 'ಸೇರಿಸಿ', 'ಖರೀದಿಸಿ'],
                cart: ['ಕಾರ್ಟ್', 'ನನ್ನ ಕಾರ್ಟ್'],
                checkout: ['ಚೆಕ್‌ಔಟ್', 'ಆರ್ಡರ್ ಮಾಡಿ'],
                placeOrder: ['ಆರ್ಡರ್ ನೀಡಿ', 'ದೃಢಪಡಿಸಿ'],
                login: ['ಲಾಗಿನ್', 'ಸೈನ್ ಇನ್'],
                register: ['ಅಕೌಂಟ್ ತೆರೆಯಿರಿ', 'ನೋಂದಾಯಿಸಿ'],
                home: ['ಹೋಮ್', 'ಮನೆ ಪುಟ'],
                orders: ['ನನ್ನ ಆರ್ಡರ್‌ಗಳು', 'ಆರ್ಡರ್ ಇತಿಹಾಸ'],
                help: ['ಸಹಾಯ', 'ಹೆಲ್ಪ್'],
                stop: ['ನಿಲ್ಲಿಸಿ', 'ಬಂದ್ ಮಾಡಿ'],
                start: ['ಚಾಲೂ ಮಾಡಿ'],
                back: ['ಹಿಂದೆ', 'ವಾಪಸ್'],
                fertilizers: ['ಗೊಬ್ಬರ', 'ರಸಗೊಬ್ಬರ', 'ಯೂರಿಯಾ'],
                pesticides: ['ಕೀಟನಾಶಕ', 'ಔಷಧ', 'ಸ್ಪ್ರೇ'],
                seeds: ['ಬೀಜ', 'ಬೀಜಗಳು'],
                tools: ['ಉಪಕರಣ', 'ಯಂತ್ರ'],
            }
        }
    };

    // ─────────────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────────────
    const STATE = {
        enabled: localStorage.getItem('va_enabled') !== 'false',
        lang: localStorage.getItem('va_lang') || 'en',
        listening: false,
        speaking: false,
        recognition: null,
        currentPage: window.location.pathname,
        lastSearchQuery: '',
        helpOpen: false,
        autoListen: false,   // becomes true after first mic press — stays on until disabled
        _autoListenTimer: null,
    };

    // ─────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────
    const L = () => LANGS[STATE.lang] || LANGS.en;

    function getPageKey() {
        const p = STATE.currentPage;
        if (p === '/' || p.endsWith('/index.html') || p === '') return '/index.html';
        const match = Object.keys(L().welcome).find(k => p.endsWith(k));
        return match || 'default';
    }

    // ─────────────────────────────────────────────────────────────────
    // SPEECH SYNTHESIS (TTS)
    // ─────────────────────────────────────────────────────────────────
    function speak(text, onEnd) {
        if (!STATE.enabled) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = L().code;
        utt.rate = 0.92;
        utt.pitch = 1.05;
        utt.volume = 1;

        utt.onstart = () => {
            STATE.speaking = true;
            updateBubble(text, 'speaking');
            updateMicBtn();
        };
        utt.onend = () => {
            STATE.speaking = false;
            updateBubble('', 'idle');
            updateMicBtn();
            if (onEnd) onEnd();
            // ── Auto-listen: restart mic after speaking, with a short pause ──
            if (STATE.autoListen && STATE.enabled) {
                clearTimeout(STATE._autoListenTimer);
                STATE._autoListenTimer = setTimeout(() => {
                    if (STATE.autoListen && STATE.enabled && !STATE.listening && !STATE.speaking) {
                        startListening();
                    }
                }, 600);
            }
        };
        utt.onerror = () => {
            STATE.speaking = false;
            updateMicBtn();
            // Still auto-restart even on TTS error
            if (STATE.autoListen && STATE.enabled) {
                clearTimeout(STATE._autoListenTimer);
                STATE._autoListenTimer = setTimeout(() => {
                    if (STATE.autoListen && STATE.enabled && !STATE.listening) startListening();
                }, 600);
            }
        };

        window.speechSynthesis.speak(utt);
    }

    // ─────────────────────────────────────────────────────────────────
    // SPEECH RECOGNITION (STT)
    // ─────────────────────────────────────────────────────────────────
    function startListening() {
        if (!STATE.enabled || STATE.listening || STATE.speaking) return;

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            speak(L().r.browserNoSupport);
            return;
        }

        const rec = new SR();
        rec.lang = L().code;
        rec.continuous = false;
        rec.interimResults = true;
        rec.maxAlternatives = 3;
        STATE.recognition = rec;

        rec.onstart = () => {
            STATE.listening = true;
            updateBubble('Listening…', 'listening');
            updateMicBtn();
        };

        rec.onresult = (e) => {
            const transcript = Array.from(e.results)
                .map(r => r[0].transcript)
                .join('');
            updateBubble(transcript, 'listening');

            if (e.results[0].isFinal) {
                processCommand(transcript.trim().toLowerCase());
            }
        };

        rec.onnomatch = () => speak(L().r.noSpeech);
        rec.onerror = (e) => {
            STATE.listening = false;
            updateMicBtn();
            if (e.error !== 'no-speech' && e.error !== 'aborted') {
                updateBubble('', 'idle');
            }
        };
        rec.onend = () => {
            STATE.listening = false;
            updateMicBtn();
            // ── Auto-listen: if we stopped without speaking (no-speech / browser timeout), restart
            if (STATE.autoListen && STATE.enabled && !STATE.speaking) {
                clearTimeout(STATE._autoListenTimer);
                STATE._autoListenTimer = setTimeout(() => {
                    if (STATE.autoListen && STATE.enabled && !STATE.listening && !STATE.speaking) {
                        startListening();
                    }
                }, 400);
            }
        };

        rec.start();
    }

    function stopListening(disableAutoListen) {
        clearTimeout(STATE._autoListenTimer);
        if (disableAutoListen) STATE.autoListen = false;
        if (STATE.recognition) {
            try { STATE.recognition.stop(); } catch (_) { }
            STATE.recognition = null;
        }
        STATE.listening = false;
        updateMicBtn();
    }

    // ─────────────────────────────────────────────────────────────────
    // INTENT DETECTION
    // ─────────────────────────────────────────────────────────────────
    function matchesAny(text, keywords) {
        return keywords.some(kw => text.includes(kw.toLowerCase()));
    }

    function extractSearchQuery(text) {
        const cmd = L().cmd;
        // Remove command keywords and extract the remaining query
        const searchKws = [...cmd.search, ...(LANGS.en.cmd.search)];
        let q = text;
        for (const kw of searchKws) {
            q = q.replace(new RegExp(kw, 'gi'), '').trim();
        }
        // Clean up common filler words
        q = q.replace(/\b(for|me|please|the|a|an|some|any)\b/gi, '').trim();
        return q || text;
    }

    function processCommand(text) {
        const cmd = L().cmd;
        updateBubble(`"${text}"`, 'heard');

        // ── STOP ────────────────────────────────────────
        if (matchesAny(text, cmd.stop)) {
            toggleAssistant(false);
            return;
        }

        // ── HELP ────────────────────────────────────────
        if (matchesAny(text, cmd.help)) {
            speak(L().r.helpOpened);
            toggleHelp(true);
            return;
        }

        // ── NAVIGATION ─────────────────────────────────
        if (matchesAny(text, cmd.home)) {
            speak(L().r.navigating('Home'));
            setTimeout(() => window.location.href = '/', 1200);
            return;
        }

        if (matchesAny(text, cmd.login)) {
            speak(L().r.navigating('Login'));
            setTimeout(() => window.location.href = '/login.html', 1200);
            return;
        }

        if (matchesAny(text, cmd.register)) {
            speak(L().r.navigating('Register'));
            setTimeout(() => window.location.href = '/signup.html', 1200);
            return;
        }

        if (matchesAny(text, cmd.cart)) {
            speak(L().r.navigating('Cart'));
            setTimeout(() => window.location.href = '/cart.html', 1200);
            return;
        }

        if (matchesAny(text, cmd.orders)) {
            speak(L().r.navigating('My Orders'));
            setTimeout(() => window.location.href = '/order-history.html', 1200);
            return;
        }

        if (matchesAny(text, cmd.back)) {
            speak(L().r.navigating('Previous page'));
            setTimeout(() => window.history.back(), 1000);
            return;
        }

        // ── CHECKOUT ────────────────────────────────────
        if (matchesAny(text, cmd.checkout)) {
            const token = localStorage.getItem('authToken');
            if (!token) { speak(L().r.notLoggedIn); return; }
            speak(L().r.navigating('Checkout'));
            setTimeout(() => window.location.href = '/checkout.html', 1200);
            return;
        }

        // ── PLACE ORDER (on checkout page) ──────────────
        if (matchesAny(text, cmd.placeOrder)) {
            const placeBtn = document.getElementById('place-order-btn');
            if (placeBtn && !placeBtn.disabled) {
                speak(L().r.orderPlaced);
                setTimeout(() => placeBtn.click(), 1400);
            } else {
                speak(L().r.navigating('Checkout'));
                setTimeout(() => window.location.href = '/checkout.html', 1200);
            }
            return;
        }

        // ── ADD TO CART ─────────────────────────────────
        if (matchesAny(text, cmd.addCart)) {
            handleAddToCart(text);
            return;
        }

        // ── CART INFO ───────────────────────────────────
        if (text.includes('cart') && (text.includes('how many') || text.includes('total') || text.includes('amount'))) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const total = cart.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0);
            speak(L().r.cartItemCount(cart.length, total.toLocaleString('en-IN')));
            return;
        }

        // ── CATEGORY FILTER ─────────────────────────────
        if (matchesAny(text, cmd.fertilizers) && !matchesAny(text, [...cmd.search, 'search'])) {
            handleCategoryFilter('Fertilizers');
            return;
        }
        if (matchesAny(text, cmd.pesticides) && !matchesAny(text, [...cmd.search, 'search'])) {
            handleCategoryFilter('Pesticides');
            return;
        }
        if (matchesAny(text, cmd.seeds) && !matchesAny(text, [...cmd.search, 'search'])) {
            handleCategoryFilter('Seeds');
            return;
        }
        if (matchesAny(text, cmd.tools) && !matchesAny(text, [...cmd.search, 'search'])) {
            handleCategoryFilter('Tools');
            return;
        }

        // ── SEARCH ──────────────────────────────────────
        if (matchesAny(text, cmd.search)
            || matchesAny(text, cmd.fertilizers)
            || matchesAny(text, cmd.pesticides)
            || matchesAny(text, cmd.seeds)
            || matchesAny(text, cmd.tools)) {
            handleSearch(text);
            return;
        }

        // ── FALLBACK ────────────────────────────────────
        speak(L().r.notUnderstood);
    }

    // ─────────────────────────────────────────────────────────────────
    // ACTION HANDLERS
    // ─────────────────────────────────────────────────────────────────
    function handleSearch(text) {
        const query = extractSearchQuery(text);
        STATE.lastSearchQuery = query;
        speak(L().r.searching(query));

        // If we're on the home page, use the search bar
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            setTimeout(() => {
                searchInput.value = query;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                // Also trigger the search button click if there is one
                const searchBtn = document.querySelector('.search-bar button[title="Search"]');
                if (searchBtn) searchBtn.click();
                // Count results after DOM updates
                setTimeout(() => {
                    const cards = document.querySelectorAll('.product-card, .product-item, [class*="product"]');
                    const visible = Array.from(cards).filter(c => c.offsetParent !== null);
                    const count = visible.length;
                    speak(count > 0 ? L().r.searchDone(count, query) : L().r.searchNone(query));
                }, 1800);
            }, 1000);
        } else {
            // Navigate to home with query param
            speak(L().r.navigating('Home'));
            setTimeout(() => window.location.href = `/?q=${encodeURIComponent(query)}`, 1000);
        }
    }

    function handleCategoryFilter(category) {
        speak(L().r.navigating(category));
        const catBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
        if (catBtn) {
            catBtn.click();
            document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = `/?category=${encodeURIComponent(category)}`;
        }
    }

    function handleAddToCart(text) {
        // Try to find the "Add to Cart" button on the current page
        const addBtns = document.querySelectorAll(
            '.add-to-cart-btn, [data-action="add-to-cart"], button[onclick*="addToCart"]'
        );

        // Check if on product detail page
        const detailAddBtn = document.querySelector('#add-to-cart-btn, .detail-add-btn, button.btn-primary');

        if (detailAddBtn && detailAddBtn.textContent.toLowerCase().includes('cart')) {
            const productName = document.querySelector('.product-name, h1, .detail-title')?.textContent || 'Product';
            speak(L().r.addedToCart(productName));
            setTimeout(() => detailAddBtn.click(), 800);
            return;
        }

        // On home/search results: "add first product"
        const firstAddBtn = addBtns[0];
        if (firstAddBtn) {
            const card = firstAddBtn.closest('.product-card, .card, [class*="product"]');
            const name = card?.querySelector('h3, .product-name, .card-title')?.textContent || 'Item';
            speak(L().r.addedToCart(name));
            setTimeout(() => firstAddBtn.click(), 800);
            return;
        }

        // Nothing found — navigate home
        speak(L().r.navigating('Home'));
        setTimeout(() => window.location.href = '/', 1200);
    }

    // ─────────────────────────────────────────────────────────────────
    // TOGGLE ASSISTANT ON / OFF
    // ─────────────────────────────────────────────────────────────────
    function toggleAssistant(force) {
        STATE.enabled = typeof force === 'boolean' ? force : !STATE.enabled;
        localStorage.setItem('va_enabled', STATE.enabled);
        window.speechSynthesis.cancel();
        stopListening(true); // stop AND disable auto-listen

        const fab = document.getElementById('va-fab');
        const toggle = document.getElementById('va-toggle-checkbox');
        if (fab) fab.classList.toggle('va-disabled', !STATE.enabled);
        if (toggle) toggle.checked = STATE.enabled;

        const bubble = document.getElementById('va-bubble');
        if (bubble) bubble.style.display = STATE.enabled ? 'block' : 'none';

        if (STATE.enabled) {
            setTimeout(() => speak(L().r.turnedOn), 200);
        } else {
            STATE.enabled = true;
            speak(L().r.turnedOff, () => { STATE.enabled = false; });
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // HELP POPUP
    // ─────────────────────────────────────────────────────────────────
    function toggleHelp(open) {
        STATE.helpOpen = (typeof open === 'boolean') ? open : !STATE.helpOpen;
        const panel = document.getElementById('va-help-panel');
        if (panel) panel.classList.toggle('va-help-open', STATE.helpOpen);
    }

    // ─────────────────────────────────────────────────────────────────
    // UI UPDATES
    // ─────────────────────────────────────────────────────────────────
    function updateBubble(text, mode) {
        const bubble = document.getElementById('va-bubble');
        const label = document.getElementById('va-bubble-text');
        const status = document.getElementById('va-status-dot');
        if (!bubble || !label || !status) return;

        if (!text || !STATE.enabled) {
            bubble.classList.remove('va-bubble-show');
            return;
        }

        label.textContent = text;
        bubble.classList.add('va-bubble-show');
        status.className = 'va-status-dot';
        if (mode === 'listening') status.classList.add('va-dot-listening');
        else if (mode === 'speaking') status.classList.add('va-dot-speaking');
        else if (mode === 'heard') status.classList.add('va-dot-heard');

        clearTimeout(bubble._hideTimer);
        if (mode === 'heard' || mode === 'idle') {
            bubble._hideTimer = setTimeout(() => bubble.classList.remove('va-bubble-show'), 3500);
        }
    }

    function updateMicBtn() {
        const fab = document.getElementById('va-fab');
        const icon = document.getElementById('va-fab-icon');
        if (!fab || !icon) return;

        fab.classList.remove('va-fab-listening', 'va-fab-speaking', 'va-disabled');

        if (!STATE.enabled) {
            fab.classList.add('va-disabled');
            icon.textContent = '🎤';
        } else if (STATE.listening) {
            fab.classList.add('va-fab-listening');
            icon.textContent = '🔴';
        } else if (STATE.speaking) {
            fab.classList.add('va-fab-speaking');
            icon.textContent = '🔊';
        } else {
            icon.textContent = '🎤';
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // BUILD THE UI
    // ─────────────────────────────────────────────────────────────────
    function buildUI() {
        // ── Inject CSS ──────────────────────────────────────────────────
        const style = document.createElement('style');
        style.textContent = `
      /* ── Voice Assistant Root ── */
      #va-root { position: fixed; bottom: 24px; right: 24px; z-index: 99000; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; font-family: 'Segoe UI', sans-serif; }

      /* ── Floating Action Button ── */
      #va-fab {
        width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer;
        background: linear-gradient(135deg, #2e7d32, #1b5e20);
        color: #fff; font-size: 24px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 6px 24px rgba(46,125,50,0.45);
        transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
        position: relative;
      }
      #va-fab:hover { transform: scale(1.08); box-shadow: 0 8px 32px rgba(46,125,50,0.55); }
      #va-fab.va-fab-listening {
        background: linear-gradient(135deg, #c62828, #b71c1c);
        box-shadow: 0 6px 28px rgba(198,40,40,0.5);
        animation: va-pulse 1.2s ease-in-out infinite;
      }
      #va-fab.va-fab-speaking {
        background: linear-gradient(135deg, #1565c0, #0d47a1);
        animation: va-pulse 1.5s ease-in-out infinite;
      }
      #va-fab.va-disabled { background: linear-gradient(135deg, #9e9e9e, #757575); box-shadow: 0 4px 12px rgba(0,0,0,0.2); animation: none; }
      @keyframes va-pulse {
        0%, 100% { box-shadow: 0 6px 24px rgba(0,0,0,0.3), 0 0 0 0 rgba(255,255,255,0.4); }
        50%       { box-shadow: 0 6px 24px rgba(0,0,0,0.3), 0 0 0 12px rgba(255,255,255,0); }
      }

      /* ── Ripple ring on listening ── */
      #va-fab.va-fab-listening::before {
        content: ''; position: absolute; inset: -8px; border-radius: 50%;
        border: 3px solid rgba(198,40,40,0.5);
        animation: va-ring 1.2s ease-out infinite;
      }
      @keyframes va-ring { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.6); } }

      /* ── Speech Bubble ── */
      #va-bubble {
        display: none; opacity: 0; transform: translateY(6px) scale(0.97);
        background: rgba(255,255,255,0.97); color: #1f2937;
        border-radius: 14px 14px 4px 14px;
        padding: 10px 14px; max-width: 260px;
        font-size: 13px; font-weight: 500; line-height: 1.45;
        box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        border: 1px solid rgba(46,125,50,0.2);
        transition: opacity 0.25s ease, transform 0.25s ease;
        pointer-events: none;
        display: flex; align-items: flex-start; gap: 8px;
      }
      #va-bubble.va-bubble-show { opacity: 1; transform: translateY(0) scale(1); display: flex !important; }

      .va-status-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; background: #9ca3af; }
      .va-dot-listening { background: #ef4444; animation: va-blink 0.7s ease-in-out infinite; }
      .va-dot-speaking  { background: #2563eb; animation: va-blink 1s ease-in-out infinite; }
      .va-dot-heard     { background: #16a34a; }
      @keyframes va-blink { 0%,100%{opacity:1;}50%{opacity:0.3;} }

      /* ── Controls bar ── */
      #va-controls {
        display: flex; align-items: center; gap: 8px;
        background: rgba(255,255,255,0.96); border-radius: 50px;
        padding: 6px 12px; box-shadow: 0 3px 14px rgba(0,0,0,0.12);
        border: 1px solid #e5e7eb;
      }

      /* ── Toggle ── */
      .va-toggle-wrap { display: flex; align-items: center; gap: 6px; }
      .va-toggle-lbl { font-size: 11px; font-weight: 600; color: #374151; }
      .va-toggle { position: relative; width: 36px; height: 20px; }
      .va-toggle input { opacity: 0; width: 0; height: 0; }
      .va-toggle-slider {
        position: absolute; inset: 0; background: #d1d5db; border-radius: 50px;
        cursor: pointer; transition: background 0.2s;
      }
      .va-toggle-slider::before {
        content: ''; position: absolute; width: 14px; height: 14px;
        left: 3px; top: 3px; background: white; border-radius: 50%;
        transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }
      .va-toggle input:checked + .va-toggle-slider { background: #2e7d32; }
      .va-toggle input:checked + .va-toggle-slider::before { transform: translateX(16px); }

      /* ── Language switcher ── */
      .va-lang-btn {
        background: none; border: 1.5px solid #e5e7eb; border-radius: 6px;
        font-size: 10px; font-weight: 700; color: #374151;
        padding: 3px 6px; cursor: pointer; transition: all 0.15s;
      }
      .va-lang-btn.active, .va-lang-btn:hover { background: #2e7d32; color: #fff; border-color: #2e7d32; }

      /* ── Help button ── */
      .va-help-btn {
        width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid #e5e7eb;
        font-size: 13px; cursor: pointer; background: #fff; color: #374151;
        display: flex; align-items: center; justify-content: center; transition: all 0.15s;
      }
      .va-help-btn:hover { background: #2e7d32; color: #fff; border-color: #2e7d32; }

      /* ── Help Panel ── */
      #va-help-panel {
        display: none; position: fixed; bottom: 160px; right: 24px;
        width: 300px; max-height: 70vh; overflow-y: auto;
        background: #fff; border-radius: 16px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.18);
        border: 1px solid #e5e7eb; z-index: 99100;
        animation: va-fade-in 0.2s ease;
      }
      #va-help-panel.va-help-open { display: block; }
      @keyframes va-fade-in { from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);} }

      .va-help-header {
        padding: 14px 16px 10px;
        background: linear-gradient(135deg, #2e7d32, #1b5e20);
        border-radius: 16px 16px 0 0; color: #fff;
        display: flex; align-items: center; justify-content: space-between;
      }
      .va-help-header h4 { margin: 0; font-size: 14px; font-weight: 700; }
      .va-help-close { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; padding: 0; line-height: 1; }

      .va-help-body { padding: 12px 14px; }
      .va-help-section { margin-bottom: 14px; }
      .va-help-section-title { font-size: 11px; font-weight: 700; color: #2e7d32; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px; }
      .va-help-chips { display: flex; flex-wrap: wrap; gap: 5px; }
      .va-chip {
        background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;
        border-radius: 50px; font-size: 11px; font-weight: 600; padding: 3px 10px;
        cursor: pointer; transition: all 0.15s;
      }
      .va-chip:hover { background: #2e7d32; color: #fff; border-color: #2e7d32; }

      /* ── Heard transcript pill ── */
      #va-transcript-bar {
        display: none; position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
        background: rgba(30,30,30,0.88); color: #fff; border-radius: 50px;
        padding: 8px 20px; font-size: 13px; font-weight: 500; z-index: 99200;
        backdrop-filter: blur(4px); max-width: 80vw; text-align: center;
        transition: opacity 0.3s;
      }
      #va-transcript-bar.show { display: block; }

      @media (max-width: 480px) {
        #va-root { bottom: 16px; right: 14px; }
        #va-fab  { width: 52px; height: 52px; font-size: 20px; }
        #va-help-panel { width: calc(100vw - 28px); right: 14px; }
        #va-bubble { max-width: 200px; }
      }
    `;
        document.head.appendChild(style);

        // ── Help panel content ──────────────────────────────────────────
        const helpSections = [
            {
                title: '🔍 Search Products',
                chips: ['search fertilizer', 'find pesticide', 'show seeds', 'search urea for wheat']
            },
            {
                title: '🛒 Shopping',
                chips: ['add to cart', 'add first product', 'open cart', 'checkout']
            },
            {
                title: '📦 Orders',
                chips: ['place order', 'my orders', 'track my order']
            },
            {
                title: '🔑 Account',
                chips: ['login', 'create account', 'go home']
            },
            {
                title: '🌐 Navigation',
                chips: ['go back', 'home', 'my orders']
            },
            {
                title: '🎙️ Assistant',
                chips: ['help', 'turn off assistant', 'turn on assistant']
            }
        ];

        const helpHTML = helpSections.map(s => `
      <div class="va-help-section">
        <div class="va-help-section-title">${s.title}</div>
        <div class="va-help-chips">
          ${s.chips.map(c => `<span class="va-chip" onclick="window.__VA.tryCommand('${c}')">"${c}"</span>`).join('')}
        </div>
      </div>
    `).join('');

        // ── Build root HTML ─────────────────────────────────────────────
        const root = document.createElement('div');
        root.id = 'va-root';
        root.innerHTML = `
      <!-- Speech bubble -->
      <div id="va-bubble">
        <span class="va-status-dot" id="va-status-dot"></span>
        <span id="va-bubble-text"></span>
      </div>

      <!-- Controls bar -->
      <div id="va-controls">
        <!-- Language buttons -->
        ${Object.entries(LANGS).map(([k, v]) => `
          <button class="va-lang-btn ${k === STATE.lang ? 'active' : ''}"
                  id="va-lang-${k}"
                  onclick="window.__VA.setLang('${k}')"
                  title="Switch to ${v.fullLabel}">${v.label}</button>
        `).join('')}

        <div style="width:1px;height:18px;background:#e5e7eb;margin:0 2px;"></div>

        <!-- Help button -->
        <button class="va-help-btn" onclick="window.__VA.toggleHelp()" title="Voice Commands Help">?</button>

        <!-- Toggle -->
        <div class="va-toggle-wrap">
          <span class="va-toggle-lbl">🎙️</span>
          <label class="va-toggle">
            <input type="checkbox" id="va-toggle-checkbox"
                   ${STATE.enabled ? 'checked' : ''}
                   onchange="window.__VA.toggleAssistant(this.checked)">
            <span class="va-toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- FAB mic button -->
      <button id="va-fab" onclick="window.__VA.onFabClick()" title="Click to speak (or hold to listen)">
        <span id="va-fab-icon">🎤</span>
      </button>
    `;
        document.body.appendChild(root);

        // ── Help panel ──────────────────────────────────────────────────
        const helpPanel = document.createElement('div');
        helpPanel.id = 'va-help-panel';
        helpPanel.innerHTML = `
      <div class="va-help-header">
        <h4>🎙️ Voice Commands</h4>
        <button class="va-help-close" onclick="window.__VA.toggleHelp(false)">✕</button>
      </div>
      <div class="va-help-body">${helpHTML}</div>
    `;
        document.body.appendChild(helpPanel);

        // ── Transcript bar (shown at top when listening) ─────────────────
        const tBar = document.createElement('div');
        tBar.id = 'va-transcript-bar';
        document.body.appendChild(tBar);

        updateMicBtn();
        if (!STATE.enabled) {
            document.getElementById('va-bubble').style.display = 'none';
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // LANGUAGE SWITCH
    // ─────────────────────────────────────────────────────────────────
    function setLang(code) {
        STATE.lang = code;
        localStorage.setItem('va_lang', code);
        window.speechSynthesis.cancel();

        // Update lang button active state
        Object.keys(LANGS).forEach(k => {
            const btn = document.getElementById(`va-lang-${k}`);
            if (btn) btn.classList.toggle('active', k === code);
        });

        // Update recognition lang if active
        if (STATE.recognition) {
            try { STATE.recognition.lang = L().code; } catch (_) { }
        }

        speak(L().r.langChanged(L().fullLabel));
    }

    // ─────────────────────────────────────────────────────────────────
    // FAB CLICK — toggle listening
    // ─────────────────────────────────────────────────────────────────
    function onFabClick() {
        if (!STATE.enabled) {
            // Clicking while disabled → re-enable
            toggleAssistant(true);
            return;
        }
        if (STATE.listening) {
            stopListening();
        } else if (STATE.speaking) {
            window.speechSynthesis.cancel();
            STATE.speaking = false;
            updateMicBtn();
        } else {
            startListening();
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // PUBLIC API (used by help chip clicks)
    // ─────────────────────────────────────────────────────────────────
    function tryCommand(text) {
        toggleHelp(false);
        speak(L().r.searching(text), null);
        setTimeout(() => processCommand(text.toLowerCase()), 400);
    }

    // ─────────────────────────────────────────────────────────────────
    // HANDLE URL PARAMS (voice search from other pages)
    // ─────────────────────────────────────────────────────────────────
    function handleURLParams() {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        const cat = params.get('category');

        if (q) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                setTimeout(() => {
                    searchInput.value = q;
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }, 600);
            }
        }

        if (cat) {
            setTimeout(() => {
                const btn = document.querySelector(`.category-btn[data-category="${cat}"]`);
                if (btn) btn.click();
            }, 700);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // INIT
    // ─────────────────────────────────────────────────────────────────
    function init() {
        // Check browser support
        const hasSR = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
        const hasSS = !!window.speechSynthesis;

        if (!hasSR && !hasSS) return; // Silently skip if no support

        buildUI();
        handleURLParams();

        // Expose public API
        window.__VA = {
            toggleAssistant,
            toggleHelp,
            setLang,
            onFabClick,
            tryCommand,
            startListening,
            stopListening,
            speak,
        };

        // Welcome message — delayed so page finishes loading
        if (STATE.enabled) {
            const pageKey = getPageKey();
            const welcomeMsg = L().welcome[pageKey] || L().welcome['default'];

            // Delay welcome on pages that need auth loading time
            const delay = 1800;
            setTimeout(() => {
                if (STATE.enabled) speak(welcomeMsg);
            }, delay);
        }

        // Keyboard shortcut: Alt + M to toggle mic
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                onFabClick();
            }
            // Escape to close help
            if (e.key === 'Escape' && STATE.helpOpen) toggleHelp(false);
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
