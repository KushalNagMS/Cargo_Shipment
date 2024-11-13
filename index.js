import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Cargo_Transportaion",
    password: "password1",
    port: 5432,
});

const app = express();
const port = 3000;

db.connect();

let train_types = []; // Changed to let if we plan to reassign
let ship_types = [];

db.query("SELECT * FROM ship", (err, res) => {
    if (err) {
        console.log("Error in fetching Data.", err);
    } else {
        ship_types = res.rows; // Properly assigning the fetched data
        // console.log(ship_types); // Log it after data is fetched
    }

    // Close connection after the query is done
});

let train_locations = [];
db.query("SELECT starting_location,destination_location FROM train_locations ", (err, res) => {
    if (err) {
        console.log("Error in fetching Data.", err);
    } else {
        train_locations = res.rows; // Properly assigning the fetched data
        console.log(train_locations); // Log it after data is fetched
    }

    
});

db.query("SELECT * FROM train ", (err, res) => {
    if (err) {
        console.log("Error in fetching Data.", err);
    } else {
        train_types = res.rows; // Properly assigning the fetched data
        // console.log(train_types); // Log it after data is fetched
    }

    
});

let ship_locations = [];
db.query("SELECT starting_location,destination_location FROM ship_locations ", (err, res) => {
    if (err) {
        console.log("Error in fetching Data.", err);
    } else {
        ship_locations = res.rows; // Properly assigning the fetched data
        // console.log(ship_locations); // Log it after data is fetched
    }

    db.end()
    
});


app.get("/",(req,res)=>{
    res.render("choose.ejs",{train_types: train_types, ship_types: ship_types, train_locations: train_locations, ship_locations: ship_locations})
})

app.get("/containers",(req,res)=>{
    const {starting_location, destination_location} = req.query
    console.log('Query Parameters:', req.query);

    const regex = /^Port\b/i;

    if(regex.test(starting_location)){
        res.render("ship_container.ejs",{ship_types: ship_types,ship_locations: ship_locations,default_value:0})
    }

    else{
        res.render("train_container.ejs",{train_types: train_types,train_locations: train_locations,default_value:0})
    }

})

// Ship data based on categories
const ships = [
  {
    id: 1,
    type: "Standard Container Ship",
    maxWeight: 20,
    costPerExtraWeight: 500,
    hazardousCostPerTEU: 3000,
    costPerTEU20Foot: 10000,
    costPerTEU40Foot: 18000
  },
  {
    id: 2,
    type: "Refrigerated Container Ship",
    maxWeight: 18,
    costPerExtraWeight: 700,
    hazardousCostPerTEU: 3500,
    costPerTEU20Foot: 15000,
    costPerTEU40Foot: 25000
  },
  {
    id: 3,
    type: "Heavy Cargo Ship",
    maxWeight: 35,
    costPerExtraWeight: 800,
    hazardousCostPerTEU: 4000,
    costPerTEU20Foot: 18000,
    costPerTEU40Foot: 30000
  }
];
function nh_ship_1(nh_n_20f_c_f, nh_n_20f_c_tw, nh_n_40f_c_f, nh_n_40f_c_tw) {
    let tw = nh_n_20f_c_tw + nh_n_40f_c_tw;
    let total_c = 0;

    // Process 20-foot containers
    let avg_20f = nh_n_20f_c_tw / nh_n_20f_c_f;
    let extra_cost_20f = 0;
    if (avg_20f > 20) {
        extra_cost_20f = (avg_20f - 20) * 500 * nh_n_20f_c_f;
    }
    total_c += extra_cost_20f + 10000 * nh_n_20f_c_f;

    // Process 40-foot containers
    let avg_40f = nh_n_40f_c_tw / nh_n_40f_c_f;
    let extra_cost_40f = 0;
    if (avg_40f > 40) {
        extra_cost_40f = (avg_40f - 40) * 500 * nh_n_40f_c_f;
    }
    total_c += extra_cost_40f + 18000 * nh_n_40f_c_f;

    return total_c;
}


