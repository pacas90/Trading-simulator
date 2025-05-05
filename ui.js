/***** issokstanti buy lentele *****/
import { Broker, GlobalStockList } from "./stock.js";
import { User, Watchlist } from "./user.js";
import {Curve} from "./curve.js";
import {Notifications} from "./snackbar.js";

const user = new User();
const watchlist = new Watchlist();
watchlist.init();
const globalStockList = new GlobalStockList();
const broker = new Broker();


export class BuyDialog {
    constructor() {
        this.stockName = undefined;
        this.stockPrice = 0; 

        this.dialog = document.querySelector('#buy-sell-dialog');
        this.dialog.returnValue
        this.stockNameElement = document.querySelectorAll('.stock-name-element');
        this.stockBuyPriceElement = document.querySelector('#stock-buy-price-element');
        this.stockSellPriceElement = document.querySelector('#stock-sell-price-element');

        // this.stockSellPriceElement = document.querySelector('.buy-stock-dialog-content.sell > .dialog-stock-price');

        // this.dialogBg = document.querySelector('.dialog-background[dialog=buy-stock]');
        // this.dialogContainer = this.dialogBg.querySelector('.dialog-container');

         this.buyStockForAmountInput = document.querySelector('#buy-amount-input');
         this.buyStockForInput = document.querySelector("#buy-price-input");
         this.sellStockForAmountInput = document.querySelector('#sell-amount-input');
         this.sellStockForInput = document.querySelector('#sell-price-input');
       
         this.updateBuyStockAmountInput = this.updateBuyStockAmountInput.bind(this);
         this.updateBuyStockForInput = this.updateBuyStockForInput.bind(this);
         this.updateSellStockAmountInput = this.updateSellStockAmountInput.bind(this);
         this.updateSellStockForInput = this.updateSellStockForInput.bind(this);

         this.buyButton = document.querySelector('#buy-button');
         this.sellButton = document.querySelector('#sell-button');
         this.sellAllButton = document.querySelector('#sell-all-button');

        this.RecentTransactions;

        //-------- limit order
         this.limitOrderSellButton = document.querySelector('#limit-order-sell');
         this.limitOrderBuyButton = document.querySelector('#limit-order-buy');
         this.limitOrderAmountInput = document.querySelector('#limit-order-amount-input');
         this.limitOrderPriceInput = document.querySelector('#limit-order-price-input');

        // //short order
         this.shortOrderAddButton = document.querySelector('#short-order-add');
         this.shortOrderAmountInput = document.querySelector('#short-order-amount-input');
        this.shortOrderPriceInput = document.querySelector('#short-order-price-input');

    }
    init() {
        const tabs = document.querySelector('md-tabs');
        const panels = document.querySelectorAll('[role="tabpanel"]');
        tabs.addEventListener('change', (e) => {
            const selectedId = e.target.activeTab.id;
            panels.forEach(panel => {
                panel.hidden = panel.getAttribute('aria-labelledby') !== selectedId;
                
            });
            if (selectedId === 'option-tab') {
                this.dialog.classList.add('dialog-expand');
            }
            else {
                this.dialog.classList.remove('dialog-expand');
                document.querySelector('#buy-graph-container').classList.add('hidden');
                document.querySelector('#show-graph-switch').selected = false;
            }
        });
        document.querySelector('#dialog-close-button').addEventListener('click', () => {
            this.hide();
        });
        //show graph switch
        document.querySelector('#show-graph-switch').addEventListener('change', () => {
            document.querySelector('#buy-graph-container').classList.toggle('hidden');
            this.dialog.classList.toggle('dialog-expand');
        });

        this.stocksTableListeners();
        this.buyButtonListener();
        this.sellButtonListener();
        this.limitOrderButtonsListeners();
        this.shortOrderButtonsListeners();
        this.addToWatchlistListener();

        this.RecentTransactions = new RecentTransactions();

    }
    addToWatchlistListener() {
        const button = document.querySelector("#dialog-watchlist-button");
        button.addEventListener('click', () => {
            if (watchlist.findIndex(this.stockName) == -1) {
                watchlist.Add(this.stockName);
                var notif = new Notifications({
                    icon: "mood",
                    text: `<p><span class="stock-name">${this.stockName}</span> has been added to your watchlist!</p>`,
                });
                notif.show();
            }
            else {
                var notif = new Notifications({
                    icon: "sentiment_dissatisfied",
                    text: `<p><span class="stock-name">${this.stockName}</span> is already in the watchlist!!!</p>`,
                });
                notif.show();
            }
        });
    }
    show() {
        this.dialog.show();
    }
    hide() {
        this.dialog.close();
      
        this.clearInputs();
        //this.disableDynamicInputs();
    }
    shortOrderButtonsListeners() {
        this.shortOrderAddButton.addEventListener('click', () => {
           const amount = this.shortOrderAmountInput.value;
        
           const price = globalStockList.findStockByName(this.stockName).price;
            if(amount != '') {
                broker.ShortOrder(this.stockName, price, amount);
                user.updateLimitOrderTable();
            }
        });
    }
    limitOrderButtonsListeners() {
        // const amount = this.limitOrderAmountInput.value;
        // const price = this.limitOrderPriceInput.value;
        this.limitOrderSellButton.addEventListener('click', () => {
            
        const amount = this.limitOrderAmountInput.value;
        const price = this.limitOrderPriceInput.value;
            if(amount != '' && price != '') {
                broker.LimitOrderSell(this.stockName, price, amount);
                user.updateLimitOrderTable();
            }
        });
        this.limitOrderBuyButton.addEventListener('click', () => {
            
        const amount = this.limitOrderAmountInput.value;
        const price = this.limitOrderPriceInput.value;
            if(amount != '' && price != '') {
                broker.LimitOrderBuy(this.stockName, price, amount);
                user.updateLimitOrderTable();
            }
        });
    }

