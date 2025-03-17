/***** issokstanti buy lentele *****/
import { Broker } from "./stock.js";
import { User } from "./user.js";

const user = new User();

const broker = new Broker();

export class BuyDialog {
    constructor() {
        this.stockName = undefined;
        this.stockPrice = 0; 

        this.stockNameElement = document.querySelectorAll(/*'.buy-stock-dialog-content >*/'.dialog-stock-name');
        this.stockBuyPriceElement = document.querySelector('.buy-stock-dialog-content.buy > .dialog-stock-price');
        this.stockSellPriceElement = document.querySelector('.buy-stock-dialog-content.sell > .dialog-stock-price');

        this.dialogBg = document.querySelector('.dialog-background[dialog=buy-stock]');
        this.dialogContainer = this.dialogBg.querySelector('.dialog-container');

        this.buyStockForAmountInput = document.querySelector('.buy-stock-dialog-input.buy-stock-amount');
        this.buyStockForInput = document.querySelector('.buy-stock-dialog-input.buy-stock-for');
        this.sellStockForAmountInput = document.querySelector('.buy-stock-dialog-input.sell-stock-amount');
        this.sellStockForInput = document.querySelector('.buy-stock-dialog-input.sell-stock-for');
       
        this.updateBuyStockAmountInput = this.updateBuyStockAmountInput.bind(this);
        this.updateBuyStockForInput = this.updateBuyStockForInput.bind(this);
        this.updateSellStockAmountInput = this.updateSellStockAmountInput.bind(this);
        this.updateSellStockForInput = this.updateSellStockForInput.bind(this);

        this.buyButton = document.querySelector('#buy-stocks-button');
        this.sellButton = document.querySelector('#sell-stocks-button');
        this.sellAllButton = document.querySelector('#sell-all-stocks-button');

        this.RecentTransactions;

        //-------- limit order
        this.limitOrderSellButton = document.querySelector('#limit-order-sell');
        this.limitOrderBuyButton = document.querySelector('#limit-order-buy');
        this.limitOrderAmountInput = document.querySelector('#limit-order-amount-input');
        this.limitOrderPriceInput = document.querySelector('#limit-order-price-input');
    }
    init() {
        this.clickOutside();
        this.stocksTableListeners();
        this.buyButtonListener();
        this.sellButtonListener();
        this.limitOrderButtonsListeners();

        this.RecentTransactions = new RecentTransactions();

        //fill values with stockName, price etc., event listeners for buy click
    }
    show() {
        this.dialogBg.classList.remove('dialog-hidden');
        
    }
    hide() {
        this.dialogBg.classList.add('dialog-hidden');
        this.clearInputs();
        //this.disableDynamicInputs();
    }
    limitOrderButtonsListeners() {
        // const amount = this.limitOrderAmountInput.value;
        // const price = this.limitOrderPriceInput.value;
        this.limitOrderSellButton.addEventListener('click', () => {
            
        const amount = this.limitOrderAmountInput.value;
        const price = this.limitOrderPriceInput.value;
            if(amount != '' && price != '') {
                broker.LimitOrderSell(this.stockName, price, amount);
            }
        });
        this.limitOrderBuyButton.addEventListener('click', () => {
            
        const amount = this.limitOrderAmountInput.value;
        const price = this.limitOrderPriceInput.value;
            if(amount != '' && price != '') {
                broker.LimitOrderBuy(this.stockName, price, amount);
            }
        });
    }

