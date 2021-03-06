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
    this.is = false;
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

    if (this.is) {
        itemContainer.addClass('menu-is');
    };

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
Recipe.prototype.isSomething = function(whatIsChecked) {

    console.log(this.name + "whatIsChecked" + ":", whatIsChecked);
    if ((whatIsChecked.GlutenFree || whatIsChecked.Vegan || whatIsChecked.CitrusFree) === false) {
        this.is = false;
    } else {
        var isIt = (whatIsChecked.GlutenFree ? this.isGlutenFree() : true) && (whatIsChecked.CitrusFree ? this.isCitrusFree() : true) && (whatIsChecked.Vegan ? this.isVegan() : true);
        console.log(this.name + " is:", isIt);
        this.is = isIt;
    }
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
MenuList.prototype.removeEdible = function(recipe) {
    var index = this.recipeS.indexOf(recipe)
    this.recipeS.splice(index, 1);
    this.renderRecipeS();
}
MenuList.prototype.isCheck = function(whatIsChecked) {
    for (var i = 0; i < this.recipeS.length; i++) {
        this.recipeS[i].isSomething(whatIsChecked);
    };
    this.renderRecipeS();
}

var Order = function($target) {
    MenuList.call(this, $target);
};
Order.prototype = new MenuList();

Order.prototype.addTotal = function() {
    var total = 0
    var text = $('.order').find('.price').each(function() {
        var price = $(this).text();
        total += +price;

    });
    $('.total-price').text(total);

    if ($('.total-price').css("display") === 'none') {
        $('.total-price').toggle();
    }
}

Order.prototype.removeTotal = function(recipe) {
    var currentTotal = +$('.total-price').text();
    var index = this.recipeS.indexOf(recipe);

    var priceToRemove = this.recipeS[index].price;
    var newTotal = currentTotal - priceToRemove;
    $('.total-price').text(newTotal);

    if (newTotal === 0) {
        $('.total-price').toggle();
    }
}

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
var guacamolePlate = new Plate('Guacamole Plate', 'green goo', 12, [avacados, tomato]);
var cornChipPlate = new Plate('Corn Chips', 'delish chippies', 4, [limeJuice, cornChips]);
var margaritaDrink = new Drink('Simple Marg', 'booze', 4, [tequilla, limeJuice]);

//menu
var mainMenu = $('.menu');
var theMenu = new Menu(mainMenu);
theMenu.addEdible(burritoPlate);
theMenu.addEdible(guacamolePlate);
theMenu.addEdible(margaritaDrink);
theMenu.addEdible(cornChipPlate);

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
    return $addBtn.closest('.menu-item').attr('data-recipe');
}

// on load populate menu
$(document).on('ready', function() {

    theMenu.renderRecipeS();

    $(document).on('click', '.add-btn', function() {
        var recipeToAdd = returnRecipeObject(theMenu, findRecipeName($(this)));
        theOrder.addEdible(recipeToAdd);
        theOrder.addTotal();
    })
    $(document).on('click', '.remove-btn', function() {
        var recipeToRemove = returnRecipeObject(theOrder, findRecipeName($(this)));
        theOrder.removeTotal(recipeToRemove);
        theOrder.removeEdible(recipeToRemove);

    })

    $(document).on('change', '[name="diet-preference"]', function() {
        var boxesChecked = {};
        $(this).parent().children().each(function() {
            $(this).prop('checked') ? boxesChecked[$(this).val()] = true : boxesChecked[$(this).val()] = false;

        });
        theMenu.isCheck(boxesChecked);
        console.log(boxesChecked);

    });
});