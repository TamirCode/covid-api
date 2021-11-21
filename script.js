// Dark mode set up before DOM loads
const HTML = document.documentElement;
const toggleThemeBtn = document.createElement("button");

if (localStorage.getItem("isDark") === null) {
    localStorage.setItem("isDark", "false");
	toggleThemeBtn.innerText = "Dark Mode"
} else if (localStorage.getItem("isDark") == "true") {
	HTML.classList.toggle("dark-mode");
	toggleThemeBtn.innerText = "Light Mode"
} else {
	toggleThemeBtn.innerText = "Dark Mode"
}

toggleThemeBtn.addEventListener("click", () => {
    HTML.classList.toggle("dark-mode");
	if (localStorage.getItem("isDark") == "false") {
		localStorage.setItem("isDark", "true");
		toggleThemeBtn.innerText = "Light Mode"
	} else {
		localStorage.setItem("isDark", "false");
		toggleThemeBtn.innerText = "Dark Mode"
	}
});

window.addEventListener('DOMContentLoaded', () => {

    // dark mode button (high priority)
    document.querySelector(".search-container").append(toggleThemeBtn);

    const searchInput = document.querySelector("input");
    const table = document.querySelector("table");
    const refreshApiBtn = document.querySelector("#refreshApiBtn")
    const sortInput = document.querySelector("#sort-select");
    let countries = [];
    let lastRefreshedApiDate;
        
        // this function expects to recieve an object that includes the 4 params which will be destructured on the spot
    function updateGlobalData({TotalDeaths, TotalConfirmed, NewDeaths, NewConfirmed}) {
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

    function renderTable() {
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th onclick="sortByCountriesTH()">Country</th>
                    <th>Daily Cases</th>
                    <th onclick="sortByCasesTH()">Total Cases</th>
                    <th>Daily Deaths</th>
                    <th onclick="sortByDeathsTH()">Total Deaths</th>
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

    async function fetchData() {
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
            renderTable();
            lastRefreshedApiDate = new Date();
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

    function sortByCountriesTH() {
        if (sortInput.value === "abc") {
            sortInput.value = "cba";
        } else {
            sortInput.value = "abc"
        }
        renderTable()
    }

    function sortByCasesTH() {
        if (sortInput.value === "c321") {
            sortInput.value = "c123";
        } else {
            sortInput.value = "c321"
        }
        renderTable()
    }

    function sortByDeathsTH() {
        if (sortInput.value === "d321") {
            sortInput.value = "d123";
        } else {
            sortInput.value = "d321"
        }
        renderTable()
    }

    function timePassedSinceFetch(miliseconds) {
        let tooltip = refreshApiBtn.firstElementChild;
        msPassed = new Date(miliseconds);
        if (msPassed < 1000) {
            tooltip.innerText = "Last refreshed: now.";
            return;
        }
        // 24 hours = 86400000 miliseconds
        if (msPassed < 86400000) {
            if (msPassed.getUTCHours() == 0) {
                if (msPassed.getMinutes() == 0) {
                    tooltip.innerText = `Last refreshed: ${msPassed.getUTCSeconds()} sec ago.`;
                } else {
                    tooltip.innerText = `Last refreshed: ${msPassed.getUTCMinutes()} min ago.`;
                }
            } else {
                tooltip.innerText = `Last refreshed: ${msPassed.getUTCHours()} hours ago.`;
            }
        } else {
            tooltip.innerText = "Last refreshed: over 24 hours ago.";
        }
    }


    searchInput.addEventListener("input", renderTable);
    sortInput.addEventListener("change", renderTable)
    refreshApiBtn.addEventListener("click", fetchData);
    refreshApiBtn.addEventListener("mouseover", () => {
        timePassedSinceFetch(Math.abs((new Date()) - lastRefreshedApiDate)) // passes the difference in miliseconds (now - last).
    })
    
    fetchData();


});