    enableDynamicInputs() {
        this.buyStockForAmountInput.addEventListener('input', this.updateBuyStockAmountInput);
        this.buyStockForInput.addEventListener('input', this.updateBuyStockForInput);
        this.sellStockForAmountInput.addEventListener('input', this.updateSellStockAmountInput);
        this.sellStockForInput.addEventListener('input', this.updateSellStockForInput);	
    }
    updateBuyStockAmountInput() {
        if(!this.stockName){
            return;
        }
        const price = broker.findStockByName(this.stockName).price;
        this.buyStockForInput.value = (this.buyStockForAmountInput.value * price).toFixed(2);
    }
    updateBuyStockForInput() {    
        if(!this.stockName){
            return;
        }
        const price = broker.findStockByName(this.stockName).price;
        this.buyStockForAmountInput.value = (this.buyStockForInput.value / price).toFixed(5);
    }
    updateSellStockAmountInput() {
        if(!this.stockName){
            return;
        }
        const price = broker.findStockByName(this.stockName).price;
        this.sellStockForInput.value = (this.sellStockForAmountInput.value * price).toFixed(2);
    }
    updateSellStockForInput() {    
        if(!this.stockName){
            return;
        }
        const price = broker.findStockByName(this.stockName).price;
        this.sellStockForAmountInput.value = (this.sellStockForInput.value / price).toFixed(5);
    }
    buyButtonListener() {
        this.buyButton.addEventListener('click', () => {
            if (this.buyStockForInput.value == 0 && this.buyStockForAmountInput.value == 0) {
                var notif = new Notifications({
                    icon: "close",
                    text: `<p>Empty values!</p>`,
                  });
                  notif.show();
                return;
            }
            if (user.getBalance() >= this.buyStockForInput.value) {
                broker.marketOrderBuy(this.stockName,this.buyStockForInput.value);
                // prideda i pirkimu istorija
                const date = new Date();
                // const transaction = {
                //     stockName: this.stockName,
                //     amountTraded: this.buyStockForAmountInput.value,
                //     balanceDiff: this.buyStockForInput.value,
                //     date: `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
                // }
                this.RecentTransactions.addToList(this.stockName, this.buyStockForAmountInput.value, this.buyStockForInput.value,`${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`);
             //  this.RecentTransactions.putInTable(transaction);
                this.updateSellStockInfo();
                //show Notifications with info of buying
                var notif = new Notifications({
                    icon: "check",
                    text: `<p>You have bought ${this.buyStockForAmountInput.value}
                            <span class='stock-name'>${this.stockName}</span>  
                            for ${this.buyStockForInput.value} <span class='stock-name'>USD</span>!</p>`,
                  });
                  notif.show();
                
                //-----------------
                console.log(user.getBalance());
                console.log(`Bought ${this.stockName} ${this.buyStockForAmountInput.value} for ${this.buyStockForInput.value} USD`);
            }
            else {
                console.log(`BALANCE INSUFFICIENT (${user.getBalance()} USD < ${this.buyStockForInput.value})`);
                var notif = new Notifications({
                    icon: "priority_high",
                    text: `<p>Insufficient funds! You have only ${user.getBalance().toFixed(2)} 
                            <span class='stock-name'>USD</span>!</p>`,
                  });
                  notif.show();
            }
            user.updatePortfolio()
            this.stocksTableListeners();
           // updateStocksTotalValue();
        });
    }
    sellButtonListener() {
        this.sellButton.addEventListener('click', () => {
            if (this.sellStockForInput.value == 0 && this.sellStockForAmountInput.value == 0) {
                var notif = new Notifications({
                    icon: "close",
                    text: `<p>Empty values!</p>`,
                  });
                  notif.show();
                return;
            }
            if (user.getStockAmount(user.getStockIndexByName(this.stockName)) >= this.sellStockForAmountInput.value) {
                broker.marketOrderSell(this.stockName,this.sellStockForAmountInput.value);
                console.log(`Sold ${this.stockName} ${this.sellStockForAmountInput.value} for ${this.sellStockForInput.value} USD`);
                
                const date = new Date();
                // const transaction = {
                //     stockName: this.stockName,
                //     amountTraded: -this.sellStockForAmountInput.value,
                //     balanceDiff: this.sellStockForInput.value,
                //     date: `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
                // }
                this.RecentTransactions.addToList(this.stockName, -this.sellStockForAmountInput.value, this.sellStockForInput.value, `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`);
              //  this.RecentTransactions.putInTable(transaction);
                this.updateSellStockInfo();
                // show notif with sell info
                var notif = new Notifications({
                    icon: "check",
                    text: `<p>You have sold ${this.sellStockForAmountInput.value}
                            <span class='stock-name'>${this.stockName}</span>  
                            for ${this.sellStockForInput.value} <span class='stock-name'>USD</span>!</p>`,
                  });
                  notif.show();
            }
            else {
                console.log('Insufficient stocks amount');
                let val = user.getStockAmount(user.getStockIndexByName(this.stockName));
                if (val == undefined) {
                    val = 0;
                }
                else {
                    val = user.getStockAmount(user.getStockIndexByName(this.stockName)).toFixed(5);
                }
                var notif = new Notifications({
                    icon: "priority_high",
                    text: `<p>Insufficient stocks! You have only
                            ${val}
                            of <span class='stock-name'>${this.stockName}</span>!</p>`,
                  });
                  notif.show();
            }
            user.updatePortfolio();
            this.stocksTableListeners();
            //updateStocksTotalValue();
        });
        // sell all button
        this.sellAllButton.addEventListener('click', () => {
            let amount = user.getStockAmount(user.getStockIndexByName(this.stockName));
            if (amount > 0) {
                broker.marketOrderSell(this.stockName, amount);
                const date = new Date();
                // const transaction = {
                //     stockName: this.stockName,
                //     amountTraded: -amount,
                //     balanceDiff: amount * this.stockPrice,
                //     date: `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
                // }
                this.RecentTransactions.addToList(this.stockName, -amount, amount * this.stockPrice, `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`);
               // this.RecentTransactions.putInTable(transaction);
                this.updateSellStockInfo();
                user.updatePortfolio();
                this.stocksTableListeners();
                this.hide();
                var notif = new Notifications({
                    icon: "check",
                    text: `<p>You have sold ${amount.toFixed(5)}
                            <span class='stock-name'>${this.stockName}</span>  
                            for ${(amount * this.stockPrice).toFixed(2)} <span class='stock-name'>USD</span>!</p>`,
                  });
                  notif.show();
            }
        });

    }
    //stocksu lenteles click eventai
    stocksTableListeners() {
        //all stocks table
        const stocksTable = document.querySelector('#stocks-table > tbody');
        const stocksRows = stocksTable.querySelectorAll('tr');
        //portfolio table
        const portfolioTable = document.querySelector('#portfolio-table > tbody');
        const portfolioRows = portfolioTable.querySelectorAll('tr');
        const allRows = [...stocksRows, ...portfolioRows];
        //remove and add again all listeners because portfolio rows are being regenerated after buying
        allRows.forEach(row => {
            row.removeEventListener('click', this.addRowClickListener);
        });
        allRows.forEach(row => {
            this.addRowClickListener(row);
        });
    }
    addRowClickListener(row) {
        if (!row.hasAttribute('header')) {
            //on row click
            row.addEventListener('click', () => {
                //show dialog
                this.show();



                this.stockName = row.getAttribute('name');
                this.stockPrice = broker.findStockByName(this.stockName).price
                for (let i = 0; i < this.stockNameElement.length; i++) {
                    this.stockNameElement[i].innerHTML = `Selected stock: <span class='stock-name'>${this.stockName}</span>`;
                }
                this.stockBuyPriceElement.innerHTML = `<p>Price: ${this.stockPrice} <span class='stock-name'>USD</span> </p>`;
                this.buyStockForAmountInput.setAttribute('suffix-text', this.stockName);
                this.sellStockForAmountInput.setAttribute('suffix-text', this.stockName);
                
                 // show curve
                let buyCurveWrapper = document.querySelector('#buy-curve-wrapper')
                buyCurveWrapper.innerHTML = '';
                const buyCurve = new Curve(600,300, buyCurveWrapper);
                let points = this.getStockHistory(this.stockName, 90);
                buyCurve.drawCurve(
                    points.slice(0, 30).map((price, index) => ({ x: 30 - index, y: Math.round(price) }))
                );

                const timeChips = document.querySelectorAll('#buy-graph-time-chips > md-filter-chip');
                timeChips[1].selected = true;
                timeChips[0].selected = false;
                timeChips[2].selected = false;

                for (let i = 0; i < timeChips.length; i++) {
                    timeChips[i].addEventListener('click', () => {
                        for (let j = 0; j < timeChips.length; j++) {
                            timeChips[j].selected = false;
                        }
                        timeChips[i].selected = true;
                        let time = '';
                        if (timeChips[i].getAttribute('time') == '3 months') {
                            time = 90;
                        }
                        else if (timeChips[i].getAttribute('time') == '30 days') {
                            time = 30;
                        }
                        else if (timeChips[i].getAttribute('time') == '7 days') {
                            time = 7;
                        }
                        buyCurve.clear();
                        buyCurve.drawCurve(
                            points.slice(0, time).map((price, index) => ({ x: time - index, y: Math.round(price) }))
                        );
                        
                    });
                }
                

                this.fillOptionsTab(this.stockName);

                

                
                this.updateSellStockInfo();
                this.enableDynamicInputs();
            });
        }
    }
    fillOptionsTab(stockName) {
        const options = broker.generateOptions(stockName);
        const list = document.querySelector('#options-menu');
        list.innerHTML = '';
        for (let i = 0; i < options.length; i++) {
            const item = document.createElement('md-select-option');
            item.innerHTML = `
                 <div slot='headline' value='${i}'>Option ${i+1}</div>
             `;
             list.appendChild(item);
        }

        document.querySelector("#option-stock-name").innerHTML = `Selected stock: <span class='stock-name'>${options[0].stockName}</span>`;

        const table = document.querySelector("#available-options-table");

        let tbodyContent = '';
        for (let i = 0; i < options.length; i++) {
            const date = new Date(options[i].expiryDate);
            const readable = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

            tbodyContent += `
                <tr>
                    <th scope="row">Option ${i+1}</th>
                    <td>${readable}</td>
                    <td>${options[i].optionType}</td>
                    <td>${options[i].premium.toFixed(3)}</td>
                    <td>${options[i].strikePrice.toFixed(3)}</td>
                </tr>
            `;
        }

        table.innerHTML = `
            <thead>
                <th></th>
                <th>Expiry date</th>
                <th>Option type</th>
                <th>Premium</th>
                <th>Strike price</th>
            </thead>
            <tbody>
                ${tbodyContent}    
            </tbody>
        `;


        document.querySelector('#buy-option-button').addEventListener('click', ()=> {
            broker.PurchaseOption(options[list.selectedIndex]);
            user.updateOptionsTable();
        });

    }
    updateSellStockInfo() {
        let amount = user.getStockAmount(user.getStockIndexByName(this.stockName));

        this.stockSellPriceElement.innerHTML = `
                <p>Price: ${this.stockPrice} <span class='stock-name'>USD</span></p>
                <p style='font-style:italic'>You own ${(amount != undefined) ? amount.toFixed(5) : 0} 
                (${((amount != undefined) ? (amount*this.stockPrice).toFixed(2) : 0)} <span class='stock-name'>USD</span>)</p>

                `;
    }
    clearInputs() {
        this.buyStockForAmountInput.value = 0;
        this.buyStockForInput.value = 0;
        this.sellStockForAmountInput.value = 0;
        this.sellStockForInput.value = 0;
    }
    getStockHistory(stockName, amount)
    {
        let hist = JSON.parse(localStorage.getItem(`${stockName}_hist`));
        let stockHistory = [];

        for(let i = 0; i < amount; i++) // stockHistory[0] - latest price
        {
            stockHistory[i] = parseFloat(hist[i].close);
        }
        return stockHistory;
    }
}