function nh_ship_2(nh_n_20f_c_f, nh_n_20f_c_tw, nh_n_40f_c_f, nh_n_40f_c_tw) {
    let tw = nh_n_20f_c_tw + nh_n_40f_c_tw;
    let total_c = 0;

    // Process 20-foot containers
    let avg_20f = nh_n_20f_c_tw / nh_n_20f_c_f;
    let extra_cost_20f = 0;
    if (avg_20f > 20) {
        extra_cost_20f = (avg_20f - 20) * 800 * nh_n_20f_c_f;
    }
    total_c += extra_cost_20f + 18000 * nh_n_20f_c_f;

    // Process 40-foot containers
    let avg_40f = nh_n_40f_c_tw / nh_n_40f_c_f;
    let extra_cost_40f = 0;
    if (avg_40f > 40) {
        extra_cost_40f = (avg_40f - 40) * 800 * nh_n_40f_c_f;
    }
    total_c += extra_cost_40f + 30000 * nh_n_40f_c_f;

    return total_c;
}

function h_ship_1(h_n_20f_c_f, h_n_20f_c_tw, h_n_40f_c_f, h_n_40f_c_tw) {
    let tw = h_n_20f_c_tw + h_n_40f_c_tw;
    let total_c = 0;

    // Process 20-foot containers
    let avg_20f = h_n_20f_c_tw / h_n_20f_c_f;
    let extra_cost_20f = 0;
    if (avg_20f > 20) {
        extra_cost_20f = (avg_20f - 20) * 500 * h_n_20f_c_f;
    }
    total_c += extra_cost_20f + 10000 * h_n_20f_c_f + 3000 * h_n_20f_c_f;

    // Process 40-foot containers
    let avg_40f = h_n_40f_c_tw / h_n_40f_c_f;
    let extra_cost_40f = 0;
    if (avg_40f > 40) {
        extra_cost_40f = (avg_40f - 40) * 500 * h_n_40f_c_f;
    }
    total_c += extra_cost_40f + 18000 * h_n_40f_c_f + 3000 * h_n_40f_c_f;

    return total_c;
}


function h_ship_2(h_n_20f_c_f, h_n_20f_c_tw, h_n_40f_c_f, h_n_40f_c_tw) {
    let tw = h_n_20f_c_tw + h_n_40f_c_tw;
    let total_c = 0;

    // Process 20-foot containers
    let avg_20f = h_n_20f_c_tw / h_n_20f_c_f;
    let extra_cost_20f = 0;
    if (avg_20f > 20) {
        extra_cost_20f = (avg_20f - 20) * 800 * h_n_20f_c_f;
    }
    total_c += extra_cost_20f + 18000 * h_n_20f_c_f + 4000 * h_n_20f_c_f;

    // Process 40-foot containers
    let avg_40f = h_n_40f_c_tw / h_n_40f_c_f;
    let extra_cost_40f = 0;
    if (avg_40f > 40) {
        extra_cost_40f = (avg_40f - 40) * 800 * h_n_40f_c_f;
    }
    total_c += extra_cost_40f + 30000 * h_n_40f_c_f + 4000 * h_n_40f_c_f;

    return total_c;
}

function r_n_h(r_n_20f_c_f, r_n_20f_c_tw, r_n_40f_c_f, r_n_40f_c_tw) {
    let tw = r_n_20f_c_tw + r_n_40f_c_tw;
    let total_c = 0;

    // Process 20-foot containers
    let avg_20f = r_n_20f_c_tw / r_n_20f_c_f;
    let extra_cost_20f = 0;
    if (avg_20f > 18) {
        extra_cost_20f = (avg_20f - 18) * 700 * r_n_20f_c_f;
    }
    total_c += extra_cost_20f + 15000 * r_n_20f_c_f;

    // Process 40-foot containers
    let avg_40f = r_n_40f_c_tw / r_n_40f_c_f;
    let extra_cost_40f = 0;
    if (avg_40f > 40) {
        extra_cost_40f = (avg_40f - 40) * 700 * r_n_40f_c_f;
    }
    total_c += extra_cost_40f + 25000 * r_n_40f_c_f;

    return total_c;
}


