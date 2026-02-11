# GIT.md — Regras de commit (Claude Code como assistente)

## Objetivo
Garantir que **todos os commits no GitHub apareçam apenas como meus** (Author e Committer),
mesmo quando o Claude Code executar o `git commit`.

---

## 1) Configuração padrão do repositório (recomendado)
Rode dentro do repo (vale só para este projeto):

```bash
git config user.name "SEU NOME"
git config user.email "seu-email@dominio.com"
```

> Use o **mesmo e-mail** que está ligado ao seu GitHub (ou o e-mail `...@users.noreply.github.com`).

---

## 2) Forçar commits “100% eu” (Author + Committer)
Quando pedir pro Claude commitar, peça para ele usar:

```bash
GIT_COMMITTER_NAME="SEU NOME" GIT_COMMITTER_EMAIL="seu-email@dominio.com" git commit --author="SEU NOME <seu-email@dominio.com>" -m "mensagem"
```

Isso impede o Claude de aparecer como “committer”.

---

## 3) Evitar que o Claude apareça como co-autor
Se o Claude estiver adicionando linhas do tipo:

```
Co-authored-by: Claude <...>
```

**Não use essas linhas**.

### Se já foi commitado com Co-authored-by
Para remover do último commit:

```bash
git commit --amend
```

- Apague a linha `Co-authored-by: ...` do editor
- Salve e feche

Se você já tinha dado push:

```bash
git push --force-with-lease
```

---

## 4) “Arrumar” commits antigos onde o Claude ficou como committer/author

### Ajustar o último commit (author/committer)
```bash
GIT_COMMITTER_NAME="SEU NOME" GIT_COMMITTER_EMAIL="seu-email@dominio.com" git commit --amend --reset-author --no-edit
```

Depois (se já tinha push):
```bash
git push --force-with-lease
```

---

## 5) Texto pronto pra você colar quando pedir commit pro Claude
Use este prompt:

> **Ao commitar:** NÃO adicione `Co-authored-by`.  
> Configure o commit para aparecer **apenas como meu** (Author e Committer).  
> Use:  
> `GIT_COMMITTER_NAME="SEU NOME" GIT_COMMITTER_EMAIL="seu-email@dominio.com" git commit --author="SEU NOME <seu-email@dominio.com>" -m "..."`

---

## Checklist rápido
- [ ] `git config user.name` e `git config user.email` estão com meus dados?
- [ ] Commit foi feito com `GIT_COMMITTER_*` + `--author`?
- [ ] Não existe `Co-authored-by` na mensagem do commit?
