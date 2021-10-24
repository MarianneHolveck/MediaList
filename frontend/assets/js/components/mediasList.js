let mediasList = {

  init: function () {
    mediasList.loadMediasFromAPI();
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

  loadMediasFromAPI: function () {
    // On récupère les médias depuis l'API

    let promise = fetch(app.apiRootURL + "/medias");

    promise.then(function (response) {
      let jsonPromise = response.json();
      jsonPromise.then(function (jsonContentFromResponse) {
        console.log(jsonContentFromResponse);
        // On dit quoi faire avec le contenu interprété de la réponse
        for (let singleMedia of jsonContentFromResponse) {
          // On crée un nouveau media
          let newMediaElement = media.createMediaElement(singleMedia);

          // On l'insert dans le dom

          mediasList.insertNewMedia(newMediaElement);

          
        }
      });
    });

  },

  //======================================
  // DOM
  //======================================

  insertNewMedia: function (newMediaElement) {
    // Récupération de l'élement du DOM qui contient tous les médias

    let mediasListElement = document.querySelector(".medias");

    mediasListElement.prepend(newMediaElement);

  }


};