import { User } from "./user.js";
import { Watchlist } from "./user.js";
import { Challenge } from "./user.js";
import { Broker } from "./stock.js";
import { GlobalStockList } from "./stock.js";
import { BuyDialog, RecentTransactions} from "./ui.js";
import { Order } from "./stock.js";
import { orderType } from "./stock.js";
import { Option } from "./stock.js";
import { optionType } from "./stock.js";
import { Notifications } from "./snackbar.js";
const user = new User();
const stockList = new GlobalStockList();
const broker = new Broker();
const watchList = new Watchlist();


stockList.loadStockInfo();
user.checkForLimitUpdate();
stockList.updateHistoricalData();

stockList.addStocksFromList();
user.putStocksToPortfolioTable();
user.putLimitOrdersToTable();

const recentTransactions = new RecentTransactions();
window.onload = () => user.realizeOptions();
window.onload = () => broker.UpdateLimitOrders();
window.onload = () => user.chargeDailyShortPremiums();


//setInterval(() => this.fetchStockInfo(), 65000);
watchList.comparePrices();
setInterval(() => watchList.comparePrices(), 300000);


//OPTIONS TESTAVIMAS - pradzia
//user.addBalance(20);

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
const navButtons = document.querySelectorAll('.nav-bar-buttons:not([value="daily-info"])'); //navigacijos mygtukai
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
        //watchList.comparePrices();
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

const dailyTradeLimitSlider = document.querySelector("#trade-limit-slider");
const tradeLimitValueText = document.querySelector("#trade-limit-value");

window.onload = () => {
    if (localStorage.getItem("dailyTradeLimit") != null) {
        if (localStorage.getItem("dailyTradeLimit") == "1000") {
            dailyTradeLimitSlider.value = 1000;
            tradeLimitValueText.textContent = "UNLIMITED";
            dailyTradeLimitSlider.valueLabel = "INF";
        }
        else {
            dailyTradeLimitSlider.value = localStorage.getItem("dailyTradeLimit");
            tradeLimitValueText.textContent = dailyTradeLimitSlider.value;
        }
    }
    tradeLimitValueText.textContent = dailyTradeLimitSlider.value;
};

dailyTradeLimitSlider.addEventListener('input', () => {
    localStorage.setItem("dailyTradeLimit", dailyTradeLimitSlider.value);
    tradeLimitValueText.textContent = dailyTradeLimitSlider.value;
    if (dailyTradeLimitSlider.value == 1000) {
        tradeLimitValueText.textContent = "UNLIMITED";
        dailyTradeLimitSlider.valueLabel = "INF";
    }
    else {
        dailyTradeLimitSlider.valueLabel = dailyTradeLimitSlider.value;
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
        let Name = myStocks[i].name;
        let Hist = JSON.parse(localStorage.getItem(`${Name}_hist`));
        //console.log(hist);
        for (let j = 0; j < 90; j++) 
        {
            prices[j] += parseFloat(Hist[j].close)*user.getStockAmount(user.getStockIndexByName(Name));
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


document.querySelector('.nav-bar-buttons[value="daily-info"]').addEventListener("click", () => {
    if (localStorage.getItem("stockList") != '[]') {
        console.log(localStorage.getItem("stockList"));
        user.generateDailyReport(change);
        document.querySelector("#daily-info-dialog").show();
    }
    else {
        var notif = new Notifications({
            icon: "priority_high",
            text: `<p>You have no stocks.</p>`,
        });
        notif.show();
    }
});
// window.onload = () => document.querySelector('.nav-bar-buttons[value="daily-info"]').click();


//                  width; height;  curve color;       grid color;  area below curve colour;    container
// var buyCurve = new Curve(600,300,document.querySelector('#buy-curve-wrapper'));

// buyCurve.drawCurve(
//     prices.slice(0, 31).map((price, index) => ({ x: 30 - index, y: Math.round(price) }))
//   );





const curveContainer = document.querySelector('#dashboard-graph-container > .curve-wrapper');

var curve = new Curve(600,300, curveContainer);


function generatePoints(n) {
  if (n < 2) throw new Error("n must be at least 2");
  const points = [];
  points.push({ x: 1, y: 0 });
  for (let i = 2; i < n; i++) {
    points.push({ x: i, y: 1 });
  }
  points.push({ x: n, y: 2 });
  return points;
}


// musu famous kreives 80+ errors bug fix --------------------------
const stocksLS = JSON.parse(localStorage.getItem("stockList"));
if (!stocksLS || stocksLS == '') {
    // curve.drawCurve([
    //     {x: 1, y: 1},
    //     {x: 2, y: 0},
    //     {x: 3, y: 0},
    //     {x: 4, y: 1}
    // ]);
    const points = 
    curve.drawCurve(
       generatePoints(1400)
    );
} 
else {
    curve.drawCurve(
        prices.slice(0, 30).map((price, index) => ({ x: 30 - index, y: Math.round(price) }))
    );
    // pagrindinis grafikas, laiko pasirinkimas
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


}


// watchList.findIndex("AAPL") == -1 ? watchList.Add("AAPL") : null;



document.querySelector('.nav-bar-buttons[value="challenges"]').addEventListener("click", () => {
    user.setUpdateChallenge(3, user.totalVal);
    user.setUpdateChallenge(4, user.totalVal);
    user.setUpdateChallenge(5, user.totalVal);
    console.log(user.totalVal);
    user.putChallengesToTable();
});