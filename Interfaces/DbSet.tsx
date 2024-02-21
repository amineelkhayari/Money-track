
import * as SQLite from 'expo-sqlite';



export interface IData {
  ID: number;
  [key: string]: any;
}

export class Database {
  db: SQLite.Database;



  constructor() {
    this.db = SQLite.openDatabase('ExpensesTrackers.db');


  }

  createTableManually = (tableName: string) => {

    this.db.transaction(tx => {
      tx.executeSql(
        tableName
      );
    });
    console.log("Data base Created")
  };
  createTable = (tableName: string, columns: string[]) => {
    const columnsString = columns.map(col => `${col} TEXT`).join(', ');
    this.db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columnsString});`
      );
    });
    console.log("Data base Created")
  };
  fetchDataQuery = (query: string, setData: React.Dispatch<React.SetStateAction<IData[]>>

  ) => {


    this.db.transaction(tx => {
      tx.executeSql(query, [], (_, { rows }) => {
        const items: IData[] = [];
        for (let i = 0; i < rows.length; i++) {
          items.push(rows.item(i));
        }
        setData(items);

      });
    });
  };
  fetchData = (tableName: string, setData: React.Dispatch<React.SetStateAction<IData[]>>,
    data?: Partial<IData>
  ) => {
    let values: any = []
    let columns: string;
    if (data != null) {
      columns = "WHERE " + Object.keys(data).join(' = ? AND ') + "= ?";
      values = Object.values(data);
      console.log("columns: ", columns + " = ?")
      console.log(`SELECT * FROM ${tableName} ${columns} ;`, values)

    }
    this.db.transaction(tx => {
      tx.executeSql(`SELECT * FROM ${tableName} ${columns} ;`, values, (_, res) => {
        const items: IData[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          items.push(res.rows.item(i));
        }
        setData(items);
        console.log(items)
      });
    });
  };

  addItem = (tableName: string, data: Partial<IData>, fetchData?: () => void) => {
    const columns = Object.keys(data).join(',');
    const placeholders = Object.keys(data).fill('?').join(',');
    const values = Object.values(data);
    this.db.transaction(tx => {
      tx.executeSql(`INSERT or replace INTO ${tableName} (${columns}) VALUES (${placeholders});`,
        values,
        (txtObj, res) => {
          alert("This Item add With Id : " + res.insertId)
          if (fetchData != null) fetchData();
        }


      );
    });
  };
  deleteItem = (tableName: string, data: Partial<IData>, fetchData: () => void) => {
    
    let values: any = []
    let columns: string;
    
      columns = "WHERE " + Object.keys(data).join(' = ? AND ') + "= ?";
      values = Object.values(data);
      console.log(columns,values)

    this.db.transaction(tx => {
      tx.executeSql(`DELETE FROM  ${tableName} ${columns};`,
        values,
        (txtObj, res) => {
          console.log("This Item add With Id : " + res.rows._array)
          fetchData();
        }


      );
    });
  };

  UpdateItem = (tableName: string, data: Partial<IData>, WhereClause: string) => {

    let columns = Object.keys(data).join(' = ? AND ') + "= ?";
    let values = Object.values(data);



    console.log(`UPDATE ${tableName}
    SET ${columns}
    WHERE
       ${WhereClause} `, values)

    this.db.transaction(tx => {
      tx.executeSql(`UPDATE ${tableName}
      SET ${columns}
      WHERE
         ${WhereClause} `,
        values,
        (txtObj, res) => {
          alert("This Item add With Id : ")
          console.log(res)

        }


      );
    });
  };
}

export const db: Database = new Database();
