var db = require("../models");

module.exports = function(app) {
  // Get all Recipes
  app.get("/api/recipes", function(req, res) {
    db.Recipes.findAll({
      where: req.body
    }).then(function(dbRecipes) {
      res.json(dbRecipes);
    });
  });

  // Get Recipe details by recipe id 
  app.get("/api/recipes/:id", function(req, res) {
    db.Recipes.findByPk(req.params.id).then(function(dbRecipe) {
      if (dbRecipe === null) {
        res.status(404).send('Not Found')
      }
     // Sequelize provides getIngredients() function, when we build associations 
      dbRecipe.getIngredients().then(function(dbIngredients) {
        var response = {
          recipe: dbRecipe,
          ingredients: dbIngredients
        };
  
        res.json(response);
      });
    });
  });

  // Create or Post a new recipe
  app.post("/api/recipes", function(req, res) {
    db.Recipes.create(req.body).then(function(dbRecipe) {
      res.json(dbRecipe.id);
    });
  });

  // Get all Products 
  app.get("/api/products", function(req, res) {
    db.Products.findAll({
      where: req.body
    }).then(function(dbProducts) {
      res.json(dbProducts);
    });
  });

  // Post Ingredients for a recipe
  app.post("/api/recipes/:id/ingredients", function(req, res) {
    req.body.forEach(ingredient => {
      ingredient["RecipeId"] = parseInt(req.params.id);
    });

    db.Ingredients.bulkCreate(req.body).then(function(dbIngredients) {
      console.log(dbIngredients);
    });
  });


  // Delete recipe by id
  app.delete("/api/recipes/:id", function(req, res) {
    db.Recipes.destroy({ where: { id: req.params.id } }).then(function(dbRecipe) {
      res.json(dbRecipe);
    });
  });
};
