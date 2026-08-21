# React + shadcn/ui starter

Адаптивная заготовка на React, TypeScript, Vite, Tailwind CSS и shadcn/ui.

## Локальный запуск

```bash
npm install
npm run dev
```

Vite покажет локальный и сетевой адрес. Чтобы открыть проект на телефоне, подключите телефон и компьютер к одной Wi-Fi сети и откройте сетевой адрес вида `http://192.168.x.x:5173`.

## Добавление компонентов shadcn/ui

```bash
npx shadcn@latest add dialog input form
```

Конфигурация уже находится в `components.json`.

## Публикация в GitHub Pages

1. Создайте пустой репозиторий на GitHub.
2. Загрузите содержимое этой папки в ветку `main`.
3. В GitHub откройте **Settings → Pages** и выберите **Source: GitHub Actions**.
4. После завершения workflow `Deploy to GitHub Pages` адрес сайта появится в разделе Pages.

Параметр `base: "./"` в Vite позволяет странице работать по адресу репозитория без ручной подстановки его имени.

## Проверки

```bash
npm run lint
npm run build
```
