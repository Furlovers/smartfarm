# Maua Smart Farm

Inserido no contexto da agricultura de precisão, onde busca-se utilizar dados coletados em culturas agrícolas para melhor gerenciar recursos, rastrear gastos e diminuir desperdícios, a plataforma Mauá Smart Farm vem para servir como um hub de informações. Agrupando dados vindo de variados sensores ligados ao perfil de usuário, somos capazes de produzir dashboards informativos que visam embasar as decisões de nossos clientes, gerando assertividade, produtividade e competitividade. 

## Demo
Aqui está o link para o site:  https://smartfarmmaua.com.br

## Resumo

### Landing Page

A página de recepção do nosso site onde podem ser vistos nossos planos e serviços ofertados.

### Mapa de Gerenciamento

A partir de dados de geolocalização atrelados a cada sensor do usuário, somos capazes de posicionar marcadores representando cada sensor ligado ao usuário logado na plataforma. Além disso, mostramos um resumo das últimas leituras de cada sensor, quantos sensores ativos o usuário possui e um botão para cadastrar um novo sensor.

### Dashboards Especializados

A fim de oferecer uma visão mais detalhada das informações coletadas (pH, temperatura, luminosidade e umidade), construímos um dashboard que exibe dados da série temporal ligada aos sensores do usuário. Entre as visualizações ofertadas está um gráfico de linha exibindo a série temporal, um gauge mostrando a média dos valores, cards exibindo o valor máximo, mínimo e a quantidade de leituras e uma tabela contendo uma visualização alternativa dos dados da série temporal, com o adicional da diferença percentual média entre as leituras.

### Perfil

Nesta aba, o usuátio pode alterar seus dados cadastrais como Nome, Email e Endereço.

### Cadastro de Sensor

Ao clicar no botão de cadastrar um novo sensor, é exibido um Pop-Up ao usuário onde ele pode inserir o Nome de Sensor, Latitude e Longitude do novo sensor que será cadastrado e atrelado ao seu usuário.

## Comentários

Tratando-se de uma prova de conceito, este projeto utiliza dados fictícios de usuários, sensores e leituras. Futuramente, pretende-se alimentar o sistema com dados reais colhidos por sensores em campo.

Nossa aplicação baseou-se na arquitetura de microsserviços a fim de oferecer uma maior tolerância à falhas e flexibilidade durante o desenvolvimento. Microsserviços desenvolvidos:

| Nome | Função |
| ---- | -------|
| user_mss | Lida com requisições para Inserção, Deleção e Alteração de dados de usuários |
| sensor_mss | Lida com requisições para Inserção, Deleção e Alteração dos sensores de um usuário |
| reading_mss | Lida com requisições para Inserção, Deleção e Alteração de leituras de um sensor |
| view_mss | Lida com requisições de Consulta através da consolidação das bases de dados proprietárias dos microsserviços anteriores |
| event_bus | Lida com a comunicação entre os microsserviços |

Por exemplo, para a criação de um novo usuário, existe o seguinte fluxo simplificado:

Usuário solicita a criação através da interação com o Frontend da aplicação -> MSS de usuário atende à requisição, inserindo-o em sua base local -> Barramento de eventos ecoa a criação deste usuário para o MSS de consulta -> MSS de consulta insere o novo usuário na base consolidada.

## Feito com:

- [React](https://react.dev/) - Biblioteca para interfaces de usuário web e mobile.
- [Vite](https://vite.dev/guide/) - Uma ferramenta de build desenhada para oferecer agilidade entre às iterações do processo de desenvolvimento.
- [Tailwind CSS](https://tailwindcss.com/) - Um framework CSS repleto de classes como flex, pt-4, text-center e rotate-90, que podem ser combinadas para construir qualquer design diretamente no seu código HTML.
- [Node.js](https://nodejs.org/pt) -  Ambiente de execução de JavaScript multiplataforma, de código-aberto e gratuita, que permite aos programadores criar servidores, aplicações da Web, ferramentas de linha de comando e programas de automação de tarefas.
- [Heroku](https://www.heroku.com/) - Serviço no modelo Platform as a Service criado para facilitar o processo de implantação (delpoy) de projetos.

## Integrantes

Breno Amorim Roman - 20.00395-0

Bruno Giannini Loffreda - 21.00122-7

Enrico Mota Santarelli - 22.00370-3

Leonardo Galdi Fiorese - 22.00952-3

Rodrigo Reis Monasterios Morales - 22.01432-2

Sergio Guidi Trovo - 22.01128-5
