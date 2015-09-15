# shriek
Yet another chat

# Build workflow (short)
1. npm install
2. gulp

# Development workflow

## Собрать проект и смотреть на изменения sass файлов и jsx файлов фронта
gulp

## Стартовать ноду
node .

# Files structure
* app — основное приложение
  * assets
    * css — файлы, которые получились от склеивания файлов в modules, потом попадают в public/assets/css
      * modules — файлы sass для модулей
    * js — основной файл фронта, гкуда объявляются все инклуды
  * components — внешние компоненты (включено в gitignore)
  * configs — файлы конфига для express
  * controllers — основные js файлы экспресс
  * models — модели для express
  * modules — модули для express
  * views
    * layouts — тут html шаблон страницы, который потом копируютсе в public/
    * components — react компоненты
* public — все статичные файлы, здесь лежит базовый index.html, который собирается из вьюх
  * assets
    * css
    * js
