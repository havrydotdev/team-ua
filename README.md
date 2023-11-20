# UA Teammates Bot

First service for searching teammates from Ukraine :ukraine:

## Installation

Install my-project with npm

```bash
  $ git clone https://github.com/gavrylenkoIvan/team-ua
  $ cd team-ua
  $ npm i
```

## Development

To run this project in development mode, you need docker running on tour machine:

```bash
  $ npm run services:up
  $ npm run start:dev
```

## Migrations

To insert games list into your postgres db, run:

```bash
  $ npm run migrations:up
```

## Docs

You can find both [compodoc](https://team-ua-compodoc.vercel.app/) and [regular documentation](https://team-ua-docs.vercel.app/) for this project.

### Run docs locally:

#### Compodoc:

```bash
  $ npm run compodoc:dev
```

#### VitePress docs:

```bash
  $ npm run docs:dev
```
