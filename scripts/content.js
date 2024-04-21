///////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)

// Copyright (c) freecurrencyapi.com <dominik@everapi.com>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
class Freecurrencyapi {
  baseUrl = "https://api.freecurrencyapi.com/v1/";

  constructor(apiKey = "") {
    this.headers = {
      apikey: apiKey,
    };
  }

  call(endpoint, params = {}) {
    const paramString = new URLSearchParams({
      ...params,
    }).toString();

    return fetch(`${this.baseUrl}${endpoint}?${paramString}`, { headers: this.headers })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  status() {
    return this.call("status");
  }

  currencies(params) {
    return this.call("currencies", params);
  }

  latest(params) {
    return this.call("latest", params);
  }

  historical(params) {
    return this.call("historical", params);
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////

let exchangeRate, wantedCurrency, currentCurrency, formatter, apiKey;

async function fetchAndSetExchangeRate() {
  if (apiKey !== undefined) {
    const freecurrencyapi = new Freecurrencyapi(apiKey);
    return freecurrencyapi
      .latest({
        base_currency: "USD",
      })
      .then((response) => {
        if (response["data"] !== undefined) {
          chrome.storage.local.set({ rateData: { date: Date.now(), rates: response["data"] } });
          return 1 / response["data"][currentCurrency];
        }
      });
  }
}

async function retrieveLocalExchangeRate() {
  return new Promise((resolve) => {
    chrome.storage.local.get("rateData", async function (data) {
      if (data.rateData !== undefined) {
        var monthSec = 2629800;
        if (data.rateData["date"] + monthSec > Date.now()) {
          let USDToWanted = data.rateData["rates"][wantedCurrency] / data.rateData["rates"]["USD"];
          resolve(USDToWanted / data.rateData["rates"][currentCurrency]);
        } else {
          const rate = await fetchAndSetExchangeRate();
          resolve(rate);
        }
      } else {
        const rate = await fetchAndSetExchangeRate();
        resolve(rate);
      }
    });
  });
}

async function getLocalStorage() {
  chrome.storage.local.get(["currentCurrency", "desiredCurrency", "apiKey"], function (data) {
    currentCurrency = data.currentCurrency !== undefined ? data.currentCurrency : "JPY";
    wantedCurrency = data.desiredCurrency !== undefined ? data.desiredCurrency : "USD";
    apiKey = data.apiKey;

    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: wantedCurrency,
    });
    if (apiKey !== undefined) {
      main();
    }
  });
}

async function main() {
  exchangeRate = await retrieveLocalExchangeRate();
  convertAllYenToUSD();
}

function convertStringToNumber(str) {
  // Remove non-numeric characters except for the decimal point
  var cleanedString = str.replace(/[^\d.-]/g, "");
  // Convert the cleaned string to a number
  var number = parseFloat(cleanedString);
  return number;
}

function convertYentoUSD(price_in_number) {
  price_in_number = price_in_number * exchangeRate;
  return formatter.format(price_in_number).toLocaleString();
}

function replaceTextWithConversion(originalText) {
  // this may be where need fix of "2000 yen" working, may need to just may regex allow this.
  const regex = /¥\d+(?:,\d{3})*\b/g;
  let modifiedText = originalText;
  let match;
  while ((match = regex.exec(originalText)) !== null) {
    const yenAmount = convertStringToNumber(match[0]);
    const usdAmount = "~" + convertYentoUSD(yenAmount);
    modifiedText = modifiedText.replace(match[0], match[0] + ` <strong>(${usdAmount} USD)</strong>`);
  }

  return modifiedText;
}

function convertAllYenToUSD() {
  const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let nodesToConvert = [];

  while (textNodes.nextNode()) {
    let current = textNodes.currentNode;
    if (current.nodeValue.match(/¥\d+(?:,\d{3})*\b/) || current.nodeValue.match(/\b\d{1,3}(?:,\d{3})*\s*yen\b/i)) {
      nodesToConvert.push(current);
    }
  }

  nodesToConvert.forEach((node) => {
    const newContent = replaceTextWithConversion(node.nodeValue);
    if (newContent !== node.nodeValue) {
      const newSpan = document.createElement("span");
      newSpan.innerHTML = newContent;
      node.parentNode.replaceChild(newSpan, node);
    }
  });
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.desiredCurrency !== undefined) {
    wantedCurrency = request.desiredCurrency;
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: wantedCurrency,
    });
    chrome.storage.local.set({ desiredCurrency: wantedCurrency });
  }
  location.reload();
});

chrome.runtime.onMessage.addListener(function (request) {
  if (request.currentCurrency !== undefined) {
    currentCurrency = request.currentCurrency;
    chrome.storage.local.set({ currentCurrency: currentCurrency });
  }
  location.reload();
});

chrome.runtime.onMessage.addListener(function (request) {
  if (request.apiKey !== undefined) {
    apiKey = request.apiKey;
    chrome.storage.local.set({ apiKey: apiKey });
  }
  location.reload();
});

getLocalStorage();
