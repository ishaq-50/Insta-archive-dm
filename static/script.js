/**
 * Instagram DM Archive Viewer — Frontend Logic
 * ==============================================
 * Handles: infinite scroll pagination, search, image modal,
 * custom audio player, gallery view, date separators.
 */

// ─── State ──────────────────────────────────────────────────────────────
const state = {
    currentPage: 0,
    isLoading: false,
    hasMore: true,
    searchQuery: "",
    searchTimeout: null,
    currentView: "chat",     // "chat" or "gallery"
    galleryLoaded: false,
    initialLoad: true,
};

// ─── DOM References ─────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const chatMessages = $("#chat-messages");
const loadingIndicator = $("#loading-indicator");
const searchInput = $("#search-input");
const searchCount = $("#search-count");
const scrollBottomBtn = $("#scroll-bottom-btn");
const imageModal = $("#image-modal");
const modalImage = $("#modal-image");
const initialLoader = $("#initial-loader");

// ─── Message Loading ────────────────────────────────────────────────────

async function loadMessages(page = 0, prepend = false) {
    if (state.isLoading) return;
    state.isLoading = true;

    if (loadingIndicator) loadingIndicator.style.display = "flex";

    try {
        const params = new URLSearchParams({ page, search: state.searchQuery });
        const res = await fetch(`/api/messages?${params}`);
        const data = await res.json();

        if (searchCount) {
            if (state.searchQuery) {
                searchCount.textContent = `${data.total_messages} results`;
            } else {
                searchCount.textContent = `${data.total_messages} messages`;
            }
        }

        state.hasMore = data.has_more;
        state.currentPage = page;

        renderMessages(data.messages, prepend);

        // On initial load, scroll to the bottom (newest messages)
        if (state.initialLoad && !prepend) {
            requestAnimationFrame(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
                // Hide loader after first render
                setTimeout(() => {
                    if (initialLoader) initialLoader.classList.add("hidden");
                    setTimeout(() => { if (initialLoader) initialLoader.remove(); }, 500);
                }, 300);
            });
            state.initialLoad = false;
        }
    } catch (err) {
        console.error("Failed to load messages:", err);
    } finally {
        state.isLoading = false;
        if (loadingIndicator) loadingIndicator.style.display = state.hasMore ? "flex" : "none";
    }
}

// ─── Message Rendering ──────────────────────────────────────────────────

let lastRenderedDate = null;

function renderMessages(messages, prepend = false) {
    const fragment = document.createDocumentFragment();
    let previousDate = prepend ? null : lastRenderedDate;

    messages.forEach((msg) => {
        // Date separator
        if (msg.date && msg.date !== previousDate) {
            const sep = document.createElement("div");
            sep.className = "date-separator";
            sep.innerHTML = `<span>${msg.date}</span>`;
            fragment.appendChild(sep);
            previousDate = msg.date;
        }

        // Call events get special treatment
        if (msg.type === "call") {
            const callEl = document.createElement("div");
            callEl.className = "call-event";
            const dur = msg.call_duration || 0;
            const durText = dur > 0 ? formatDuration(dur) : "No answer";
            callEl.innerHTML = `
                <span class="call-icon">📞</span>
                <span>${msg.sender} · ${durText}</span>
            `;
            fragment.appendChild(callEl);
            return;
        }

        // Message row
        const row = document.createElement("div");
        row.className = `message-row ${msg.is_me ? "me" : "them"}`;
        row.dataset.content = (msg.content || "").toLowerCase();

        let bubbleHTML = "";

        switch (msg.type) {
            case "photo":
                bubbleHTML = buildPhotoBubble(msg);
                break;
            case "video":
                bubbleHTML = buildVideoBubble(msg);
                break;
            case "gif":
                bubbleHTML = buildGifBubble(msg);
                break;
            case "audio":
                bubbleHTML = buildAudioBubble(msg);
                break;
            case "share":
                bubbleHTML = buildShareBubble(msg);
                break;
            default:
                bubbleHTML = buildTextBubble(msg);
        }

        row.innerHTML = bubbleHTML;

        // Reactions
        if (msg.reactions && msg.reactions.length > 0) {
            const reactionsDiv = document.createElement("div");
            reactionsDiv.className = "reactions-row";
            msg.reactions.forEach((r) => {
                reactionsDiv.innerHTML += `<span class="reaction-chip">${r.emoji}</span>`;
            });
            row.appendChild(reactionsDiv);
        }

        // Timestamp
        if (msg.timestamp) {
            const timeEl = document.createElement("div");
            timeEl.className = "msg-time";
            timeEl.textContent = msg.timestamp;
            row.appendChild(timeEl);
        }

        fragment.appendChild(row);
    });

    if (!prepend) {
        lastRenderedDate = previousDate;
    }

    if (prepend) {
        // Remember scroll position to maintain view
        const prevHeight = chatMessages.scrollHeight;
        chatMessages.insertBefore(fragment, chatMessages.firstChild);
        const newHeight = chatMessages.scrollHeight;
        chatMessages.scrollTop += newHeight - prevHeight;
    } else {
        chatMessages.appendChild(fragment);
    }
}