function r_h(rh_n_20f_c_f, rh_n_20f_c_tw, rh_n_40f_c_f, rh_n_40f_c_tw) {
    let tw = rh_n_20f_c_tw + rh_n_40f_c_tw;
    let total_c = 0;

    // Process 20-foot containers
    let avg_20f = rh_n_20f_c_tw / rh_n_20f_c_f;
    let extra_cost_20f = 0;
    if (avg_20f > 18) {
        extra_cost_20f = (avg_20f - 18) * 700 * rh_n_20f_c_f;
    }
    total_c += extra_cost_20f + 15000 * rh_n_20f_c_f + 3500 * rh_n_20f_c_f;

    // Process 40-foot containers
    let avg_40f = rh_n_40f_c_tw / rh_n_40f_c_f;
    let extra_cost_40f = 0;
    if (avg_40f > 40) {
        extra_cost_40f = (avg_40f - 40) * 700 * rh_n_40f_c_f;
    }
    total_c += extra_cost_40f + 25000 * rh_n_40f_c_f + 3500 * rh_n_40f_c_f;

    return total_c;
}

// Train data
const trains = [
    {
      id: 1,
      type: "Standard Freight Train",
      maxWeight: 20,
      costPerExtraWeight: 300,
      hazardousCostPerTEU: 1500,
      costPerTEU20Foot: 5000,
      costPerTEU40Foot: 8000
    },
    {
      id: 2,
      type: "Refrigerated Freight Train",
      maxWeight: 18,
      costPerExtraWeight: 500,
      hazardousCostPerTEU: 2000,
      costPerTEU20Foot: 7000,
      costPerTEU40Foot: 12000
    },
    {
      id: 3,
      type: "Heavy-Duty Freight Train",
      maxWeight: 35,
      costPerExtraWeight: 400,
      hazardousCostPerTEU: 3000,
      costPerTEU20Foot: 9000,
      costPerTEU40Foot: 15000
    }
  ];
  
  // Function to calculate cost for standard freight train (non-hazardous)
  function nh_train_1(nh_n_20f_c_f, nh_n_20f_c_tw, nh_n_40f_c_f, nh_n_40f_c_tw) {
      let total_c = 0;
  
      // Process 20-foot containers
      let avg_20f = nh_n_20f_c_tw / nh_n_20f_c_f;
      let extra_cost_20f = 0;
      if (avg_20f > 20) {
          extra_cost_20f = (avg_20f - 20) * 300 * nh_n_20f_c_f;
      }
      total_c += extra_cost_20f + 5000 * nh_n_20f_c_f;
  
      // Process 40-foot containers
      let avg_40f = nh_n_40f_c_tw / nh_n_40f_c_f;
      let extra_cost_40f = 0;
      if (avg_40f > 40) {
          extra_cost_40f = (avg_40f - 40) * 300 * nh_n_40f_c_f;
      }
      total_c += extra_cost_40f + 8000 * nh_n_40f_c_f;
  
      return total_c;
  }
  
  // Function to calculate cost for hazardous standard freight train
  function h_train_1(h_n_20f_c_f, h_n_20f_c_tw, h_n_40f_c_f, h_n_40f_c_tw) {
      let total_c = 0;
  
      // Process 20-foot containers
      let avg_20f = h_n_20f_c_tw / h_n_20f_c_f;
      let extra_cost_20f = 0;
      if (avg_20f > 20) {
          extra_cost_20f = (avg_20f - 20) * 300 * h_n_20f_c_f;
      }
      total_c += extra_cost_20f + 5000 * h_n_20f_c_f + 1500 * h_n_20f_c_f;
  
      // Process 40-foot containers
      let avg_40f = h_n_40f_c_tw / h_n_40f_c_f;
      let extra_cost_40f = 0;
      if (avg_40f > 40) {
          extra_cost_40f = (avg_40f - 40) * 300 * h_n_40f_c_f;
      }
      total_c += extra_cost_40f + 8000 * h_n_40f_c_f + 1500 * h_n_40f_c_f;
  
      return total_c;
  }
  
  // Function to calculate cost for refrigerated freight train (non-hazardous)
  function r_n_train(r_n_20f_c_f, r_n_20f_c_tw, r_n_40f_c_f, r_n_40f_c_tw) {
      let total_c = 0;
  
      // Process 20-foot containers
      let avg_20f = r_n_20f_c_tw / r_n_20f_c_f;
      let extra_cost_20f = 0;
      if (avg_20f > 18) {
          extra_cost_20f = (avg_20f - 18) * 500 * r_n_20f_c_f;
      }
      total_c += extra_cost_20f + 7000 * r_n_20f_c_f;
  
      // Process 40-foot containers
      let avg_40f = r_n_40f_c_tw / r_n_40f_c_f;
      let extra_cost_40f = 0;
      if (avg_40f > 40) {
          extra_cost_40f = (avg_40f - 40) * 500 * r_n_40f_c_f;
      }
      total_c += extra_cost_40f + 12000 * r_n_40f_c_f;
  
      return total_c;
  }
  
  // Function to calculate cost for refrigerated hazardous freight train
  function r_h_train(rh_n_20f_c_f, rh_n_20f_c_tw, rh_n_40f_c_f, rh_n_40f_c_tw) {
      let total_c = 0;
  
      // Process 20-foot containers
      let avg_20f = rh_n_20f_c_tw / rh_n_20f_c_f;
      let extra_cost_20f = 0;
      if (avg_20f > 18) {
          extra_cost_20f = (avg_20f - 18) * 500 * rh_n_20f_c_f;
      }
      total_c += extra_cost_20f + 7000 * rh_n_20f_c_f + 2000 * rh_n_20f_c_f;
  
      // Process 40-foot containers
      let avg_40f = rh_n_40f_c_tw / rh_n_40f_c_f;
      let extra_cost_40f = 0;
      if (avg_40f > 40) {
          extra_cost_40f = (avg_40f - 40) * 500 * rh_n_40f_c_f;
      }
      total_c += extra_cost_40f + 12000 * rh_n_40f_c_f + 2000 * rh_n_40f_c_f;
  
      return total_c;
  }
  
  // Function to calculate cost for heavy-duty freight train (non-hazardous)
  function nh_train_2(nh_n_20f_c_f, nh_n_20f_c_tw, nh_n_40f_c_f, nh_n_40f_c_tw) {
      let total_c = 0;
  
      // Process 20-foot containers
      let avg_20f = nh_n_20f_c_tw / nh_n_20f_c_f;
      let extra_cost_20f = 0;
      if (avg_20f > 20) {
          extra_cost_20f = (avg_20f - 20) * 400 * nh_n_20f_c_f;
      }
      total_c += extra_cost_20f + 9000 * nh_n_20f_c_f;
  
      // Process 40-foot containers
      let avg_40f = nh_n_40f_c_tw / nh_n_40f_c_f;
      let extra_cost_40f = 0;
      if (avg_40f > 40) {
          extra_cost_40f = (avg_40f - 40) * 400 * nh_n_40f_c_f;
      }
      total_c += extra_cost_40f + 15000 * nh_n_40f_c_f;
  
      return total_c;
  }
  
  // Function to calculate cost for heavy-duty hazardous freight train
  function h_train_2(h_n_20f_c_f, h_n_20f_c_tw, h_n_40f_c_f, h_n_40f_c_tw) {
      let total_c = 0;
  
      // Process 20-foot containers
      let avg_20f = h_n_20f_c_tw / h_n_20f_c_f;
      let extra_cost_20f = 0;
      if (avg_20f > 20) {
          extra_cost_20f = (avg_20f - 20) * 400 * h_n_20f_c_f;
      }
      total_c += extra_cost_20f + 9000 * h_n_20f_c_f + 3000 * h_n_20f_c_f;
  
      // Process 40-foot containers
      let avg_40f = h_n_40f_c_tw / h_n_40f_c_f;
      let extra_cost_40f = 0;
      if (avg_40f > 40) {
          extra_cost_40f = (avg_40f - 40) * 400 * h_n_40f_c_f;
      }
      total_c += extra_cost_40f + 15000 * h_n_40f_c_f + 3000 * h_n_40f_c_f;
  
      return total_c;
  }
  



