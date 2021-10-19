let media = {

  //======================================
  // Events
  //======================================

  /**
   * Ajoute tous les évènements liés à une tâche
   * @param {HTMLElement} mediaElement L'élément du DOM correspondant à la tâche
   */
  bindSingleMediaEvents: function (mediaElement) {
    
    // -------------------------------------------------------------------
    // Ecoute de l'évènement permettant l'édition du titre de la tâche
    // -------------------------------------------------------------------

    // -------------------------------------------------------------------
    // Ecoute des évènements permettant de valider le nouveau nom de la tâche
    // -------------------------------------------------------------------

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



};