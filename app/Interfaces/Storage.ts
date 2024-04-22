import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
    /**
     *
     */
    constructor() {
    }
    // Method for save Data On lcoal storage
    storeData = async (key: string, value: any, setData?: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            //const jsonValue = JSON.stringify(value);

            await AsyncStorage.setItem(key, value);
            if (setData != null) setData(value);


        } catch (e) {
            // saving error
        }
    };
    getData = async (key: string, setData?: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // value previously stored
                if (setData != null) setData(value);
                else return value;
            }
        } catch (e) {
            // error reading value
            return 'error'
        }
    };

    // remove a data store
    removeValue = async (key: string) => {
        try {
            let val = await AsyncStorage.removeItem(key);
           // console.log("remove : ", val)
        } catch (e) {
            // remove error
        }

        //console.log('Done.')
    }

}

export const str: Storage = new Storage();
