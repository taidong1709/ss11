let $ = (...x) => document.querySelector(...x);
/** @type {HTMLUListElement} */
const coffeeList = $("#coffee-list");
/** @type {HTMLFormElement} */
const addForm = $("form#add-coffee-form");

(async () => {
    let renderCoffeeShops = item => {
        let data = item.data();
    
        let li = coffeeList.appendChild(document.createElement("li"));
        li.setAttribute("data-id", item.id);
    
        let name = li.appendChild(document.createElement("span"));
        let city = li.appendChild(document.createElement("span"));
        let deleteBtn = li.appendChild(document.createElement("div"));
    
        name.innerText = data.name;
        city.innerText = data.city;
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.float = "right";
        deleteBtn.style.width = "16px";
        deleteBtn.style.marginTop = "-40px";
        deleteBtn.style.marginRight = "12px";
        deleteBtn.innerText = "❌";
        deleteBtn.addEventListener("click", async () => {
            await db.collection("coffee").doc(item.id).delete();
            await render();
        });
    };

    addForm.addEventListener("submit", async e => {
        e.preventDefault();

        if (addForm.cfname.value && addForm.cfcity.value) {
            await db.collection("coffee").add({
                name: addForm.cfname.value.trim(),
                city: addForm.cfcity.value.trim()
            });

            addForm.cfname.value = "";
            addForm.cfcity.value = "";
        }
        await render();
    });

    async function render() {
        let cf = await db.collection("coffee").get();
        [...coffeeList.children].forEach(e => coffeeList.removeChild(e));
        for (let item of cf.docs) {
            renderCoffeeShops(item);
        }
    }

    render();
})()