app.get("/cost",(req,res)=>{
  // console.log(req.query);

  const shipData = {
    ship_id_1: parseInt(req.query.ship_id_1) || 0,
    nh_n_20f_c_f: parseInt(req.query.nh_n_20f_c_f) || 0,
    nh_n_20f_c_tw: parseInt(req.query.nh_n_20f_c_tw) || 0,
    nh_n_40f_c_f: parseInt(req.query.nh_n_40f_c_f) || 0,
    nh_n_40f_c_tw: parseInt(req.query.nh_n_40f_c_tw) || 0,
    ship_id_2: parseInt(req.query.ship_id_2) || 0,
    h_n_20f_c_f: parseInt(req.query.h_n_20f_c_f) || 0,
    h_n_20f_c_tw: parseInt(req.query.h_n_20f_c_tw) || 0,
    h_n_40f_c_f: parseInt(req.query.h_n_40f_c_f) || 0,
    h_n_40f_c_tw: parseInt(req.query.h_n_40f_c_tw) || 0,
    r_n_20f_c_f: parseInt(req.query.r_n_20f_c_f) || 0,
    r_n_20f_c_tw: parseInt(req.query.r_n_20f_c_tw) || 0,
    r_n_40f_c_f: parseInt(req.query.r_n_40f_c_f) || 0,
    r_n_40f_c_tw: parseInt(req.query.r_n_40f_c_tw) || 0,
    rh_n_20f_c_f: parseInt(req.query.rh_n_20f_c_f) || 0,
    rh_n_20f_c_tw: parseInt(req.query.rh_n_20f_c_tw) || 0,
    rh_n_40f_c_f: parseInt(req.query.rh_n_40f_c_f) || 0,
    rh_n_40f_c_tw: parseInt(req.query.rh_n_40f_c_tw) || 0,
};

let cost1 = 0;
let cost2 = 0;
let cost3 = 0;
let cost4 = 0;

// Calculate cost for non-hazardous ships
if (shipData['ship_id_1'] === 1) {
    cost1 = nh_ship_1(shipData['nh_n_20f_c_f'], shipData['nh_n_20f_c_tw'], shipData['nh_n_40f_c_f'], shipData['nh_n_40f_c_tw']);
} else if (shipData['ship_id_1'] === 3) {
    cost1 = nh_ship_2(shipData['nh_n_20f_c_f'], shipData['nh_n_20f_c_tw'], shipData['nh_n_40f_c_f'], shipData['nh_n_40f_c_tw']);
}

// Calculate cost for hazardous ships
if (shipData['ship_id_2'] === 1) {
    cost2 = h_ship_1(shipData['h_n_20f_c_f'], shipData['h_n_20f_c_tw'], shipData['h_n_40f_c_f'], shipData['h_n_40f_c_tw']);
} else if (shipData['ship_id_2'] === 3) {
    cost2 = h_ship_2(shipData['h_n_20f_c_f'], shipData['h_n_20f_c_tw'], shipData['h_n_40f_c_f'], shipData['h_n_40f_c_tw']);
}

// Calculate cost for refrigerated non-hazardous ships
cost3 = r_n_h(shipData['r_n_20f_c_f'], shipData['r_n_20f_c_tw'], shipData['r_n_40f_c_f'], shipData['r_n_40f_c_tw']);

// Calculate cost for refrigerated hazardous ships
cost4 = r_h(shipData['rh_n_20f_c_f'], shipData['rh_n_20f_c_tw'], shipData['rh_n_40f_c_f'], shipData['rh_n_40f_c_tw']);

// Total cost object
const cost = {
    nh_cost: cost1,
    h_cost: cost2,
    r_nh_cost: cost3,
    r_h_cost: cost4
};

res.render("cost_reult.ejs",{cost})
})

