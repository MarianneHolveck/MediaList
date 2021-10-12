let task = {

  //======================================
  // Events
  //======================================

  /**
   * Ajoute tous les évènements liés à une tâche
   * @param {HTMLElement} taskElement L'élément du DOM correspondant à la tâche
   */
  bindSingleTaskEvents: function (taskElement) {
    // -------------------------------------------------------------------
    // Ecoute de l'évènement permettant l'édition du titre de la tâche
    // -------------------------------------------------------------------

    // On récupère l'élément du DOM correspondant au titre de la tâche
    let taskTitleLabelElement = taskElement.querySelector(".task__title-label");
    // Dès qu'on clique sur le titre de la tâche, on passe en mode édition
    taskTitleLabelElement.addEventListener("click", task.handleEnableTaskTitleEditMode);

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant de valider le nouveau nom de la tâche
    // -------------------------------------------------------------------

    // On récupère le champ input permettant de modifier le titre de la tâche
    let taskTitleFieldElement = taskElement.querySelector(".task__title-field");
    // On ajoute l'écoute de la perte de focus du champ (par exemple si on clique en dehors du champ input)
    taskTitleFieldElement.addEventListener("blur", task.handleValidateNewTaskTitle)
    // On ajoute l'écouter de la saisie d'une touche du clavier
    taskTitleFieldElement.addEventListener("keydown", task.handleValidateNewTaskTitleOnKeyDown);

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant de compléter la tâche
    // -------------------------------------------------------------------

    // On récupère le bouton "compléter la tache"
    let taskCompleteButtonElement = taskElement.querySelector(".task__button--validate");
    taskCompleteButtonElement.addEventListener("click", task.handleCompleteTask)

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant de incompléter la tâche
    // -------------------------------------------------------------------

    // On récupère le bouton "incompléter la tache"
    let taskIncompleteButtonElement = taskElement.querySelector(".task__button--incomplete");
    taskIncompleteButtonElement.addEventListener("click", task.handleIncompleteTask)

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant d'archiver une tâche'
    // -------------------------------------------------------------------

    let taskArchiveButtonElement = taskElement.querySelector(".task__button--archive");
    taskArchiveButtonElement.addEventListener("click", task.handleArchiveTask);

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant de désarchiver une tâche
    // -------------------------------------------------------------------

    let taskDesarchiveButtonElement = taskElement.querySelector(".task__button--desarchive");
    taskDesarchiveButtonElement.addEventListener("click", task.handleDesarchiveTask);

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant de supprimer une tâche
    // -------------------------------------------------------------------

    let taskDeleteButtonElement = taskElement.querySelector(".task__button--delete");
    taskDeleteButtonElement.addEventListener("click", task.handleDeleteTask);


  },

  //======================================
  // Handlers
  //======================================

  /**
   * Méthode gérant le passage en mode édition du titre de la tâche
   * @param {Event} evt 
   */
  handleEnableTaskTitleEditMode: function (evt) {
    // Pour passer visuellement en mode édition du titre de la tâche, 
    // on va devoir ajouter la classe 'task--edit' sur l'élément tâche.
    // Pour cela, on a donc besoin d'accéder à l'élément tâche contenant l'élément titre.

    // On commence par récupèrer l'élément titre sur lequel l'évènement click s'est produit
    let taskTitleDisplayElement = evt.currentTarget;

    // On cherche ensuite dans les ancêtres de l'élément titre le 
    // premier élément du DOM qui possède la classe 'task'.
    // Doc de closest : https://developer.mozilla.org/fr/docs/Web/API/Element/closest
    let taskElement = taskTitleDisplayElement.closest(".task");

    // Enfin, on ajoute la classe 'task--edit' sur l'élément tâche
    // Doc de classList : https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    taskElement.classList.add("task--edit");

    // Bonus UX : on met le focus dans l'input pour pouvoir directement
    // modifier son contenu
    taskElement.querySelector('.task__title-field').focus();
  },

  /**
   * Méthode gérant la validation du nouveau titre de la tâche sur l'évènement 'blur'
   * @param {Event} evt 
   */
  handleValidateNewTaskTitle: function (evt) {
    // On récupèré l'input dont on sort
    let taskTitleFieldElement = evt.currentTarget;

    // On récupère sa valeur
    let newTaskTitle = taskTitleFieldElement.value;

    // On a également besoin d'accéder à l'élément tâche pour :
    // - mettre à jour le titre de la la tâche
    // - quitter le "mode édition"
    let taskElement = taskTitleFieldElement.closest(".task");

    // 1. Mettre à jour le titre de la tache dans la balise <p>
    let taskTitleLabelElement = taskElement.querySelector(".task__title-label");

    // Autre solution : https://developer.mozilla.org/en-US/docs/Web/API/Element/previousElementSibling
    // let taskTitleLabelElement = taskTitleFieldElement.previousElementSibling;

    // Au lieu de modifier le DOM directement on passe par l'API

    // Récupération de l'id de la tache a compléter
    let taskId = taskElement.dataset.id;

    // Préparation des données à modifier coté API

    let data = {
      title: newTaskTitle
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };
    // Je lance ma requete, sans oublier de fournir les options en 2e param ;)
    let promise = fetch(app.apiRootURL + "/tasks/" + taskId, fetchOptions);

    // Lorqu'on reçoit la réponse
    promise.then(function (response) {
      if (response.status === 204) {
        // Maintenant que j'ai mon élément <p> je remplace son contenu TEXTUEL
        taskTitleLabelElement.textContent = newTaskTitle;

        // On quitte le "mode édition"
        taskElement.classList.remove("task--edit");

      } else {
        console.log("Error Fetch : " + response.status);
        alert("Impossible de compléter la tache(" + response.status + "")
      }
    });

  },

  /**
   * Méthode gérant la validation du nouveau titre de la tâche sur l'évènement 'keydown'
   * (c'est la touche Entrée qui permettra de valider la modification)
   * @param {Event} evt 
   */
  handleValidateNewTaskTitleOnKeyDown: function (evt) {
    // console.log( evt );
    if (evt.key === "Enter") {
      task.handleValidateNewTaskTitle(evt);
    }
  },

  /**
   * Méthode gérant le passage d'une tâche non terminée à une tâche 
   * terminée/complétée lors du clic sur le bouton 'complete' de la tâche
   * @param {Event} evt 
   */
  handleCompleteTask: function (evt) {
    // Récupération du bouton à l'origine de l'event
    let taskCompleteButtonElement = evt.currentTarget;

    // Recherche de l'élement du DOM de la tache correspondante
    let taskElement = taskCompleteButtonElement.closest(".task");

    // Récupération de l'id de la tache a compléter
    let taskId = taskElement.dataset.id;

    // Préparation des données à modifier coté API

    let data = {
      completion: 100
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };
    // Je lance ma requete, sans oublier de fournir les options en 2e param ;)
    let promise = fetch(app.apiRootURL + "/tasks/" + taskId, fetchOptions);

    // Lorqu'on reçoit la réponse
    promise.then(function (response) {
      if (response.status === 204) {
        // Modification de la complétion de la tâche
        // UNIQUEMENT si la requète API qui défini la tâche comme complétée
        // m'indique qu'elle a fonctionné
        task.markTaskAsComplete(taskElement);
      } else {
        console.log("Error Fetch : " + response.status);
        alert("Impossible de compléter la tache(" + response.status + "")
      }
    });


  },

  handleIncompleteTask: function (evt) {
    // Récupération du bouton à l'origine de l'event
    let taskIncompleteButtonElement = evt.currentTarget;

    // Recherche de l'élement du DOM de la tache correspondante
    let taskElement = taskIncompleteButtonElement.closest(".task");

    // Récupération de l'id de la tache a compléter
    let taskId = taskElement.dataset.id;

    // Préparation des données à modifier coté API

    let data = {
      completion: 0
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };
    // Je lance ma requete, sans oublier de fournir les options en 2e param ;)
    fetch(app.apiRootURL + "/tasks/" + taskId, fetchOptions);

    // Modification de la complétion de la tâche
    task.markTaskAsIncomplete(taskElement);
  },

  handleArchiveTask: function (evt) {
    // on récupère l'élément à l'origine de l'event
    let taskArchiveButtonElement = evt.currentTarget;
    // Recherche de l'élement du DOM de la tache correspondante
    let taskElement = taskArchiveButtonElement.closest(".task");

    // Récupération de l'id de la tache a compléter
    let taskId = taskElement.dataset.id;


    let data = {
      status: 2
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };
    // Je lance ma requete, sans oublier de fournir les options en 2e param ;)
    let promise = fetch(app.apiRootURL + "/tasks/" + taskId, fetchOptions);

    // Lorqu'on reçoit la réponse
    promise.then(function (response) {
      if (response.status === 204) {
        // Modification du status de la tâche
        // UNIQUEMENT si la requète API qui défini la tâche comme complétée
        // m'indique qu'elle a fonctionné
        task.markTaskAsArchive(taskElement);
      } else {
        console.log("Error Fetch : " + response.status);
        alert("Impossible de d'archiver la tache(" + response.status + "")
      }
    });


  },

  handleDesarchiveTask: function (evt) {

    // on récupère l'élément à l'origine de l'event
    let taskDesarchiveButtonElement = evt.currentTarget;
    // Recherche de l'élement du DOM de la tache correspondante
    let taskElement = taskDesarchiveButtonElement.closest(".task");

    // Récupération de l'id de la tache a desarchiver
    let taskId = taskElement.dataset.id;


    let data = {
      status: 1
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };
    // Je lance ma requete, sans oublier de fournir les options en 2e param ;)
    let promise = fetch(app.apiRootURL + "/tasks/" + taskId, fetchOptions);

    // Lorqu'on reçoit la réponse
    promise.then(function (response) {
      if (response.status === 204) {
        // Modification du status de la tâche
        // UNIQUEMENT si la requète API qui défini la tâche comme complétée
        // m'indique qu'elle a fonctionné
        task.markTaskDesarchive(taskElement);
      } else {
        console.log("Error Fetch : " + response.status);
        alert("Impossible de d'archiver la tache(" + response.status + "")
      }
    });
  },

  handleDeleteTask: function (evt) {
    // on récupère l'élément à l'origine de l'event
    let taskDeleteButtonElement = evt.currentTarget;
    // Recherche de l'élement du DOM de la tache correspondante
    let taskElement = taskDeleteButtonElement.closest(".task");

    // Récupération de l'id de la tache a compléter
    let taskId = taskElement.dataset.id;

    let data = {
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: 'DELETE',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };
    // Je lance ma requete, sans oublier de fournir les options en 2e param ;)
    let promise = fetch(app.apiRootURL + "/tasks/" + taskId, fetchOptions);

    // Lorqu'on reçoit la réponse
    promise.then(function (response) {
      if (response.status === 204) {
        // Modification du status de la tâche
        // UNIQUEMENT si la requète API qui défini la tâche comme complétée
        // m'indique qu'elle a fonctionné
        alert("La tâche a bien été supprimé")
      } else {
        console.log("Error Fetch : " + response.status);
        alert("Impossible de d'archiver la tache(" + response.status + "")
      }
    });

  },

  //======================================
  // DOM
  //======================================

  /**
   * Méthode permettant de terminer/compléter une tâche
   * @param {Element} taskElement 
   */
  markTaskAsIncomplete: function (taskElement) {
    // On enlève la classe task--complete
    taskElement.classList.remove("task--complete");
    // Puis on ajoute la classe task-todo
    taskElement.classList.add("task--todo");

    // Solution en une ligne
    // Doc classList : https://developer.mozilla.org/fr/docs/Web/API/Element/classLis
    //  taskElement.classList.replace( "task--todo", "task--complete" );

    let newTaskProgessBarElement = taskElement.querySelector('.progress-bar__level');
    newTaskProgessBarElement.style.width = "0%";
  },

  markTaskAsComplete: function (taskElement) {

    // Récupération de l'id de la tâche à compléter

    taskElement.classList.remove("task--todo");
    // Puis on ajoute la classe task-complete
    taskElement.classList.add("task--complete");

    let newTaskProgessBarElement = taskElement.querySelector('.progress-bar__level');
    newTaskProgessBarElement.style.width = "100%";

  },

  /**
   * Méthode permettant de créer un nouvel élément tâche
   * SANS l'ajouter dans le DOM et le retourner
   * @param {String} newTaskTitle 
   * @param {String} newTaskCategoryName 
   * @return {Element} newTaskElement
   */
  createTaskElement: function (newTaskObject) {
    //-------------------------------------------------------------------
    // Création du clone du template
    //-------------------------------------------------------------------

    // Récupération de l'élément <template>
    let taskTemplateElement = document.querySelector("#task-template");
    // Récupération du contenu de template
    let taskTemplateElementContent = taskTemplateElement.content;
    // Clonage du CONTENU du template
    let taskCloneElementFragment = taskTemplateElementContent.cloneNode(true);

    // taskTemplateElementContent est de type #document-fragment
    // Le fragment de document sert de container à l'élément "task"
    // console.log( taskCloneElementFragment );
    // Ainsi, si on veut travailler directement avec l'élément "task"
    // on doit récupérer le contenu à l'intérieur du fragment de document
    let newTaskElement = taskCloneElementFragment.firstElementChild;
    // console.log(newTaskElement);

    // Version en une seule ligne : 
    //  let newTaskElement = document.querySelector( "#task-template" ).content.cloneNode( true ).firstElementChild;

    //-------------------------------------------------------------------
    // Mise à jour des données de la nouvelle tache
    //-------------------------------------------------------------------

    // Je stocke l'id de la tâche dans un dataset pour plus tard
    newTaskElement.dataset.id = newTaskObject.id;

    task.updateTaskTitle(newTaskElement, newTaskObject.title);

    // Je donne tout le sous-objet category à cette méthode
    task.updateTaskCategoryName(newTaskElement, newTaskObject.category);

    // On se base sur la completion pour déterminer si la tache est complétée

    if (newTaskObject.completion >= 100) {

      task.markTaskAsComplete(newTaskElement);
    }

    // On se base sur le status pour déterminer si la tache est archiver

    if (newTaskObject.status >= 2) {

      task.markTaskAsArchive(newTaskElement);
    }


    //-------------------------------------------------------------------
    // Enregistrement des écouteurs d'événement
    //-------------------------------------------------------------------

    task.bindSingleTaskEvents(newTaskElement);

    // On oublie pas de retourner l'élément fraichement créé !
    return newTaskElement;
  },

  /**
   * Méthode gérant la mise à jour du titre d'une tâche
   * @param {Element} taskElement La tâche à modifier
   * @param {String} taskTitle Le nouveau titre de la tâche
   */
  updateTaskTitle: function (taskElement, taskTitle) {
    // Mettre à jour le titre de la tache dans la balise <p>
    let taskTitleLabelElement = taskElement.querySelector(".task__title-label");

    // Maintenant que j'ai mon élément <p> je remplace son contenu TEXTUEL
    taskTitleLabelElement.textContent = taskTitle;

    // Il faut aussi penser à changer la value de l'input cloné !
    let taskTitleFieldElement = taskElement.querySelector('.task__title-field');
    taskTitleFieldElement.value = taskTitle;

    // Bidouille pour navigateur récalcitrant 
    // Pour certains, modifier la value de l'input ne fonctionne pas :o
    taskTitleFieldElement.setAttribute("value", taskTitle);

    // Bonus : On pourrait réutiliser cette méthode pour 
    // la validation de l'édition du nom d'une tache existante
    // dans => task.handleValidateNewTaskTitle()
  },

  /**
   * Méthode gérant la mise à jour du nom de la catégorie d'une tâche
   * @param {Element} taskElement La tâche à modifier
   * @param {String} taskCategoryName Le nouveau nom de la catégorie de la tâche
   */
  updateTaskCategoryName: function (taskElement, taskCategoryObject) {
    // Récupération de l'élément <p> qui contient la catégorie
    let taskCategoryNameElement = taskElement.querySelector(".task__category p")

    // Modification de sa valeur textuelle
    taskCategoryNameElement.textContent = taskCategoryObject.name;

    // Mise à jour de l'attribut data-category
    taskElement.dataset.category = taskCategoryObject.id;
  },

  markTaskAsArchive: function (taskElement) {

    // Récupération de l'id de la tâche à compléter

    taskElement.classList.remove("task--todo");
    // Puis on ajoute la classe task-complete
    taskElement.classList.add("task--archive");

  },

  markTaskDesarchive: function (taskElement) {

    // Récupération de l'id de la tâche à compléter

    taskElement.classList.remove("task--archive");
    // Puis on ajoute la classe task-complete
    taskElement.classList.add("task--todo");
  },

};