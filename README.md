# To-Do List API

L'objectif du projet est de m'entrainer à l'utilisation de Fastify pour créer une API avec système d'authentification.

## Démarrer

Le projet utilise Fastify et Argon2 comme dépendances. Il faut les installer et lancer le serveur de développement.

```bash
npm install
npm run start
```

## Technologies

C'est un petit projet que j'ai essayé de garder léger sans utiliser trop de librairies.

-   NodeJS avec Fastify
-   SQLite

## Endpoints

### Authentification

-   `POST:/v1/auth/signup` permet de créer un nouveau compte
-   `POST:/v1/auth/login` permet de se connecter à un compte
-   `POST:/v1/auth/logout` permet de se déconnecter du compte actuel

## Catégories

-   `GET:/v1/categories` permet de lister toutes les catégories
-   `GET:/v1/categories/:id` permet de récupérer les informations d'une catégorie spécifique
-   `POST:/v1/categories` permet de créer une nouvelle catégorie
-   `PUT:/v1/categories/:id` permet de modifier le titre d'une catégorie
-   `DELETE:/v1/categories/:id` permet de supprimer une catégorie

## To-Do

-   `GET:/v1/todos` permet de lister toutes les To-Do
-   `GET:/v1/todos/:id` permet de récupérer les informations d'une To-Do spécifique
-   `POST:/v1/todos` permet de créer une nouvelle To-Do
-   `PUT:/v1/todos/:id` permet de modifier le status d'une To-Do comme complétée
-   `DELETE:/v1/todos/:id` permet de supprimer une To-Do
-   `PUT:/v1/todos/:id/:categoryId` permet d'ajouter une To-Do à une catégorie

## Utilisation

Vous pouvez vous connecter au compte de test avec les identifiants suivants ou en créer un nouveau avec la requête prévue à cet effet.

-   Nom d'utilisateur : `admin`
-   Mot de passe : `admin`
