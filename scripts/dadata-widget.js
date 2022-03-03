import fields from './fields.js'

class DadataWidget extends HTMLElement{
    constructor() {
        super();
        this.searchResults = null;
        this.query = null;
        this.inputList = [];
        this.isLoading = false;
        this.apiUrl = this.getAttribute("apiUrl") || "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
        this.token = this.getAttribute("token") || "2691faa57672075492c50f83678c714c316021b2";
        this.title = this.getAttribute("title") || "Dadata.ru";
        this.width = this.getAttribute("width") || "500px";
        this.height = this.getAttribute("height") || "auto";
    }

    connectedCallback(){
        this.style = `min-width:min(100%,${this.width});width:min(100%,${this.width});height:${this.height};`;
        const title = document.createElement('div');
        title.classList.add("dadata-widget__title");
        title.innerHTML = this.title;
        this.appendChild(title);
        const form = this.initForm();
        this.appendChild(form);
    }
   
    /**
     * Инициализация формы
    */
    initForm(){        
        const form = document.createElement('form');        
        form.classList.add("dadata-widget__form");
        form.setAttribute("name", "dadata");
        fields.forEach(field => {

            const fieldBody = document.createElement('div');
            fieldBody.classList.add("dadata-widget__form_field");

            const fieldInput = document.createElement('input');
            fieldInput.classList.add("dadata-widget__form_input");
            fieldInput.id = `dadata_${field.name}`;
            fieldInput.setAttribute("type", field.type);
            fieldInput.setAttribute("name", field.name);
            fieldInput.setAttribute("placeholder", field.placeholder);
            this.inputList.push(fieldInput);

            const fieldLabel = document.createElement('label');
            fieldLabel.innerText = field.label;
            fieldLabel.classList.add("dadata-widget__form_label");
            fieldLabel.setAttribute("for", `dadata_${field.name}`);

            fieldBody.appendChild(fieldLabel);
            fieldBody.appendChild(fieldInput);
            if(field.name === "query"){
                fieldInput.addEventListener("input", this.search.bind(this));
                this.query = fieldInput;                
                this.searchResults = document.createElement('div');
                this.searchResults.id = "search_results";
                fieldBody.appendChild(this.searchResults);
            }
            form.appendChild(fieldBody);
        });      
        return form;
    }

    /**
     * Обработка ошибок запроса к серверу api
     */
    handleSearchError(error){
        console.log("error:", error);
        this.isLoading = false;               
        this.updateSerachResults();
    }

    /**
     * обработка успешного ответа запроса к серверу api
     */
    handleSearchSuccess(result){
        const data = result.suggestions.map(suggestion => {
            const fieldData = {};
            fields.forEach(field => {
                fieldData[field.name] = field.getDataFromSuggestion(suggestion);
            });
            return fieldData;
        })
        this.isLoading = false;               
        this.updateSerachResults(data);
    }

    /**
     * обновление списка найденых по запросу данных
     */
    updateSerachResults(suggestionsData){
        if(!this.searchResults) return;
        this.searchResults.innerHTML = "";
        if(suggestionsData){
            suggestionsData.forEach(suggestion => {
                const suggestionElement = document.createElement("div");
                suggestionElement.suggestion = suggestion;
                suggestionElement.classList.add("dadata-widget__form_serch-result");
                suggestionElement.innerText = suggestion.query;
                suggestionElement.addEventListener("click", this.selectSuggestion.bind(this));
                this.searchResults.appendChild(suggestionElement);
            });
            
        }
        this.searchResults.style.display = suggestionsData ? "block" : "none";
    }

    /**
     * запрос к серверу апи для получения списка организаций согласно введенных данных
     */
    async search(e){
        if(this.query.value){
            if(this.isLoading) return;
            const options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + this.token
                },
                body: JSON.stringify({query: this.query.value})
            }
            this.isLoading = true;
            fetch(this.apiUrl, options)          
                .then(response => response.json())
                    .then(this.handleSearchSuccess.bind(this))
                .catch(this.handleSearchError.bind(this));
        }else           
            this.updateSerachResults();
    }
    
    /**
     * действи при клике на конкретной организации из списка результатов поиска
     */
    selectSuggestion(e){
        for (const key in e.target.suggestion) {
            const el = this.querySelector(`#dadata_${key}`);
            if(el){
                if(key === "query"){
                    el.value = "";
                    const event = new Event("input");
                    el.dispatchEvent(event); 
                }else 
                    el.value = e.target.suggestion[key] 
            }
        }
    }
}
customElements.define("dadata-widget", DadataWidget);