import { GlobalStockList } from "./stock.js";
import { Stock } from "./stock.js";
import { Broker } from "./stock.js";
import { Order } from "./stock.js";
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
            /*var Transactions = new RecentTransactions();
            for (var i = 0; i < Transactions.transactions.length; i++) {
                Transactions.putInTable(Transactions.transactions[i]);
            }*/
           // kazkodel blet neleidzia issaugot, meta error kad user undefined
        }
        document.querySelector("#money-balance").textContent = `${this.balance.toFixed(2)} `;
        this.stocklist = JSON.parse(localStorage.getItem("stockList")) || [];
        this.stockAmounts = JSON.parse(localStorage.getItem("stockAmounts")) || [];
        this.orderList = JSON.parse(localStorage.getItem("orderList")) || [];
        this.generateStockObject();
        //this.generateDecimalList();
    }
    // atkuriam stock objektus po issaugojimo is Stringu
    generateStockObject(){
        this.newStockList = [];
        for(let i =0;i<this.stocklist.length;i++){
            this.newStockList.push(new Stock(this.stocklist[i].name,this.stocklist[i].price,this.stocklist[i].description,this.stocklist[i].volume,this.stocklist[i].marketCap,this.stocklist[i].revenue))
        }
        this.stocklist = this.newStockList;
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
    // prideda limit uzsakyma
    addLimitOrder(order){
        this.orderList.push(order);
        localStorage.setItem("orderList",JSON.stringify(this.orderList));
    }
    // istrina limit uzsakyma
    removeLimitOrder(order){
        console.log(this.getOrderIndex(order)+" " + order);
        this.orderList.splice(this.getOrderIndex(order),1);
        localStorage.setItem("orderList",JSON.stringify(this.orderList));
    }
    getOrderIndex(order){
        for(let i=0;i < this.orderList.length;i++){
            if(order.name==this.orderList[i].name&& order.price==this.orderList[i].price&&
                order.amount==this.orderList[i].amount && order.orderType==this.orderList[i].orderType){
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
            if (i == 2) {
                cell.classList.add('description');
            }
            if (i == 3) {
                cell.classList.add('change');
            }
            if (i == 5) {
                cell.innerHTML = `${data[i]}<span style='margin-left: 5px;color: var(--text-accent)'>EUR</span>`;
            }
            else {
                cell.textContent = data[i];
            }
            row.appendChild(cell);
            
        }
        row.classList.add('portfolio-table-row');
        table.appendChild(row)
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
        totalAccValue.innerHTML = `${totalVal} <span style='margin-left: 5px;
    color: var(--text-accent)'>EUR</span>`;
    }
    updatePortfolio() {
        const row = document.querySelectorAll('.portfolio-table-row');
        //clear table
        for (let i = 0; i < row.length; i++) {
            row[i].remove();
        }
        this.putStocksToPortfolioTable();
    }
    // pirkimo istorijos saugojimas
    recentTransactionsAdd(transaction) {
        var all = localStorage.getItem('recentTransactions');
        all += transaction;
        localStorage.setItem('recentTransactions', all);
    }
}   


