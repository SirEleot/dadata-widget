import fields from './fields.js'

class DadataWidget extends HTMLElement{
    constructor() {
        super();
        this.searchResults = [];
        this.isLoading = false;
        this.query = "";
        this.apiUrl = this.getAttribute("apiUrl") || "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
        this.token = this.getAttribute("token") || "2691faa57672075492c50f83678c714c316021b2";
        this.title = this.getAttribute("title") || "Dadata.ru";
        this.width = this.getAttribute("width") || "500px";
        this.height = this.getAttribute("height") || "auto";
    }

    connectedCallback(){
        this.style = `min-width:min(100%,${this.width});width:min(100%,${this.width});height:${this.height};`;
        this.innerHTML = `
            <div class="dadata-widget__title">${this.title}</div>
            <form class="dadata-widget__form" name="dadata">
                ${this.parseFields()}              
            </form>
        `;
        const query = this.querySelector("[name='query']");
        if(query) {
            query.addEventListener("input", this.search.bind(this));
        }
        this.addEventListener("click", this.selectSuggestion.bind(this));
    }
   
    parseFields(){
        return fields.reduce((previous, current)=>{
            let result =  previous + `
                <div class="dadata-widget__form_field">
                    <label for="dadata_${current.name}" class="dadata-widget__form_label">${current.label}</label> <br>
                    <input type="${current.type}" name="${current.name}" id="dadata_${current.name}"  class="dadata-widget__form_input" placeholder="${current.placeholder}">
            `
            if(current.name === "query"){
                result += `<div id="search_results"></div>`;
            }
            result += "</div>";
            return result;
        }, "");
    }

    handleSearchError(error){
        console.log("error:", error);
        this.isLoading = false;               
        this.updateSerachResults();
    }
    handleSearchSuccess(result){
        this.searchResults = result.suggestions.map(suggestion => {
            const fieldData = {};
            fields.forEach(field => {
                fieldData[field.name] = field.getDataFromSuggestion(suggestion);
            });
            return fieldData;
        })
        this.isLoading = false;               
        this.updateSerachResults();
    }
    updateSerachResults(){
        const serchResults = this.querySelector("#search_results");
        let html = "";
        if(this.searchResults.length > 0){
            this.searchResults.forEach(result => {
                html += `<div class="dadata-widget__form_serch-result" name="search_result">${result.query}</div>`
            });
        }
        serchResults.style.display = html ? "block" : "none";
        
        serchResults.innerHTML = html;
    }
    async search(e){
        this.query = e.target.value;
        if(this.query){
            if(this.isLoading) return;
            const options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + this.token
                },
                body: JSON.stringify({query: this.query})
            }
            this.isLoading = true;
            fetch(this.apiUrl, options)          
                .then(response => response.json())
                    .then(this.handleSearchSuccess.bind(this))
                .catch(this.handleSearchError.bind(this));
        }else {
            this.searchResults = [];            
            this.updateSerachResults();
        }
    }
    
    selectSuggestion(e){        
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if(el.getAttribute("name") === "search_result"){           
            const selected = this.searchResults.find(result=>result.query == el.innerHTML);
            fields.forEach(field => {
                const input = this.querySelector(`[name="${field.name}"]`)
                if(field.name === "query"){
                    input.value = "";
                    let event = new Event("input");
                    input.dispatchEvent(event);
                }else
                    input.value = selected[field.name];
            });
        }
    }
}
customElements.define("dadata-widget", DadataWidget);