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
    UpdatePrice(newPrice){
        this.price = newPrice;
    }
}
//cia laikoma visu akciju info
export class GlobalStockList
{
    //hard-codintos akcijos
    constructor(){ 
        //this.stocks = [];
        //this.createStock("KO",100,"Coca-Cola is a soda drinks company",17000,25000,300);
        //this.createStock("TSLA",190,"Tesla is a tech/car company",1000,10000,30);
        //this.createStock("AAPL",150,"Apple is a tech company",20000,50000,15000);
        this.stocks = JSON.parse(localStorage.getItem("globalStockList")) || [];
        
        if(this.stocks.length==0||this.stocks==null){

            this.createStock("AAPL", 35, "Apple is a tech giant", 20000, "3.28T", "391B");
            this.createStock("MSFT", 200, "Microsoft is a software co.", 19000, "2.82T", "245B");
            this.createStock("TSLA", 350, "Tesla makes electric cars", 18000, "825.8B", "97.7B");
            this.createStock("AMZN", 40, "Amazon is an e-commerce leader", 15000, "2.04T", "637B");
            this.createStock("GOOG", 100, "Google is a search engine co.", 12000, "1.89T", "348B");
            this.createStock("NVDA", 130, "Nvidia specializes in graphics", 17000, "2.68T", "130.5B");
            this.createStock("META", 50, "Meta is a social media company", 16000, "1.46T", "164.5B");
            this.createStock("NFLX", 30, "Netflix is a streaming service", 14000, "399.4B", "39B");
            this.createStock("SPY", 430, "SPY is an ETF for S&P 500", 20000, "501.5B", "151B");
            this.createStock("V", 200, "Visa is a global payments network", 18000, "669.7B", "35.9B");
            
            localStorage.setItem("globalStockList",JSON.stringify(this.stocks));
            
        }
        else{
            this.generateStockObjects();    
        }
        }
        resetStocks(){
            localStorage.removeItem("globalStockList");
        }
    generateStockObjects(){
        this.stocks = JSON.parse(localStorage.getItem("globalStockList")) || [];      
        this.newStockList = [];
        for(let i =0;i<this.stocks.length;i++){
            this.newStockList.push(new Stock(this.stocks[i].name,this.stocks[i].price,this.stocks[i].description,this.stocks[i].volume,this.stocks[i].marketCap,this.stocks[i].revenue));
        }
        this.stocks = this.newStockList;

    }
    createStock(name,price,description,volume,marketCap,revenue){
        this.stocks.push(new Stock(name,price,description,volume,marketCap,revenue));
    }
    getStockCount(){
        this.generateStockObjects();
        return this.stocks.length;
    }
    getStock(index){
        this.generateStockObjects();
        return this.stocks[index];
    }
    addStockToTable(name, price, description, volume, marketCap, revenue) {
        var data = [name, price, description, volume, marketCap, revenue];
        const table = document.querySelector('#stocks-table > tbody');
        const row = document.createElement('tr');
        row.setAttribute("name", name);
        for (let i = 0; i < data.length; i++) {
            const cell = document.createElement('td');
            if (i == 0) cell.classList.add('stock-name');
            if (i == 2) {
                cell.classList.add('description');
            }
            

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
    // funkcija atnaujina stocks lenteles kaina pagal NAME identifikatoriu
    updateStocksTable(name,price) {
        
        const table = document.querySelector('#stocks-table > tbody');
        if (table.childElementCount != 1) {
            const row = table.querySelector(`tr[name=${name}`);
            const cells = row.querySelectorAll('td');
            cells[1].textContent = price;
        }
    }
    addStocksFromList()
    {
        this.generateStockObjects();
        this.stocks.forEach(stock =>{
                this.addStockToTable(stock.name,stock.price,stock.description,stock.volume,stock.marketCap,stock.revenue)
        })
    }
    findStockByName(name){
        this.generateStockObjects();
        for(let i = 0;i<this.stocks.length;i++){
            if(this.stocks[i].name==name){
                return this.stocks[i];
            }
        }
    }
    //grazian akcijos index pagal akcijso pav
    getStockIndexByName(name){
        this.generateStockObjects();
        for(let i = 0;i<this.stocks.length;i++){
            if(this.stocks[i].name==name){
                return i;
            }
        }
        return -1;
        
    }
    // keiciantis kainai saukiam sita metoda su name Identifikatorium pvz AAPL ir duodam nauja kaina
    // TODO: Neveikia metodas
    UpdateStockPrice(name,newPrice){
        this.generateStockObjects();
        this.findStockByName(name).UpdatePrice(newPrice);
        //console.log(""+name+" "+newPrice+ " "+this.findStockByName(name).price);
        this.updateStocksTable(name,newPrice);
        
        localStorage.setItem("globalStockList",JSON.stringify(this.stocks));
    }
    
    fetchStockInfo() {
        const apiKey = "cvbk2i1r01qob7ue5mugcvbk2i1r01qob7ue5mv0";
        const symbols = ["AAPL", "MSFT", "TSLA", "AMZN", "GOOG", "NVDA", "META", "NFLX", "SPY", "V"];
    
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
        const fetchStockData = async () => {
            try {
                let stockData = [];
    
                for (const symbol of symbols) {
                    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
                    const data = await response.json();
                    
                    stockData.push({ symbol, currentPrice: data.c });
                    //console.log(`${symbol}: ${data.c}`);
    
                    await wait(100);
                }
    
                //console.log("Batch Stock Data:", stockData);
                
                let currentTime = new Date().toISOString();
                localStorage.setItem("lastStockInfo", JSON.stringify(stockData));
                localStorage.setItem("lastUpdateTime", currentTime);
                
                stockData.forEach(stock => {
                    this.UpdateStockPrice(stock.symbol, stock.currentPrice);
                    //broker.UpdateLimitOrders(); 
                });

            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };
    
        fetchStockData();
    }
    //PADARYT:
    //pasaukti metoda UpdateLimitOrders(); kuris yra Broker klasej kai yra keiciama kaina
    loadStockInfo()
    {
        let currentTime = new Date();
        let lastUpdate = new Date(localStorage.getItem("lastUpdateTime"))

        if(lastUpdate == null) // jei pirma karta lankoma
        {
            this.fetchStockInfo();
            setInterval(() => this.fetchStockInfo(), 65000);
        }
        else if ((currentTime.getTime() - lastUpdate.getTime()) >= 65000) // jei paskutini karta updatinta pries > 1 min
        {
            this.fetchStockInfo();
            setInterval(() => this.fetchStockInfo(), 65000);
        }
        else // jei updatinta pries maziau nei 1 min, sekanti update daryti po 1 min
        {
            const storedStockData = localStorage.getItem("lastStockInfo")
            const stockData = JSON.parse(storedStockData);
            stockData.forEach(stock => {
                //console.log(`IS STORAGO:  ${stock.symbol}: ${stock.currentPrice}`);
                this.UpdateStockPrice(stock.symbol, stock.currentPrice);
                //broker.UpdateLimitOrders();
            });
            setInterval(() => this.fetchStockInfo(), 65000);
        }
    }
    fetchHistoricalData()
    {
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const apiKey = "lXpj4p4JRk6pGiQDSh9T3OnsniC3McAL";
        const symbols = ["AAPL", "MSFT", "TSLA", "AMZN", "GOOG", "NVDA", "META", "NFLX", "SPY", "V"];

        async function fetchHistoricalData() {
        try {
            
            for (const symbol of symbols)
            {
                const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=252&apikey=${apiKey}`);
                const data = await response.json();
        
                if (data && data.historical) 
                {
                    console.log("Historical Stock Data:", data.historical);
                    localStorage.setItem(`${symbol}_hist`, JSON.stringify(data.historical));
                } 
                else 
                {
                    console.error("Error: Unexpected data format", data);
                }
                await wait(50);
            }
        } 
        catch (error) 
        {
            console.error("Error fetching historical data:", error);
        }
        }
        fetchHistoricalData();
    }
    updateHistoricalData()
    {
        let currentTime = new Date();
        let lastUpdate = new Date(localStorage.getItem("lastHistoricalUpdateTime"))
        const differenceInDays = Math.floor((currentTime - lastUpdate) / (1000 * 3600 * 24))

        if(lastUpdate == null)
        {
            this.fetchHistoricalData()
            localStorage.setItem("lastHistoricalUpdateTime", currentTime.toISOString())

        }
        else if (differenceInDays > 0)
        {
            this.fetchHistoricalData()
            localStorage.setItem("lastHistoricalUpdateTime", currentTime.toISOString())
        }
    }
}
export const orderType = {
    BUY: "LIMIT BUY",
    SELL: "LIMIT SELL",
    SHORT: "SHORT"       
};
export const optionType = {
    PUT: "put",
    CALL: "call"
};
export class Broker{

    constructor(user = null) {
        this.stockList = new GlobalStockList();
        this.orderList = [];

        if (user) {
            this.user = user;
        } else {
            this.user = new User();
        }
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
            this.user.updateChallenge(0, 1);
            this.user.updateChallenge(2,1);

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
            //console.log(stockCount);
            //console.log(stock.price);
            this.user.addBalance(stockCount*stock.price); // pridedami pinigai
            this.user.removeStock(stock,stockCount); // nuskaitomos akcijos
            this.user.updateChallenge(1,1);
            this.user.updateChallenge(2,1);
        }
        else {
            console.log("parduoti noriu "+stockCount+ " o yra "+stockAmount);
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
    // limit order pirkimo, sukuria uzsakyma pirkimo, nuema balansa
    LimitOrderBuy(name,price,amount){
        if(amount*price<=this.user.getBalance()){
            if(this.stockList.getStockIndexByName(name)!=-1){
                this.user.removeBalance(amount*price);
                this.user.addOrder(new Order(price,amount,name,orderType.BUY));
            }
            else console.log("Invalid name for the stock, it doesn't exist");
        }
        else {
            console.log("Invalid number for LimitOrderBuy | must be less or equal to the balance")
        }
    }
    // limit oder pardavimas, sukuria uzsakyma pardavimo, nuema akcijas
    LimitOrderSell(name,price,amount){
        const stockIndex = this.user.getStockIndexByName(name); //akcijos kuria perkame indexas user portfelyje
        const stockAmount = this.user.getStockAmount(stockIndex); //akciju skaicius kuri turi useris
        if(amount<=stockAmount){
            if(this.stockList.getStockIndexByName(name)!=-1){
                this.user.removeStock(this.stockList.findStockByName(name),amount);
                this.user.addOrder(new Order(price,amount,name,orderType.SELL));
            }
            else console.log("Invalid name for the stock, it doesn't exist");
        }
        else {
            console.log("Invalid number for LimitOrderSell | must be less or equal to the stock amount")
        }
    }
    // sukuria short pozicija
    ShortOrder(name,price,amount){
        this.user.addOrder(new Order(price,amount,name,orderType.SHORT));
    }
    // uzdaro short pozicija, skirtumas akciju kainoje nuo uzsakymo pradzios kainos 
    // ir dabartines pridedamas prie user balance;
    CloseShortOrder(order){
        const stock = this.stockList.findStockByName(order.stockName);
        if(order.orderType==orderType.SHORT){
            const netGain = (stock.price*order.amount)-(order.price*order.amount);
            this.user.addBalance(netGain);
            this.user.removeOrder(order);
        }
    }
    // is UI limit orderiu listo paspaudus pasauktum sita klase su orderiu CancelLimitOrder(new Order(t.t)) <- info i ji is UI gali paduoti
    // price, amount,stockname, orderType;
    CancelLimitOrder(order){
        //console.log(order);
        const stock = this.stockList.findStockByName(order.stockName);
        if(order.orderType==orderType.SELL){
        this.user.addStock(stock,order.amount);
        }
        else if(order.orderType==orderType.BUY){
            this.user.addBalance(order.amount*order.price);
        }else if(order.orderType==orderType.SHORT){
            this.CloseShortOrder(order);
        }
        if(order.orderType!=orderType.SHORT)this.user.removeOrder(order);
    }
    // patikrina ar limit orderis patenka i reikiama kaina pardavimo/pirkimo, atnaujinant akciju kaina reikia pasaukti sita metoda
    UpdateLimitOrders(){
        for(let i = 0;i < this.user.getOrderListSize();i++){
           const order =  this.user.getOrderByIndex(i);
           const stock = this.stockList.findStockByName(order.stockName);
        //    if(stock.price<=order.price) console.log("pass2");
        //    else console.log(stock.name+" "+stock.price+" "+ order.price)
           if(stock.name==order.stockName&& stock.price<=order.price&&orderType.BUY==order.orderType){
                this.user.addStock(stock,order.amount);
                this.user.removeOrder(order);
                i--;
            }
            else if (stock.name==order.stockName&& stock.price>=order.price&&orderType.SELL==order.orderType){
                
                this.user.addBalance(order.amount*order.price);
                this.user.removeOrder(order);
                i--;
            }
        }
    }
    //duodam stock name, grazina sarasa options pagal kuri ir bus perkama;
    generateOptions(stockName){
        const optionCount = Math.max(Math.floor(Math.random()*25),10);
        
        this.optionList = [];
        for(let i = 0;i<optionCount;i++){
            const currentPrice = this.stockList.findStockByName(stockName).price;
            const newPriceRangeValue =(Math.floor(Math.random()*30))+1;
            let percetangePriceRange;
            let NewOptionStrike;
            const timeValue = (Math.floor(Math.random()*30)+1);
            const newExpiryDate = new Date().getTime()+(timeValue*24*60*60*1000);
            let premiumPrice;
            let selectedType;
            if(i%2==0){
                percetangePriceRange= ((newPriceRangeValue/100)+1);
                NewOptionStrike= currentPrice*percetangePriceRange;
                premiumPrice =Math.max((currentPrice*(0.35-(percetangePriceRange-1)))*0.5,0)+(timeValue*0.2);
                selectedType = optionType.CALL;
            }
            else{
                percetangePriceRange= (1-(newPriceRangeValue/100));
                NewOptionStrike= currentPrice*percetangePriceRange;
                premiumPrice =Math.max((currentPrice*(0.35-(1-percetangePriceRange)))*0.5,0)+(timeValue*0.2);
                selectedType = optionType.PUT;
            }
            
            this.optionList.push(new Option(NewOptionStrike,stockName,premiumPrice,newExpiryDate,selectedType));
        }
        return this.optionList;
    }
    // nuperka option duoti reikia Option objekta -> new Option(strikePrice,stockName,premium,expiryDate,optionType);
    PurchaseOption(option){
        if(this.user.getBalance()>=option.premium){
            this.user.addOption(option);
            this.user.removeBalance(option.premium);
        }
        else{
            console.log("Not enough balance to purhcase option");
        }
    }
}
// order klase
export class Order{
    /**
     * @param {float} price - kaina
     * @param {float} amount - kiekis
     * @param {string} stockName - akcijos pav/identifikatorius
     * @param {orderType} orderType - order type, buy ir sell butu limit orders o short, short pozicijai;
     */
    constructor(price,amount,stockName,orderType){
        this.price = price;
        this.amount = amount;
        this.stockName = stockName;
        this.orderType = orderType;
    }
}

export class Option{
    constructor(strikePrice,stockName,premium,expiryDate,optionType){
        this.strikePrice = strikePrice;
        this.stockName = stockName;
        this.premium = premium;
        this.expiryDate = expiryDate;
        this.optionType = optionType;
    }
    isExpired(currentDate){
        return currentDate>=this.expiryDate;
    }
    realizeOption(){
        const stocklist = new GlobalStockList();
        const currentDate = new Date();
        const user = new User();
        if(this.isExpired(currentDate.getTime())){
            const stock = stocklist.findStockByName(this.stockName);
                
            if(this.optionType==optionType.CALL){
                if(stock.price>this.strikePrice){
                    const priceDiff = stock.price-this.strikePrice;
                    user.addBalance(priceDiff);
                    user.removeOption(this);
                }
                else{
                    user.removeOption(this);
                }
            }
            else if(this.optionType == optionType.PUT) {
                if(stock.price<this.strikePrice){
                    const priceDiff = this.strikePrice-stock.price;
                    user.addBalance(priceDiff);
                    user.removeOption(this);
                }
                else{
                    user.removeOption(this);
                }
            }
        }
    }
}