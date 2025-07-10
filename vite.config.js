import { defineConfig } from 'vite';

export default defineConfig({
  // Это указывает Vite, какой HTML-файл использовать в качестве основной точки входа
  // как для режима разработки, так и для сборки.
  root: './', // Убедитесь, что это указывает на корень вашего проекта, где лежит test.html
  build: {
    rollupOptions: {
      input: {
        main: './src/frontend/library.html' // Явно указываем test.html как входную точку
      }
    }
  },
  server: {
    open: '/src/frontend/library.html' // Открывать test.html при запуске сервера
  }
});