    //uzsidaro paspaudus uz lenteles
    clickOutside() {
        this.dialogBg.addEventListener('click', (e) => {
            if(e.target == this.dialogBg) {
                this.hide();
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
        this.buyStockForAmountInput.value = (this.buyStockForInput.value / price).toFixed(2);
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
        this.sellStockForAmountInput.value = (this.sellStockForInput.value / price).toFixed(2);
    }
    buyButtonListener() {
        this.buyButton.addEventListener('click', () => {;
            if (user.getBalance() >= this.buyStockForInput.value) {
                broker.marketOrderBuy(this.stockName,this.buyStockForInput.value);
                // prideda i pirkimu istorija
                const date = new Date();
                const transaction = {
                    stockName: this.stockName,
                    amountTraded: this.buyStockForAmountInput.value,
                    balanceDiff: this.buyStockForInput.value,
                    date: `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
                }
                this.RecentTransactions.addToList(transaction);
                this.RecentTransactions.putInTable(transaction);
                this.updateSellStockInfo();
                //-----------------
                console.log(`Bought ${this.stockName} ${this.buyStockForAmountInput.value} for ${this.buyStockForInput.value} EUR`);
            }
            else {
                console.log(`BALANCE INSUFFICIENT (${user.getBalance()} EUR < ${this.buyStockForInput.value})`);
            }
            user.updatePortfolio()
            this.stocksTableListeners();
           // updateStocksTotalValue();
        });
    }
    sellButtonListener() {
        this.sellButton.addEventListener('click', () => {
            if (user.getStockAmount(user.getStockIndexByName(this.stockName)) >= this.sellStockForAmountInput.value) {
                broker.marketOrderSell(this.stockName,this.sellStockForAmountInput.value);
                console.log(`Sold ${this.stockName} ${this.sellStockForAmountInput.value} for ${this.sellStockForInput.value} EUR`);
                
                const date = new Date();
                const transaction = {
                    stockName: this.stockName,
                    amountTraded: -this.sellStockForAmountInput.value,
                    balanceDiff: this.sellStockForInput.value,
                    date: `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
                }
                this.RecentTransactions.addToList(transaction);
                this.RecentTransactions.putInTable(transaction);
                this.updateSellStockInfo();
            }
            else {
                console.log('Insufficient stocks amount');
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
                const transaction = {
                    stockName: this.stockName,
                    amountTraded: -amount,
                    balanceDiff: amount * this.stockPrice,
                    date: `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
                }
                this.RecentTransactions.addToList(transaction);
                this.RecentTransactions.putInTable(transaction);
                this.updateSellStockInfo();
                user.updatePortfolio();
                this.stocksTableListeners();
                this.hide();
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
                    this.stockNameElement[i].textContent = this.stockName;
                }
                this.stockBuyPriceElement.textContent = `${this.stockPrice} EUR`;
                // this.stockSellPriceElement.innerHTML = `
                // <p>${this.stockPrice} EUR</p>
                // <p>You own ${user.getStockAmount(user.getStockIndexByName(this.stockName)).toFixed(5)} 
                // (${(user.getStockAmount(user.getStockIndexByName(this.stockName))*this.stockPrice).toFixed(2)} EUR)</p>

                // `;
                this.updateSellStockInfo();
                this.enableDynamicInputs();
            });
        }
    }
    updateSellStockInfo() {
        let amount = user.getStockAmount(user.getStockIndexByName(this.stockName));

        this.stockSellPriceElement.innerHTML = `
                <p>${this.stockPrice} EUR</p>
                <p>You own ${(amount != undefined) ? amount.toFixed(5) : 0} 
                (${((amount != undefined) ? (amount*this.stockPrice).toFixed(2) : 0)} EUR)</p>

                `;
    }
    clearInputs() {
        this.buyStockForAmountInput.value = 0;
        this.buyStockForInput.value = 0;
        this.sellStockForAmountInput.value = 0;
        this.sellStockForInput.value = 0;
    }
}

/***************** RECENT TRANSACTIONS ***************/
export class RecentTransactions {
    constructor() {
        this.transactions = [];
    }
    //balanceDiff - kiek pinigu buvo gauta pardavus arba isleista nusipirkus
    addToList(stockName, amountTraded, balanceDiff, date) {
        let transaction = {
            stockName: stockName,
            amountTraded: amountTraded,
            balanceDiff: balanceDiff,
            date: date
        };
        this.transactions.push(transaction);
    };
    removeFromList() {

    }
    get(i) {
        return this.transactions[i];
    }
    clearList() {
        this.transactions = [];
        //taip pat reikia isvalyti lentele
    }
    putInTable(transactionInfo) {
        const recentTransactionsTable = document.querySelector('#dashboard-transactions-container');
        const transaction = document.createElement('div');
        transaction.classList.add('transaction-info-container');
        const status = (transactionInfo.amountTraded >= 0) ? 'Bought' : 'Sold';
      //  console.log(transactionInfo.balanceDiff.toFixed(2));
        transaction.innerHTML = `
            <p class="transaction-status ${status.toLowerCase()}">${status}</p>
            <p class="transaction-amount">${Math.abs(transactionInfo.amountTraded).toFixed(5)}</p>
            <p class="transaction-stock-name">${transactionInfo.stockName}</p>
            <p>for</p>
            <p class="transaction-for">${parseFloat(transactionInfo.balanceDiff).toFixed(3)} Eur</p>
            <p class="transaction-date">${transactionInfo.date}</p>
        `;
        recentTransactionsTable.prepend(transaction);
    }
}