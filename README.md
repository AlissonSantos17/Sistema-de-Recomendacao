# Sistema-de-Recomendacao
Sistema de recomendação feita com conhecimento em Grafos

## BACKEND
De início foi criado uma lista de Adjacências com os vértices feito pelos usuários e as arestas sendo os filmes. Após essa lista gerada foi criado um json de users e de filmes para ser consumido e ser pegado os dados de cada usuário e de cada filme.

### backend/source
criarJson.py: O criarJson.py foi feito no intuito de gerar os json dos determinados users e movies, criada uma função onde lê o arquivo csv e pega o userID dos ratings e o movieId dos filmes e é criado.

getDados.py: Lê os jsons e é feito um get passado determinado id ou userId como parâmetro, sendo assim é retornado todos usuários, filmes que o usuário assistiu e todos os filmes retorna o filme passando como parâmetro o seu id.

similaridade.py: É feito o cálculo da distância euclidiana entre determinado usuários e assim feita à similaridade entre ele, de início a distância euclidiana faz a distância de dois pontos, mas na similaridade foi modificado para realizar a similaridade de um usuário com todos os que estão na base criada. Após isso ele retorna à similaridade do usuário passado entre todos os outro 609 que estão na base.

recomendacao.py: 
distanciaEuclidiana(): Distancia euclidiana foi feita para pegar a distância entre dois usuários, lendo a base que está o json com os usuários e os filmes que assistiram, é feito o cálculo da distância entre dois pontos (usuario1 e usuario2) sendo assim retornando o cálculo entre eles irá ajudar para encontrar a similaridade entre os pontos.

recomendar(): O recomendar é passado a base como parâmetro e o usuário, sendo assim é feito a soma da similaridade chamando a função da distância euclidiana entre um usuário e todos os outros, enquanto a similaridade for <= a 0, ele continua até achar uma avaliação ideal para ser recomendado, após encontrado todos os similares, ele faz a recomendação com os melhores filmes e dá um sort() para ficar ordenado. Sendo assim traz um total de 25 filmes recomendando, eu precisei colocar esse limite pois como a base é muito grande, iria demorar bastante para que todos os filmes chegassem até o retorno da API.

## FRONTEND
Foi criado com ReactJs para consumir a API do backend, onde é passado um usuário e retorna a lista de filmes assistidos [0:26] e filmes recomendados [0:26].

### frontend/src
No front não tenho muito o que falar, foi feita apenas um form passando o userId e armazeno no storage do navegador, é feito a verificação se o usuário existe na base, se não existir é recomendado que você informe um usuário entre 1 - 610, caso exista é passado para o /recomendar onde é retornado os "Filmes que você assistiu:" retornando 25 filmes que você assistiu e os "Filmes recomendado para você:" retornando os 25 filmes melhores avaliados de acordo com o seu gosto para que você possa assistir. Não foi colocado os posters de cada Filme.

## Como rodar o projeto?
### BACKEND
É necessário instalar todos os dados que se encontram no requirements.txt e após isso executar o "main.py" contendo as seguintes rotas:
rota get("/") retorna a seguinte mensagem -> "Seja bem-vindo a API de Recomendação de Filmes."
rota get("/usuario/<string:id>") -> Verifica o id do usuário e faz o check se existe na base ou não.
rota get("/filmes_usuario/<string:id>") -> retorna todos os filmes que o usuário assistiu.
rota get("/recomendacao/<string:id>") -> retorna os 25 melhores filmes recomendados por usuários com os gostos parecidos ao seu para que você assista.
Obs.: Estará rodando em http://127.0.0.1:5000

### FRONTEND
É necessário ter instalado o React na sua máquina, após isso apenas rodar um yarn ou um npm install para que seja instalado as dependências do node_modules e dá um npm start ou um yarn start para que seja executado o frontend. Obs.: Estará sendo executado em http://localhost:3000

Alunos: Alisson Santos, Nathan Jose e Natan Nascimento.
