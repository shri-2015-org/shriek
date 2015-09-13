# shriek
Yet another chat

# Build workflow (short)
1. npm install
2. bower install
3. gulp bower
4. gulp watch (watching for sass files)

# Development workflow

## Смотреть на изменения main.js для фронта
jsx --watch app/assets/js/ public/assets/js/

## Смотреть на изменения sass файлов
gulp watch

## Стартовать ноду
node .

# Files structure
* app — основное приложение
  * assets
    * css — файлы, которые получились от склеивания файлов в modules, потом попадают в public/assets/css
      * modules — файлы sass для модулей
    * js — файлы, из которых собирается статика для фронта, отсюда они попадают в public/assets/js с помощь jsx
  * components — внешние компоненты (включено в gitignore)
  * configs — файлы конфига для express
  * controllers — основные js файлы экспресс
  * models — модели для express
  * modules — модули для express
  * views
    * layouts — тут html шаблоны, которые потом копируются в public/
* public — все статичные файлы, здесь лежит базовый index.html, который собирается из вьюх
  * assets
    * css
    * js
