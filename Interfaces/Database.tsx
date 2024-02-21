import * as SQLite from 'expo-sqlite';
 class DataBase{
    private db:SQLite.Database;
    constructor(){
        this.db = SQLite.openDatabase('ExpenseTracker.db');
       
    }
    public SetUpDataBase(Table:string):void{
        this.db.transaction(tx=>{
            tx.executeSql(Table)
        })
    }

   

 public getFromTable(Table:string,param?:any[]):void{
        this.db.transaction(tx => {
            tx.executeSql(Table, param,
              (txObj, resultSet) => console.log('aaaaaaa',resultSet),
              
            );
          });
    }

 public InsertIntoTable(Table:string,param?:any[]):void{
  
        try{
            this.db.transaction(tx => {
                tx.executeSql('INSERT INTO categoery (NameCat) values (?)', ["amine"],
                  (txObj, resultSet) => {
                  
                      console.log(resultSet)
                  }
                );
              });
        }
        catch(e){
            console.log(e)
        }
      
    }

}

export var dt:DataBase = new DataBase();