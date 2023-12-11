const express = require('express');
const Sequelize = require('sequelize');
const app = express();

// Configuração do Sequelize e SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Produto = sequelize.define('Produto', {
  nome: Sequelize.STRING,
  valor: Sequelize.FLOAT
});

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Rota para a página inicial (home)
app.get('/', (req, res) => {
  res.render('home');
});

// Rota para a página de busca
app.get('/busca', (req, res) => {
  res.render('busca');
});

// Rota para a busca de produtos
app.get('/buscaProdutos', (req, res) => {
  const { codigo, nome, valor } = req.query;

  // Simulando a busca no banco de dados
  Produto.findAll({
    where: {
      id: codigo || undefined,
      nome: nome || undefined,
      valor: valor || undefined
    }
  })
    .then((produtos) => {
      res.render('resultados', { produtos: produtos });
    })
    .catch((erro) => {
      console.log('Erro na busca: ' + erro);
      res.send('Erro na busca');
    });
});

// Rota para a página de alteração
app.get('/alterar/:id', (req, res) => {
  const idProduto = req.params.id;
  Produto.findByPk(idProduto)
    .then((produto) => {
      res.render('alteracao', { produto: produto });
    })
    .catch((erro) => {
      console.log('Erro na busca por ID: ' + erro);
      res.send('Erro na busca por ID');
    });
});

// Rota para realizar a alteração do produto
app.post('/realizarAlteracao/:id', express.urlencoded({ extended: true }), (req, res) => {
  const idProduto = req.params.id;
  const { nome, valor } = req.body;

  Produto.update(
    { nome: nome, valor: valor },
    { where: { id: idProduto } }
  )
    .then(() => {
      res.redirect('/busca');
    })
    .catch((erro) => {
      console.log('Erro na alteração: ' + erro);
      res.send('Erro na alteração');
    });
});

// Rota para a página de confirmação de exclusão
app.get('/excluir/:id', (req, res) => {
  const idProduto = req.params.id;
  Produto.findByPk(idProduto)
    .then((produto) => {
      res.render('confirmacaoExclusao', { produto: produto });
    })
    .catch((erro) => {
      console.log('Erro na busca por ID: ' + erro);
      res.send('Erro na busca por ID');
    });
});

// Rota para realizar a exclusão do produto
app.get('/excluirProduto/:id', (req, res) => {
  const idProduto = req.params.id;

  Produto.destroy({
    where: { id: idProduto }
  })
    .then(() => {
      res.redirect('/busca');
    })
    .catch((erro) => {
      console.log('Erro na exclusão: ' + erro);
      res.send('Erro na exclusão');
    });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
