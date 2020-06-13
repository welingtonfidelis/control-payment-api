# control-payment-api

Este projeto foi construído com objetivo de atender necessidades de ONGs no quisito de controle de caixa (entrada e saída), controle de contribuintes e doações mensais. Este repositório contém o backend (API REST) do sistema, construído em NodeJs e banco de dados Postgres (com uso de ORM - Sequelize). O frontend do sistema está neste repositório [FrontEnd].

### Requisitos

* [NodeJs] - Nodejs 10 ou superior
* [PostgresSQL] - Uma conta no servidor Mongodb Atlas

### Instalação

Clonar este projeto, rodar o comando npm install ou yarn install para que sejam baixadas as dependências necessárias. Também é necessário criar um arquivo .env com as informações contidas no .env.example já disponível na raíz do projeto.
Criar um banco de dados com nome 'postgres' com usuário e senha "admin" (ou alterar as informações dentro do arquivo /src/database/config/config.json). Como o sistema usa [Sequelize], é possível utilizar outros tipos de banco de dados (relacionais) como mysql e sqlServer, desde que esta informação seja incluída no mesmo arquivo config.json citado anteriormente. Em seguida, é necessário executar o comando npx sequelize db:migration e npx sequelize db:seed:all para criação das tabelas e popular estas tabelas no banco de dados.
Por fim, executar o comando node server.js para que o servidor possa iniciar e estar preparado para atender as requisições HTTP.
Um modelo do banco de dados pode ser encontrado [neste link], para melhor entendimento das relações.

### Contato
welingtonfidelis@gmail.com
Sujestões e pull requests são sempre bem vindos =) 

License
----

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[FrontEnd]: <https://github.com/welingtonfidelis/control-payment-front>
[NodeJs]: <https://nodejs.org/en/>
[PostgresSQL]: <https://www.postgresql.org/download/>
[Sequelize]: <https://sequelize.org/>
[Postman]: <https://www.postman.com/downloads/>
[neste link]: <https://drive.google.com/open?id=1rk6cejuRqE5NdKsT3qaU5ge-b2jGpaKR>

;
