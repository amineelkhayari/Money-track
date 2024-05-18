import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./Firebase";


class GetData {
    private db: any;
    constructor() {
        this.db = db
    }
    getFrom = () => {
        try {
            const usersCollection = collection(this.db, 'users');

            const subscribe = onSnapshot(usersCollection, {
                next: async (snapshot) => {
                    const Todos = snapshot.docs.forEach((doc) => {
                        console.log("All data",doc.data());
                    })



                }

            });

        } catch (e) {
            // saving error
        }



    }
}

export const getDt: GetData = new GetData();