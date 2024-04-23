const listingItems = document.querySelectorAll(".listing-item");

// grabbing yen value
listingItems.forEach(item => {
    const regex = /¥\d{1,3}(?:,\d{3})*(?!\d)/g;
    const yenUnformatted = item.textContent.match(regex);

    if (yenUnformatted) {
        yenUnformatted.forEach((price) => {
            const price_in_number = convertStringToNumber(price)
            const usd_price_string = "$" + convertYentoUSD(price_in_number)

            console.log("YEN: " + price_in_number + "\nUSD: " + usd_price_string)
        
            const new_price = document.createElement("p");
            new_price.style.color = '#555'; // dark gray text color
            new_price.style.marginTop = '0.5em'; // space above the price
            new_price.style.fontWeight = 'bold'; // make text bold
            new_price.classList.add('usd-amount');

            new_price.textContent = `USD: ${usd_price_string}`;
            item.appendChild(new_price);
        })
    }
});

function convertStringToNumber(str) {
    // Remove non-numeric characters except for the decimal point
    var cleanedString = str.replace(/[^\d.-]/g, '');
    // Convert the cleaned string to a number
    var number = parseFloat(cleanedString);
    return number;
}

// convert number (yen) to usd (string), # -> # -> "$#"

function convertYentoUSD(price_in_number) {
    // 1 YEN worth 0.0065 USD, based on the Apr. 17, 2024 13:0:0 exchange rate from openexchangerates.org.
    price_in_number = price_in_number * 0.0065
    return price_in_number.toLocaleString()
}