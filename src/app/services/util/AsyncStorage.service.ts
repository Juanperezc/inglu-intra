export class AsyncStorage{
  

         static async setItem (key, value) {
            return   Promise.resolve().then(function () {
                localStorage.setItem(key, value);
            });
        }
        static async getItem (key) {
            return   Promise.resolve().then(function () {
                return localStorage.getItem(key);
            });
        }
        static async clear () {
           return   Promise.resolve().then(function () {
                return localStorage.clear();
            });
        }
}