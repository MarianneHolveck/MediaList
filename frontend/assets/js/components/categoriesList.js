let categoriesList = {

    //======================================
    // Init
    //======================================
  
    init : function()
    {
      categoriesList.loadCategoriesFromAPI();
    },
  
    //======================================
    // API
    //======================================
  
    loadCategoriesFromAPI : function()
    {
      // J'envoi ma requete et je reçois une "promesse" de réponse
      let promise = fetch( app.apiRootURL + "/categories" );
  
      // ENSUITE, comme je ne peux pas savoir QUAND je vais recevoir la réponse
      // j'indique a cette promesse QUOI faire lorsque la réponse arrivera
      promise.then( function( response ) 
      {
        let jsonPromise = response.json();
        jsonPromise.then( function( jsonContentFromResponse ) 
        {
          // ENFIN j'ai accès aux données contenues dans la réponse
          // je peux en faire ce que j'en veux
          categoriesList.createSelectFromCategories( jsonContentFromResponse );
        } );
      } );
    },
  
    //======================================
    // Events
    //======================================
  
    //======================================
    // DOM
    //======================================
  
    /**
     * Méthode permettant de créer les <select> des catégories
     * et de les ajouter au DOM
     * @param {Array} jsonContentFromResponse 
     */
    createSelectFromCategories : function( jsonContentFromResponse )
    {
      // Création du select pour le filtre des tâches
      let selectElementForMediaFilters = categoriesList.createSelectElement( jsonContentFromResponse, "Toutes les catégories", "filters__choice" );
      // Ajout de ce nouveau select à la page
      document.querySelector( ".filters__media--category" ).appendChild( selectElementForMediaFilters );
  
      // Création du select pour le formulaire d'ajout de tâche
      let selectElementForNewMediaForm = categoriesList.createSelectElement( jsonContentFromResponse, "Choisir une catégorie" );
      // Ajout de ce nouveau select à la page
      document.querySelector( ".media--add .media__category .select" ).appendChild( selectElementForNewMediaForm );
  
    },
  
    // ####################################################################
    //                              DOM
    // ####################################################################
    /**
     * Méthode permettant de générer une liste déroulante des catégories
     * @param {Array} jsonContentFromResponse Tableau contenant la liste des catégories
     * @param {String} defaultLabel Le libellé de la première valeur de la liste
     * @param {String} className Le nom de la classe à rajouter sur le <select>
     * @returns {HTMLElement} Un élément <select> avec les <option> remplies
     */
    createSelectElement( jsonContentFromResponse, defaultLabel, className = '' )
    {
      // Création de l'élément <select>
      let selectElement = document.createElement( "select" );
  
      // Ajouter l'éventuel attribut class si le paramètre className est fourni
      if( className !== '' )
      {
        selectElement.classList.add( className );
      }
  
      // Création de la première <option> comme valeur par défaut
      let defaultOption = document.createElement( "option" );
      // On modifie son contenu textuel
      defaultOption.textContent = defaultLabel;
      // On ajoute l'<option> au <select>
      selectElement.appendChild( defaultOption );
  
      // On parcourt la liste des catégories pour créer
      // une <option> pour chacune d'elle
      for( let categoryObject of jsonContentFromResponse )
      {
        // Création de l'élement <option>
        let optionElement = document.createElement( "option" );
        // Modification de son contenu textuel
        optionElement.setAttribute('value', categoryObject.id)
        optionElement.textContent = categoryObject.name
        // Bonus : On modifie également la value de l'option
        optionElement.setAttribute( "value", categoryObject.id );
        // On ajoute notre nouvelle <option> au <select>
        selectElement.appendChild( optionElement );
      }
  
      return selectElement;
    }
  
    //======================================
    // Handlers
    //======================================
  
  };