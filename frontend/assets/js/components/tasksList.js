let tasksList = {

  init: function () {
    tasksList.loadTasksFromAPI();

    // Les écouteurs d'évènements étant ajoutés lors de la création 
    // des éléments task => plus besoin d'appeler bindAllTasksEvents()
    // tasksList.bindAllTasksEvents();
    // Désormais, les écouteurs de chaque tache sont ajoutés
    // de la même façon que lors de leur création via le formulaire d'ajout
  },

  //======================================
  // Handlers
  //======================================

  //======================================
  // Events
  //======================================

  //======================================
  // API
  //======================================

  loadTasksFromAPI: function () {
    // On récupère les taches depuis l'API
    let promise = fetch(app.apiRootURL + "/tasks");

    // On dit quoi faire une fois la réponse reçue
    promise.then(function (response) {
      let jsonPromise = response.json();
      jsonPromise.then(function (jsonContentFromResponse) {
        console.log(jsonContentFromResponse);
        // On dit quoi faire avec le contenu inteprété de la réponse
        // => Pour chaque tache issue de la liste retournée par l'API        
        for (let singleTask of jsonContentFromResponse) {
          // 1. On crée une nouvelle tache
          let newTaskElement = task.createTaskElement(singleTask);

          // 2. On l'insère dans le DOM
          tasksList.insertNewTask(newTaskElement);

        }
      });
    });
  },


  //======================================
  // DOM
  //======================================

  /**
   * Ajoute un élément task dans la liste des tâches
   * @param {HTMLElement} taskElement L'élément tâche à rajouter
   */
  insertNewTask: function (newTaskElement) {
    // Récupération de l'élement du DOM qui contient toutes les taches
    let tasksListElement = document.querySelector(".tasks");

    // Ajout de la tâche à la fin de la liste
    // tasksListElement.appendChild( newTaskElement );

    // Ajout de la tâche au début de la liste
    // https://developer.mozilla.org/fr/docs/Web/API/ParentNode/prepend
    tasksListElement.prepend(newTaskElement);

    tasksList.hideTaskArchive();

  },

  hideTaskArchive: function () {

    let tasksListElement = document.querySelector(".tasks");

    let tasksArchive = tasksListElement.querySelector(".task--archive");

    tasksArchive.classList.add("is-hidden");
  },

  hideTaskActive: function () {

    let tasksArchive = document.querySelectorAll(".task--archive");

    for (let classArchive of tasksArchive) {

      classArchive.classList.remove("is-hidden");
    };

    let tasksTodo = document.querySelectorAll(".task--todo");

    for (let classTodo of tasksTodo) {

      classTodo.classList.add("is-hidden");;
    };

    let tasksComplete = document.querySelectorAll(".task--complete");

    for (let classComplete of tasksComplete) {

      classComplete.classList.add("is-hidden");;
    };

  },


};