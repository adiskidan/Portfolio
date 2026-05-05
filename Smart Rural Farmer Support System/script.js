// ----- FARMER REGISTRATION -----
let farmers = [];
const form = document.getElementById("farmerForm");
const farmerContainer = document.getElementById("farmers");

form.addEventListener("submit", function(e){
    e.preventDefault();
    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;
    const crop = document.getElementById("crop").value;
    const land = document.getElementById("land").value;

    const farmer = { name, location, crop, land };
    farmers.push(farmer);
    displayFarmers();
    form.reset();
});

function displayFarmers(){
    farmerContainer.innerHTML = "";
    farmers.forEach(farmer => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `<h4>${farmer.name}</h4>
                         <p>Location: ${farmer.location}</p>
                         <p>Crop: ${farmer.crop}</p>
                         <p>Land: ${farmer.land} hectares</p>`;
        farmerContainer.appendChild(div);
    });
}

// ----- MARKET PRICE LIST -----
const marketPrices = [
    { crop: "Wheat", price: "$200/ton" },
    { crop: "Maize", price: "$150/ton" },
    { crop: "Rice", price: "$250/ton" },
    { crop: "Barley", price: "$180/ton" }
];

function displayMarketPrices(){
    const priceList = document.getElementById("priceList");
    priceList.innerHTML = "";
    marketPrices.forEach(item => {
        const div = document.createElement("div");
        div.className = "card card-price";
        div.innerHTML = `<h4>${item.crop}</h4>
                         <p>Price: ${item.price}</p>`;
        priceList.appendChild(div);
    });
}
displayMarketPrices();

// ----- EXPENSE & PROFIT CALCULATOR -----
const expenseForm = document.getElementById("expenseForm");
expenseForm.addEventListener("submit", function(e){
    e.preventDefault();
    const seed = parseFloat(document.getElementById("seed").value);
    const fertilizer = parseFloat(document.getElementById("fertilizer").value);
    const labor = parseFloat(document.getElementById("labor").value);
    const income = parseFloat(document.getElementById("income").value);

    const profit = income - (seed + fertilizer + labor);
    document.getElementById("profitOutput").textContent = `Your Profit: $${profit}`;
    expenseForm.reset();
});

// ----- SCROLL TO SECTION -----
function scrollToSection(id){
    document.getElementById(id).scrollIntoView({behavior: "smooth"});
}

// ----- ACTIVE LINK HIGHLIGHT -----
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav ul li a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 60;
        if(pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if(link.getAttribute("href") === "#" + current){
            link.classList.add("active");
        }
    });
});