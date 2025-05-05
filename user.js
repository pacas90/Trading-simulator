import { GlobalStockList } from "./stock.js";
import { Stock } from "./stock.js";
import { Broker } from "./stock.js";
import { Order } from "./stock.js";
import { Option } from "./stock.js";
import { orderType } from "./stock.js";
import { Curve } from "./curve.js";
import { Notifications } from "./snackbar.js";
//import Decimal from './node_modules/decimal.js/dist/decimal.min.js'
//const Decimal = require( './node_modules/decimal.js/dist/decimal.min.js');
//import { RecentTransactions } from "./ui.js";
const globalStockList = new GlobalStockList();
export class User
{
    
    constructor()
    {
        
        const storedBalance = localStorage.getItem("userBalance");
        const recentTransactions = localStorage.getItem('recentTransactions');

        if(storedBalance == null && recentTransactions == null)
        {
            this.balance = 200.00;
            localStorage.setItem("userBalance",this.balance);
            localStorage.setItem("recentTransactions",{});
        }
        else
        {
            this.balance = parseFloat(storedBalance);
        }
        document.querySelector("#money-balance").textContent = `${this.balance.toFixed(2)} `;
        this.stocklist = JSON.parse(localStorage.getItem("stockList")) || [];
        this.stockAmounts = JSON.parse(localStorage.getItem("stockAmounts")) || [];
        this.orderList = JSON.parse(localStorage.getItem("orderList")) || [];
        this.optionList = JSON.parse(localStorage.getItem("optionList")) || [];
        this.shortUpdateTime = localStorage.getItem("shortOrderTime");
        this.generateOptionObject();
        this.generateStockObject();
        //this.generateDecimalList();
    }
    // short orderiu pozicijai mokamas mokestis
    chargeDailyShortPremiums(){
        const oneDay = 24*60*60*1000;
        const date = Date.now();
        //const date = Date.now()+(2*oneDay); // sitas testavimui
        const globalStockList = new GlobalStockList();
        // cia fixed skaicius % kuri naudojam kiek daily reik moket short orderio pozicijai;
        const premiumDailyFee=0.001;
        if(this.shortUpdateTime == null || date-this.shortUpdateTime>=oneDay){
            var notif = new Notifications({
                icon: "close",
                text: `<p>Being Charged Daily Premiums for held Short Positions!</p>`,
              });
              notif.show();
            for(let i = 0;i<this.orderList.length;i++){
                if(this.orderList[i].orderType==orderType.SHORT){
                    const daysPassed = Math.floor((date - this.shortUpdateTime) / oneDay);
                    const stock = globalStockList.findStockByName(this.orderList[i].stockName);
                    console.log(stock);
                    const value = this.orderList[i].amount*stock.price;
                    let premium = value * premiumDailyFee * daysPassed;
                    if(premium>this.balance) {
                        const broker = new Broker(this);
                        broker.CloseShortOrder(this.orderList[i]);
                    }
                    premium = this.balance;
                    this.removeBalance(premium);  
                }
            }
            this.shortUpdateTime = Date.now();
            localStorage.setItem("shortOrderTime",this.shortUpdateTime);
        }
    }
    // atkuriam stock objektus po issaugojimo is Stringu
    generateStockObject(){
        this.newStockList = [];
        for(let i =0;i<this.stocklist.length;i++){
            this.newStockList.push(new Stock(this.stocklist[i].name,this.stocklist[i].price,this.stocklist[i].description,this.stocklist[i].volume,this.stocklist[i].marketCap,this.stocklist[i].revenue))
        }
        this.stocklist = this.newStockList;
    }
    generateOptionObject(){
        this.newOptionList = [];
        for(let i =0;i<this.optionList.length;i++){
            this.newOptionList.push(new Option(this.optionList[i].strikePrice,this.optionList[i].stockName,this.optionList[i].premium,this.optionList[i].expiryDate,this.optionList[i].optionType))
        }
        this.optionList= this.newOptionList;
    }
    //paverciu issaugotuos duomenis is float i decimal
    generateDecimalList(){
        for(let i =0;i>this.stockAmounts;i++){
            this.stockAmounts[i]= new Decimal(this.stockAmounts[i]);
        }
    }
    // prideda duota suma prie balanso
    addBalance(amount)
    {
        if(amount > 0)
        {
            this.balance += amount
            localStorage.setItem("userBalance",this.balance);
            document.querySelector("#money-balance").textContent = `${this.balance} `;
        }
        else
        {
            console.log("Amount must be positive");
        }
    }
    // nuema duota suma nuo balanso
    removeBalance(amount)
    {
            if(amount >= 0 && this.balance - amount >= 0)
            {
                this.balance -= amount
                localStorage.setItem("userBalance",this.balance);
                document.querySelector("#money-balance").textContent = `${this.balance} `;
            }
            else
            {
                console.log("Klaida");
            }
    }
    // nustato balansa i fixed skaiciu 
    setBalance(amount)
    {
        this.balance = amount;
        localStorage.setItem("userBalance",this.balance);
        document.querySelector("#money-balance").textContent = `${this.balance} `;
    }
    // grazina user balansa
    getBalance()
    {
        return this.balance;
    }
    /**
     * prideda akcijas pagal duota pav ir kieki
     * @param {stock} stock - akcijos objektas prie kurios pridedam
     * @param {float} amount - kiekis pridedamu akciju
     */
    addStock(stock,amount){
        
        const stockIndex = this.getStockIndexByName(stock.name);
        if(stockIndex==-1){
            // sukuriam nauja akcija portfolio jeigu jo nera
            this.stocklist.push(stock);
            this.stockAmounts.push(amount);
        }
        else {
            // pridedam prie jau egzistuojancios akcijos portfolio
            this.stockAmounts[stockIndex]+=amount;
            this.stocklist[stockIndex].price=globalStockList.findStockByName(this.stocklist[stockIndex].name).price;
        }
        localStorage.setItem("stockList",JSON.stringify(this.stocklist));
        localStorage.setItem("stockAmounts",JSON.stringify(this.stockAmounts));
    }
    /**
     * nuema duotos akcijos pagal pav, duota kieki
     * @param {stock} stock - akcijos objektas nuo kurios nuemam
     * @param {float} amount - kiekis akciju kuris yra nuemamas
     */
    removeStock(stock,amount){
        
        const stockIndex = this.getStockIndexByName(stock.name);
        if(stockIndex==-1)
        {
            console.log("Invalid stock | doesn't exist or user doesn't have it")
        }
        else 
        {
            if(this.stockAmounts[stockIndex]>=amount){
                this.stockAmounts[stockIndex]-=amount;
                this.stocklist[stockIndex].price=globalStockList.findStockByName(this.stocklist[stockIndex].name).price;
            }
            else console.log("Invalid stock amount being removed | must be greater or equal to stock amount held in storage");
        }
        this.removeNotHeldStocks();
        localStorage.setItem("stockList",JSON.stringify(this.stocklist));
        localStorage.setItem("stockAmounts",JSON.stringify(this.stockAmounts));
    }
    // prideda  uzsakyma
    addOrder(order){
        this.orderList.push(order);
        localStorage.setItem("orderList",JSON.stringify(this.orderList));
    }
    // istrina  uzsakyma
    removeOrder(order){
        //console.log("order name "+ order.name);
        //console.log(this.getOrderIndex(order)+" " + order);
        const index = this.getOrderIndex(order);
        if(index!=-1){
        this.orderList.splice(this.getOrderIndex(order),1);
        localStorage.setItem("orderList",JSON.stringify(this.orderList));
        }
        else console.log("order not found");
    }
    addOption(option){
        this.optionList.push(option);
        localStorage.setItem("optionList",JSON.stringify(this.optionList));
    }
    removeOption(order){
        //console.log("order name "+ order.name);
        console.log(this.getOptionIndex(order)+" " + order);
        this.optionList.splice(this.getOptionIndex(order),1);
        localStorage.setItem("optionList",JSON.stringify(this.optionList));
    }
    // pasaukiam kai page refreshina ar atidaro, tai patikrina ar jau praejo laikas tam kad uzdaryti 
    // option pozicija;
    realizeOptions(){
        this.optionList = JSON.parse(localStorage.getItem("optionList")) || [];
        this.generateOptionObject();
        for(let i = 0;i<this.optionList.length;i++){
            this.optionList[i].realizeOption();
        }
    }
    getOrderIndex(order){
        for(let i=0;i < this.orderList.length;i++){
            //console.log(order.stockName);
            if(order.stockName==this.orderList[i].stockName&& 
                order.price==this.orderList[i].price&&
                order.amount==this.orderList[i].amount && order.orderType==this.orderList[i].orderType){
                return i;
            }
        }
        return -1;
    }
    getOptionIndex(option){
        for(let i=0;i < this.optionList.length;i++){
            //console.log(order.stockName);
            if(option.stockName==this.optionList[i].stockName&& 
                option.strikePrice==this.optionList[i].strikePrice&&
                option.premium==this.optionList[i].premium && option.optionType==this.optionList[i].optionType && 
                option.expiryDate==this.optionList[i].expiryDate){
                return i;
            }
        }
    }
    getOrderListSize(){
        return this.orderList.length;
    }
    getOrderByIndex(index){
        return this.orderList[index];
    }
    printOrdersToConsole(){
        for(let i = 0;i<this.orderList.length;i++){
            console.log(this.orderList[i].stockName+" "+ this.orderList[i].price+" "+this.orderList[i].amount+" "+this.orderList[i].orderType+" "+i);
        }
    }
    // naikina akcijas is portfelio kuriu laikomas skaicius yra 0
    removeNotHeldStocks(){
        for(let i = 0;i<this.stocklist.length;i++){
            if(this.stockAmounts[i]<=0) {
                this.stocklist.splice(i,1);
                this.stockAmounts.splice(i,1);
                i--;
            }
        }
    }
    //grazian akcijos index pagal akcijso pav
    getStockIndexByName(name){
        for(let i = 0;i<this.stocklist.length;i++){
            if(this.stocklist[i].name==name){
                return i;
            }
        }
        return -1;
        
    }
    printUserOptionsToConsole(){
        for(let i = 0;i<this.optionList.length;i++){
        //     console.log("strike " +  this.optionList[i].strikePrice+ " name " + this.optionList[i].stockName+
        //         " premium "+this.optionList[i].premium+ " expiryDate " + this.optionList[i].expiryDate+" type "+this.optionList[i].optionType);
        }
        console.log(this.optionList);
    }
    clearUserStocks(){
        
        this.stocklist = JSON.parse(localStorage.getItem("stockList")) || [];
        this.stockAmounts = JSON.parse(localStorage.getItem("stockAmounts")) || [];
        for(let i = 0;i<this.stocklist.length;i++){
            this.stocklist.splice(i);
            i--;
        }
        for(let i = 0;i<this.stockAmounts.length;i++){
            this.stockAmounts.splice(i);
            i--;
        }
        localStorage.setItem("stockList",JSON.stringify(this.stocklist));
        localStorage.setItem("stockAmounts",JSON.stringify(this.stockAmounts));
    }
    clearUserOrders(){
        this.orderList = JSON.parse(localStorage.getItem("orderList")) || [];
        for(let i = 0;i<this.orderList.length;i++){
            this.orderList.splice(i);
            i--;
        }
        localStorage.setItem("orderList",JSON.stringify(this.orderList));
    }
    //spausdina portfelio akciju sarasa i koncole
    printStockList(){
        for(let i =0;i<this.stocklist.length;i++){
            this.stocklist = JSON.parse(localStorage.getItem("stockList")) || [];
            this.stockAmounts = JSON.parse(localStorage.getItem("stockAmounts")) || [];
            this.generateStockObject();
            console.log("-".repeat(50));
            console.log("Amount: " +this.stockAmounts[i]);
            console.log("-".repeat(50));
            this.stocklist[i].printStockInfo();
        }
    }
    //grazina akciju sk duoto indkeso portfelyje
    getStockAmount(index){
        return this.stockAmounts[index];
    }
    addStockToPortfolioTable(name, price, description, change, amount, totalValue) {
        var data = [name, price, description, change, amount, totalValue];
        const table = document.querySelector('#portfolio-table > tbody');
        const row = document.createElement('tr');
        row.setAttribute("name", name);
        for (let i = 0; i < data.length; i++) {
            const cell = document.createElement('td');
            if (i == 0) {
                cell.classList.add('stock-name');
            }
            if (i == 2) {
                cell.classList.add('description');
            }
            if (i == 3) {
                cell.classList.add('change');
            }
            if (i == 5) {
                cell.innerHTML = `${data[i]}<span style='font-style:italic;font-weight: 400;margin-left: 5px;color: var(--primary)'>USD</span>`;
            }
            else {
                cell.textContent = data[i];
            }
            row.appendChild(cell);
            
        }
        row.classList.add('portfolio-table-row');
        table.appendChild(row)
        //this.sortPortfolio();
    }
    putStocksToPortfolioTable() {
        this.stocklist = JSON.parse(localStorage.getItem("stockList")) || [];
        this.stockAmounts = JSON.parse(localStorage.getItem("stockAmounts")) || [];
        let broker = new Broker();
        let totalVal = 0;
        for (let i = 0; i < this.stocklist.length; i++) {
            
            if(this.stockAmounts[i]>0)
            this.addStockToPortfolioTable(
                this.stocklist[i].name,
                this.stocklist[i].price,
                this.stocklist[i].description,
                '-', //todays change
                
                this.stockAmounts[i].toFixed(5),
                (this.stockAmounts[i] * broker.findStockByName(this.stocklist[i].name).price).toFixed(2)
            )
            
            totalVal += +(this.stockAmounts[i] * broker.findStockByName(this.stocklist[i].name).price).toFixed(2);
        }
        const totalAccValue = document.querySelector('#total-account-value');
        totalAccValue.innerHTML = `${totalVal.toFixed(2)} <span style='margin-left: 5px;
    color: var(--text-accent)'>USD</span>`;

        const portfolioRows = document.querySelector('#portfolio-table > tbody')
        const portfolioHeaderRow = document.querySelector('#portfolio-table > tbody > tr[header=true]');
        this.sortTable(portfolioHeaderRow, portfolioRows);  
    }
    
