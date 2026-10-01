<p align="center">
  <img src="wwwroot/images/logo2.png" alt="EcoMapBrasil" width="96">
</p>

<h1 align="center">EcoMapBrasil · 2º semestre</h1>

<p align="center">
  <img alt="Semestre" src="https://img.shields.io/badge/semestre-2%C2%BA_%C2%B7_2025%2F2-5b6270">
  <img alt="C#" src="https://img.shields.io/badge/C%23-ASP.NET_Core_MVC-512bd4?logo=dotnet&logoColor=white">
  <img alt=".NET" src="https://img.shields.io/badge/.NET-8-512bd4?logo=dotnet&logoColor=white">
  <img alt="SQL Server" src="https://img.shields.io/badge/banco-SQL_Server_LocalDB-cc2927?logo=microsoftsqlserver&logoColor=white">
  <img alt="Entregue" src="https://img.shields.io/badge/estado-entregue-199e70">
</p>

A segunda versão do **EcoMapBrasil**, do 2º semestre de 2025 em Desenvolvimento de
Software Multiplataforma da FATEC. O site estático do 1º semestre virou uma aplicação
**ASP.NET Core MVC** com banco de dados: contas de usuário, avaliações e um painel de
administração, além do mapa de desmatamento.

> [!NOTE]
> Esta é uma versão **congelada**, guardada como registro. O projeto continua nos
> semestres seguintes: veja a [página da organização](https://github.com/ecomap-devs).

## 🧩 O que tem

| Área | O que faz |
|---|---|
| 🏠 **Início** e 🗺️ **Mapa** | A página do projeto e o mapa em Leaflet com as áreas desmatadas (`wwwroot/meuarquivo4.json`) |
| 🔐 **Login e cadastro** | Autenticação por cookie, com papéis `NORMAL` e `ADM` |
| ⭐ **Avaliações** | Quem está logado cria, edita e apaga as próprias avaliações, com nota de 1 a 5 |
| 🛠️ **Administração** | Só para `ADM`: moderar avaliações e gerenciar usuários |

O banco é criado sozinho na primeira execução, pelas migrations do Entity Framework
Core, em `Migrations/`.

## 🚀 Como rodar

> Pré-requisitos: Windows com o **.NET 8 SDK** e o **SQL Server LocalDB** (vem com o
> Visual Studio 2022, onde o projeto foi feito).

```bash
dotnet run
```

Ou abra `EcoMapBrasil.sln` no Visual Studio e rode. Na primeira execução o app aplica as
migrations e cria um administrador local:

| E-mail | Senha |
|---|---|
| `admin@local` | `admin123` |

<details>
<summary>Limitações conhecidas</summary>

Ficam registradas como estavam na entrega, sem correção:

- **As senhas são gravadas sem hash** no banco.
- O `Program.cs` imprime no console todos os serviços registrados, um resto de depuração.
- Usuários são gerenciados em dois lugares, `Admin2Controller` e `UsuarioController`; o
  `AdminController` cuida das avaliações.

</details>

## 🗄️ O banco

Antes do Entity Framework, o banco foi modelado em MySQL. O modelo está em
[`docs/banco/`](docs/banco): o diagrama do MySQL Workbench (`DER.mwb`) e o script das
tabelas `Usuario` e `Avaliacao` (`ecomapbrasilBD.sql`). Os dois foram apagados do
repositório original em dezembro de 2025 e voltaram aqui como documentação.

## 📜 Histórico

Os commits vêm do repositório original da equipe (`EcoMapBrasil/EcoMapBrasil`), de
junho a dezembro de 2025, com os autores originais, incluindo o 1º semestre, que viveu
no mesmo repositório. O código completo da versão final (v3.2) nunca chegou lá: entrou
aqui em 2026, a partir da cópia local do projeto.

## 👥 Equipe do 2º semestre

**Bruno** · **Cesar** · **João Flávio** · **Victor** · **Vinicius**