// ─── Bubble Builders ────────────────────────────────────────────────────

function buildTextBubble(msg) {
    const content = msg.content || "";
    if (!content.trim()) {
        return `<div class="bubble"><em style="opacity:0.5">Message unavailable</em></div>`;
    }
    // Convert newlines and linkify URLs
    const escaped = escapeHtml(content);
    const linked = linkify(escaped);
    const formatted = linked.replace(/\n/g, "<br>");
    return `<div class="bubble">${formatted}</div>`;
}

function buildPhotoBubble(msg) {
    const photos = msg.photos || [];
    let html = `<div class="bubble media-bubble">`;
    photos.forEach((url) => {
        html += `<img src="${url}" alt="Photo" loading="lazy" onclick="openModal(this.src)" onerror="this.style.display='none'">`;
    });
    if (msg.content) {
        html += `<div class="media-caption">${escapeHtml(msg.content)}</div>`;
    }
    html += `</div>`;
    return html;
}

function buildVideoBubble(msg) {
    const videos = msg.videos || [];
    let html = `<div class="bubble media-bubble">`;
    videos.forEach((url) => {
        html += `<video src="${url}" controls preload="metadata" playsinline onerror="this.style.display='none'"></video>`;
    });
    if (msg.content) {
        html += `<div class="media-caption">${escapeHtml(msg.content)}</div>`;
    }
    html += `</div>`;
    return html;
}

function buildGifBubble(msg) {
    const gifs = msg.gifs || [];
    let html = `<div class="bubble media-bubble">`;
    gifs.forEach((url) => {
        html += `<img src="${url}" alt="GIF" loading="lazy" onclick="openModal(this.src)" onerror="this.style.display='none'">`;
    });
    html += `</div>`;
    return html;
}

function buildAudioBubble(msg) {
    const audioFiles = msg.audio || [];
    let html = "";
    audioFiles.forEach((url, idx) => {
        const uid = `audio-${msg.timestamp_ms}-${idx}`;
        html += `
        <div class="bubble">
            <div class="audio-card" id="${uid}">
                <button class="audio-play-btn" onclick="toggleAudio('${uid}')">▶</button>
                <div class="audio-waveform">
                    <div class="audio-progress-bar" onclick="seekAudio(event, '${uid}')">
                        <div class="audio-progress-fill"></div>
                    </div>
                    <span class="audio-duration">0:00</span>
                </div>
                <audio src="${url}" preload="metadata"></audio>
            </div>
        </div>`;
    });
    return html;
}

function buildShareBubble(msg) {
    const share = msg.share || {};
    const link = share.link || "#";
    const owner = share.owner || "Instagram";
    const text = share.text || "";
    const preview = text.length > 80 ? text.substring(0, 80) + "…" : text;
    return `
    <div class="bubble">
        <div class="share-card">
            <a class="share-link" href="${escapeHtml(link)}" target="_blank" rel="noopener">
                <span class="share-icon">🔗</span>
                <div class="share-meta">
                    <div class="share-owner">@${escapeHtml(owner)}</div>
                    ${preview ? `<div class="share-text">${escapeHtml(preview)}</div>` : ""}
                </div>
                <span class="share-arrow">›</span>
            </a>
            ${msg.content && msg.content !== "Instagram User sent an attachment." && msg.content !== (msg.sender + " sent an attachment.")
                ? `<div style="font-size:13px;margin-top:4px">${escapeHtml(msg.content)}</div>` : ""}
        </div>
    </div>`;
}

// ─── Audio Player ───────────────────────────────────────────────────────

function toggleAudio(uid) {
    const card = document.getElementById(uid);
    if (!card) return;
    const audio = card.querySelector("audio");
    const btn = card.querySelector(".audio-play-btn");

    if (audio.paused) {
        // Pause all other playing audio
        document.querySelectorAll("audio").forEach((a) => {
            if (a !== audio && !a.paused) {
                a.pause();
                a.closest(".audio-card")?.querySelector(".audio-play-btn")
                    && (a.closest(".audio-card").querySelector(".audio-play-btn").textContent = "▶");
            }
        });
        audio.play();
        btn.textContent = "⏸";
        trackAudioProgress(uid);
    } else {
        audio.pause();
        btn.textContent = "▶";
    }
}

function trackAudioProgress(uid) {
    const card = document.getElementById(uid);
    if (!card) return;
    const audio = card.querySelector("audio");
    const fill = card.querySelector(".audio-progress-fill");
    const durLabel = card.querySelector(".audio-duration");

    function update() {
        if (!audio.paused) {
            const pct = (audio.currentTime / audio.duration) * 100 || 0;
            fill.style.width = pct + "%";
            durLabel.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
            requestAnimationFrame(update);
        }
    }

    audio.addEventListener("ended", () => {
        card.querySelector(".audio-play-btn").textContent = "▶";
        fill.style.width = "0%";
    }, { once: true });

    audio.addEventListener("loadedmetadata", () => {
        durLabel.textContent = formatTime(audio.duration);
    }, { once: true });

    requestAnimationFrame(update);
}

