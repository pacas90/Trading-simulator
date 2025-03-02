import { User } from "./user.js";
//akcijos klase
export class Stock
{
    constructor(name,price,description,volume,marketCap,revenue)
    {
        this.name = name; // unkikalus pav kaip indentifikatorius pvz TSLA,KO,AAPL
        this.price = price; // akcijos kaina
        this.description = description; //akcijos aprasymas
        this.volume = volume; // kiek prekiauta per pastaraja diena
        this.marketCap = marketCap; // Imones verte
        this.revenue = revenue; // Imones pelnas
    } 
    //spausdina akciju info i koncole
    printStockInfo()
    {
        console.log("-".repeat(50));
        console.log("Stock".padEnd(10, " ")+ "Price".padStart(10, " ")+"Volume".padStart(10, " ")+"marketCap".padStart(10, " ")+"revenue".padStart(10, " "));
        console.log(this.name.padEnd(10, " ")+ String(this.price).padStart(10, " ")+ String(this.volume).padStart(10, " ")+ 
        String(this.marketCap).padStart(10, " ")+ String(this.revenue).padStart(10, " "));
        console.log("-".repeat(50));
        console.log(this.description);
        console.log("-".repeat(50));
    }
}
//cia laikoma visu akciju info
export class GlobalStockList
{
    //hard-codintos akcijos
    constructor(){
        this.stocks = [];
        this.createStock("KO",100,"Coca-Cola is a soda drinks company",17000,25000,300);
        this.createStock("TSLA",190,"Tesla is a tech/car company",1000,10000,30);
        this.createStock("AAPL",150,"Apple is a tech company",20000,50000,15000);
    }
    createStock(name,price,description,volume,marketCap,revenue){
        this.stocks.push(new Stock(name,price,description,volume,marketCap,revenue));
    }
    getStockCount(){
        return this.stocks.length;
    }
    getStock(index){
        return this.stocks[index];
    }
    addStockToTable(name, price, description, volume, marketCap, revenue) {
        var data = [name, price, description, volume, marketCap, revenue];
        const table = document.querySelector('#stocks-table > tbody');
        const row = document.createElement('tr');
        row.setAttribute("name", name);
        for (let i = 0; i < data.length; i++) {
            const cell = document.createElement('td');
            cell.textContent = data[i];
            row.appendChild(cell);
        }
        row.classList.add('stocks-table-row');
        table.appendChild(row)
    }
    // funkcija atnaujina stocks lenteles duomenis pagal NAME identifikatoriu
    updateStocksTable(name, price, description, volume, marketCap, revenue) {
        const table = document.querySelector('#stocks-table > tbody');
        const row = table.querySelector(`tr[name=${name}`);
        const cells = row.querySelectorAll('td');
        cells[1].textContent = price;
        cells[2].textContent = description;
        cells[3].textContent = volume;
        cells[4].textContent = marketCap;
        cells[5].textContent = revenue;
    }
    addStocksFromList()
    {
        this.stocks.forEach(stock =>{
                this.addStockToTable(stock.name,stock.price,stock.description,stock.volume,stock.marketCap,stock.revenue)
        })
    }
}
export class Broker{

    constructor(){
        this.stockList = new GlobalStockList();
        this.user = new User();
    }
    /**
     * Pirkimas duotos akcijos uz duota pinigu suma.
     * @param {string} name - akcijos id/name pvz TSLA ar KO
     * @param {number} currencyCount - pinigu suma uz kuria perkame duota akcija
     */
    marketOrderBuy(name,currencyCount)
    {
        if(currencyCount>0&&currencyCount<=this.user.getBalance()){
            this.user.removeBalance(currencyCount); // nuskaitomi pinigai
            const stock = this.findStockByName(name); // surandama akcija kuria perkam

            const numOfSharesBought =currencyCount/stock.price; // kiek akciju pirksim
            this.user.addStock(stock,numOfSharesBought); // pridedam tiek akciju 
        }
        else {
            console.log("Invalid number for marketOrderBuy | must be greater than 0 and less than user balance");
        }
    }
    /**
     * Pardavimas duotos akcijos uz duota akciju kieki.
     * @param {string} name - akcijos id/name pvz TSLA ar KO
     * @param {number} stockCount - akciju skaicius kuri parduodame
     */
    marketOrderSell(name,stockCount)
    {
        const stockIndex = this.user.getStockIndexByName(name); //akcijos kuria perkame indexas user portfelyje
        const stockAmount = this.user.getStockAmount(stockIndex); //akciju skaicius kuri turi useris
        if(stockAmount>=stockCount){
            const stock = this.findStockByName(name); //randame akcija kuri yra parduodama
            console.log(stockCount);
            console.log(stock.price);
            this.user.addBalance(stockCount*stock.price); // pridedami pinigai
            this.user.removeStock(stock,stockCount); // nuskaitomos akcijos
        }
        else {
            console.log("Invalid number for marketOrderSell | must be greater than or equal to held stock count");
        }
    }
    //suranda akcija pagal duota varda ir ja grazina
    findStockByName(name){
        for(let i = 0;i<this.stockList.getStockCount();i++){
            if(this.stockList.getStock(i).name==name){
                return this.stockList.getStock(i);
            }
        }
    }
}