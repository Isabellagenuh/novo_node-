const express = require("express")
const exphbs= require("express-handlebars")
const mysql = require("mysql2")

const app = express()

app.engine('handlebars', exphbs.engine())
app.set("view engine", 'handlebars')

app.use(express.static('public'))

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.get('/limpartarefas', (requisicao, resposta) => {
    const sql = 'DELETE FROM tarefa'

    conexao.query(sql, (erro) => {
        if (erro) {
            return console.log(erro)
        }

        resposta.redirect('/')
    })
})

app.post('/excluir', (requisicao, resposta) => {
    const id = requisicao.body.id

    const sql = `
    DELETE FROM tarefa
    WHERE id = ${id}
    `

    conexao.query(sql, (erro) => {
        if (erro) {
            return console.log(erro)
        }

        resposta.redirect('/')
    })
})

app.post('/completar', (requisicao, resposta) => {
    const id = requisicao.body.id

    const sql = `
    UPDATE tarefa
    SET completa = '1'
    WHERE id = ${id}
    `

    conexao.query(sql, (erro) => {
        if (erro) {
            return console.log(erro)
        }

        resposta.redirect('/')
    })
})


app.post('/descompletar', (requisicao, resposta) => {
    const id = requisicao.body.id

    const sql = `
    UPDATE tarefa
    SET completa = '0'
    WHERE id = ${id}
    `

    conexao.query(sql, (erro) => {
        if (erro) {
            return console.log(erro)
        }

        resposta.redirect('/')
    })
})


app.post('/criar', (requisicao, resposta) => {
    const descricao = requisicao.body.descricao

    const completa = 0

    const sql = `
    INSERT INTO tarefa(descricao, completa)
    VALUES ('${descricao}', '${completa}')
    `

    conexao.query(sql, (erro) => {
        if (erro){
            return console.log(erro)
        }

        resposta.redirect('/')
    })
})

app.get('/completas', (requisicao, resposta) => {
    const sql = `
    SELECT * FROM tarefa
    WHERE completa = 1
    `

    conexao.query(sql, (erro, dados) => {
        if (erro) {
            return console.log(erro)
        }

        const tarefa = dados.map((dado) => {
            return {
                id: dado.id,
                descricao: dado.descricao,
                completa: true
            }
        })

        const quantidadeTarefas = tarefa.length

        resposta.render('completas', { tarefa, quantidadeTarefas })
    })
})

app.get('/ativas', (requisicao, resposta) => {
    const sql = `
    SELECT * FROM tarefa
    WHERE completa = 0
    `

    conexao.query(sql, (erro, dados) => {
        if (erro) {
            return console.log(erro)
        }

        const tarefa = dados.map((dado) => {
            return {
                id: dado.id,
                descricao: dado.descricao,
                completa: false
            }
        })

        const quantidadeTarefas = tarefa.length

        resposta.render('ativas', {tarefa, quantidadeTarefas})
    })
})

app.get('/', (requisicao, resposta) => {
    const sql = 'SELECT * FROM tarefa'

    conexao.query(sql, (erro, dados) => {
        if (erro) {
            return console.log(erro)
        }

        const tarefa = dados.map((dado) => {
            return {
                id: dado.id,
                descricao: dado.descricao,
                completa: dado.completa === 0 ? false : true
            }
        })
        const  tarefasAtivas = tarefa.filter((tarefaa) => {
            return tarefa.completa === false && tarefaa
        })

        const quantidadeAtivas = tarefasAtivas.length

        resposta.render('home', { tarefa, quantidadeAtivas })
    })
})

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tbl_todoapp",
    port: 3306
})

conexao.connect((erro) => {
    if (erro) {
        return console.log(erro)
    }
    console.log("Estou conectado ao MySQL")

    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000!")
    })
})