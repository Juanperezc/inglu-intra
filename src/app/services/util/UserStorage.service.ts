import { AsyncStorage } from './AsyncStorage.service';

export class UserStorage{
  
         static async setUser (value) {
         return await AsyncStorage.setItem("user", JSON.stringify(value));
        }
        static async setToken (value: any) {
            return await AsyncStorage.setItem("token", value);
        }
        static async getUser () {
          return   JSON.parse(await AsyncStorage.getItem("user"));
        }
        static async getToken () {
            return  await AsyncStorage.getItem("token");
        }
        static async clear () {
            return await AsyncStorage.clear();
        }
        static async isAuthenticated(){
            if  (await UserStorage.getUser() != null && await UserStorage.getToken() != null){
                return true;
            }else{
                return false;
            }
        }
   
        
}