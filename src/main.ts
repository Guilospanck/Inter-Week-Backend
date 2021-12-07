import { AppModule } from './app.module'

(async function bootstrap () {
  const appModule = new AppModule();
  
  try {
    await appModule.connectToDatabase();
    console.log('DATABASE CONNECTED');
  } catch (err) {
    console.error('DATABASE CONNECTION ERROR ', err);
  }

  try {
    await appModule.initServer();
    console.log('SERVER STARTED');
  } catch (err) {
    console.error('SERVER START ERROR ', err);
  }

})()