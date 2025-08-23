Desenvolvimento de Software do Front ao Back - Parte 2 (frontend)
Projeto de disciplina

                                      Objetivo

Desenvolver um portal, em React, através do qual seja possível gerenciar o sistema de
e-commerce cujo backend foi desenvolvido na primeira parte desta disciplina. O resultado
final deste projeto deve utilizar as funcionalidades do backend para:

● Listar todos os produtos cadastrados no sistema;
● Buscar por produtos específicos a partir do código cadastrado no sistema;
● Alterar os dados de cadastro de produtos;
● Remover produtos já cadastrados.

Além disso, o portal web também deve permitir que o usuário possa fazer a carga de
uma lista de produtos, através do upload de um arquivo com extensão csv. O portal deve
permitir que o usuário selecione um arquivo .csv qualquer, extraia a informação de todos os
produtos deste arquivo, e mostre-os em uma única lista na qual o usuário deve poder escolher
quais produtos serão efetivamente carregados no sistema. Ao final do processo, o portal deve
exibir quais produtos foram carregados com sucesso e quais apresentaram falha neste
processo. Supõe-se que o arquivo .csv escolhido pelo usuário estará no formato esperado pela
página.

Ao abrir a listagem de produtos, aqueles que foram carregados com sucesso devem
aparecer na lista.


Lista de funcionalidades a serem entregues...

Listagem de produtos:
● No topo da página, é exibido um campo de texto com o rótulo “Código”, em que o
usuário pode digitar apenas números;
● à direita do campo “Código”, é exibido um botão com o rótulo “Buscar”, que se
clicado deve disparar uma busca pelo código especificado, usando o endpoint do
backend;
● Quando não há produtos cadastrados no sistema, a mensagem “Não existem produtos
cadastrados” deve ser exibida;
● Quando há ao menos um produto cadastrado, cada produto é apresentado em um
cartão próprio;
● O cartão de cada produto apresenta as informações do sistema (código, nome,
categoria, preço e descrição).

Edição de produtos:
● O cartão de cada produto apresenta um botão com o rótulo “Editar”, que se clicado
altera o cartão para o modo edição;
● Quando em modo edição, as informações textuais do cartão são convertidas em inputs
alteráveis pelo usuário;
● Quando em modo edição, é exibido um botão com o rótulo “Salvar”, que se clicado
deve disparar uma requisição para o backend atualizar o produto editado, com os
novos dados;
● Quando em modo edição, é exibido um botão com o rótulo “Cancelar”, que se clicado
descarta as alterações feitas e volta o cartão para o modo apenas exibição.

Exclusão de produtos:
● O cartão de cada produto apresenta um botão com o rótulo “Excluir”, que se clicado
deve abrir um alerta ou modal, com a mensagem “Você quer mesmo excluir este
produto?” e dois botões, com os rótulos “Sim” e “Não”;
● Quando o usuário clica no botão “Sim”, uma requisição é disparada para o backend
para excluir o produto selecionado. Logo após, a listagem de produtos é exibida
novamente e deve remover o produto excluído da lista.

Carga de produtos
● No topo da página, deve ser exibido um campo com o rótulo “Arquivo CSV” e que
permita ao usuário selecionar um arquivo qualquer do próprio computador;
● À direita deste campo, é exibido um botão com o rótulo “Enviar”, que deve estar
desabilitado;
● Caso o usuário selecione um arquivo com extensão que não seja CSV, é exibido um
alerta com a mensagem “Extensão de arquivo inválida”, e o arquivo selecionado é
descartado;
● Ao selecionar um arquivo com a extensão correta, deve ser exibida uma lista com
todos os produtos do arquivo selecionado, semelhante à listagem de produtos. No
entanto, o cartão de cada produto não deve apresentar os botões “Editar” e “Excluir”;
● Ao mostrar o cartão de um produto lido do arquivo, no lugar onde os botões “Editar”
e “Excluir” são originalmente exibidos, deve ser exibida uma caixa de seleção do tipo
checkbox, que deve estar inicialmente desmarcada;
● Ao selecionar um arquivo com a extensão correta, o botão “Enviar” deve se tornar
habilitado, podendo ser clicado;
● Ao clicar no botão “Enviar”, apenas os produtos com a checkbox selecionada devem
ser criados através de requisição enviada ao backend. A página deve exibir, logo
abaixo de cada produto enviado, o resultado da criação do mesmo (sucesso ou falha).