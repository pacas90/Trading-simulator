import { User } from "./user.js";
import { Broker } from "./stock.js";
import { GlobalStockList } from "./stock.js";
const user = new User();
const stockList = new GlobalStockList();
const broker = new Broker();
//broker.marketOrderSell(stockList.getStock(0).name,0.05);
/* broker.marketOrderBuy(stockList.getStock(0).name,10);
broker.marketOrderBuy(stockList.getStock(1).name,5);
broker.marketOrderSell(stockList.getStock(2).name,0.5533333333333333);
user.printStockList(); */



//sukursiu siandien dar jeigu spesiu mygtuku buy/sell bet neprizadu ar spesiu

//dar del mygtuku, tai paciu akciju selectiona
//ten reiktu kad generuotu is saraso mygtuku sarasa kazkaip, ir pagal mygtuko value tada galetume paduot kokia akcija Perka 


//as tai turiu ideja tokia: padaryt lentele, realiai unlimited dydzio, kuri dideja priklausant kiek mes norim stocksu pardavient
//ir tenais pasirinkus kazkuria tipo su ja kazka daryt, pirkt parduot ir taip toliau

//jo gerai ir tada realiai global kazkoki value pakeicia ten currentStockName ir pagal tai paspaudus buy galetu orentuotis tada



//-----------------------------------------------------------------
// kintamieji kuriuos reikes nusettinti kad rodytu interfeise pirmam tabe:
//const totalAccValue = document.querySelector('#total-account-value'); //bendra suma acccounto
const todaysChangeValue = document.querySelector('#todays-change-value'); //kiek per siandien pasikeite kainos
const todaysChangePercentage = document.querySelector('#todays-change-percentage'); //tas pats, tik procentais
// ----------------------------------------------------------------
// reikia padaryti kad addEventListener() onpageload ar kazka tokio, kad is kazkur paimtu ir
// kazkiek stocku pridetu i pirkimo/pardavimo lentele su sita funkcija:
// addStockToTable(name, price, description, volume, marketCap, revenue)
// tuomet dar reiktu padaryti, kad kas kazkiek laiko atnaujintu kainas lenteleje su sita funkcija:
// function updateStocksTable(name, price, description, volume, marketCap, revenue)
// apacioj cia yra aprasyti du event'ai button clicku (buy ir sell),
// reik aprasyti logika, kas buna kai nusiperki ar parduodi ir issaugot viska localStorage




const navButtons = document.querySelectorAll('.nav-bar-buttons'); //navigacijos mygtukai
const content = document.querySelectorAll(".nav-content"); // content'as skirtingu skyriu (home, buy/sell, portfolio..)
//cia perjungia skyrius ant mygtuku paspaudimo
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        for(let i = 0; i < navButtons.length; i++) {
            navButtons[i].classList.remove('nav-bar-buttons-active');
            content[i].classList.add('hidden');
        }
        button.classList.add('nav-bar-buttons-active');
        document.querySelector(`.nav-content.${button.getAttribute('value')}`).classList.remove('hidden');

    });
});

// sukuria nauja stock'o lenteles skyriu buy/sell tab'e

stockList.addStocksFromList()
user.putStocksToPortfolioTable();
/*
addStockToTable("test2", 2, "a", 5, 5, 5);
addStockToTable("test3", 3, "a", 5, 5, 5);
addStockToTable("test4", 4, "a", 5, 5, 5);
addStockToTable("test5", 5, "a", 5, 5, 5);
addStockToTable("test6", 6, "a", 5, 5, 5);*/



// lentele stocku
const stocksTable = document.querySelector('#stocks-table > tbody');
const stocksRows = stocksTable.querySelectorAll('tr');

const stocksBuyText1 = document.querySelector('#stocks-buy-sell-text1');
const stocksSellText1 = document.querySelector('#stocks-buy-sell-text2');
const stocksBuyButton = document.querySelector('#button-buy'); //buy mygtukas
const stocksBuyStockForInput = document.querySelector('.stocks-buy-sell-input.buy-stock-for'); //eurais input
const stocksBuyStockAmountInput = document.querySelector('.stocks-buy-sell-input.buy-stock-amount'); //stocku kiekis input

const stocksSellButton = document.querySelector('#button-sell'); //sell mygtukas
const stocksSellStockForInput = document.querySelector('.stocks-buy-sell-input.sell-stock-for'); //eurais input
const stocksSellStockAmountInput = document.querySelector('.stocks-buy-sell-input.sell-stock-amount'); 

const ownedStocksAmount = document.querySelector('#owned-stocks-amount');

