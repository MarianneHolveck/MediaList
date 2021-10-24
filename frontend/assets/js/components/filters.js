let filters = {

  showViewMedia: false,

  init: function () {

    //======================================
    // Event
    //======================================
    // -------------------------------------------------------------------
    // Ecoute de l'évènement permettant l'affichage des médias vues ou non vues
    // -------------------------------------------------------------------

    // On récupère la div où se trouve les filtres
    let mediaSeenDivElement = document.querySelector(".filters__media--completion");


    // On demande à écouter l'event du click sur le bouton contenu dans la div
    mediaSeenDivElement.addEventListener("click", (event) => {
      const isButton = event.target.nodeName === 'BUTTON';
      if (!isButton) {
        return;
      }
      // On renvoi dans le handle le contenu du bouton cliqué
      filters.handleShowMediaSeen(event.target.textContent);
    });


  },


  //======================================
  // Handlers
  //======================================

  // On indique quoi faire lorsque que le bouton est clique
  handleShowMediaSeen: function (evt) {

    // On récupère ce qui se trouve dans le bouton
    let mediaFilterButtonPressed = evt;

    // console.log(mediaFilterButtonPressed);

    // On vérifie à quoi correspond le bouton et on revoi vers la bonne fonction
    if (mediaFilterButtonPressed === "Vu") {
      filters.showSeenMedia();
    }

    if (mediaFilterButtonPressed === "Pas Vu") {
      filters.showOnlyNotSeenMedia();
    }

    if (mediaFilterButtonPressed === "Tous") {
      filters.showAllMedia();
    }


  },


  //======================================
  // DOM
  //======================================

  // -------------------------------------------------------------------
  // Gestion de l'affichage des medias vues ou non vues
  // -------------------------------------------------------------------

  //* Fonction qui affiche les medias vus 
  showSeenMedia: function () {
    // On récupère tous les médias à voir
    let mediasToSee = document.querySelectorAll(".media--tosee");

    // Pour chaque élément on le cache
    for (let classToSee of mediasToSee) {
      classToSee.classList.add("is-hidden");
    }

    // On récupère tous les médias vus
    let mediasSeen = document.querySelectorAll(".media--seen");

    // Pour chaque élément on les affiche
    for (let classSeen of mediasSeen) {
      classSeen.classList.remove("is-hidden");
    }

    // On gère l'affichage des buttons cliqué :
    // Comme tous les bouttons ont la même classe il va falloir tous les récupérer et les vérifiés un par un
    let mediaAllFilterElement = document.querySelectorAll(".filters__media--completion button")

    for (let button of mediaAllFilterElement) {
      let buttonContent = button.textContent;
      if (buttonContent === "Vu") {
        button.classList.add("is-info")
        button.classList.add("is-selected")
      }
      if (buttonContent === "Pas Vu") {
        button.classList.remove("is-info")
        button.classList.remove("is-selected")
      }
      if (buttonContent === "Tous") {
        button.classList.remove("is-info")
        button.classList.remove("is-selected")
      }
    }

  },

  //* Fonction qui affiche les medias pas vus 
  showOnlyNotSeenMedia: function () {
    let mediasSeen = document.querySelectorAll(".media--seen");

    for (let classSeen of mediasSeen) {
      classSeen.classList.add("is-hidden");
    }

    let mediasToSee = document.querySelectorAll(".media--tosee");

    for (let classToSee of mediasToSee) {
      classToSee.classList.remove("is-hidden");
    }

    let mediaAllFilterElement = document.querySelectorAll(".filters__media--completion button")

    for (let button of mediaAllFilterElement) {
      let buttonContent = button.textContent;
      if (buttonContent === "Pas Vu") {
        button.classList.add("is-info")
        button.classList.add("is-selected")
      }
      if (buttonContent === "Vu") {
        button.classList.remove("is-info")
        button.classList.remove("is-selected")
      }
      if (buttonContent === "Tous") {
        button.classList.remove("is-info")
        button.classList.remove("is-selected")
      }
    }

  },

  //* Fonction qui affiche tous les medias 
  showAllMedia: function () {
    let mediasSeen = document.querySelectorAll(".media--seen");

    for (let classSeen of mediasSeen) {
      classSeen.classList.remove("is-hidden");
    }

    let mediasToSee = document.querySelectorAll(".media--tosee");

    for (let classToSee of mediasToSee) {
      classToSee.classList.remove("is-hidden");
    }

    let mediaAllFilterElement = document.querySelectorAll(".filters__media--completion button")

    for (let button of mediaAllFilterElement) {
      let buttonContent = button.textContent;
      if (buttonContent === "Tous") {
        button.classList.add("is-info")
        button.classList.add("is-selected")
      }
      if (buttonContent === "Pas Vu") {
        button.classList.remove("is-info")
        button.classList.remove("is-selected")
      }
      if (buttonContent === "Vu") {
        button.classList.remove("is-info")
        button.classList.remove("is-selected")
      }
    }

  },


};