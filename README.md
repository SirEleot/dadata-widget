# dadata-widget
Добавление на сайт:
1. Добавить перед закрывающим тегом </body> слкдущее:
```html
  <link rel="stylesheet" href="https://dadata.uniq-rp.com/styles/style.css>
  <script src="https://dadata.uniq-rp.com/scripts/dadata-widget.bandle.js"></script>
```
2. Добавьте виджет на страницу
```html
  <dadata-widget />
```
Параметры:

apiUrl - адресс api. default: https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party 

token - токен доступа default: 2691faa57672075492c50f83678c714c316021b2 

title - заголовок default: Dadata.ru 

width - шрина default: 500px 

height - высота default: auto 
