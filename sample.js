class Ship {
    constructor(capacity, max_w_c, cost_ew, h_cost_per_teu, cost_per_20_teu, cost_per_40_teu) {
        this.capacity = capacity;
        this.max_w_c = max_w_c;
        this.cost_ew = cost_ew;
        this.h_cost_per_teu = h_cost_per_teu;
        this.cost_per_20_teu = cost_per_20_teu;
        this.cost_per_40_teu = cost_per_40_teu;
    }

    bestPrice_20f(_20_f, _20_tw) {
        var max_weight_of_ship = this.capacity * this.max_w_c;
        let avg_w_c = _20_tw / _20_f;
        var total_cost = 0;
        
        if (_20_tw <= max_weight_of_ship) {
            var containers_cost_without_extra_weight = _20_f * this.cost_per_20_teu;
            total_cost = containers_cost_without_extra_weight;

            // Calculate extra weight cost and add it to total_cost, instead of overwriting it
            if (avg_w_c > this.max_w_c) {
                var extra_weight = avg_w_c - this.max_w_c;
                total_cost += (extra_weight * _20_f * this.cost_ew);  // Add to existing total_cost
            }

            max_weight_of_ship -= _20_tw;
        }

        var weight_available_total_cost = [total_cost, max_weight_of_ship];
        return weight_available_total_cost;
    }
}

const stnd = new Ship(2000, 20, 500, 3000, 10000, 18000);
const hcrg = new Ship(1500, 35, 800, 4000, 18000, 30000);

var list = hcrg.bestPrice_20f(10, 200);

console.log(list[0]);  // Outputs total cost
console.log(list[1]);  // Outputs remaining ship weight capacity