/***************** RECENT TRANSACTIONS ***************/
export class RecentTransactions {
    constructor() {
        this.transactions = [];
        this.loadFromStorage();
        this.init(); // Initialize event listeners
    }

    init() {
        // Load existing transactions when DOM is ready
        window.addEventListener('DOMContentLoaded', () => {
            this.refreshTable();
        });
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('recentTransactions');
            
            // Clear any legacy corrupted data
            if (typeof stored === 'string' && 
                (stored.startsWith('[object') || !stored.startsWith('['))) {
                localStorage.removeItem('recentTransactions');
                this.transactions = [];
                return;
            }
            
            this.transactions = stored ? JSON.parse(stored) : [];
            
            // Validate and sanitize transactions
            this.transactions = this.transactions.filter(trans => 
                trans &&
                typeof trans.stockName === 'string' &&
                typeof trans.amountTraded === 'number' &&
                typeof trans.balanceDiff === 'number' &&
                trans.date
            ).map(trans => ({
                ...trans,
                stockName: String(trans.stockName).substring(0, 50) // Sanitize name
            }));
            
        } catch (e) {
            console.error('Error loading transactions:', e);
            this.transactions = [];
        }
    }

    saveToStorage() {
        localStorage.setItem(
            'recentTransactions',
            JSON.stringify(this.transactions)
        );;
    }

    addToList(stockName, amountTraded, balanceDiff, date) {
        // Validate and sanitize input
        const transaction = {
            stockName: String(stockName || 'Unknown').trim(),
            amountTraded: Number(amountTraded) || 0,
            balanceDiff: Number(balanceDiff) || 0,
            date: date || new Date().toISOString()
        };
        console.log(stockName);
        
        this.transactions.unshift(transaction);
        this.saveToStorage();
        this.putInTable(transaction);
    }

     refreshTable() {
        const container = document.querySelector('#dashboard-transactions-container');
        if (container) {
            container.innerHTML = ''; // Clear existing items
            
            // Reverse transactions before adding to maintain newest-first
            this.transactions.slice().reverse().forEach(t => this.putInTable(t));
        }
    }

    putInTable(transactionInfo) {
        const container = document.querySelector('#dashboard-transactions-container');
        if (!container) return;

        try {
            const date = new Date(transactionInfo.date);
            const formattedDate = isNaN(date.getTime()) 
                ? 'Unknown date' 
                : date.toLocaleDateString();

            const status = transactionInfo.amountTraded >= 0 ? 'Bought' : 'Sold';
            const absAmount = Math.abs(transactionInfo.amountTraded).toFixed(5);
            const balance = parseFloat(transactionInfo.balanceDiff).toFixed(2);

            const item = document.createElement('md-list-item');
            item.innerHTML = `
                <div slot="headline" class="${status.toLowerCase()}">
                    ${status} ${transactionInfo.stockName}
                </div>
                <div slot="supporting-text">
                    ${absAmount} shares • ${balance} USD
                </div>
                <div slot="trailing-supporting-text">
                    ${formattedDate}
                </div>
            `;
            container.prepend(item);
        } catch (e) {
            console.error('Error rendering transaction:', e);
        }
    }

    // ... other methods remain the same ...
}

