module.exports = function(application){
    
    application.get("/items", (req, res) => {
      application.src.controllers.items.home(application, req, res);
    })

    application.get("/item/:item_id", (req, res) => {
      application.src.controllers.items.busca_item(application, req, res);
    })

    application.get("/buscaItems", (req, res) => {
      application.src.controllers.items.busca_todos(application, req, res);
    })
  }