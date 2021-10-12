let app = {

  // On conserve la route
  apiRootURL: 'http://localhost:8080',
  // La méthode init contient le code que l'on veut 
  // exécuter au lancement de l'application

  init: function () {
    console.log("Module app chargé");

    // Initialisation du module tasksList
    tasksList.init();

    // Initialisation du module newTaskForm
    newTaskForm.init();

    // Initialisation du module categoriesList
    categoriesList.init();

    filters.init();

  }

};

// On ajoute un écouteur d'évènement pour pouvoir lancer l'application
// dès que le DOM sera chargé
document.addEventListener("DOMContentLoaded", app.init);

// Si on appelle app.init() directement, il est possible que
// le DOM ne soit pas encore totalement chargé à ce moment là
// Ca posera des problèmes si on essaye de le manipuler
//   app.init();