    updatePortfolio() {
        const row = document.querySelectorAll('.portfolio-table-row');
        //clear table
        for (let i = 0; i < row.length; i++) {
            row[i].remove();
        }
        this.putStocksToPortfolioTable();
    }
    //sorts portfolio by selected column
    sortTable(headerRow, tbody) {
        let indexToSort = null;
        let ascending = null;
        //console.log(headerRow);
        for (let i = 0; i < headerRow.children.length; i++) {
            if (headerRow.children[i].hasAttribute('sort')) {
                indexToSort = i;
                ascending = headerRow.children[i].getAttribute('sort') == 'asc' ? true : false;
            }
        }
        const rows = Array.from(tbody.rows);//Array.from(tbody.rows);
        rows.shift(); //dont sort header

        rows.sort((rowA, rowB) => {
            const cellA = rowA.cells[indexToSort].textContent.trim();
            const cellB = rowB.cells[indexToSort].textContent.trim();
            const numA = parseFloat(cellA.replace(/[^0-9.-]/g, '')) || NaN;
            const numB = parseFloat(cellB.replace(/[^0-9.-]/g, '')) || NaN;
            if (!isNaN(numA) && !isNaN(numB)) {
                return ascending ? numA - numB : numB - numA;
            } 
            else {
                return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
            }
        });
        tbody.append(...rows);
        console.log(headerRow.parentElement.parentElement.getAttribute('id')+' table sorted by column ' + indexToSort);
    }
    // pirkimo istorijos saugojimas
    