function disableInputs(flag) {
    if (flag == true) {
        stocksBuyText1.textContent = '------';
        stocksSellText1.textContent = '------'; 
        stocksBuyStockForInput.value = 0;
        stocksBuyStockAmountInput.value = 0;
        stocksSellStockForInput.value = 0;
        stocksSellStockAmountInput.value = 0;
        stocksBuyStockForInput.setAttribute("disabled", '');
        stocksBuyStockAmountInput.setAttribute("disabled", '');
        stocksSellStockForInput.setAttribute("disabled", '');
        stocksSellStockAmountInput.setAttribute("disabled", '');
        stocksBuyButton.setAttribute("disabled", '');
        stocksSellButton.setAttribute("disabled", '');
        //ownedStocksAmount.classList.add('hidden');
        ownedStocksAmount.textContent = 'Select row to buy/sell';
    }
    else {
        stocksBuyStockForInput.removeAttribute("disabled");
        stocksBuyStockAmountInput.removeAttribute("disabled");
        stocksSellStockForInput.removeAttribute("disabled");
        stocksSellStockAmountInput.removeAttribute("disabled");
        stocksBuyButton.removeAttribute("disabled");
        stocksSellButton.removeAttribute("disabled");
        //ownedStocksAmount.classList.remove('hidden');
    }
}

function updateStocksTotalValue() {
    stocksRows.forEach(row => {
    if (row.classList.contains('stocks-row-active')) {
        var amount = user.getStockAmount(user.getStockIndexByName(row.getAttribute('name')));
        ownedStocksAmount.innerHTML = 
            `You have ${amount.toFixed(5)}
             (${(amount * broker.findStockByName(row.getAttribute('name')).price).toFixed(2)} 
             <span style=color:var(--text-accent);margin:0;>EUR</span>)`;
    }
    }); 
}


stocksRows.forEach(row => {
    if (!row.isEqualNode(stocksRows[0])) {
        row.addEventListener('click', () => {
            stocksRows.forEach(row2 => {
                if (!row2.isEqualNode(row)) {
                    row2.classList.remove('stocks-row-active');
                }
                disableInputs(true);
            })
            row.classList.toggle('stocks-row-active');
            if (row.classList.contains('stocks-row-active')) {
                stocksBuyText1.textContent = `${row.getAttribute('name')}`;
                stocksSellText1.textContent = `${row.getAttribute('name')}`; 
                /*var amount = user.getStockAmount(user.getStockIndexByName(row.getAttribute('name')));
                ownedStocksAmount.innerHTML = 
                    `You have ${amount.toFixed(5)}
                     (${(amount * broker.findStockByName(row.getAttribute('name')).price).toFixed(2)} 
                     <span style=color:var(--text-accent);margin:0;>EUR</span>)`;*/
                     updateStocksTotalValue();
                disableInputs(false);
            }
        });
    }
});


// buy/sell inputu valdymas, kad ivedus i viena, pasikeistu kitas ir atvirksciai
//buy
stocksBuyStockAmountInput.addEventListener('input', updateBuyStockAmountInput);
stocksBuyStockForInput.addEventListener('input', updateBuyStockForInput);	
// sell
stocksSellStockAmountInput.addEventListener('input', updateSellStockAmountInput);
stocksSellStockForInput.addEventListener('input', updateSellStockForInput);

function updateBuyStockAmountInput() {
    const name = stocksBuyText1.textContent;
    const price = broker.findStockByName(name).price;
    stocksBuyStockForInput.value = (stocksBuyStockAmountInput.value * price).toFixed(2);
}
function updateBuyStockForInput() {    
    const name = stocksBuyText1.textContent;
    const price = broker.findStockByName(name).price;
    stocksBuyStockAmountInput.value = (stocksBuyStockForInput.value / price).toFixed(2);
}
function updateSellStockAmountInput() {
    const name = stocksSellText1.textContent;
    const price = broker.findStockByName(name).price;
    stocksSellStockForInput.value = (stocksSellStockAmountInput.value * price).toFixed(2);
}
function updateSellStockForInput() {
    const name = stocksSellText1.textContent;
    const price = broker.findStockByName(name).price;
    stocksSellStockAmountInput.value = (stocksSellStockForInput.value / price).toFixed(2);
}












// cia pirkimas stocku
stocksBuyButton.addEventListener('click', () => {
    const name = stocksBuyText1.textContent;
    if (user.getBalance() >= stocksBuyStockForInput.value) {
        broker.marketOrderBuy(name,stocksBuyStockForInput.value);
        console.log(`Bought ${name} ${stocksBuyStockAmountInput.value} for ${stocksBuyStockForInput.value} EUR`);
    }
    else {
        console.log(`BALANCE INSUFFICIENT (${user.getBalance()} EUR < ${stocksBuyStockForInput.value})`);
    }
    user.updatePortfolio()
    updateStocksTotalValue();
});
stocksSellButton.addEventListener('click', () => {
    const name = stocksSellText1.textContent;
    if (user.getStockAmount(user.getStockIndexByName(name)) >= stocksSellStockAmountInput.value) {
        broker.marketOrderSell(name,stocksSellStockAmountInput.value);
        console.log(`Sold ${name} ${stocksSellStockAmountInput.value} for ${stocksSellStockForInput.value} EUR`);
    }
    user.updatePortfolio();
    updateStocksTotalValue();
});



//portfolio table
const portfolioTable = document.querySelector('#portfolio-table > tbody');