/* ------- buy/sell pranesimai -------*/
// export class Notification {
//     constructor(data) {

//         this.notif = document.createElement('div');
//         this.notif.classList = 'notification-container hidden';
        
//         this.notif.innerHTML = `
//              <div class="notification-icon-container">
//                 <span class='material-symbols-outlined'>${data.icon}</span>
//              </div>
//              <div class="notification-text-container">${data.text}</div>
//              <div class="notification-button-container">
//                 <button style='display:none;'>${data.button}</button>
//              </div>
//         `;
//         this.data = data;
//         document.body.appendChild(this.notif);

//         if(data.x != undefined || data.y != undefined) {
//             this.notif.classList = 'notification-container hidden';
//         }
//         else this.notif.classList = 'notification-container notifTranslate hidden';
//     }
//     show() {
//         /*const otherNotifs = document.querySelectorAll('.notification-container');
//         if (otherNotifs.length > 1) {
//             for (let i = 0; i < otherNotifs.length; i++) {
//                 if (otherNotifs[i] === this.notif) continue;
//                 for (let j = 0; j < otherNotifs[i].length; j++) {
//                     otherNotifs[j].classList = 'notification-container';
//                 }
//                 otherNotifs[i].classList.add(`notif${i+1}`);
//             }
//         }*/
//         const allNotifs = document.querySelectorAll('.notification-container');
//         if(allNotifs.length > 1) {
//             allNotifs.forEach(notifs => {
//                 if (this.notif !== notifs) {
//                     notifs.remove();
//                 }
//             });
//         }

//         setTimeout(() => this.notif.classList.remove('hidden'), 10);

//         if (this.data.autohide != false) {
//             setTimeout(() => this.hide(), 2000);
//         }
//     }
//     hide() {
//         this.notif.classList.add('hidden');
//         setTimeout(() => this.notif.remove(), 500);
//     }
//     setPosition(x, y) {

//     }
// }