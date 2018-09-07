Dinnertable.chat

- [Stack](#stack)
- [Getting started](#getting-started)
- [Configs](#configs)

### Stack

* Typescript
* React
* material-ui

### Getting started

Configure AWS to use your DTC aws account :
* required: accessKeyId and secretAccessKey)
* Use `us-east-1`
```
npm install -g awsmobile-cli
awsmobile configure
```

After cloning project:
```
npm install
awsmobile init 842a85ef-0cf3-4602-beac-784388fbbf64

npm start
```

### Configs

* [base config](.env)
* [local development config](.env.development)

**Note:** Create a file called `.env.development.local` to override. It will not be committed into the repo.