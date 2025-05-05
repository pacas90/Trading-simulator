
export class Notifications {
    constructor(data) {

        this.notif = document.createElement('div');
        this.notif.classList = 'notification-container hidden';
        
        this.notif.innerHTML = `
             <div class="notification-icon-container">
                <span class='material-symbols-outlined'>${data.icon}</span>
             </div>
             <div class="notification-text-container">${data.text}</div>
             <div class="notification-button-container">
                <button style='display:none;'>${data.button}</button>
             </div>
        `;
        this.data = data;
        document.body.appendChild(this.notif);

        if(data.x != undefined || data.y != undefined) {
            this.notif.classList = 'notification-container hidden';
        }
        else this.notif.classList = 'notification-container notifTranslate hidden';
    }
    show() {
        /*const otherNotifs = document.querySelectorAll('.notification-container');
        if (otherNotifs.length > 1) {
            for (let i = 0; i < otherNotifs.length; i++) {
                if (otherNotifs[i] === this.notif) continue;
                for (let j = 0; j < otherNotifs[i].length; j++) {
                    otherNotifs[j].classList = 'notification-container';
                }
                otherNotifs[i].classList.add(`notif${i+1}`);
            }
        }*/
        const allNotifs = document.querySelectorAll('.notification-container');
        if(allNotifs.length > 1) {
            allNotifs.forEach(notifs => {
                if (this.notif !== notifs) {
                    notifs.remove();
                }
            });
        }

        setTimeout(() => this.notif.classList.remove('hidden'), 10);

        if (this.data.autohide != false) {
            setTimeout(() => this.hide(), 2000);
        }
    }
    hide() {
        this.notif.classList.add('hidden');
        setTimeout(() => this.notif.remove(), 500);
    }
    setPosition(x, y) {

    }
}