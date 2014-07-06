
import System.Data;  // we import our  data class

import Mono.Data.Sqlite; // we import our sqlite client

import System;
 

class dbAccess {

    // variables for basic query access

    private var connection : String;

    private var dbcon : IDbConnection;

    private var dbcmd : IDbCommand;

    private var reader : IDataReader;
    
    function OpenDB(p : String){
	
    print("OpenDB");
    
    if(Application.platform == RuntimePlatform.IPhonePlayer){
    	
    	//persistentDataPath
    	connection = System.IO.Path.Combine (Application.persistentDataPath, p);
    	Debug.Log("pathDB :"+connection);
		
		//if no exist the DB in the folder of persistent data (folder "Documents" on iOS) proceeds to copy it.
		if (!System.IO.File.Exists (connection)) {
			//original path
			var sourcePath :String = System.IO.Path.Combine (Application.streamingAssetsPath, p);
			Debug.Log("sourcePath :"+sourcePath);
			
			// Mac, Windows, Iphone
		 
			//validate the existens of the DB in the original folder (folder "streamingAssets")
			if (System.IO.File.Exists (sourcePath)) {
					
				//copy file - alle systems except Android
				Debug.Log("System.IO.File.Cop");
				System.IO.File.Copy (sourcePath, connection, true);
				//pathDB = sourcePath;
											
			} else {
				Debug.Log ("ERROR: the file DB named " + p + " doesn't exist in the StreamingAssets Folder, please copy it there.");
			}	
		}
		connection = "URI=file:" + connection;
		Debug.Log("connection :"+connection);
    	
    } else {
    	connection = "URI=file:"+Application.streamingAssetsPath+"/monster_war.db";	
    }
    

    dbcon = new SqliteConnection(connection);

    dbcon.Open();
    
    

    }

    function GetiPhoneDocumentsPath(){
    	var path : String = Application.dataPath.Substring(0, Application.dataPath.Length - 5);
    	return path;
    }

    function BasicQuery(q : String, r : boolean){ // run a baic Sqlite query

        dbcmd = dbcon.CreateCommand(); // create empty command

        dbcmd.CommandText = q; // fill the command

        reader = dbcmd.ExecuteReader(); // execute command which returns a reader

        if(r){ // if we want to return the reader

        return reader; // return the reader

        }

    }
    
    function BasicQuery(q : String){ // run a baic Sqlite query

        dbcmd = dbcon.CreateCommand(); // create empty command
        dbcmd.CommandText = q; // fill the command
        reader = dbcmd.ExecuteReader(); // execute command which returns a reader
		var readArray = new ArrayList();
        while(reader.Read()){ 
            var lineArray = new ArrayList();
            for (var i = 0; i < reader.FieldCount; i++)
//            	print(""+reader.GetValue(i));
                lineArray.Add(reader.GetValue(i)); // This reads the entries in a row
            readArray.Add(lineArray); // This makes an array of all the rows
        }
        return readArray; // return matches
    }

	// This returns a 2 dimensional ArrayList with all the
    //  data from the table requested
    function ReadFullTable(tableName : String){
        var query : String;
        query = "SELECT * FROM " + tableName;	
        dbcmd = dbcon.CreateCommand();
        dbcmd.CommandText = query; 
        reader = dbcmd.ExecuteReader();
        var readArray = new ArrayList();
        while(reader.Read()){ 
            var lineArray = new ArrayList();
            for (var i = 0; i < reader.FieldCount; i++)
                lineArray.Add(reader.GetValue(i)); // This reads the entries in a row
            readArray.Add(lineArray); // This makes an array of all the rows
        }
        return readArray; // return matches
    }
    
    function Update_monster(own_index: int,attribute : String, values : String){
    	dbcmd = dbcon.CreateCommand(); // create empty command
    	dbcmd.CommandText = "Update monster_box set "+attribute+" = "+values+" where own_index = "+own_index; // fill the command
        reader = dbcmd.ExecuteReader(); // execute command which returns a reader
    }
    
    function Delete_monster(own_index: String){
    	dbcmd = dbcon.CreateCommand(); // create empty command
        dbcmd.CommandText = "delete from monster_box where own_index = '"+own_index+"'"; // fill the command
        reader = dbcmd.ExecuteReader(); // execute command which returns a reader
    }

    function CreateTable(name : String, col : Array, colType : Array){ // Create a table, name, column array, column type array

        var query : String;

        query  = "CREATE TABLE if not exists " + name + "(" + col[0] + " " + colType[0];

        for(var i=1; i<col.length; i++){

            query += ", " + col[i] + " " + colType[i];

        }

        query += ")";

        dbcmd = dbcon.CreateCommand(); // create empty command

        dbcmd.CommandText = query; // fill the command

        reader = dbcmd.ExecuteReader(); // execute command which returns a reader

    

    }
	
    /*

    function InsertIntoSingle(tableName : String, colName : String, value : String){ // single insert 

        var query : String;

        query = "INSERT INTO " + tableName + "(" + colName + ") " + "VALUES (" + value + ")";

        dbcmd = dbcon.CreateCommand(); // create empty command

        dbcmd.CommandText = query; // fill the command

        reader = dbcmd.ExecuteReader(); // execute command which returns a reader

    }

    

    function InsertIntoSpecific(tableName : String, col : Array, values : Array){ // Specific insert with col and values

        var query : String;

        query = "INSERT INTO " + tableName + "(" + col[0];

        for(var i=1; i<col.length; i++){

            query += ", " + col[i];

        }

        query += ") VALUES (" + values[0];

        for(i=1; i<values.length; i++){

            query += ", " + values[i];

        }

        query += ")";

        dbcmd = dbcon.CreateCommand();

        dbcmd.CommandText = query; 

        reader = dbcmd.ExecuteReader();

    }

    

    function InsertInto(tableName : String, values : Array){ // basic Insert with just values

        var query : String;

        query = "INSERT INTO " + tableName + " VALUES (" + values[0];

        for(var i=1; i<values.length; i++){

            query += ", " + values[i];

        }

        query += ")";

        dbcmd = dbcon.CreateCommand();

        dbcmd.CommandText = query; 

        reader = dbcmd.ExecuteReader(); 

    }

    

    function SingleSelectWhere(tableName : String, itemToSelect : String, wCol : String, wPar : String, wValue : String){ // Selects a single Item

        var query : String;

        query = "SELECT " + itemToSelect + " FROM " + tableName + " WHERE " + wCol + wPar + wValue; 

        dbcmd = dbcon.CreateCommand();

        dbcmd.CommandText = query; 

        reader = dbcmd.ExecuteReader();

        var readArray = new Array();

        while(reader.Read()){ 

            readArray.Push(reader.GetString(0)); // Fill array with all matches

        }

        return readArray; // return matches
    }
*/
    function CloseDB(){
        reader.Close(); // clean everything up
        reader = null; 
        dbcmd.Dispose(); 
        dbcmd = null; 
        dbcon.Close(); 
        dbcon = null; 
    }
    
	// created by RJ
    function run_sql(sql : String){
		dbcmd = dbcon.CreateCommand();
        dbcmd.CommandText = sql; 
        reader = dbcmd.ExecuteReader();    
 	}

}

