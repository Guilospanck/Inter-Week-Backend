# Inter-Week-Backend
This is the backend part based on the "Frontend Inter Week" series. The main goal of this series is to develop a copy of the web interface from [Banco Inter](https://www.bancointer.com.br/). However, here the series is used just as an example to be based on. Everything (from Project Structure, to coding, documentation, tests) is different.

The application provides signin and signup with asymmetrical keys using JWT and JOSE (the JWT token is encrypted. So, without the private key, people can't really know which information are in there). Also, we can make money transferences between the participants (known in Brazil as PIX).

<p align="center">
➡️ 👷🚧 <b>Under Construction...</b>
 </p>

## Technologies
- Node.js
- Express
- TypeORM
- PostgreSQL
- Clean Code Architecture
- Design Patterns
- JWT
- JOSE (JSON Object Signing and Encryption)
- Jest

## Project Structure
I'm using <b>Clean Code Architecture</b> for this project. The reason is because it provides a nicer and better way of changing and maintening the code, besides providing us the best out of <b>design patterns</b> and <b>S.O.L.I.D. principles</b>.

The goal is to have the code at the best readability possible and to have layers detached from each other. We must not be a slave to some library, some outside module or to some other part of our code.

Below we have the architectural names used for this project and their basic explanations.

```

├── applications
│   ├── errors
│   ├── interfaces
│   └── usecases
│       └── users
├── business
│   ├── dtos
│   │   └── users
│   ├── entities
│   ├── errors
│   └── usecases
│       └── users
├── infrastructure
│   ├── adapters
│   ├── database
│   ├── http_server
│   └── repositories
│       └── user
├── interfaces
│   ├── controllers
│   │   └── users
│   └── middlewares
├── mocks
├── routes
└── shared
    └── utils
```

- ***Applications***: this layer is used for usecases rules. What we mean by that is that here lies all business cases related to the project. If an outsider look at our usecases, they must know what our project does even though they don't undestand it. So, for example, we have inside of <code>User</code> the <b>signin</b> and <b>signup</b> usecases. An outsider will know that the User part of our project lies on getting a user signed in and signed up.

- ***Business***: here we have all things related to our intrinsic company needs. In here we define the I/O structures, the entities for the databases and so on.

- ***Infrastructure***: basically everything related to the outside lies here: a module (like `express, typeorm, logger`) and a database (like `postgres`). This is the part of our application that is using something external.

- ***Interfaces***: this is our front door of the application. All requests will be redirected to this layer before it takes time into the interior of our project. He is the frontman that gives directions for the requests coming.

- ***Mocks***: basically used for testing purposes. Here we'll have dummy mocked requests, objects, functions, classes in order to execute our unit tests.

- ***Routes***: as the name describes, all our endpoints are located here.

- ***Shared***: finally, this is the layer where we have something that can be used throughout the application, something that more than one layer will use.

## Installation
Git clone this repository
```bash
git clone https://github.com/Guilospanck/Inter-Week-Backend.git
```
and then <code>cd</code> into it
```bash
cd /Inter-Week-Backend
```
Run Yarn to install dependencies
```bash
yarn
```
Be sure to have an instance of PostgreSQL up and running with the following credentials (you can see then in the `ormconfig.json` file):
```json
{
  "name": "default",
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "123456",
  "database": "inter",
  "entities": ["src/business/entities/*.ts"],
  "logging": false,
  "synchronize": true
}
```
One simple and quick way to have it running is to run it on Docker.
Once you have [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04) installed, you can run on the terminal:
```bash
docker run --rm --name pg-docker -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=default -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres
```
Also, personally, I like [DBeaver](https://dbeaver.io/) as a Graphical Interface to the database.

Then, once the database is up and running and you already have a database there with the above configurations, you can run on the terminal:
```bash
yarn start:dev
```
to run the HTTP Server and the connection to the database.

## Using the application
On the `docs/` folder we have the [Insomnia](https://insomnia.rest/) JSON file that can be imported and is ready to use.
- First you have to do the user `signup` in order to create the user in the database (be sure to remember its credentials `email` and `password`;
- Then create another user the same way. You do this in order to transfer money from one to another.
- `Signin` with one of the users; get its `userId` and `accessToken` and put it on the Insomnia Environments (Ctrl E);

Example:
```json
{
	"BASE_URL": "http://localhost:4444",
	"TOKEN": "eyJyZWNpcGllbnRzIjpbeyJlbmNyeXB0ZWRfa2V5IjoibHE3cUpRR0J1Q1RtQzlYaWxEd1Y0Z0NsTkszUEk4UXd6am5NRnoxRWFrVVpYcEFRWUVjMnlNcVpPQ2VKdGtXY0s5aHAyYWdfRkJDWW10Z1NWVDQtbEpycUN2d3l6bzNXbG4xMWpNN2xzTUMwcjlaYXltc05GNUdfaVNma2VUZmhMYlk5V1FXTVpIT0tWVGZjN1JtSjR4TVBVWEFvUVE0MGdtcl9VMGwwMzZ5aHJNYTZlRG9DazVIMUQyWUROVWRDSk91eUdHMW1BMHhUWHljdWZyOTYtUXJYdFlvc2JvM3VOQ2NvaGxabGtKQ19nY25CYW9aLXZ2VU1GU2ViaDh0bWtOTnVCMVFKR0tkbkVId0dtbGZCbEFNVUpUNzkzLUUyTWJPemZSOVdBYms3dWJrLUd3R1JnZkk5WkZ4aVpkM2xWYzV1cHpoVmNBazYxWmVLdWJxVF9PM09qR25oOTZCa1llNzduS3A2dmRJbnV2YTFaZDJaY1ljS1ZZVnpOeUpLV29NeGNtM1hYZmVlUERhU1IzNTFESjFSdmppVVhBUDF5b2FmNkJNbXgtaUVsT0RjLURuVjh1YW8yRkZabjNPNkRkcDZoOFBjRGxFUXFWUkdVbUwtV2pUNGxGNktKLUFPSFlIUkxxaEQ4MHYteTdnVVN2aS1BbGVjQmQ3Mmcwb3VMamN1SXdfbFpVQWR2ckZ3NG1YWGxrT2NNWGtldE54VWQ1ZUFLMmdWY2l5blUyUkVOS0oyVzIzM0VaQmlzaUJJa21FS0JkOXNfYWNUSmduSzNSajFtb2FsNnBPbnVpYmNJSGxMZ2gzZk9od2dvUDJUOW81Mlh3S3ZKY0xLQkpGU3BpZmFZa1dIUUt4M0t5NjEwY3MwcHFQYlF5bWRlbW41MTVpWW1mVl9pT2MifV0sInByb3RlY3RlZCI6ImV5SmxibU1pT2lKQk1USTRRMEpETFVoVE1qVTJJaXdpWVd4bklqb2lVbE5CTFU5QlJWQWlMQ0pyYVdRaU9pSkhaSGRYTTNoS1ExTTFka1ExTmtScVZuSnBVWEI1VWtvMlNsVmtSbFZuWVVveGFYSkVOMDkwVkdOTkluMCIsIml2IjoiSmxQbjkwem00ZTVNZnYwQzJjZHhMUSIsImNpcGhlcnRleHQiOiJaU0JuTks3RHJjVmdDUGExd0NOQzgzUVJGU1Q3NDFaTWpfLVh4SlBEbk85VnB0Tktnd0hfYkNuYlBJUFlRVlNwQVZ3Q19pZmxPZFZpVVlDZnNQT2t2TkRjbHZCUDEwMzRFY2xVMTFFV2t1WUFVU2ZjRjk4U1h1Z2hoZXdpS3NJR2xTd1pxQlVBM29HcTJtVlgyakI3UF9GeEVmdmdSTFU2STJjV3F6dndUMWFzcldjNndRS3V4Mjc5M3lLOVFFbG92ZUE2ZjBDQnpuZDlVUVdhUzBqbzlvemxNdU5ONEx1U3A4UnNvRC0zVHJ3RFdpajNVSEpSSmZtS1RVM1MxWGViWWJSaEpuNWtmMjdtTjVZTklheTJqM0JYSWhubTYxNUNkNFB4WlA3Mlg4a3FoVkxIM1RQOWFKRVNBWWRyWGpfV1lPZU95NllDYWNUaGgwc3FJLWR0RnZ1Zm5PSElqdG55WVNrOF9lemZ0cjhSa0FQRVM3T0JBM01TZ2xjak9uSnpUNm8xTlI3OXVWb2FGUzZaZnAydUNHcGFjaE54TEd1aXd2bG03TnFuM08tX1dXWXlzOVFycmRwU2FSS2FmT1NXb0ZsM1k1Q0RGcWRGMVJrcHJBZ3hyNVJlMl9qalFCTTJCb3RVeHN6a21NMk5UOHYzWkYxTEpRVjlBYV9fS1FVMTBBSUFNSjdzZU9pWTRHM3lVZnpWVlp2YlZmZUdKSVNzRm9VQnNZbFBCZEkiLCJ0YWciOiJSSHR3ZW9RLWNqdHRZdFhUNkU3WnhBIn0=",
	"USER_ID": "0aed60cb-a16a-429f-b429-169ff33040e9"
}
```

- Then, on the `Pix` section, `Request` a new payment of some value. Copy the `pixKey` returned. This is the code you'll use to pay with another user;
- `Signin` with the other user, change the Insomnia environment with its credentials and then on the `Pix` section go to `Pay` and paste the `pixKey` from the previous step on the `key` field;
- On your database now you should have a 'closed' transactions and users created.
