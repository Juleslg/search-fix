export default class VideoPlayer extends HTMLElement {
    constructor() { super(); this.intersectionObserver = null; this.progressElement = null; }

    connectedCallback() {
        const video = this.querySelector('video');
        const playPauseButton = this.querySelector('.controller');
        video.removeAttribute('controls');
        playPauseButton.setAttribute('aria-label', 'Play');

        const togglePlayPause = () => {
            const playPromise = video.paused ? video.play() : video.pause();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playPauseButton.setAttribute('aria-label', video.paused ? 'Play' : 'Pause');
                    this.classList.toggle('playing', !video.paused);
                }).catch(() => {
                    playPauseButton.setAttribute('aria-label', 'Play');
                    this.classList.remove('playing');
                });
            }
        };

        const lazyLoad = () => {
            const source = video.querySelector('source[data-src]');
            if (source) {
                source.setAttribute('src', source.getAttribute('data-src'));
                source.removeAttribute('data-src');
                video.load();
            }
        };

        lazyLoad();

        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {

                    lazyLoad();
                    togglePlayPause();
                    
                } else {
                    if (!video.paused) {
                        video.pause();
                        playPauseButton.setAttribute('aria-label', 'Play');
                        this.classList.remove('playing');
                    }
                }
            });
        };

        this.intersectionObserver = new IntersectionObserver(handleIntersection);
        this.intersectionObserver.observe(this);

        // Create progress element if progress-play attribute is present
        if (this.hasAttribute('progress-play') || video.hasAttribute('progress-play')) {
            this.progressElement = document.createElement('div');
            this.progressElement.className = 'video-progress';
            this.appendChild(this.progressElement); // Append progress element to the component

            // Update progress as the video plays
            video.addEventListener('timeupdate', () => {
                const progress = Math.round((video.currentTime / video.duration) * 100);
                this.progressElement.style.setProperty('--vp-progress', `${progress}%`)
            });
        }

        // Hover play/pause functionality
        if (this.hasAttribute('hover-play') || video.hasAttribute('hover-play')) {
            this.addEventListener('mouseenter', () => {
                // Play on hover if paused
                if (video.paused) togglePlayPause();
            });
            this.addEventListener('mouseleave', () => {
                // Pause on hover out if playing
                if (!video.paused && this.classList.contains('playing')) togglePlayPause();
            });
        }

        playPauseButton.addEventListener('click', togglePlayPause);
        if (video.hasAttribute('click-play')) video.addEventListener('click', togglePlayPause);

        video.addEventListener('pause', () => {
            playPauseButton.setAttribute('aria-label', 'Play');
            this.classList.remove('playing');
        });

        video.addEventListener('play', () => {
            playPauseButton.setAttribute('aria-label', 'Pause');
            this.classList.add('playing');
        });

        if (video.autoplay) togglePlayPause();
    }

    disconnectedCallback() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }
    }
}

if (!customElements.get('video-player')) (customElements.define('video-player', VideoPlayer));