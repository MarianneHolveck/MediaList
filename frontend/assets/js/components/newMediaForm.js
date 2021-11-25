let newMediaForm = {

  //======================================
  // Event
  //======================================

  init: function () {
    
    // -------------------------------------------------------------------
    // Ecoute de la soumission du formulaire d'ajout d'un média
    // -------------------------------------------------------------------

    // On récupère l'élèment correspondant au formulaire d'ajout

    let newMediaFormElement = document.querySelector(".media--add form");

    newMediaFormElement.addEventListener("submit", newMediaForm.handleNewMediaFormSubmit);
  },

  //======================================
  // Handlers
  //======================================

  /**
   * Méthode gérant la soumission du formulaire d'ajout d'un media
   * @param {Event} evt 
   */

  handleNewMediaFormSubmit: function (evt) {

    // On bloque la soumission du formulaire, car on veut traiter les données fournies directement sans recharger la page
    evt.preventDefault();

    // Récupération du formulaire
    let newMediaFormElement = evt.currentTarget;

    // Récupération du nouveau titre
    let mediaTitleFieldElement = newMediaFormElement.querySelector(".media__title-field");
    let newMediaTitle = mediaTitleFieldElement.value;

    // Récupération de la nouvelle catégorie

    let mediaCategoryElement = newMediaFormElement.querySelector(".media__category select");
    let newMediaCategoryId = mediaCategoryElement.value;

    // Préparation des données à envoyer à L'API
    let data = {
      title: newMediaTitle,
      categoryId: newMediaCategoryId
    }

    // On prépare les entêtes HTTP de la requète afin de spécidier que les données sont en JSON
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
    let promise = fetch(app.apiRootURL + "/medias", fetchOptions);

    // Lorqu'on reçoit la réponse
    promise.then(function (response) {
      if (response.status === 201) {
        // Une fois que l'API indique avoir bien créé le média

        let jsonPromise = response.json();

        // On dit quoi faire lorsque que l'interprétation est terminée
        jsonPromise.then(function (json) {
          // Création de la nouvelle tache
          let newMediaElement = media.createMediaElement(json);

          // Affichage de la nouvelle tache dans la liste
          mediasList.insertNewMedia(newMediaElement);
          
          newMediaFormElement.reset();

        });

      } else {
        console.log("Error Fetch : " + response.status);
        alert("Impossible d'ajout' la tache(" + response.status + "")
      }
    });


  },



};