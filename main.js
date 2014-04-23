// create all required objects for restaurant
var Ingredient = function(name, calories, vegan, glutenFree, citrusFree) {
    this.name = name;
    this.calories = calories;
    this.vegan = vegan;
    this.glutenFree = glutenFree;
    this.citrusFree = citrusFree
};
Ingredient.prototype.toString = function() {
    return "Name: " + this.name + " Calories: " + this.calories + " Is Vegan: " + this.vegan + " Is Gluten Free: " + this.glutenFree + " Is Citrus Free: " + this.citrusFree;
};

Ingredient.prototype.createDomElement = function() {

    return $('<div class="food-item">' + this.name + ": " + this.calories + ' cals</div>');
}

// var Recipe = (function() {

function Recipe(name, description, price, ingredients) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.ingredients = ingredients;
};
Recipe.prototype.toString = function() {
    return "Name: " + this.name + " Description: " + this.description + " Price: " + this.price + " Ingredients: " + this.ingredients.map(function(z) {
        return z.name;
    });
}
Recipe.prototype.isVegan = function() {
    return this.ingredients.every(function(z) {
        return z.vegan;
    })
}
Recipe.prototype.isGlutenFree = function() {
    return this.ingredients.every(function(z) {
        return z.glutenFree;
    })
}
Recipe.prototype.isCitrusFree = function() {
    return this.ingredients.every(function(z) {
        return z.citrusFree;
    })
}

Recipe.prototype.createDomElement = function(buttonType) {
    var itemContainer = $('<div class="menu-item" data-recipe="' + this.name + '"></div>');
    var plate = $('<div class="plate">' + this.name + '</div>');
    var price = $('<div class="price">' + this.price + '</div>');

    var addBtn = this.createButton(buttonType);

    var ingredientContainer = $('<div class="ing-cont"></div>');

    var priceContainer = $('<div class="price-cont"></div>');

    var ingredientElements = this.ingredients.map(function(ingredient) {
        return ingredient.createDomElement();
    });
    ingredientContainer.append(plate, ingredientElements);
    priceContainer.append(price, addBtn);

    itemContainer.append(ingredientContainer, priceContainer);

    return itemContainer;
};
Recipe.prototype.createButton = function(buttonType) {
    if (buttonType === "add") {
        var button = $('<button class="add-btn">Add</button>')
    } else {
        var button = $('<button class="remove-btn">Remove</button>')
    }
    return button;
}
//     return Recipe;
// })();

//specific recipes drink/plate
var Drink = function(name, description, price, ingredients) {
    Recipe.call(this, name, description, price, ingredients);
}
Drink.prototype = new Recipe();

var Plate = function(name, description, price, ingredients) {
    Recipe.call(this, name, description, price, ingredients);
};
Plate.prototype = new Recipe();



//menu's / orders

var MenuList = function($target) {
    this.recipeS = [];
    this.$target = $target;
}
MenuList.prototype.toString = function() {
    return this.recipeS.join(', ');
}
MenuList.prototype.renderRecipeS = function() {
    this.$target.empty();
    for (var i = 0; i < this.recipeS.length; i++) {
        this.$target.append(this.recipeS[i].createDomElement(this.$target.attr('data-form')));
    }
}
MenuList.prototype.addEdible = function(recipe) {
    this.recipeS.unshift(recipe);
    this.renderRecipeS();
}

var Order = function($target) {
    MenuList.call(this, $target);
};
Order.prototype = new MenuList();

var Menu = function($target) {
    MenuList.call(this, $target);
};
Menu.prototype = new MenuList();

var Restaurant = function(name, description, menu) {
    this.name = name;
    this.description = description;
    this.menu = menu;

};
Restaurant.prototype.toString = function() {
    return "Menu has these Plates:" + this.menu;

}

var Customer = function(diet) {
    this.dietaryPreference = diet;

};
Customer.prototype.toString = function() {
    return "Dietary Preferences: " + this.dietaryPreference;
}

//instantiate all variables

//ingredients
var cornChips = new Ingredient('Corn Chips', 200, false, true, false);
var groundBeef = new Ingredient('Ground Beef', 500, false, true, true);
var tomato = new Ingredient("Tomato", 25, true, true, true);
var avacados = new Ingredient("Avacados", 55, true, true, true);
var wheatTortilla = new Ingredient("Tortilla", 425, false, false, true);
var tequilla = new Ingredient("Tequilla", 55, true, true, true);
var limeJuice = new Ingredient("Limes", 25, true, true, false);

//plates
var burritoPlate = new Plate('Burrito Plate', 'plain burrito', 8, [groundBeef, tomato, avacados, wheatTortilla]);
var guacamolePlate = new Plate('Guacamole Plate', 'green goo', 12, [avacados, tomato, limeJuice, cornChips]);
var margaritaDrink = new Drink('Simple Marg', 'booze', 4, [tequilla, limeJuice]);

//menu
var mainMenu = $('.menu');
var theMenu = new Menu(mainMenu);
theMenu.addEdible(burritoPlate);
theMenu.addEdible(guacamolePlate);
theMenu.addEdible(margaritaDrink);

//order
var mainOrder = $('.order');
var theOrder = new Order(mainOrder, []);

//restaurant
var theRestaurant = new Restaurant('Refactoru Cafe', 'Cheap brain food', theMenu);

var returnRecipeObject = function(menuList, recipeName) {
    return menuList.recipeS.filter(function(recipe) {
        return recipe.name === recipeName;
    })[0];
}

var findRecipeName = function($addBtn) {
    console.log($addBtn);
    return $addBtn.closest('.menu-item').attr('data-recipe');
}

// on load populate menu
$(document).on('ready', function() {

    theMenu.renderRecipeS();

    $(document).on('click', '.add-btn', function() {
        var obj1 = returnRecipeObject(theMenu, findRecipeName($(this)));
        console.log(obj1);
        theOrder.addEdible(obj1);
    })
    $(document).on('click', '.remove-btn', function() {

    })

});