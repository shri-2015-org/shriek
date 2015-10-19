# Shriek Chat [![Build Status](https://travis-ci.org/shri-2015-org/shriek.svg?branch=master)](https://travis-ci.org/shri-2015-org/shriek)

Yet another chat

# Build workflow (short)
```
npm install
npm run init
```

# Development workflow

## Собрать проект и смотреть на изменения файлов

`gulp`

## Стартовать ноду

`node .`

## Тестирование сервера
1. Стартоните приложение: `node .`
2. В другом окне консоли запустите тесты: `mocha`

# Files structure
* app — основное приложение
  * assets
    * css — файлы sass для модулей
    * js — основной файл фронта, куда объявляются все инклуды
  * components — внешние компоненты (включено в gitignore)
  * configs — файлы конфига для express
  * controllers — основные js-файлы express
  * models — модели express
  * modules — модули express
  * views
    * layouts — тут html-шаблон страницы, который потом копируется в public/
    * components — react-компоненты
* public — все статичные файлы, здесь лежит базовый index.html, который собирается из вьюх
  * assets
    * css
    * js

## Результат

Production доступен по адресу shriek-chat.tk, development — test.shriek-chat.tk

# API
## Description
Все события отправляются с помощью `socket.io`. Если мы хотим получить данные то пишем:

```javascript
socket.on('<name-of-event>', function (data) {
  // work with 'data'
});
```
Для отправки данных:

```javascript
socket.emit('<name-of-event>', data);
```

## Response

##### Success

```json
{
  "status": "ok",
  "<some-data>" : {}
}
```

##### Failed

```json
{
  "status": "error",
  "error_message": "<Error message>"
}
```

## Events

##### `user enter`

Вход/регистрация пользователя

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|
| username | String | Username |
| password | String | Password |

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| user | Object | `user` object from DB (see schema) |

`error_message`:
  * `Пользователь уже вошел`
  * `Неверный пароль`
  * `User validation failed`
  * `Пользователь не найден`

##### `user connected`

Пользователь подсоединился

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| user | Object | `user` object from DB (see schema) |

##### `user leave`

Пользователь вышел

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| user.username | String | Username |

`error_message`:
  * `Пользователь еще не вошел`

##### `user disconnected`

Отсоединение пользователя

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| user.username | String | Username |

##### `user info`

Получить информацию о пользователе

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|
| username | String | Username |

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| user | Object | `user` object from DB (see schema) |

`error_message`:
  * `Пользователь должен войти`
  * `Пользователь не найден`

##### `user update`

Получить информацию о пользователе

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|
| username | String | Username |
| setting | Object | Field: `email`, `image` |

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| user | Object | `user` object from DB (see schema) |

`error_message`:
  * `Пользователь должен войти`
  * `Пользователь не найден`

##### `user list`

Получить список пользователей

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| users | Array | array of `user` objects from DB (see schema) |

`error_message`:
  * `Пользователь должен войти`
  * `Пользователей не найдено`

##### `user start typing`

Пользователь начал печатать

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| user.username | String | Username |

`error_message`:
  * `Пользователь должен войти`
  * `Пользователь уже печатает`

##### `user stop typing`

Пользователь закончил печатать

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| user.username | String | Username |

`error_message`:
  * `Пользователь должен начать печатать`

##### `channel create`

Создание канала

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|
| name | String | Название чата |
| description | String | Описание чата |
| privateUsers | Boolean | Приватный ли |
| userslist | String | Пользователи канала |

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| channel | Object | `channel` object from DB (see schema) |

`error_message`:
  * `Ошибка создания чата`

##### `channel info`

Получение информации о канале

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|
| slug | String | Слаг чата |

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| channel | Object | `channel` object from DB (see schema) |

`error_message`:
  * `Ошибка получения чата`

##### `channel list`

Получение списка каналов с учетом привытных каналов для данного пользователя

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| channels | Array | array of `channel` objects from DB (see schema) |

`error_message`:
  * `Ошибка получения чата`

##### `channel get`

Получить сообщения из канала

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|
| channel | String | Слаг канала |
| limit | Integer | Кол-во сообщений |
| skip | Integer | Начиная с какого |
| date | ISODate | С какой даты |

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| messages | Array | Array of `message` objects from DB (see schema) |

`error_message`:
  * `Ошибка получения сообщений`

##### `message send`

Отправить сообщение

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|
| username | String | Username |
| text | String | Message |
| channel | String | (optional) Slug of channel, default: `general` |
| type | String | (optional) Type of message, default: `text` |

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| message | Object | `message` object from DB (see schema) |

`error_message`:
  * `Ошибка создания сообщения`

##### `search text`

Отправить сообщение

*Input* (`emit`)

| Field | Type | Description |
|-------|------ | -------|
| channels | Array | Slugs of channel where find |
| text | String | Query string |

*Output* (`on`)

| Field | Type | Description |
|-------|------ | -------|
| status | String | Status of error |
| messages | Array | Array of `message` object from DB (see schema) |

`error_message`:
  * `Ошибка поиска`

## Schema

#### User

| Field | Type | Other |
|-------|------ | -------|
| username | String | `required`, `unique` |
| hashedPassword | String | `required` |
| salt | String | `required` |
| created_at | ISODate | `default: now` |
| updated_at | ISODate | `default: now` |
| setting | Object | see below |

**settings**

| Field | Type | Other |
|-------|------ | -------|
| email | String | Email |
| image | String | Url of image |
| first_name | String | First name |
| last_name | String | Last name |
| full_name | String | **virtual**, full name |
| sex | String | `['male', 'female']` Gender of user |
| description | String | About himself |

`username` from 5 to 29 letters. Only latin letters, figures and underscore (`_`).

`password` from 6 letters.

#### Channel

| Field | Type | Other |
|-------|------ | -------|
| name | String | `required` |
| description | String |  |
| slug | String | `required`, `unique` |
| is_private | Boolean | `required`, `default: false` |
| created_at | ISODate | `default: now` |
| updated_at | ISODate | `default: now` |
| users | Array | Array of usernames in current channel |

#### Message

| Field | Type | Other |
|-------|------ | -------|
| username | String | `required` |
| channel | String | `required` |
| text | String | `required` |
| raw | String | HTML after modules |
| type | String | `required` |
| created_at | ISODate | `default: now` |
| attachments | Object | - |

## Config

Configuration file `config.json` example

```json
{
  "port": 3000,
  "mongoose": {
    "uri": "mongodb://localhost/shriek"
  }
}

```

## Удалить все данные из БД

`mongo shriek --eval "db.dropDatabase();"`

# Plugins

## For backend

You can create NPM package (ex. [shriek-markdown](https://github.com/sigorilla/shriek-markdown)).

1. You should name package with prefix `shriek-`.
2. Add you package via `require` in file `app/modules/plugins.js`.
3. Add in code `module.exports.forEvent`.
 - Different events have different data for your package.

## For frontend

As plugins for backend you can create React component as Bower package (ex. [shriek-emoji](https://github.com/sigorilla/shriek-emoji/)).

1. You should name package with prefix `shriek-`.
2. You should exec registration function with your root component. For example, registration for message component names `registerMessagePlugin`.
3. ...
4. Profit! Now your plugin is in our chat.
