function convertStringToNumber(str) {
    // Remove non-numeric characters except for the decimal point
    var cleanedString = str.replace(/[^\d.-]/g, '');
    // Convert the cleaned string to a number
    var number = parseFloat(cleanedString);
    return number;
}


function convertYentoUSD(price_in_number) {
    // 1 YEN worth 0.0065 USD, based on the Apr. 17, 2024 13:0:0 exchange rate from openexchangerates.org.
    price_in_number = price_in_number * 0.0065
    return price_in_number.toLocaleString()
}

function replaceTextWithConversion(originalText) {
    // this may be where need fix of "2000 yen" working, may need to just may regex allow this.
    const regex = /¥\d+(?:,\d{3})*\b/g;
    let modifiedText = originalText;
    let match;

    while ((match = regex.exec(originalText)) !== null) {
        const yenAmount = convertStringToNumber(match[0]);
        const usdAmount = "$" + convertYentoUSD(yenAmount);
        modifiedText = modifiedText.replace(match[0], match[0] + ` <strong>(${usdAmount} USD)</strong>`);
    }

    return modifiedText;
}

function convertAllYenToUSD() {
    const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let nodesToConvert = [];

    while(textNodes.nextNode()) {
        let current = textNodes.currentNode;
        if (current.nodeValue.match(/¥\d+(?:,\d{3})*\b/) || current.nodeValue.match(/\b\d{1,3}(?:,\d{3})*\s*yen\b/i)) {
            nodesToConvert.push(current);
        }
    }

    nodesToConvert.forEach(node => {
        const newContent = replaceTextWithConversion(node.nodeValue);
        if (newContent !== node.nodeValue) {
            const newSpan = document.createElement('span');
            newSpan.innerHTML = newContent;
            node.parentNode.replaceChild(newSpan, node);
        }
    });
}

convertAllYenToUSD();