function seekAudio(event, uid) {
    const card = document.getElementById(uid);
    if (!card) return;
    const audio = card.querySelector("audio");
    const bar = card.querySelector(".audio-progress-bar");
    const rect = bar.getBoundingClientRect();
    const pct = (event.clientX - rect.left) / rect.width;
    if (audio.duration) {
        audio.currentTime = pct * audio.duration;
    }
}

function formatTime(sec) {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDuration(sec) {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

// ─── Image Modal ────────────────────────────────────────────────────────

function openModal(src) {
    if (!imageModal || !modalImage) return;
    modalImage.src = src;
    imageModal.style.display = "flex";
    requestAnimationFrame(() => imageModal.classList.add("visible"));
}

function closeModal() {
    if (!imageModal) return;
    imageModal.classList.remove("visible");
    setTimeout(() => {
        imageModal.style.display = "none";
        if (modalImage) modalImage.src = "";
    }, 250);
}

// Close modal on background click or Escape
if (imageModal) {
    imageModal.addEventListener("click", (e) => {
        if (e.target === imageModal || e.target.id === "modal-close") closeModal();
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

// ─── Search ─────────────────────────────────────────────────────────────

function toggleSearch() {
    const container = $("#search-container");
    const btn = $("#search-toggle-btn");
    if (!container) return;

    container.classList.toggle("open");
    btn?.classList.toggle("active");

    if (container.classList.contains("open")) {
        setTimeout(() => searchInput?.focus(), 300);
    } else {
        // Clear search when closing
        if (searchInput) searchInput.value = "";
        if (state.searchQuery) {
            state.searchQuery = "";
            resetAndReload();
        }
    }
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        clearTimeout(state.searchTimeout);
        state.searchTimeout = setTimeout(() => {
            state.searchQuery = searchInput.value.trim();
            resetAndReload();
        }, 400);
    });
}

function resetAndReload() {
    state.currentPage = 0;
    state.hasMore = true;
    state.initialLoad = true;
    lastRenderedDate = null;
    chatMessages.innerHTML = "";
    loadMessages(0);
}

// ─── Gallery ────────────────────────────────────────────────────────────

function toggleGallery() {
    const tabBar = $("#tab-bar");
    tabBar?.classList.toggle("open");
    
    // If we're toggling the tab bar, default to chat view
    if (tabBar?.classList.contains("open")) {
        switchTab("chat");
    } else {
        switchTab("chat");
    }
}

function switchTab(view) {
    state.currentView = view;
    const chatView = $("#chat-view");
    const galleryView = $("#gallery-view");

    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelector(`.tab-btn[data-tab="${view}"]`)?.classList.add("active");

    if (view === "gallery") {
        if (chatView) chatView.style.display = "none";
        if (galleryView) {
            galleryView.classList.add("active");
            galleryView.style.display = "block";
        }
        if (!state.galleryLoaded) loadGallery();
    } else {
        if (chatView) chatView.style.display = "flex";
        if (galleryView) {
            galleryView.classList.remove("active");
            galleryView.style.display = "none";
        }
    }
}

async function loadGallery() {
    try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        const grid = $("#gallery-grid");
        if (!grid) return;

        grid.innerHTML = "";
        data.media.forEach((item) => {
            const div = document.createElement("div");
            div.className = "gallery-item";

            if (item.type === "photo") {
                div.innerHTML = `<img src="${item.url}" alt="Photo" loading="lazy" onclick="openModal(this.src)">`;
            } else if (item.type === "video") {
                div.innerHTML = `
                    <video src="${item.url}" preload="metadata" onclick="this.paused ? this.play() : this.pause()"></video>
                    <span class="gallery-video-icon">▶</span>`;
            }
            grid.appendChild(div);
        });

        state.galleryLoaded = true;
    } catch (err) {
        console.error("Failed to load gallery:", err);
    }
}

// ─── Infinite Scroll (load older messages on scroll up) ─────────────────

if (chatMessages) {
    chatMessages.addEventListener("scroll", () => {
        // Load more when scrolled near top
        if (chatMessages.scrollTop < 300 && state.hasMore && !state.isLoading) {
            loadMessages(state.currentPage + 1, true);
        }

        // Show/hide scroll-to-bottom button
        const distFromBottom = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight;
        if (scrollBottomBtn) {
            scrollBottomBtn.classList.toggle("show", distFromBottom > 500);
        }
    });
}

if (scrollBottomBtn) {
    scrollBottomBtn.addEventListener("click", () => {
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
    });
}

// ─── Utility Functions ──────────────────────────────────────────────────

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener" style="color:#58a6ff;text-decoration:underline">$1</a>');
}

// ─── Initialize ─────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    loadMessages(0);
});
