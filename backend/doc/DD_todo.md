# Dictionnaire de données

## Tâches (`media`)

|Champ|Type|Spécificités|Description|
|-|-|-|-|
|id|INT|PRIMARY KEY, NOT NULL, UNSIGNED, AUTO_INCREMENT|L'identifiant de notre média|
|title|VARCHAR(128)|NOT NULL|Le titre d'un média|
|status|TINYINT|NOT NULL, DEFAULT 1|Le statut du média (1=vu, 2=non vu)|
|created_at|TIMESTAMP|NOT NULL, DEFAULT CURRENT_TIMESTAMP|La date de création du média|
|updated_at|TIMESTAMP|NULL|La date de la dernière mise à jour du média|
|category_id|INT|NOT NULL, UNSIGNED|Identifiant de la catégorie du média|

## Catégories (`categories`)

|Champ|Type|Spécificités|Description|
|-|-|-|-|
|id|INT|PRIMARY KEY, NOT NULL, UNSIGNED, AUTO_INCREMENT|L'identifiant de notre catégorie|
|name|VARCHAR(64)|NOT NULL|Le nom de la catégorie|
|status|TINYINT|NOT NULL, DEFAULT 1|Le statut de la catégorie (1=active, 2=désactivée)|
|created_at|TIMESTAMP|NOT NULL, DEFAULT CURRENT_TIMESTAMP|La date de création de la catégorie|
|updated_at|TIMESTAMP|NULL|La date de la dernière mise à jour de la catégorie|
