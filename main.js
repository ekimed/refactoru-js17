// create all required objects for restaurant
var Fooditem = function(name, calories, vegan, glutenFree, citrusFree) {
    this.name = name;
    this.calories = calories;
    this.vegan = vegan;
    this.glutenFree = glutenFree;
    this.citrusFree = citrusFree
};
Fooditem.prototype.toString = function() {
    return "Name: " + this.name + " Calories: " + this.calories + " Is Vegan: " + this.vegan + " Is Gluten Free: " + this.glutenFree + " Is Citrus Free: " + this.citrusFree;
};

Fooditem.prototype.createDomElement = function() {

    return $('<div class="food-item">' + this.name + ": " + this.calories + ' cals</div>');
}

// var EdibleCombinations = (function() {

function EdibleCombinations(name, description, price, ingredients) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.ingredients = ingredients;
};
EdibleCombinations.prototype.toString = function() {
    return "Name: " + this.name + " Description: " + this.description + " Price: " + this.price + " Ingredients: " + this.ingredients.map(function(z) {
        return z.name;
    });
}
EdibleCombinations.prototype.isVegan = function() {
    return this.ingredients.every(function(z) {
        return z.vegan;
    })
}
EdibleCombinations.prototype.isGlutenFree = function() {
    return this.ingredients.every(function(z) {
        return z.glutenFree;
    })
}
EdibleCombinations.prototype.isCitrusFree = function() {
    return this.ingredients.every(function(z) {
        return z.citrusFree;
    })
}

EdibleCombinations.prototype.createDomElement = function() {
    var itemContainer = $('<div class="menu-item"></div>');
    var plate = $('<div class="plate">' + this.name + '</div>');
    var price = $('<div class="price">' + this.price + '</div>');
    var addBtn = $('<button class="add-btn">Add</button>')

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
//     return EdibleCombinations;
// })();


var Drink = function(name, description, price, ingredients) {
    EdibleCombinations.call(this, name, description, price, ingredients);
}
Drink.prototype = new EdibleCombinations();

var Plate = function(name, description, price, ingredients) {
    EdibleCombinations.call(this, name, description, price, ingredients);
};
Plate.prototype = new EdibleCombinations();


var ListsOfEdibles = function(edibles, $target) {
    this.edibles = edibles;
    this.$target = $target;
}
ListsOfEdibles.prototype.toString = function() {
    return this.edibles.join(', ');
}
ListsOfEdibles.prototype.renderEdibles = function() {
    this.$target.empty();
    for (var i = 0; i < this.edibles.length; i++) {
        this.$target.append(this.edibles[i].createDomElement());
    }
}
ListsOfEdibles.prototype.addEdible = function(edible) {
    this.edibles.unshift(edible);
    this.renderEdibles();
}

var Order = function(edibles, $target) {
    ListsOfEdibles.call(this, edibles, $target);
};
Order.prototype = new ListsOfEdibles();

var Menu = function(edibles, $target) {
    ListsOfEdibles.call(this, edibles, $target);
};
Menu.prototype = new ListsOfEdibles();

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
var cornChips = new Fooditem('Corn Chips', 200, false, true, false);
var groundBeef = new Fooditem('Ground Beef', 500, false, true, true);
var tomato = new Fooditem("tomato", 25, true, true, true);
var avacados = new Fooditem("avacados", 55, true, true, true);
var wheatTortilla = new Fooditem("tortilla", 425, false, false, true);
var tequilla = new Fooditem("tequilla", 25, true, true, true);
var limeJuice = new Fooditem("tequilla", 25, true, true, false);

//plates
var burritoPlate = new Plate('Burrito Plate', 'plain burrito', 8, [groundBeef, tomato, avacados, wheatTortilla]);
var guacamolePlate = new Plate('Guacamole Plate', 'green goo', 12, [avacados, tomato, limeJuice, cornChips]);
var margaritaDrink = new Drink('Simple Marg', 'booze', 4, [tequilla, limeJuice]);

//menu
var mainMenu = $('.menu');
var theMenu = new Menu([burritoPlate, guacamolePlate, margaritaDrink], mainMenu);

//restaurant
var theRestaurant = new Restaurant('Refactoru Cafe', 'Cheap brain food', theMenu);


// on load populate menu
$(document).on('ready', function() {

    theMenu.renderEdibles();

    $(document).on('click', '.add-btn', function() {

    })

});