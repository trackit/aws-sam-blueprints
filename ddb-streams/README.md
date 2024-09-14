### Docs

```bash
npm install
```

#### Deploy

```bash
sam build --use-container 
```


```bash
sam deploy --no-confirm-changeset

OR 

aws-vault exec trackit-demo -- sam deploy --no-confirm-changeset
```

#### Create items
```
aws-vault exec trackit-demo -- ts-node triggers/create-items.ts
```

#### Find items
```
aws-vault exec trackit-demo -- ts-node triggers/find-items.ts 
```