let filters = {

  showArchivedTasks: false,

  init: function () {
    // On récupère l'élément du DOM correspondant au titre de la tâche
    let tasksArchiveDivElement = document.querySelector(".filters__task--archived");

    let tasksArchiveButtonElement = tasksArchiveDivElement.querySelector(".filters__choice");
    // Dès qu'on clique sur le titre de la tâche, on passe en mode édition
    tasksArchiveButtonElement.addEventListener("click", filters.handleShowArchiveTask);

    if (filters.showArchivedTasks === true) {
      // On récupère l'élément du DOM correspondant au titre de la tâche
      let tasksAcitveDivElement = document.querySelector(".filters__task--actived");

      let tasksActiveButtonElement = tasksAcitveDivElement.querySelector(".filters__choice");
      // Dès qu'on clique sur le titre de la tâche, on passe en mode édition
      tasksActiveButtonElement.addEventListener("click", filters.handleShowActiveTask);
    }
  },


  //======================================
  // Handlers
  //======================================

  handleShowArchiveTask: function (evt) {

    filters.showArchivedTasks = true;

    filters.transformArchiveElement();
  },

  handleShowActiveTask: function (evt) {
    
    filters.showArchivedTasks = false;

    filters.transformArchiveElement();
  },

  //======================================
  // DOM
  //======================================


  transformArchiveElement: function () {

    if (filters.showArchivedTasks === true) {

      let tasksArchiveButtonElement = document.querySelector(".filters__task--archived");

      let insideTaskArchiveButtonElement = tasksArchiveButtonElement.querySelector(".filters__choice");

      insideTaskArchiveButtonElement.textContent = "Voir les tâches actives";

      tasksList.hideTaskActive();

      tasksArchiveButtonElement.classList.add("filters__task--actived");

      tasksArchiveButtonElement.classList.remove("filters__task--archived");
    }

    if (filters.showArchivedTasks === false) {

      let tasksArchiveButtonElement = document.querySelector(".filters__task--actived");

      let insideTaskArchiveButtonElement = tasksArchiveButtonElement.querySelector(".filters__choice");

      insideTaskArchiveButtonElement.textContent = "Voir les archives";

      tasksList.hideTaskArchive();

      tasksArchiveButtonElement.classList.add("filters__task--archived");

      tasksArchiveButtonElement.classList.remove("filters__task--actived");
    }

  }

};