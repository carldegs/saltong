declare global {
  namespace NodeJS {
    interface Global {
      mongooseObj: MongooseObject;
    }
  }
  interface Window {
    gtag: any;
  }
}
