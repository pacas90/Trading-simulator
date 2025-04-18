import { User } from "./user.js";
import { Broker } from "./stock.js";
import { GlobalStockList } from "./stock.js";
import { BuyDialog, RecentTransactions} from "./ui.js";
import { Order } from "./stock.js";
import { orderType } from "./stock.js";
import { Option } from "./stock.js";
import { optionType } from "./stock.js";
const user = new User();
const stockList = new GlobalStockList();
const broker = new Broker();


stockList.loadStockInfo();
stockList.updateHistoricalData();

stockList.addStocksFromList();
user.putStocksToPortfolioTable();
user.putLimitOrdersToTable();

const recentTransactions = new RecentTransactions();
window.onload = () => user.realizeOptions();
//OPTIONS TESTAVIMAS - pradzia


//const optionList = broker.generateOptions(stockList.getStock(0).name);
//console.log(optionList);
 //broker.PurchaseOption(optionList[0]);
 //broker.PurchaseOption(optionList[1]);
 //broker.PurchaseOption(optionList[7]);
//user.printUserOptionsToConsole();
//stockList.UpdateStockPrice("AAPL",145);
//user.realizeOptions();
//user.printUserOptionsToConsole();

//OPTION TESTAVIMAS - pabaiga

// pagr. navigacijos buttonai
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
        content[0].scrollTop = 0;
    });
});


// portfolio/stocks table header clickai kad sortintu
const portfolioHeaderRow = document.querySelector('#portfolio-table > tbody > tr[header=true]');
const portfolioCells = portfolioHeaderRow.querySelectorAll('td');
const stocksHeaderRow = document.querySelector('#stocks-table > tbody > tr[header=true]');
const stocksCells = stocksHeaderRow.querySelectorAll('td');
const headerRows = [portfolioHeaderRow, stocksHeaderRow];
const tableTbody = [document.querySelector('#portfolio-table > tbody'), document.querySelector('#stocks-table > tbody')];
const cells = [portfolioCells, stocksCells]; //header cells
const sortArrows = document.querySelectorAll('.table-sort-arrow');

// sort both tables
for (let i = 0; i < cells.length; i++) {
    // for each in each table
    cells[i].forEach(cell => {
        // header cell click event
        cell.addEventListener('click', () => {
            if (cell.hasAttribute('sort')) {
                //arrow change direction
                if (cell.getAttribute('sort') == 'asc') {
                    cell.setAttribute('sort', 'desc');
                    sortArrows[i].classList = 'table-sort-arrow material-symbols-outlined sort-arrow-desc';
                }
                else if (cell.getAttribute('sort') == 'desc') {
                    cell.setAttribute('sort', 'asc');
                    sortArrows[i].classList = 'table-sort-arrow material-symbols-outlined sort-arrow-asc';
                }
            }
            else {
                for(let j = 0; j < cells[i].length; j++) {
                    cells[i][j].removeAttribute('sort');
                    console.log(cells[1][1].textContent);
                }
                cell.setAttribute('sort', 'desc');
                cell.querySelector('div').append(sortArrows[i]);
                sortArrows[i].classList = 'table-sort-arrow material-symbols-outlined sort-arrow-desc';
            }
            user.sortTable(headerRows[i], tableTbody[i]);
        });
    });
}





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





var buyDialog = new BuyDialog();
buyDialog.init();

import { argbFromHex, themeFromSourceColor, applyTheme } from 'https://esm.sh/@material/material-color-utilities';

// Get the theme from a hex color
const theme = themeFromSourceColor(argbFromHex('#6f528a'), [
  {
    name: "custom-1",
    value: argbFromHex("#6f528a"),
    blend: true,
  },
]);


applyTheme(theme, {target: document.body, dark: false});
const lightModeSwitch = document.querySelector('#light-mode-switch');
lightModeSwitch.addEventListener('input', () => {
    if (lightModeSwitch.checked) {
        document.body.classList = '';
        document.body.classList.add('light-theme');
        applyTheme(theme, {target: document.body, dark: false});
    }
    else {
        document.body.classList = '';
        document.body.classList.add('dark-theme');
        applyTheme(theme, {target: document.body, dark: true});
    }
});


import { Curve } from './curve.js';



var myStocks = JSON.parse(localStorage.getItem('stockList'));
var myStocksNames = [];
let prices = [];
for (let j = 0; j < 90; j++) {
    prices[j] = 0;
}
if (myStocks != null) {
for (let i = 0; i < myStocks.length; i++)
    {
        let name = myStocks[i].name;
        let hist = JSON.parse(localStorage.getItem(`${name}_hist`));
        //console.log(hist);
        for (let j = 0; j < 90; j++) 
        {
            prices[j] += parseFloat(hist[j].close)*user.getStockAmount(user.getStockIndexByName(name));
        }
    }
}

//  curve.drawCurve([
//      {x: 0, y: prices[30]}, {x: 1, y: prices[29]}, {x: 2, y: prices[28]}, {x: 3, y: prices[27]}, {x: 4, y: prices[26]},
//      {x: 5, y: prices[25]}, {x: 6, y: prices[24]}, {x: 7, y: prices[23]}, {x: 8, y: prices[22]}, {x: 9, y: prices[21]},
//     {x: 10, y: prices[20]}, {x: 11, y: prices[19]}, {x: 12, y: prices[18]}, {x: 13, y: prices[17]}, {x: 14, y: prices[16]},
//     {x: 15, y: prices[15]}, {x: 16, y: prices[14]}, {x: 17, y: prices[13]}, {x: 18, y: prices[12]}, {x: 19, y: prices[11]},
//     {x: 20, y: prices[10]}, {x: 21, y: prices[9]}, {x: 22, y: prices[8]}, {x: 23, y: prices[7]}, {x: 24, y: prices[6]},
//     {x: 25, y: prices[5]}, {x: 26, y: prices[4]}, {x: 27, y: prices[3]}, {x: 28, y: prices[2]}, {x: 29, y: prices[1]},
//     {x: 30, y: prices[0]}
//   ]
//   );



const todaysChangeValue = document.querySelector('#todays-change-value'); //kiek per siandien pasikeite kainos
const todaysChangePercentage = document.querySelector('#todays-change-percentage'); //tas pats, tik procentais

let change = prices[0]-prices[1];
let changeColor = change < 0 ? "var(--text-red)" : "var(--text-green)";
todaysChangeValue.innerHTML = `${change.toFixed(2)} USD`;
todaysChangeValue.style.color = changeColor;

let changePercentage = ((prices[0] - prices[1]) / prices[0]) * 100;
todaysChangePercentage.innerHTML = `(${changePercentage.toFixed(2)}%)`;
todaysChangePercentage.style.color = changeColor;






//                  width; height;  curve color;       grid color;  area below curve colour;    container
// var buyCurve = new Curve(600,300,document.querySelector('#buy-curve-wrapper'));

// buyCurve.drawCurve(
//     prices.slice(0, 31).map((price, index) => ({ x: 30 - index, y: Math.round(price) }))
//   );






const curveContainer = document.querySelector('#dashboard-graph-container > .curve-wrapper');

var curve = new Curve(600,300, curveContainer);


// pagrindinis grafikas, laiko pasirinkimas

curve.drawCurve(
    prices.slice(0, 30).map((price, index) => ({ x: 30 - index, y: Math.round(price) }))
);

const timeChips = document.querySelectorAll('#main-graph-time-chips > md-filter-chip');
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
        curve.clear();
        curve.drawCurve(
            prices.slice(0, time).map((price, index) => ({ x: time - index, y: Math.round(price) }))
        );
        
    });
}
