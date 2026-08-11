import { app } from './app.js';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    app.listen(PORT, () => {
      console.info(`[Server] Успешно запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('[Fatal Error] Ошибка инициализации приложения:', error);
    process.exit(1);
  }
}

bootstrap();
