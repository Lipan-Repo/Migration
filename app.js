const sql = require('mysql');
const sourceConnection = sql.createConnection({
    host: 'dev-respo-db.cnjv3cljxiji.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'f%HDh6g6&v;!',
    database: 'kyc_service'
});
sourceConnection.connect();
const targetConnection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mysql@0987',
});
targetConnection.connect();
// Create schema in target connection
targetConnection.query('CREATE DATABASE IF NOT EXISTS dev_database', (error, results) => {
    if (error) throw error;
    // Switch to target schema
    targetConnection.changeUser({database: 'lipan_db'}, (error) => {
        if (error) throw error;
        // Create table in target schema
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS targetTable (
                id INT PRIMARY KEY,
                customer_id INT,
                max_tenure INT
            )
        `;
        targetConnection.query(createTableQuery, (error, results) => {
            if (error) throw error;
            // Retrieve data from source table
            sourceConnection.query('SELECT id, customer_id, max_tenure FROM test', (error, results) => {
                if (error) throw error;
                // Insert retrieved data into target table
                const insertValues = results.map(({id, customer_id, max_tenure}) => {
                    return [id, customer_id, max_tenure];
                });
                const insertQuery = 'INSERT INTO targetTable (id, customer_id, max_tenure) VALUES ?';
                targetConnection.query(insertQuery, [insertValues], (error, results) => {
                    if (error) throw error;
                    console.log('Data transferred successfully!');
                    targetConnection.end();
                    sourceConnection.end();
                });
            });
        });
    });
});
