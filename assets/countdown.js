export default class BulletCountdown extends HTMLElement {
    constructor() {
        super();

        const currentTime = this.dataset.now;
        const timezoneIdentifier = this.dataset.timezone;

        if (currentTime) {
            this.serverNow = new Date(Date.parse(currentTime)).getTime();
            if (isNaN(this.serverNow)) this.serverNow = new Date(currentTime.replace(/-/g, "/")).getTime();
        } else if (timezoneIdentifier) {
            this.serverNow = new Date().toLocaleString('en-US', { timeZone: timezoneIdentifier });
            this.serverNow = new Date(this.serverNow).getTime();
        } else {
            this.serverNow = Date.now();
        }

        this.date = new Date(Date.parse(this.dataset.then)).getTime();
        this.message = this.dataset.message;

        if (isNaN(this.date)) {
            this.date = new Date(this.dataset.then.replace(/-/g, "/")).getTime();
            if (isNaN(this.date)) return;
        }

        this.init();
    }

    init() { setInterval(this.timer.bind(this), 1000); }

    timer() {
        const now = this.serverNow = this.serverNow + 1000;
        const countTo = new Date(this.date);
        const timeDiff = countTo - now;

        if (timeDiff > 0) {
            const secsInDay = 60 * 60 * 1000 * 24;
            const secsInHour = 60 * 60 * 1000;

            const   days =  Math.floor(timeDiff / secsInDay),
                    hours = Math.floor((timeDiff % secsInDay) / secsInHour),
                    mins =  Math.floor(((timeDiff % secsInDay) % secsInHour) / (60 * 1000)),
                    secs =  Math.floor((((timeDiff % secsInDay) % secsInHour) % (60 * 1000)) / 1000);

            // HTML
            const   dayX = days > 0 ? `<x-cell class="days"><span class="label">${days == 1 ? dateStrings.day : dateStrings.days}</span> <span class="date">${days}</span></x-cell>` : '',
                    hourX = `<x-cell class="hours"><span class="label">${hours == 1 ? dateStrings.hour : dateStrings.hours}</span> <span class="date">${hours}</span></x-cell>`,
                    minX = `<x-cell class="mins"><span class="label">${mins == 1 ? dateStrings.minute : dateStrings.minutes}</span> <span class="date">${mins}</span></x-cell>`,
                    secX = `<x-cell class="secs"><span class="label">${secs == 1 ? dateStrings.second : dateStrings.seconds}</span> <span class="date">${secs}</span></x-cell>`;

            // Compose & append
            this.querySelector('.countdowner').innerHTML = `${dayX}${hourX}${minX}${secX}`;
        } else { this.innerHTML = `<h3 class="h3 endMessage">${this.message}</h3>`; }
    }
}

if (!customElements.get('bullet-countdown')) customElements.define('bullet-countdown', BulletCountdown);