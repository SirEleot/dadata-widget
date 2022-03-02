class Field{
    constructor(label, name, type, placeholder, dataParser) {
        this.label = label;
        this.name = name;
        this.type = type;
        this.placeholder = placeholder;
        this.getDataFromSuggestion = dataParser;
    }
}

export default [
    new Field("Компания или ИП", "query", "text", "Введите название, ИНН, ОГРН или адресс организации", suggestion=>suggestion.value),    
    new Field("Краткое наименование", "shortName", "text", "", suggestion=>suggestion.data.name.short),    
    new Field("Полное наименование", "fullName", "text", "", suggestion=>suggestion.data.name.full),    
    new Field("ИНН/КПП", "inn", "text", "", suggestion=>suggestion.data.inn),    
    new Field("Адресс", "address", "text", "", suggestion=>suggestion.data.address.value)   
]