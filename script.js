const HTML = document.documentElement;
const themeToggleBtn = document.querySelector("#themeToggleBtn");
const searchInput = document.querySelector("input");
const table = document.querySelector("table");
const refreshApiBtn = document.querySelector("#refreshApiBtn")
const sortInput = document.querySelector("#sort-select");
let countries = [];

// this function expects to recieve an object that includes the 4 params which will be destructured on the spot
const updateGlobalData = ({TotalDeaths, TotalConfirmed, NewDeaths, NewConfirmed}) => {
    document.querySelector("#gct").textContent = TotalConfirmed.toLocaleString("en-US");
    document.querySelector("#gcd").textContent = NewConfirmed.toLocaleString("en-US");
    document.querySelector("#gdt").textContent = TotalDeaths.toLocaleString("en-US");
    document.querySelector("#gdd").textContent = NewDeaths.toLocaleString("en-US");
}

// mutates the given array
function sortOrder(array) {
    if (sortInput.value === "cba") {
        array.sort((a, b) => {
            if (a.Country.toUpperCase() > b.Country.toUpperCase()) { return -1; }
            if (a.Country.toUpperCase() < b.Country.toUpperCase()) { return 1; }
            return 0;
        });
    } else if (sortInput.value === "c123") {
        array.sort((a, b) => {
            return a.TotalConfirmed - b.TotalConfirmed;
        });
    } else if (sortInput.value === "c321") {
        array.sort((a, b) => {
            return b.TotalConfirmed - a.TotalConfirmed;
        });
    } else if (sortInput.value === "d123") {
        array.sort((a, b) => {
            return a.TotalDeaths - b.TotalDeaths;
        });
    } else if (sortInput.value === "d321") {
        array.sort((a, b) => {
            return b.TotalDeaths - a.TotalDeaths;
        });
    } else {
        console.log("input has wierd value")
    }
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
    let filteredCountries = countries.filter(country => {
            return country.Country.toLowerCase().includes(searchInput.value.toLowerCase());
        })

    if (!filteredCountries.length) {
        table.innerHTML += `
        <tr>
            <th>No results found. 🙁</th>
        </tr>`;
        return;
    }

    if (sortInput.value != "abc") {
        sortOrder(filteredCountries);
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
        document.querySelector("#gct").textContent = "Loading...";
        document.querySelector("#gcd").textContent = "Loading...";
        document.querySelector("#gdt").textContent = "Loading...";
        document.querySelector("#gdd").textContent = "Loading...";
        table.innerHTML = `
            <tr>
                <th>Loading...</th>
            </tr>`;
        const res = await fetch("https://api.covid19api.com/summary");
        const data = await res.json();
        countries = data.Countries;
        updateGlobalData(data.Global);
        displayCountriesTable();
    } catch (error) {
        console.warn(error);
        document.querySelector("#gct").textContent = "Could not fetch data."
        document.querySelector("#gcd").textContent = "Could not fetch data.";
        document.querySelector("#gdt").textContent = "Could not fetch data.";
        document.querySelector("#gdd").textContent = "Could not fetch data.";
        table.innerHTML = `
            <tr>
                <th>Could not fetch data.</th>
            </tr>`;
    }
}



// darkMode button
themeToggleBtn.addEventListener("click", () => {
    HTML.classList.toggle("dark-mode");
    if (themeToggleBtn.innerText == "Dark Mode") {
        themeToggleBtn.innerText = "Light Mode";
    } else {
        themeToggleBtn.innerText = "Dark Mode";
    }
})

searchInput.addEventListener("input", displayCountriesTable);
sortInput.addEventListener("change", displayCountriesTable)
refreshApiBtn.addEventListener("click", getData);

getData();