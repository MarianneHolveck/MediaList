let media = {

  //======================================
  // Events
  //======================================

  /**
   * Ajoute tous les évènements liés à un media
   * @param {HTMLElement} mediaElement L'élément du DOM correspondant au media
   */
  bindSingleMediaEvents: function (mediaElement) {

    // -------------------------------------------------------------------
    // Ecoute de l'évènement permettant l'édition du titre de la tâche
    // -------------------------------------------------------------------

    let mediaTitleLabelElement = mediaElement.querySelector(".media__title-label");

    mediaTitleLabelElement.addEventListener("click", media.handleEnableMediaTitleEditMode);

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant de valider le nouveau nom de la tâche
    // -------------------------------------------------------------------

    let mediaTitleFieldElement = mediaElement.querySelector(".media__title-field");

    mediaTitleFieldElement.addEventListener('blur', media.handleValidateNewMediaTitle);

    mediaTitleFieldElement.addEventListener('keydown', media.handleValidateNewMediaTitleOnKeydown);

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant de marqué le média comme vu
    // -------------------------------------------------------------------

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant de le marqué comme pas vu
    // -------------------------------------------------------------------

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant d'afficher tous les médias les medias
    // -------------------------------------------------------------------

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant d'afficher les medias vu
    // -------------------------------------------------------------------

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant d'afficher les medias pas vu
    // -------------------------------------------------------------------

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant de supprimer un media
    // -------------------------------------------------------------------



  },

  //======================================
  // Handlers
  //======================================

  //======================================
  // DOM
  //======================================

  createMediaElement: function (newMediaObject) {

    //-------------------------------------------------------------------
    // Création du clone du template
    //-------------------------------------------------------------------

    // récupération de l'élément <template>
    let mediaTemplateElement = document.querySelector("#media-template");
    // Récupération du contenu de template
    let mediaTemplateElementContent = mediaTemplateElement.content;

    // Clonage du CONTENU du template
    let mediaCloneElementFragment = mediaTemplateElementContent.cloneNode(true);

    // On récupère ce qui se trouve à l'intérieur du fragment pour travailler avec
    let newMediaElement = mediaCloneElementFragment.firstElementChild;

    //-------------------------------------------------------------------
    // Mise à jour des données du nouveau media
    //-------------------------------------------------------------------

    // Je crée un dataset de l'id 
    newMediaElement.dataset.id = newMediaObject.id;

    media.updateMediaTitle(newMediaElement, newMediaObject.title);

    media.updateMediaCategoryName(newMediaElement, newMediaObject.category);

    // on se base sur le status pour déterminer si le media est vu ou non
    if (newMediaObject.status >= 2) {
      media.markMediaAsSeen(newMediaElement);
    }

    //-------------------------------------------------------------------
    // Enregistrement des écouteurs d'événement
    //-------------------------------------------------------------------

    // Pour que l'écoute d'un évènement se fasse comme il faut
    media.bindSingleMediaEvents(newMediaElement);

    // On renvoie l'element crée
    return newMediaElement;
  },


  /**
   * Méthode gérant la mise à jour du nom du media
   * @param {Element} mediaElement Le media à modifier
   * @param {String} mediaTitle Le nouveau nom du media
   */
  updateMediaTitle: function (mediaElement, mediaTitle) {

    // On modifie ce qui se trouve dans la balise <p>
    let mediaTitleLabelElement = mediaElement.querySelector(".media__title-label");

    mediaTitleLabelElement.textContent = mediaTitle;

    // On modifie la value de l'input

    let mediaTitleFieldElement = mediaElement.querySelector(".media__title-field")

    mediaTitleFieldElement.value = mediaTitle;

    // On force les navigateur récalcitrant

    mediaTitleFieldElement.setAttribute("value", mediaTitle);

  },

  /**
   * Méthode gérant la mise à jour du nom de la catégorie d'un media
   * @param {Element} mediaElement Le media à modifier
   * @param {String} mediaCategoryName Le nouveau nom de la catégorie du media
   */
  updateMediaCategoryName: function (mediaElement, mediaCategoryObject) {
    // Récupération de l'élement qui contient le nom de la categorie
    let mediaCategoryNameElement = mediaElement.querySelector(".media__category p");

    // modifiction de sa valeur
    mediaCategoryNameElement.textContent = mediaCategoryObject.name;

    // Mise à jour de l'attribue data-category
    mediaElement.dataset.category = mediaCategoryObject.id;

  },

  markMediaAsSeen: function (mediaElement) {
    // Récupération de l'id du media

    mediaElement.classList.remove("media--tosee");

    mediaElement.classList.add("media--seen");

  },

  markMediaAsNotSeen: function (mediaElement) {
    // Récupération de l'id du media

    mediaElement.classList.remove("media--seen");

    mediaElement.classList.add("media--tosee");
  },

  /**
   * Méthode gérant le passage en mode édition du titre du media
   * @param {Event} evt 
   */ // handleValidateNewMediaTitle: function(evt){

  //   let mediaTitleFieldElement = evt.currentTarget;

  //   let newMediaTitle = mediaTitleFieldElement.value;

  //   let mediaElement = mediaTitleFieldElement.closest('.media')


  // },
  handleEnableMediaTitleEditMode: function (evt) {

    let mediaTitleDisplayElement = evt.currentTarget;

    let mediaElement = mediaTitleDisplayElement.closest(".media");

    mediaElement.classList.add("media--edit");

    mediaElement.querySelector(".media__title-field").focus();

  },

  handleValidateNewMediaTitle: function (evt) {

    // On récupèré l'input dont on sort
    let mediaTitleFieldElement = evt.currentTarget;

    // On récupère sa valeur
    let newMediaTitle = mediaTitleFieldElement.value;

    // On a également besoin d'accéder à l'élément media pour :
    // - mettre à jour le titre du media
    // - quitter le "mode édition"
    let mediaElement = mediaTitleFieldElement.closest('.media');

    // 1. Mettre à jour le titre de la tache dans la balise <p>
    let mediaTitleLabelElement = mediaElement.querySelector(".media__title-label");

    // Récupération de l'id de la tache a compléter
    let mediaId = mediaElement.dataset.id;

    let data = {
      title: newMediaTitle
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
    let promise = fetch(app.apiRootURL + "/medias/" + mediaId, fetchOptions);

    // Lorqu'on reçoit la réponse
    promise.then(function (response) {
      if (response.status === 204) {
        // Maintenant que j'ai mon élément <p> je remplace son contenu TEXTUEL
        mediaTitleLabelElement.textContent = newMediaTitle;

        // On quitte le "mode édition"
        mediaElement.classList.remove("media--edit");

      } else {
        console.log("Error Fetch : " + response.status);
        alert("Impossible de compléter le media(" + response.status + "")
      }
    });

  },

  handleValidateNewMediaTitleOnKeydown: function (evt) {
    if (evt.key === "Enter") {
      media.handleValidateNewMediaTitle(evt);
    }
  },


};