**Toptal_Quiz_task**\
Start Application Guide:\
"git clone" repository on your device\
run "docker-compose up -d" inside cloned repository\
Postman APIs collection can be found "/documents"\
nodejs-server-dev is the main-app, it waits for mysql to be up and haelthy, then the main-app will appear in docker hub\
\
nodejs-server-dev --> The main application\
mysql-database-dev --> Database used with main app\
mysql-adminer --> Admin portal for database @localhost:8080\
Open database admin portal:\
Go to "localhost:8080" on browser\
Enter the following: System: MySQL Server: mysql-database Username: root Password: mostafa1996 Database: dev_db\
Project Structure:\
/app is the node application\
/config: catch exported environment variables to be used for project setup\
/database: setup "Sequelize" orm\
/errors: defining errors needed in the project\
/models: database models\
/adapters: any calls to the external should be executed here (database calls)\
/controllers: contains business logic\
/routers: routes entrypoint (route request to be processed)\
/schemas: Validation on input payload received from and call made to this application\
/startup: initialising express application and adding all express middlewares\
server.js: server creation\
