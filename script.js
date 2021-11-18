const searchInput = document.querySelector("input");
const table = document.querySelector("table");
let countries = [];

// this function expects to recieve an object which includes
// the 4 params that will be destructured on the spot
const updateGlobalData = ({TotalDeaths, TotalConfirmed, NewDeaths, NewConfirmed}) => {
    document.querySelector("#gct").textContent = TotalConfirmed.toLocaleString("en-US")
    document.querySelector("#gcd").textContent = NewConfirmed.toLocaleString("en-US")
    document.querySelector("#gdt").textContent = TotalDeaths.toLocaleString("en-US")
    document.querySelector("#gdd").textContent = NewDeaths.toLocaleString("en-US")
}

const displayCountriesTable = () => {
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>Country</th>
                <th>Daily Cases</th>
                <th>Total Cases</th>
                <th>Daily Deaths</th>
                <th>Total Deaths</th>
            </tr>
        </thead>`;

    // filter will return all the countries which include whatever is in the input value.
    // let filteredCountries = countries.filter(country => country.Country.includes(searchInput.value))
    // without case-sensitivity:
    let filteredCountries = countries.filter(country => {
            return country.Country.toLowerCase().includes(searchInput.value.toLowerCase())
        })
    if (!filteredCountries.length) {
        table.innerHTML += `
        <tr>
            <th>No results found. ☹️</th>
        </tr>`;
        return
    }

    for (const country of filteredCountries) {
        // .toLocaleString("en-US") converts number to str number with commas
        table.innerHTML += `
            <tr>
                <td>${country.Country.toLocaleString("en-US")}</td>
                <td>${country.NewConfirmed.toLocaleString("en-US")}</td>
                <td>${country.TotalConfirmed.toLocaleString("en-US")}</td>
                <td>${country.NewDeaths.toLocaleString("en-US")}</td>
                <td>${country.TotalDeaths.toLocaleString("en-US")}</td>
            </tr>`;
    }
}

const getData = async()  => {
    try {
        const res = await fetch("https://api.covid19api.com/summary");
        const data = await res.json();
        countries = data.Countries
        updateGlobalData(data.Global);
        displayCountriesTable();
    } catch (error) {
        console.warn(error)
    }
}

searchInput.addEventListener("input", displayCountriesTable);

getData();