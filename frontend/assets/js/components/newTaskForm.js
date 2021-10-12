let newTaskForm = {

  //======================================
  // Event
  //======================================

  init: function () {
    // -------------------------------------------------------------------
    // Ecoute de la soumission du formulaire d'ajout d'une tâche
    // -------------------------------------------------------------------
    // On récupère l'élément correspond au formulaire d'ajout d'une tâche
    let newTaskFormElement = document.querySelector(".task--add form");
    // On ajoute l'écoute de la soumission de ce form
    newTaskFormElement.addEventListener("submit", newTaskForm.handleNewTaskFormSubmit);
  },

  //======================================
  // Handlers
  //======================================

  /**
   * Méthode gérant la soumission du formulaire d'ajout d'une tâche
   * @param {Event} evt 
   */
  handleNewTaskFormSubmit: function (evt) {
    // On bloque la soumission du formulaire, car on veut traiter
    // les données fournies directement sans recharger la page
    evt.preventDefault();

    // Récupération du formulaire
    let newTaskFormElement = evt.currentTarget;

    // Récupération du titre de la tache
    let taskTitleFieldElement = newTaskFormElement.querySelector(".task__title-field");
    let newTaskTitle = taskTitleFieldElement.value;

    // Récupération du nom de la catégorie de la tache
    let taskCategoryElement = newTaskFormElement.querySelector('.task__category select');
    let newTaskCategoryId = taskCategoryElement.value;

    // Préparation des données à insérer côté API
    let data = {
      title: newTaskTitle,
      categoryId: newTaskCategoryId
    };

    // On prépare les entêtes HTTP (headers) de la requête
    // afin de spécifier que les données sont en JSON
    const httpHeaders = new Headers();
    httpHeaders.append("Content-Type", "application/json");

    // On consomme l'API pour ajouter en DB
    const fetchOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      // On ajoute les headers dans les options
      headers: httpHeaders,
      // On ajoute les données, encodées en JSON, dans le corps de la requête
      body: JSON.stringify(data)
    };
    // Je lance ma requete, sans oublier de fournir les options en 2e param ;)
    let promise = fetch(app.apiRootURL + "/tasks", fetchOptions);

    // Lorqu'on reçoit la réponse
    promise.then(function (response) {
      if (response.status === 201) {
        // Une fois que l'API indique avoir bien créé la tache

        let jsonPromise = response.json();

        // On dit quoi faire lorsque que l'interprétation est terminée
        jsonPromise.then(function (json) {
          // Création de la nouvelle tache
          let newTaskElement = task.createTaskElement(json);

          // Affichage de la nouvelle tache dans la liste
          tasksList.insertNewTask(newTaskElement);

        });

      } else {
        console.log("Error Fetch : " + response.status);
        alert("Impossible d'ajout' la tache(" + response.status + "")
      }
    });



    // Bonus UX : Vider les champs du formulaire
  }

};