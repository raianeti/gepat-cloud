# Gerenciamento de Patrimonio - Gepat-Cloud

### Pré-requisitos
- React JS
- Docker
- NPM 

### Passo a passo 
- Clone o repositório  
`git clone https://github.com/raianeti/gepat-cloud.git`

- Instale as dependencias   
`npm install`

- Rode o o comando de build  
`npm run build` 

`docker build -f Dockerfile -t raianeti/gepat-cloud:gepat-cloud .`

- Inicie o docker  
`docker run -d -p 3004:3000 raianeti/gepat-cloud:gepat-cloud`