    updateLimitOrderTable() {
        const row = document.querySelectorAll('.limit-orders-table-row');
        //clear table
        for (let i = 0; i < row.length; i++) {
            row[i].remove();
        }
        this.putLimitOrdersToTable();

    }
    updateOptionsTable() {
        
    }

    putLimitOrdersToTable() {
        let orders = JSON.parse(localStorage.getItem('orderList'));
        if (orders != null) {
            for (let i = 0; i < orders.length; i++) {
                this.fillLimitOrdersTable(orders[i].stockName, orders[i].price, orders[i].amount, orders[i].orderType);
            }
        }
    
    }
    fillLimitOrdersTable(name, price, amount, date) {
        var data = [name, price, amount, date];
        const table = document.querySelector('#limit-orders-table > tbody');
        const row = document.createElement('tr');
        row.setAttribute("name", name);
        for (let i = 0; i < data.length; i++) {
            const cell = document.createElement('td');
            cell.textContent = data[i];
            row.appendChild(cell);
        }
        const buttonCell = document.createElement('td');
        buttonCell.style.width = '80px';
        if (date === "LIMIT BUY" || date === "LIMIT SELL" || date === "SHORT") {
            const button = document.createElement("md-icon-button");
            button.innerHTML = `<md-icon>close</md-icon>`;
            buttonCell.appendChild(button);

            button.addEventListener("click", async ()=> {
                const dialog = document.querySelector("#cancel-limit-order-dialog");

                const returnValue = await new Promise((resolve) => {
                    const handler = (event) => {
                        dialog.removeEventListener("closed", handler);
                        resolve(event.target.returnValue);
                    };
                    dialog.addEventListener("closed", handler);
                    dialog.open = true; 
                });
            
                if (returnValue === "yes") {
                    const broker = new Broker(this);
                    broker.CancelLimitOrder(new Order(price, amount,name, date));
                    this.updateLimitOrderTable();
                }

            });
        }
        row.appendChild(buttonCell);
        row.classList.add('limit-orders-table-row');
        table.appendChild(row)
    }    
}