app.get("/cost_train", (req, res) => {
    const trainData = {
        train_id_1: parseInt(req.query.train_id_1) || 0,
        nh_n_20f_c_f: parseInt(req.query.nh_n_20f_c_f) || 0,
        nh_n_20f_c_tw: parseInt(req.query.nh_n_20f_c_tw) || 0,
        nh_n_40f_c_f: parseInt(req.query.nh_n_40f_c_f) || 0,
        nh_n_40f_c_tw: parseInt(req.query.nh_n_40f_c_tw) || 0,
        train_id_2: parseInt(req.query.train_id_2) || 0,
        h_n_20f_c_f: parseInt(req.query.h_n_20f_c_f) || 0,
        h_n_20f_c_tw: parseInt(req.query.h_n_20f_c_tw) || 0,
        h_n_40f_c_f: parseInt(req.query.h_n_40f_c_f) || 0,
        h_n_40f_c_tw: parseInt(req.query.h_n_40f_c_tw) || 0,
        r_n_20f_c_f: parseInt(req.query.r_n_20f_c_f) || 0,
        r_n_20f_c_tw: parseInt(req.query.r_n_20f_c_tw) || 0,
        r_n_40f_c_f: parseInt(req.query.r_n_40f_c_f) || 0,
        r_n_40f_c_tw: parseInt(req.query.r_n_40f_c_tw) || 0,
        rh_n_20f_c_f: parseInt(req.query.rh_n_20f_c_f) || 0,
        rh_n_20f_c_tw: parseInt(req.query.rh_n_20f_c_tw) || 0,
        rh_n_40f_c_f: parseInt(req.query.rh_n_40f_c_f) || 0,
        rh_n_40f_c_tw: parseInt(req.query.rh_n_40f_c_tw) || 0,
    };

    let cost1 = 0;
    let cost2 = 0;
    let cost3 = 0;
    let cost4 = 0;

    console.log(req.query)

    // Calculate cost for non-hazardous trains
    if (trainData['train_id_1'] === 1) {
        cost1 = nh_train_1(trainData['nh_n_20f_c_f'], trainData['nh_n_20f_c_tw'], trainData['nh_n_40f_c_f'], trainData['nh_n_40f_c_tw']);
    } else if (trainData['train_id_1'] === 3) {
        cost1 = nh_train_2(trainData['nh_n_20f_c_f'], trainData['nh_n_20f_c_tw'], trainData['nh_n_40f_c_f'], trainData['nh_n_40f_c_tw']);
    }

    // Calculate cost for hazardous trains
    if (trainData['train_id_2'] === 1) {
        cost2 = h_train_1(trainData['h_n_20f_c_f'], trainData['h_n_20f_c_tw'], trainData['h_n_40f_c_f'], trainData['h_n_40f_c_tw']);
    } else if (trainData['train_id_2'] === 3) {
        cost2 = h_train_2(trainData['h_n_20f_c_f'], trainData['h_n_20f_c_tw'], trainData['h_n_40f_c_f'], trainData['h_n_40f_c_tw']);
    }

    // Calculate cost for refrigerated non-hazardous trains
    cost3 = r_n_train(trainData['r_n_20f_c_f'], trainData['r_n_20f_c_tw'], trainData['r_n_40f_c_f'], trainData['r_n_40f_c_tw']);

    // Calculate cost for refrigerated hazardous trains
    cost4 = r_h_train(trainData['rh_n_20f_c_f'], trainData['rh_n_20f_c_tw'], trainData['rh_n_40f_c_f'], trainData['rh_n_40f_c_tw']);

    // Total cost object
    const cost = {
        nh_cost: cost1,
        h_cost: cost2,
        r_nh_cost: cost3,
        r_h_cost: cost4
    };

    res.render("cost_reult.ejs",{cost})
    
});



app.listen(port,()=>{
    console.log(`Listening at port ${port}`)
})




