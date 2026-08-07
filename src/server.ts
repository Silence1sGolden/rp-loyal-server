import { app } from './app';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    app.listen(PORT, () => {
      console.log(`[Server] Успешно запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('[Fatal Error] Ошибка инициализации приложения:', error);
    process.exit(1);
  }
}

bootstrap();
