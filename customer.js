var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host:"localhost",
	port:3306,
	user:"root",
	password:"",
	database:"bamazon"
});

connection.connect(function(err){
	if(err)throw err;
	console.log("connected as id" + connection.threadId);
});

function displayInv(){
	connection.query('SELECT * FROM Products', function(err, res){
		if(err){console.log(err)};
		var theDisplayTable = new Table({
			head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
			colWidths: [10,25,25,10,14]
		});
		for(i=0; i<res.length;i++){
			theDisplayTable.push(
				[res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
				);
		}
		console.log(theDisplayTable.toString());
		myUpdates();
	});
};
//----------------------------------------------------------------------    
function myUpdates(){
	inquirer.prompt([{
		name:"action",
		type: "list",
		message: "Manage options:",
		choices: ["Restock Inv", "Add A Product", "Remove A Product"]
	}]).then(function(results){
		switch(results.action){
			case 'Restock Inv':
				restock();
				break;
			case 'Add A Product':
				addReq();
				break;
			case 'Remove A Product':
				removeReq();
				break;		
		}
	});
};
//   -------------------------------------------------------------------
function restock(){
	inquirer.prompt([
	{
		name:"ID",
		type:"input",
		message:"What is the item number of the item you would like to restock?"
	},
	{
		name:"Quantity",
		type:"input",
		message:"What is the quantity you would like to add?"
	},
	]).then(function(results){
		var quantityAdded = results.Quantity;
		var IDOfProduct = results.ID;
		restockInv(IDOfProduct, quantityAdded);
	});
};
// ------------------------------------------------------------------------
function restockInv(id, quant){
	connection.query('SELECT * FROM Products WHERE item_id = '+id, function(err,res){
		if(err){console.log(err)};
		connection.query('UPDATE Products SET stock_quantity = stock_quantity + ' +stock_quantity+ 'WHERE item_id =' +item_id);

		displayInv();
	});
};
// ----------------------------------------------------------------------------
function addReq(){
	inquirer.prompt([

	{
		name: "ID",
		type: "input",
		message: "Add ID Number"

	},	
	{
		name: "Name",
		type: "input",
		message: "What is name of product you would like to stock?"
	},
	{
		name:"Category",
		type:"input",
		message:"What is the category for product?"
	},
	{
		name:"Price",
		type:"input",
		message:"What is the price for item?"
	},
	{
		name:"Quantity",
		type:"input",
		message:"What is the quantity you would like to add?"
	},

	]).then(function(results){
		var id = results.Id;
		var name = results.Name;
		var category = results.Category;
		var price = results.Price;
		var quantity = results.Quantity;
		createNewItem(id,name,category,price,quantity); 
	});
  };

  function createNewItem(name,category,price,quantity){
  	connection.query('INSERT INTO products (item_id,product_name,department_name,price,stock_quantity) VALUES("' + id + '","' + name + '","' + category + '",' + price + ',' + quantity +  ')');
  	displayInv();
  };

  function removeReq(){
  	inquirer.prompt([{
  		name:"ID",
  		type:"input",
  		message:"What is the item number of the item you would like to remove?"
  	}]).then(function(answer){
  		var id = results.ID;
  		removeInv(id); 
  	});
  };

  function removeInv(id){
  	connection.query('DELETE FROM Products WHERE item_id = ' + id);
  	displayInv();
  };

  displayInv();