export class Watchlist
{
    constructor()
    {
        this.stocks = JSON.parse(localStorage.getItem("watchedStocks")) || [];
        if(this.stocks.length==0||this.stocks==null)
        {
            localStorage.setItem("watchedStocks", JSON.stringify(this.stocks));
        }
        else
        {
            // this.stocks.forEach(stock =>{
            //     this.addToTable(stock);
            // })   
        }
        // this.updateButtonListener();
    }
    init() {
        this.stocks.forEach(stock =>{
            this.addToTable(stock);
        });
        this.updateButtonListener();
    }
    updateButtonListener() {
      //  <md-text-button value="watchlist" class="nav-bar-buttons">
        const button = document.querySelector(".nav-bar-buttons[value='watchlist']");
        button.addEventListener("click", () => {
            this.updateInfo();
        });
    }
    Update() {
        const container = document.querySelector("#watchlist-container");
        container.innerHTML = "";
        this.stocks.forEach(stock =>{
            this.addToTable(stock);
        });
    }
    Add(stock)
    {
        this.stocks.push(stock);
        localStorage.setItem("watchedStocks", JSON.stringify(this.stocks));

        this.addToTable(stock);
    }
    findIndex(stockName)
    {
        for(let i = 0; i < this.stocks.length; i++)
            if(this.stocks[i] == stockName)
                return i;
        return -1;
    }
    Remove(stockName)
    {
        let index = this.findIndex(stockName)
        if(index != -1)
        {
            this.stocks.splice(index,1);
            localStorage.setItem("watchedStocks", JSON.stringify(this.stocks));
        }
    }
    updateStock(stock)
    {
        let index = findStockByName(stock)
        if (index != -1)
        {
            this.stocks[index] = stock;
            localStorage.setItem("watchedStocks", JSON.stringify(this.stocks));
        }
    }
    updateInfo()
    {
        let allStockInfo = JSON.parse(localStorage.getItem("globalStockList"));
        this.stocks.forEach(stock =>{
            let matchedStock = allStockInfo.find(s => s.name == stock.name);
            if(matchedStock)
            {
                stock.price = matchedStock.price;
            }
        })
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
    comparePrices()
    {
        let allStockInfo = JSON.parse(localStorage.getItem("globalStockList"));
        let notifStocks = JSON.parse(localStorage.getItem("notificationStocks"));

        notifStocks.forEach(stock => {
            let matchedStock = allStockInfo.find(s => s.name == stock.name);
            if(matchedStock.price <= stock.price)
            {
                    sendNotif(`Price of ${stock.name} has reached ${matchedStock.price} USD`);
                    setTimeout(() => {}, 5000);
            }
        })

        function sendNotif(data) {
            if (Notification.permission === "granted") {
                new Notification("TradingSim", { body: data });
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                    new Notification("TradingSim", { body: data });
                  }
                });
            }
        }    
    }
    addToTable(stockName) {
        const container = document.querySelector("#watchlist-container");
        const price = this.getStockHistory(stockName, 1);
        const priceDiff = (price - this.getStockHistory(stockName, 2)[1]).toFixed(2);
        const priceDiffDisplay = priceDiff > 0 ? `<span style="color:green;">+${priceDiff} $</span>` : `<span style="color:red;">${priceDiff} $</span>`;

        const elem = document.createElement("div");

        elem.classList.add("watchlist-element-container");
        elem.innerHTML = `
            <md-icon-button id="watchlist-remove-${stockName}" style="position:absolute;right:15px;">
                <md-icon>close</md-icon>
            </md-icon-button>
            <div class="watchlist-info">
                <p class="stock-name">${stockName}</p>
                <p>${price} $</p>
                <p>Today: ${priceDiffDisplay}</p>
            </div>
            
            <div class="watchlist-curve">
                <div id="watchlist-curve${stockName}" class="curve-wrapper">
                    
                </div>
            </div>
            <div class="watchlist-notify-container">
                <p>Notify if price is lower than</p>
                <md-outlined-text-field min="0" step="0.01" prefix-text="$" id="notify-price${stockName}" type="number"></md-outlined-text-field>
                <label>
                    <md-checkbox id="notify-checkbox${stockName}"></md-checkbox>
                </label> 
            </div>
        `;
        
        container.appendChild(elem);

        document.querySelector("#watchlist-remove-"+stockName).addEventListener("click", () => {
            this.Remove(stockName);
            this.Update();
        });
        const checkbox = document.querySelector("#notify-checkbox"+stockName);


        let raw = localStorage.getItem("notificationStocks");
        let storageList = [];

        try {
        storageList = raw ? JSON.parse(raw) : [];
        } catch (e) {
        storageList = [];
        }

        let match = storageList.find(s => s.name === stockName);
        if (match) {
            checkbox.checked = true;
            
        }


        
        const input = document.querySelector("#notify-price"+stockName);
        input.value = price;
        checkbox.addEventListener("change", () => {
            

            if (input.value == "") {
                // tuscia

                var notif = new Notifications({
                    icon: "sentiment_dissatisfied",
                    text: `<p>Enter price first!</p>`,
                });
                notif.show();
                checkbox.checked = false;
            }
            else if (checkbox.checked) {
                
                //stockName, input.value === name ir kaina
                //localStorage.add()

                // let storageList = JSON.parse(localStorage.getItem("notificationStocks")) || [];
                // let match = storageList.find(s => s.name === stockName);
                // if(!match)
                // {
                //     let stock = { name: stockName, price: input.value };
                //     storageList.push(stock);
                // }
                // localStorage.setItem("notificationStocks", JSON.stringify(storageList));

                let raw = localStorage.getItem("notificationStocks");
                let storageList = [];

                try {
                storageList = raw ? JSON.parse(raw) : [];
                } catch (e) {
                storageList = [];
                }

                let match = storageList.find(s => s.name === stockName);
                if (!match) {
                let stock = { name: stockName, price: input.value };
                storageList.push(stock);
                }

                localStorage.setItem("notificationStocks", JSON.stringify(storageList));


                var notif = new Notifications({
                    icon: "mood",
                    text: `<p>Now you will be getting browser notifications for <span class="stock-name">${stockName}</span>!</p>`,
                });
                notif.show();


            }
            else if (!checkbox.checked) {
                //remove notif
                let storageList = JSON.parse(localStorage.getItem("notificationStocks"));
                let index = storageList.findIndex(s => s.name === stockName);
                if(index != -1)
                    storageList.splice(index,1);
                localStorage.setItem("notificationStocks", JSON.stringify(storageList));


                
                var notif = new Notifications({
                    icon: "sentiment_dissatisfied",
                    text: `<p>Browser notifications cancelled.</p>`,
                });
                notif.show();
            }
        });

        let curveWrapper = document.querySelector(`#watchlist-curve${stockName}`);
        curveWrapper.innerHTML = '';
        const buyCurve = new Curve(700,250, curveWrapper);
        let points = this.getStockHistory(stockName, 30);
        buyCurve.drawCurve(
            points.slice(0, 30).map((price, index) => ({ x: 30 - index, y: Math.round(price) }))
        );

    }

    

}


