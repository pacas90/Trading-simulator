import { GlobalStockList } from "./stock.js";
import { Stock } from "./stock.js";
import { Broker } from "./stock.js";
	
export class User
{
    
    constructor()
    {
        const storedBalance = localStorage.getItem("userBalance");

        if(storedBalance == null)
        {
            this.balance = 200.00;
            localStorage.setItem("userBalance",this.balance);
        }
        else
        {
            this.balance = parseFloat(storedBalance);
        }
        document.querySelector("#money-balance").textContent = `${this.balance.toFixed(2)} `;
        this.stocklist = JSON.parse(localStorage.getItem("stockList")) || [];
        this.stockAmounts = JSON.parse(localStorage.getItem("stockAmounts")) || [];
        this.generateStockObject();

    }
    // atkuriam stock objektus po issaugojimo is Stringu
    generateStockObject(){
        this.newStockList = [];
        for(let i =0;i<this.stocklist.length;i++){
            this.newStockList.push(new Stock(this.stocklist[i].name,this.stocklist[i].price,this.stocklist[i].description,this.stocklist[i].volume,this.stocklist[i].marketCap,this.stocklist[i].revenue))
        }
        this.stocklist = this.newStockList;
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
     * @param {String} stock - akcijos prie kurios pridedi kieki/sukurti nauja pav
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
        }
        localStorage.setItem("stockList",JSON.stringify(this.stocklist));
        localStorage.setItem("stockAmounts",JSON.stringify(this.stockAmounts));
    }
    /**
     * nuema duotos akcijos pagal pav, duota kieki
     * @param {String} stock - akcijos pav kuris yra nuemamas
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
            if(this.stockAmounts[stockIndex]>=amount)this.stockAmounts[stockIndex]-=amount;
            else console.log("Invalid stock amount being removed | must be greater or equal to stock amount held in storage");
        }
        this.removeNotHeldStocks();
        localStorage.setItem("stockList",JSON.stringify(this.stocklist));
        localStorage.setItem("stockAmounts",JSON.stringify(this.stockAmounts));
    }
    // naikina akcijas is portfelio kuriu laikomas skaicius yra 0
    removeNotHeldStocks(){
        for(let i = 0;i<this.stocklist.length;i++){
            if(this.stockAmounts[i]<=0) {
                this.stocklist.splice(i);
                this.stockAmounts.splice(i);
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
}   


